'use client';

import { useEffect, useRef, useState } from 'react';

interface PanoramaViewerProps {
  imageSrc: string;
  title: string;
  onClose: () => void;
}

export default function PanoramaViewer({ imageSrc, title, onClose }: PanoramaViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);
  const isDragging = useRef(false);
  const prevPos = useRef({ x: 0, y: 0 });
  const viewAngles = useRef({ lon: 0, lat: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageSrc;

    let animId: number;

    img.onload = () => {
      setLoading(false);

      const render = () => {
        if (!canvas) return;
        const width = canvas.width;
        const height = canvas.height;

        // Auto slow pan if not interacting
        if (!isDragging.current) {
          viewAngles.current.lon += 0.08;
        }

        ctx.clearRect(0, 0, width, height);

        // Cylindrical 360 wrap projection
        const imgW = img.width;
        const imgH = img.height;
        const scale = height / imgH;
        const scaledW = imgW * scale;

        let offsetX = ((-viewAngles.current.lon * 3) % scaledW);
        if (offsetX > 0) offsetX -= scaledW;

        // Draw seamless repeating panoramic image
        ctx.drawImage(img, offsetX, 0, scaledW, height);
        if (offsetX + scaledW < width) {
          ctx.drawImage(img, offsetX + scaledW, 0, scaledW, height);
        }
        if (offsetX + scaledW * 2 < width) {
          ctx.drawImage(img, offsetX + scaledW * 2, 0, scaledW, height);
        }

        animId = requestAnimationFrame(render);
      };

      const resize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      };
      resize();
      window.addEventListener('resize', resize);
      render();
    };

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [imageSrc]);

  const onPointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    prevPos.current = { x: e.clientX, y: e.clientY };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - prevPos.current.x;
    viewAngles.current.lon -= dx * 0.35;
    prevPos.current = { x: e.clientX, y: e.clientY };
  };

  const onPointerUp = () => {
    isDragging.current = false;
  };

  return (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={`جولة افتراضية 360 درجة — ${title}`}
      style={{ touchAction: 'none' }}
    >
      <div className="lightbox__backdrop" onClick={onClose} />
      
      <div
        style={{
          position: 'absolute',
          inset: 0,
          cursor: isDragging.current ? 'grabbing' : 'grab',
          overflow: 'hidden',
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
      </div>

      <div
        style={{
          position: 'absolute',
          top: '1.5rem',
          right: '1.5rem',
          left: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pointerEvents: 'none',
          zIndex: 10,
        }}
      >
        <div style={{ background: 'rgba(20,5,25,0.75)', padding: '0.6rem 1.25rem', borderRadius: '999px', backdropFilter: 'blur(8px)', border: '1px solid rgba(212,175,55,0.3)', color: '#fff', pointerEvents: 'auto' }}>
          <span style={{ color: '#D4AF37', fontWeight: 'bold' }}>360°</span> {title} — <span style={{ fontSize: '0.85rem', opacity: 0.8 }}>اسحب للتنقّل يمينًا ويسارًا</span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="lightbox__btn"
          aria-label="إغلاق الجولة الافتراضية"
          style={{ pointerEvents: 'auto', background: 'rgba(20,5,25,0.8)' }}
        >
          <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2" fill="none">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {loading && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D4AF37' }}>
          <span>جاري تجهيز المشهد البانورامي…</span>
        </div>
      )}
    </div>
  );
}
