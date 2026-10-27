'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { site } from '@/content/site';
import { whenIdle } from '@/lib/motion';

const PREF_KEY = 'saraya-music';
// Events that browsers accept as a user gesture for starting audio.
const GESTURES = ['pointerdown', 'pointerup', 'touchend', 'click', 'keydown'] as const;

const readPref = () => {
  try {
    return localStorage.getItem(PREF_KEY);
  } catch {
    return null;
  }
};
const writePref = (v: 'on' | 'off') => {
  try {
    localStorage.setItem(PREF_KEY, v);
  } catch {}
};

/**
 * Looping background music. Starts by itself where the browser allows it;
 * otherwise on the visitor's first tap, click or key press anywhere on the page.
 * A floating button turns it on and off, with an animated audio visualizer.
 */
export default function BackgroundMusic() {
  const music = site.music;
  const audio = useRef<HTMLAudioElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const fade = useRef(0);
  const [playing, setPlaying] = useState(false);
  const [waiting, setWaiting] = useState(false);

  const fadeIn = useCallback(() => {
    const a = audio.current!;
    const target = music?.volume ?? 0.5;
    cancelAnimationFrame(fade.current);
    a.volume = 0;
    const t0 = performance.now();
    const step = (t: number) => {
      const p = Math.min(1, (t - t0) / 1800);
      a.volume = target * p;
      if (p < 1) fade.current = requestAnimationFrame(step);
    };
    fade.current = requestAnimationFrame(step);
  }, [music]);

  const start = useCallback(async () => {
    const a = audio.current;
    if (!a) return false;
    try {
      await a.play();
      fadeIn();
      setWaiting(false);
      return true;
    } catch {
      return false;
    }
  }, [fadeIn]);

  useEffect(() => {
    const a = audio.current;
    if (!music || !a) return;
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    a.addEventListener('play', onPlay);
    a.addEventListener('pause', onPause);

    let removeGestures = () => {};
    const armGestures = () => {
      setWaiting(true);
      const onGesture = (e: Event) => {
        // The music button handles its own clicks.
        if (button.current?.contains(e.target as Node)) return;
        start().then((ok) => ok && removeGestures());
      };
      GESTURES.forEach((g) => window.addEventListener(g, onGesture, { capture: true, passive: true }));
      removeGestures = () => GESTURES.forEach((g) => window.removeEventListener(g, onGesture, { capture: true }));
    };

    // Respect a visitor who switched the music off before.
    const cancelIdle =
      readPref() === 'off'
        ? () => {}
        : whenIdle(() => {
            start().then((ok) => !ok && armGestures());
          }, 1500);

    // Pause while the tab is hidden; resume when the visitor comes back.
    let resume = false;
    const onVisibility = () => {
      if (document.hidden) {
        resume = !a.paused;
        a.pause();
      } else if (resume) {
        a.play().catch(() => {});
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelIdle();
      removeGestures();
      cancelAnimationFrame(fade.current);
      document.removeEventListener('visibilitychange', onVisibility);
      a.removeEventListener('play', onPlay);
      a.removeEventListener('pause', onPause);
      a.pause();
    };
  }, [music, start]);

  if (!music) return null;

  const toggle = () => {
    const a = audio.current!;
    if (a.paused) {
      writePref('on');
      start();
    } else {
      writePref('off');
      a.pause();
    }
  };

  return (
    <>
      <audio ref={audio} src={music.src} loop preload="none" playsInline aria-hidden="true" />
      <button
        ref={button}
        type="button"
        className={`music-toggle ${playing ? 'is-playing' : ''} ${waiting && !playing ? 'is-waiting' : ''}`}
        onClick={toggle}
        aria-pressed={playing}
        aria-label={playing ? 'إيقاف المقطوعة الملكية' : 'تشغيل المقطوعة الملكية'}
        title={playing ? 'إيقاف المقطوعة الملكية' : 'تشغيل المقطوعة الملكية'}
      >
        <span className="music-toggle__bars" aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
        </span>
        <svg className="music-toggle__off" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M9 18V6l10-2v12" />
          <circle cx="6.5" cy="18" r="2.5" />
          <circle cx="16.5" cy="16" r="2.5" />
        </svg>
        <span className="music-toggle__hint" aria-hidden="true">
          {playing ? 'مقطوعة سرايا شيرين الملكية 🎵' : 'اضغطوا لتشغيل الموسيقى'}
        </span>
      </button>
    </>
  );
}
