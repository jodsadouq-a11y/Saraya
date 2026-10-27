/**
 * Generates the illustrated placeholder artwork in /public/media/placeholders.
 *
 * These are stylised gold line-art illustrations, NOT photographs. They exist
 * only so the layout can be designed and reviewed before genuine Saraya Shereen
 * photographs are supplied, and the site labels them as illustrations.
 *
 *   node scripts/gen-placeholders.mjs
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'media', 'placeholders');
mkdirSync(OUT, { recursive: true });

const C = {
  night: '#180B20',
  plum: '#280D2E',
  purple: '#501456',
  violet: '#6B2A70',
  gold: '#E8C36F',
  champagne: '#F6E4B2',
  ivory: '#FFF9F0',
  blush: '#EBC8C4',
  rose: '#C98FA6',
  sage: '#7E8B6A',
};

const rng = (seed) => () => {
  seed = (seed * 16807) % 2147483647;
  return (seed - 1) / 2147483646;
};
const f = (n) => Math.round(n * 10) / 10;

const svg = (w, h, body, defs = '') =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice"><defs>` +
  `<radialGradient id="glow"><stop offset="0" stop-color="${C.champagne}" stop-opacity=".95"/><stop offset=".25" stop-color="${C.gold}" stop-opacity=".45"/><stop offset="1" stop-color="${C.gold}" stop-opacity="0"/></radialGradient>` +
  `<radialGradient id="soft"><stop offset="0" stop-color="${C.gold}" stop-opacity=".35"/><stop offset="1" stop-color="${C.gold}" stop-opacity="0"/></radialGradient>` +
  `<radialGradient id="bokeh"><stop offset="0" stop-color="${C.champagne}" stop-opacity=".55"/><stop offset=".7" stop-color="${C.gold}" stop-opacity=".18"/><stop offset="1" stop-color="${C.gold}" stop-opacity="0"/></radialGradient>` +
  defs +
  `</defs>${body}</svg>`;

const bokeh = (r, w, h, n, maxR = 40, yMax = h) => {
  let s = '';
  for (let i = 0; i < n; i++) {
    const rad = 6 + r() * maxR;
    s += `<circle cx="${f(r() * w)}" cy="${f(r() * yMax)}" r="${f(rad)}" fill="url(#bokeh)" opacity="${f(0.3 + r() * 0.7)}"/>`;
  }
  return s;
};

/* ── Chandelier ─────────────────────────────────────────────────────────── */
function chandelier(cx, cy, s, { lit = true, chain = 60 } = {}) {
  const g = lit ? C.gold : '#7b6440';
  const sw = Math.max(0.6, 1.4 * s);
  let out = '';
  if (lit) out += `<circle cx="${cx}" cy="${f(cy + 40 * s)}" r="${f(170 * s)}" fill="url(#glow)" opacity=".8"/>`;
  out += `<g fill="none" stroke="${g}" stroke-width="${f(sw)}" stroke-linecap="round">`;
  out += `<line x1="${cx}" y1="${f(cy - chain * s)}" x2="${cx}" y2="${f(cy)}"/>`;
  const tiers = [
    { y: 10, rx: 30, n: 7, drop: 22 },
    { y: 36, rx: 58, n: 11, drop: 30 },
    { y: 66, rx: 82, n: 15, drop: 38 },
  ];
  out += `<path d="M${cx} ${cy} q ${f(-6 * s)} ${f(30 * s)} 0 ${f(80 * s)} q ${f(6 * s)} ${f(20 * s)} 0 ${f(40 * s)}"/>`;
  for (const t of tiers) {
    const y = cy + t.y * s;
    out += `<ellipse cx="${cx}" cy="${f(y)}" rx="${f(t.rx * s)}" ry="${f(t.rx * 0.18 * s)}"/>`;
    for (let i = 0; i < t.n; i++) {
      const a = (i / (t.n - 1)) * Math.PI;
      const x = cx - Math.cos(a) * t.rx * s;
      const yy = y + Math.sin(a) * t.rx * 0.18 * s;
      const d = t.drop * s * (0.7 + 0.3 * Math.sin(a));
      out += `<line x1="${f(x)}" y1="${f(yy)}" x2="${f(x)}" y2="${f(yy + d)}" stroke-width="${f(sw * 0.6)}" opacity=".85"/>`;
      out += `<circle cx="${f(x)}" cy="${f(yy + d + 2.5 * s)}" r="${f(2.6 * s)}" fill="${lit ? C.champagne : '#5c4a33'}" stroke="none"/>`;
      if (t === tiers[1] && i % 2 === 0) {
        out += `<line x1="${f(x)}" y1="${f(yy)}" x2="${f(x)}" y2="${f(yy - 12 * s)}" stroke-width="${f(sw * 1.6)}"/>`;
        if (lit) out += `<circle cx="${f(x)}" cy="${f(yy - 16 * s)}" r="${f(5 * s)}" fill="url(#glow)" stroke="none"/><circle cx="${f(x)}" cy="${f(yy - 15 * s)}" r="${f(1.6 * s)}" fill="${C.ivory}" stroke="none"/>`;
      }
    }
  }
  // swags
  for (let i = 0; i < 6; i++) {
    const a0 = (i / 6) * Math.PI;
    const a1 = ((i + 1) / 6) * Math.PI;
    const x0 = cx - Math.cos(a0) * 82 * s;
    const x1 = cx - Math.cos(a1) * 82 * s;
    const y0 = cy + 66 * s + Math.sin(a0) * 15 * s;
    const y1 = cy + 66 * s + Math.sin(a1) * 15 * s;
    out += `<path d="M${f(x0)} ${f(y0)} Q ${f((x0 + x1) / 2)} ${f((y0 + y1) / 2 + 18 * s)} ${f(x1)} ${f(y1)}" stroke-width="${f(sw * 0.5)}" opacity=".7"/>`;
  }
  out += `<circle cx="${cx}" cy="${f(cy + 150 * s)}" r="${f(4 * s)}" fill="${g}" stroke="none"/>`;
  out += `</g>`;
  return out;
}

/* ── Round banquet table ────────────────────────────────────────────────── */
function table(cx, cy, s, r, lit = true) {
  const g = C.gold;
  let out = '';
  // chairs behind
  for (let i = 0; i < 5; i++) {
    const x = cx + (i - 2) * 30 * s;
    out += `<rect x="${f(x - 9 * s)}" y="${f(cy - 34 * s)}" width="${f(18 * s)}" height="${f(30 * s)}" rx="${f(8 * s)}" fill="${C.ivory}" opacity=".18" stroke="${g}" stroke-opacity=".35" stroke-width="${f(0.8 * s)}"/>`;
  }
  out += `<path d="M${f(cx - 74 * s)} ${f(cy)} Q ${f(cx - 80 * s)} ${f(cy + 40 * s)} ${f(cx - 70 * s)} ${f(cy + 52 * s)} L ${f(cx + 70 * s)} ${f(cy + 52 * s)} Q ${f(cx + 80 * s)} ${f(cy + 40 * s)} ${f(cx + 74 * s)} ${f(cy)} Z" fill="${C.ivory}" opacity=".16"/>`;
  out += `<ellipse cx="${cx}" cy="${cy}" rx="${f(74 * s)}" ry="${f(18 * s)}" fill="${C.ivory}" opacity=".3" stroke="${g}" stroke-width="${f(s)}"/>`;
  // centerpiece
  out += `<line x1="${cx}" y1="${f(cy)}" x2="${cx}" y2="${f(cy - 64 * s)}" stroke="${g}" stroke-width="${f(1.4 * s)}"/>`;
  out += `<path d="M${f(cx - 10 * s)} ${f(cy)} L ${cx} ${f(cy - 8 * s)} L ${f(cx + 10 * s)} ${f(cy)}" fill="none" stroke="${g}" stroke-width="${f(s)}"/>`;
  for (let i = 0; i < 9; i++) {
    const a = r() * Math.PI * 2;
    const d = r() * 16 * s;
    const fx = cx + Math.cos(a) * d * 1.4;
    const fy = cy - 70 * s + Math.sin(a) * d * 0.8;
    const col = [C.ivory, C.blush, C.champagne, C.rose][i % 4];
    out += `<circle cx="${f(fx)}" cy="${f(fy)}" r="${f((5 + r() * 4) * s)}" fill="${col}" opacity=".85"/>`;
  }
  if (lit) {
    for (const dx of [-36, -14, 14, 36]) {
      out += `<circle cx="${f(cx + dx * s)}" cy="${f(cy - 6 * s)}" r="${f(14 * s)}" fill="url(#glow)"/>`;
    }
  }
  return out;
}

/* ── Hall (wide perspective) ────────────────────────────────────────────── */
function hall({ lit = true, tables = true } = {}) {
  const W = 1600, H = 900;
  const r = rng(lit ? 7 : 3);
  const gStroke = lit ? C.gold : '#6e5a3c';
  const defs =
    `<linearGradient id="wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${lit ? '#3b1442' : '#1d0b23'}"/><stop offset="1" stop-color="${lit ? '#5a2050' : '#241029'}"/></linearGradient>` +
    `<linearGradient id="back" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${lit ? '#6a2c63' : '#261029'}"/><stop offset="1" stop-color="${lit ? '#a0607a' : '#2c1430'}"/></linearGradient>` +
    `<linearGradient id="floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${lit ? '#5b2a55' : '#1f0d24'}"/><stop offset="1" stop-color="${lit ? '#2a0e2f' : '#120814'}"/></linearGradient>` +
    `<linearGradient id="ceil" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.night}"/><stop offset="1" stop-color="${lit ? '#3a1640' : '#1c0c21'}"/></linearGradient>` +
    `<linearGradient id="runner" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.champagne}" stop-opacity="${lit ? '.55' : '.12'}"/><stop offset="1" stop-color="${C.ivory}" stop-opacity="${lit ? '.25' : '.05'}"/></linearGradient>` +
    `<radialGradient id="haze" cx=".5" cy=".55" r=".5"><stop offset="0" stop-color="${C.champagne}" stop-opacity="${lit ? '.55' : '0'}"/><stop offset="1" stop-color="${C.champagne}" stop-opacity="0"/></radialGradient>`;
  const BX0 = 560, BX1 = 1040, BY0 = 230, BY1 = 540;
  let b = '';
  b += `<rect width="${W}" height="${H}" fill="${C.night}"/>`;
  b += `<polygon points="0,0 ${W},0 ${BX1},${BY0} ${BX0},${BY0}" fill="url(#ceil)"/>`;
  b += `<polygon points="0,0 ${BX0},${BY0} ${BX0},${BY1} 0,${H}" fill="url(#wall)"/>`;
  b += `<polygon points="${W},0 ${BX1},${BY0} ${BX1},${BY1} ${W},${H}" fill="url(#wall)"/>`;
  b += `<polygon points="0,${H} ${BX0},${BY1} ${BX1},${BY1} ${W},${H}" fill="url(#floor)"/>`;
  b += `<rect x="${BX0}" y="${BY0}" width="${BX1 - BX0}" height="${BY1 - BY0}" fill="url(#back)"/>`;
  // ceiling coffers
  b += `<g fill="none" stroke="${gStroke}" stroke-opacity=".35" stroke-width="1">`;
  for (const t of [0.25, 0.5, 0.72, 0.88]) {
    const x0 = BX0 * t, x1 = W - BX0 * t, y = BY0 * t;
    b += `<line x1="${f(x0)}" y1="${f(y)}" x2="${f(x1)}" y2="${f(y)}"/>`;
  }
  for (let i = 1; i < 8; i++) {
    const xb = BX0 + ((BX1 - BX0) * i) / 8;
    const xt = (W * i) / 8;
    b += `<line x1="${f(xt)}" y1="0" x2="${f(xb)}" y2="${BY0}"/>`;
  }
  b += `</g>`;
  // side walls: pillars & arches
  const us = [0.04, 0.26, 0.45, 0.6, 0.72, 0.82, 0.9, 0.96];
  for (const side of [0, 1]) {
    const X = (x) => (side ? W - x : x);
    b += `<g fill="none" stroke="${gStroke}" stroke-width="1.6">`;
    for (let i = 0; i < us.length - 1; i++) {
      const x0 = BX0 * us[i], x1 = BX0 * us[i + 1];
      const yt0 = BY0 * us[i], yt1 = BY0 * us[i + 1];
      const yb0 = H - (H - BY1) * us[i], yb1 = H - (H - BY1) * us[i + 1];
      const h0 = yb0 - yt0, h1 = yb1 - yt1;
      const ys0 = yt0 + h0 * 0.34, ys1 = yt1 + h1 * 0.34;
      const apex = (yt0 + yt1) / 2 + ((h0 + h1) / 2) * 0.14;
      const inset = (x1 - x0) * 0.12;
      const ax0 = x0 + inset, ax1 = x1 - inset;
      const ayb0 = yb0 - h0 * 0.04, ayb1 = yb1 - h1 * 0.04;
      const d = `M${f(X(ax0))} ${f(ayb0)} L${f(X(ax0))} ${f(ys0 + inset * 0.4)} Q ${f(X((ax0 + ax1) / 2))} ${f(apex)} ${f(X(ax1))} ${f(ys1 + inset * 0.4)} L${f(X(ax1))} ${f(ayb1)}`;
      b += `<path d="${d} Z" fill="${lit ? '#7a3a6d' : '#1a0a1e'}" fill-opacity="${lit ? '.55' : '.8'}"/>`;
      b += `<path d="${d}"/>`;
      // pillar
      b += `<line x1="${f(X(x0))}" y1="${f(yt0 + h0 * 0.06)}" x2="${f(X(x0))}" y2="${f(yb0)}" stroke-width="${f(3 - us[i] * 2)}" stroke-opacity=".8"/>`;
      // sconce
      const sy = yt0 + h0 * 0.42;
      if (lit) b += `<circle cx="${f(X(x0))}" cy="${f(sy)}" r="${f(46 * (1 - us[i] * 0.8))}" fill="url(#glow)" stroke="none"/>`;
      b += `<circle cx="${f(X(x0))}" cy="${f(sy)}" r="${f(3.5 * (1 - us[i] * 0.7))}" fill="${lit ? C.ivory : '#5c4a33'}" stroke="none"/>`;
    }
    // cornice lines
    b += `<line x1="${X(0)}" y1="20" x2="${X(BX0)}" y2="${BY0 + 8}" stroke-opacity=".6"/>`;
    b += `<line x1="${X(0)}" y1="${H - 30}" x2="${X(BX0)}" y2="${BY1 - 2}" stroke-opacity=".4"/>`;
    b += `</g>`;
  }
  // back wall: stage arch
  b += `<rect x="${BX0}" y="${BY0}" width="${BX1 - BX0}" height="${BY1 - BY0}" fill="url(#haze)"/>`;
  b += `<g fill="none" stroke="${gStroke}" stroke-width="2">`;
  b += `<path d="M640 ${BY1 - 40} L640 330 Q800 220 960 330 L960 ${BY1 - 40}" />`;
  b += `<path d="M660 ${BY1 - 40} L660 338 Q800 246 940 338 L940 ${BY1 - 40}" stroke-opacity=".5" stroke-width="1"/>`;
  b += `</g>`;
  // drapes on back wall
  for (const side of [0, 1]) {
    const x = side ? 960 : 640;
    const dir = side ? -1 : 1;
    b += `<path d="M${x} 330 Q ${x + dir * 40} 400 ${x + dir * 18} ${BY1 - 40} L ${x} ${BY1 - 40} Z" fill="${C.ivory}" opacity="${lit ? '.25' : '.06'}"/>`;
  }
  // floral clusters on the arch
  for (let i = 0; i <= 18; i++) {
    const t = i / 18;
    const ang = Math.PI * (1 - t);
    const px = 800 + Math.cos(ang) * 160;
    const py = 330 - Math.sin(ang) * 66 * (1 - Math.abs(0.5 - t)) * 1.3;
    for (let k = 0; k < 3; k++) {
      const col = [C.ivory, C.blush, C.champagne][Math.floor(r() * 3)];
      b += `<circle cx="${f(px + (r() - 0.5) * 18)}" cy="${f(py + (r() - 0.5) * 14)}" r="${f(4 + r() * 5)}" fill="${col}" opacity="${lit ? '.9' : '.18'}"/>`;
    }
  }
  // stage
  b += `<polygon points="600,${BY1 - 40} 1000,${BY1 - 40} 1030,${BY1} 570,${BY1}" fill="${lit ? '#c99a8f' : '#2d1630'}" opacity=".55" stroke="${gStroke}" stroke-width="1.2"/>`;
  // kosha (sofa)
  b += `<path d="M752 ${BY1 - 44} L752 470 Q760 440 800 438 Q840 440 848 470 L848 ${BY1 - 44} Z" fill="${C.ivory}" opacity="${lit ? '.55' : '.1'}" stroke="${gStroke}" stroke-width="1.2"/>`;
  b += `<rect x="742" y="${BY1 - 62}" width="116" height="20" rx="8" fill="${C.ivory}" opacity="${lit ? '.6' : '.1'}" stroke="${gStroke}"/>`;
  // floor runner & reflections
  b += `<polygon points="730,${H} 870,${H} 812,${BY1} 788,${BY1}" fill="url(#runner)"/>`;
  if (lit) {
    for (let i = 0; i < 70; i++) {
      const t = r();
      const y = BY1 + 10 + t * t * (H - BY1 - 10);
      const half = 12 + ((y - BY1) / (H - BY1)) * 60;
      b += `<ellipse cx="${f(800 + (r() - 0.5) * 2 * half)}" cy="${f(y)}" rx="${f(2 + t * 4)}" ry="${f(1 + t * 2)}" fill="${[C.blush, C.ivory, C.rose][i % 3]}" opacity=".7"/>`;
    }
    b += `<ellipse cx="800" cy="700" rx="360" ry="70" fill="url(#soft)" opacity=".6"/>`;
  }
  // tables
  if (tables) {
    const rows = [
      { y: 600, s: 0.42, xs: [590, 680, 920, 1010] },
      { y: 670, s: 0.62, xs: [380, 530, 1070, 1220] },
      { y: 790, s: 0.95, xs: [130, 390, 1210, 1470] },
    ];
    for (const row of rows) for (const x of row.xs) b += table(x, row.y, row.s, r, lit);
  }
  // chandeliers
  const ch = [
    { x: 800, y: 175, s: 0.45, c: 30 },
    { x: 600, y: 150, s: 0.5, c: 40 }, { x: 1000, y: 150, s: 0.5, c: 40 },
    { x: 800, y: 105, s: 0.75, c: 60 },
    { x: 380, y: 70, s: 0.85, c: 60 }, { x: 1220, y: 70, s: 0.85, c: 60 },
    { x: 800, y: 20, s: 1.15, c: 30 },
  ];
  for (const c of ch) b += chandelier(c.x, c.y, c.s, { lit, chain: c.c });
  if (!lit) b += `<rect width="${W}" height="${H}" fill="${C.night}" opacity=".35"/>`;
  return svg(W, H, b, defs);
}

/* ── Stage (frontal) ────────────────────────────────────────────────────── */
function stage() {
  const W = 1600, H = 900;
  const r = rng(11);
  const defs =
    `<linearGradient id="bd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a1850"/><stop offset="1" stop-color="#b47a86"/></linearGradient>` +
    `<linearGradient id="fl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4b1d4c"/><stop offset="1" stop-color="${C.night}"/></linearGradient>` +
    `<linearGradient id="beam" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.champagne}" stop-opacity=".35"/><stop offset="1" stop-color="${C.champagne}" stop-opacity="0"/></linearGradient>`;
  let b = `<rect width="${W}" height="${H}" fill="${C.plum}"/>`;
  b += bokeh(r, W, H, 40, 30, 500);
  b += `<rect y="640" width="${W}" height="260" fill="url(#fl)"/>`;
  // backdrop arch
  b += `<path d="M420 660 L420 330 Q800 40 1180 330 L1180 660 Z" fill="url(#bd)"/>`;
  b += `<path d="M420 660 L420 330 Q800 40 1180 330 L1180 660" fill="none" stroke="${C.gold}" stroke-width="3"/>`;
  b += `<path d="M452 660 L452 342 Q800 84 1148 342 L1148 660" fill="none" stroke="${C.gold}" stroke-opacity=".5" stroke-width="1.2"/>`;
  // drapes
  for (let i = 0; i < 14; i++) {
    const x = 470 + i * 50;
    b += `<path d="M${x} ${250 + Math.abs(i - 6.5) * 18} Q ${x + 12} 460 ${x + 4} 660" fill="none" stroke="${C.ivory}" stroke-opacity=".18" stroke-width="10"/>`;
  }
  // string lights
  for (let k = 0; k < 3; k++) {
    for (let i = 0; i <= 40; i++) {
      const t = i / 40;
      const x = 440 + 720 * t;
      const y = 330 - Math.sin(Math.PI * t) * (230 - k * 50) + k * 70 + Math.sin(t * 40) * 3;
      b += `<circle cx="${f(x)}" cy="${f(y)}" r="9" fill="url(#glow)"/><circle cx="${f(x)}" cy="${f(y)}" r="1.6" fill="${C.ivory}"/>`;
    }
  }
  // flowers along arch and pillars
  const flower = (x, y, rad) => {
    const col = [C.ivory, C.blush, C.champagne, C.rose, C.ivory][Math.floor(r() * 5)];
    return `<circle cx="${f(x)}" cy="${f(y)}" r="${f(rad)}" fill="${col}"/><circle cx="${f(x)}" cy="${f(y)}" r="${f(rad * 0.55)}" fill="none" stroke="${C.night}" stroke-opacity=".12"/>`;
  };
  for (let i = 0; i < 160; i++) {
    const t = r();
    const x = 420 + 760 * t;
    const y = 330 - Math.sin(Math.PI * t) * 260 * (t > 0.08 && t < 0.92 ? 1 : 0.4);
    b += flower(x + (r() - 0.5) * 50, y + (r() - 0.5) * 40, 6 + r() * 12);
  }
  for (const px of [420, 1180]) {
    for (let i = 0; i < 60; i++) b += flower(px + (r() - 0.5) * 60, 340 + r() * 320, 6 + r() * 11);
    for (let i = 0; i < 12; i++) b += `<ellipse cx="${f(px + (r() - 0.5) * 80)}" cy="${f(360 + r() * 300)}" rx="14" ry="5" fill="${C.sage}" opacity=".55" transform="rotate(${f(r() * 180)} ${f(px)} ${f(500)})"/>`;
  }
  // platform & steps
  b += `<polygon points="360,660 1240,660 1290,720 310,720" fill="#d8b3a4" opacity=".55" stroke="${C.gold}" stroke-width="1.5"/>`;
  b += `<polygon points="310,720 1290,720 1330,760 270,760" fill="#b88c84" opacity=".45" stroke="${C.gold}" stroke-opacity=".6"/>`;
  // kosha
  b += `<path d="M660 650 L660 520 Q670 450 800 440 Q930 450 940 520 L940 650 Z" fill="${C.ivory}" opacity=".85" stroke="${C.gold}" stroke-width="2"/>`;
  b += `<path d="M690 640 L690 530 Q700 480 800 474 Q900 480 910 530 L910 640" fill="none" stroke="${C.gold}" stroke-opacity=".6"/>`;
  b += `<rect x="640" y="600" width="320" height="50" rx="20" fill="${C.ivory}" stroke="${C.gold}" stroke-width="2"/>`;
  // beams
  b += `<polygon points="500,0 560,0 760,660 600,660" fill="url(#beam)"/><polygon points="1040,0 1100,0 1000,660 840,660" fill="url(#beam)"/>`;
  // aisle
  b += `<polygon points="700,${H} 900,${H} 860,760 740,760" fill="${C.ivory}" opacity=".18"/>`;
  for (let i = 0; i < 50; i++) b += `<circle cx="${f(720 + r() * 160)}" cy="${f(770 + r() * 130)}" r="${f(2 + r() * 3)}" fill="${C.blush}" opacity=".7"/>`;
  return svg(W, H, b, defs);
}

/* ── Table close-up (portrait) ──────────────────────────────────────────── */
function tableClose(seed = 5, alt = false) {
  const W = 900, H = 1200;
  const r = rng(seed);
  const defs =
    `<linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${alt ? '#3a1640' : C.plum}"/><stop offset="1" stop-color="${alt ? '#7c3f66' : '#5a2050'}"/></linearGradient>` +
    `<radialGradient id="cloth" cx=".5" cy=".35" r=".7"><stop offset="0" stop-color="${C.ivory}"/><stop offset="1" stop-color="#e2cfc4"/></radialGradient>`;
  let b = `<rect width="${W}" height="${H}" fill="url(#bg)"/>`;
  b += bokeh(r, W, H, 34, 60, 640);
  // cloth
  b += `<path d="M40 780 Q450 640 860 780 L900 1200 L0 1200 Z" fill="url(#cloth)" opacity=".92"/>`;
  b += `<ellipse cx="450" cy="790" rx="420" ry="120" fill="url(#cloth)" stroke="${C.gold}" stroke-width="2"/>`;
  // candelabra centerpiece
  b += `<g fill="none" stroke="${C.gold}" stroke-width="3" stroke-linecap="round">`;
  b += `<path d="M450 760 L450 420"/><path d="M420 770 Q450 740 480 770"/>`;
  for (const [dx, h] of [[-120, 520], [-60, 470], [60, 470], [120, 520]]) b += `<path d="M450 600 Q ${450 + dx} 600 ${450 + dx} ${h}"/>`;
  b += `</g>`;
  for (const [x, y] of [[330, 520], [390, 470], [510, 470], [570, 520], [450, 420]]) {
    b += `<rect x="${x - 7}" y="${y - 70}" width="14" height="70" rx="3" fill="${C.ivory}"/>`;
    b += `<circle cx="${x}" cy="${y - 84}" r="44" fill="url(#glow)"/><ellipse cx="${x}" cy="${y - 80}" rx="4" ry="9" fill="${C.ivory}"/>`;
  }
  // flowers at base
  for (let i = 0; i < 70; i++) {
    const a = r() * Math.PI;
    const d = 40 + r() * 150;
    const x = 450 + Math.cos(a) * d * 1.3;
    const y = 740 - Math.sin(a) * d * 0.4;
    const rad = 10 + r() * 16;
    const col = alt ? [C.blush, C.rose, C.ivory][i % 3] : [C.ivory, C.blush, C.champagne][i % 3];
    b += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(rad)}" fill="${col}"/><path d="M${f(x - rad * 0.5)} ${f(y)} q ${f(rad * 0.5)} ${f(-rad * 0.6)} ${f(rad)} 0" fill="none" stroke="${C.night}" stroke-opacity=".15"/>`;
  }
  for (let i = 0; i < 18; i++) b += `<ellipse cx="${f(300 + r() * 300)}" cy="${f(720 + r() * 50)}" rx="22" ry="7" fill="${C.sage}" opacity=".6" transform="rotate(${f(r() * 60 - 30)} 450 740)"/>`;
  // plates & glasses
  for (const [x, y, s] of [[170, 880, 1], [730, 880, 1], [450, 960, 1.15]]) {
    b += `<ellipse cx="${x}" cy="${y}" rx="${100 * s}" ry="${28 * s}" fill="${C.ivory}" stroke="${C.gold}" stroke-width="3"/>`;
    b += `<ellipse cx="${x}" cy="${y}" rx="${70 * s}" ry="${19 * s}" fill="none" stroke="${C.gold}" stroke-opacity=".5"/>`;
    b += `<path d="M${x + 110 * s} ${y - 120 * s} q 18 50 0 70 q -18 -20 0 -70 M${x + 110 * s} ${y - 50 * s} L ${x + 110 * s} ${y - 6 * s} M ${x + 92 * s} ${y - 4 * s} L ${x + 128 * s} ${y - 4 * s}" fill="none" stroke="${C.champagne}" stroke-width="2.4" opacity=".9"/>`;
  }
  return svg(W, H, b, defs);
}

/* ── Chandelier close-up (portrait) ─────────────────────────────────────── */
function chandelierClose() {
  const W = 900, H = 1200;
  const r = rng(21);
  const defs = `<radialGradient id="bg" cx=".5" cy=".35" r=".8"><stop offset="0" stop-color="#5a2050"/><stop offset="1" stop-color="${C.night}"/></radialGradient>`;
  let b = `<rect width="${W}" height="${H}" fill="url(#bg)"/>`;
  b += bokeh(r, W, H, 30, 50);
  b += `<g fill="none" stroke="${C.gold}" stroke-opacity=".5"><circle cx="450" cy="0" r="110"/><circle cx="450" cy="0" r="80"/></g>`;
  b += chandelier(450, 300, 3.6, { chain: 80 });
  return svg(W, H, b, defs);
}

/* ── Floral arrangement (portrait) ──────────────────────────────────────── */
function floral(seed = 31, alt = false) {
  const W = 900, H = 1200;
  const r = rng(seed);
  const defs = `<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${alt ? '#6b2a70' : C.plum}"/><stop offset="1" stop-color="${alt ? '#2a0e2f' : '#4f1c55'}"/></linearGradient>`;
  let b = `<rect width="${W}" height="${H}" fill="url(#bg)"/>`;
  b += bokeh(r, W, H, 26, 70);
  // urn
  b += `<path d="M330 1200 L360 980 Q300 930 330 880 L570 880 Q600 930 540 980 L570 1200 Z" fill="${C.gold}" opacity=".75"/>`;
  b += `<path d="M330 880 L570 880" stroke="${C.champagne}" stroke-width="4"/>`;
  // leaves
  for (let i = 0; i < 40; i++) {
    const a = -Math.PI * (0.05 + r() * 0.9);
    const d = 120 + r() * 320;
    const x = 450 + Math.cos(a) * d;
    const y = 840 + Math.sin(a) * d * 1.2;
    b += `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(26 + r() * 20)}" ry="${f(9 + r() * 6)}" fill="${C.sage}" opacity="${f(0.45 + r() * 0.35)}" transform="rotate(${f((a * 180) / Math.PI)} ${f(x)} ${f(y)})"/>`;
  }
  // roses
  const pal = alt ? [C.blush, C.rose, C.ivory, '#d9a9b8'] : [C.ivory, C.blush, C.champagne, C.ivory];
  for (let i = 0; i < 46; i++) {
    const a = -Math.PI * (0.08 + r() * 0.84);
    const d = r() * 300;
    const x = 450 + Math.cos(a) * d * 1.1;
    const y = 800 + Math.sin(a) * d * 1.2;
    const rad = 26 + r() * 30;
    const col = pal[i % pal.length];
    b += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(rad)}" fill="${col}"/>`;
    b += `<g fill="none" stroke="#8a5a6a" stroke-opacity=".25" stroke-width="1.6"><path d="M${f(x - rad * 0.7)} ${f(y + rad * 0.3)} Q ${f(x - rad * 0.2)} ${f(y + rad * 0.75)} ${f(x + rad * 0.55)} ${f(y + rad * 0.2)}"/><path d="M${f(x + rad * 0.3)} ${f(y - rad * 0.1)} Q ${f(x)} ${f(y - rad * 0.55)} ${f(x - rad * 0.35)} ${f(y - rad * 0.05)} Q ${f(x - rad * 0.1)} ${f(y + rad * 0.3)} ${f(x + rad * 0.15)} ${f(y + rad * 0.05)}"/></g>`;
  }
  for (let i = 0; i < 30; i++) b += `<circle cx="${f(200 + r() * 500)}" cy="${f(380 + r() * 500)}" r="${f(3 + r() * 4)}" fill="${C.ivory}" opacity=".9"/>`;
  return svg(W, H, b, defs);
}

/* ── Entrance (portrait) ────────────────────────────────────────────────── */
function entrance() {
  const W = 900, H = 1200;
  const r = rng(41);
  const defs =
    `<linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.night}"/><stop offset="1" stop-color="${C.plum}"/></linearGradient>` +
    `<radialGradient id="door" cx=".5" cy=".6" r=".7"><stop offset="0" stop-color="${C.ivory}"/><stop offset=".4" stop-color="${C.champagne}"/><stop offset="1" stop-color="${C.gold}" stop-opacity=".6"/></radialGradient>` +
    `<linearGradient id="spill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.champagne}" stop-opacity=".55"/><stop offset="1" stop-color="${C.champagne}" stop-opacity="0"/></linearGradient>`;
  let b = `<rect width="${W}" height="${H}" fill="url(#bg)"/>`;
  b += bokeh(r, W, H, 20, 30, 500);
  b += `<path d="M230 960 L230 430 Q450 180 670 430 L670 960 Z" fill="url(#door)"/>`;
  b += `<polygon points="230,960 670,960 860,1200 40,1200" fill="url(#spill)"/>`;
  // open doors
  b += `<polygon points="230,430 120,470 120,1010 230,960" fill="#3c1542" stroke="${C.gold}" stroke-width="2"/>`;
  b += `<polygon points="670,430 780,470 780,1010 670,960" fill="#3c1542" stroke="${C.gold}" stroke-width="2"/>`;
  for (const [x0, x1] of [[135, 215], [685, 765]]) b += `<g fill="none" stroke="${C.gold}" stroke-opacity=".6"><rect x="${x0}" y="520" width="${x1 - x0}" height="180"/><rect x="${x0}" y="730" width="${x1 - x0}" height="220"/></g>`;
  // arch frame
  b += `<g fill="none" stroke="${C.gold}" stroke-width="4"><path d="M200 980 L200 420 Q450 130 700 420 L700 980"/></g>`;
  b += `<g fill="none" stroke="${C.gold}" stroke-width="1.4" stroke-opacity=".6"><path d="M170 990 L170 410 Q450 90 730 410 L730 990"/></g>`;
  // garland
  for (let i = 0; i < 90; i++) {
    const t = r();
    const ang = Math.PI * (1 - t);
    const x = 450 + Math.cos(ang) * 250;
    const y = 420 - Math.sin(ang) * 270;
    b += `<circle cx="${f(x + (r() - 0.5) * 34)}" cy="${f(y + (r() - 0.5) * 30)}" r="${f(6 + r() * 10)}" fill="${[C.ivory, C.blush, C.champagne][i % 3]}"/>`;
  }
  // lanterns
  for (const x of [80, 820]) {
    b += `<circle cx="${x}" cy="760" r="90" fill="url(#glow)"/>`;
    b += `<g fill="none" stroke="${C.gold}" stroke-width="2"><path d="M${x - 22} 730 L${x + 22} 730 L${x + 16} 800 L${x - 16} 800 Z"/><path d="M${x} 700 L${x} 730"/><path d="M${x - 26} 730 Q ${x} 700 ${x + 26} 730"/></g>`;
  }
  // steps
  for (let i = 0; i < 3; i++) b += `<rect x="${200 - i * 40}" y="${980 + i * 40}" width="${500 + i * 80}" height="40" fill="${C.ivory}" opacity="${0.12 + i * 0.05}" stroke="${C.gold}" stroke-opacity=".4"/>`;
  return svg(W, H, b, defs);
}

const files = {
  'hall.svg': hall(),
  'hall-dark.svg': hall({ lit: false, tables: false }),
  'stage.svg': stage(),
  'table.svg': tableClose(),
  'table-2.svg': tableClose(9, true),
  'chandelier.svg': chandelierClose(),
  'floral.svg': floral(),
  'floral-2.svg': floral(57, true),
  'entrance.svg': entrance(),
};
for (const [name, content] of Object.entries(files)) {
  writeFileSync(join(OUT, name), content);
  console.log(`${name.padEnd(16)} ${(content.length / 1024).toFixed(1)} kB`);
}
