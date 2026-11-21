import { useEffect, useRef } from 'react';
import { portrait } from '../data/portrait';

// Width / height of one character cell. scripts/build-portrait.mjs uses the same value.
const CELL = 0.6;
const FAMILY = '"JetBrains Mono Variable", ui-monospace, "SF Mono", Menlo, monospace';
const WEIGHT = 700;
const REVEAL_MS = 1500;
// Share of the reveal that one cell can lag behind its row. It makes the edge ragged.
const JITTER = 0.26;

// Characters that the ramp can use. Symbols only: letters make the picture look noisy.
const CANDIDATES = ' .:-=+*x#%8@';

/** Orders the candidates by the ink they put down in the loaded font, then picks one per level. */
function buildRamp(levels: number): string[] {
  const size = 40;
  const probe = document.createElement('canvas');
  probe.width = size;
  probe.height = size * 2;
  const ctx = probe.getContext('2d', { willReadFrequently: true })!;
  ctx.font = `${WEIGHT} ${size}px ${FAMILY}`;
  ctx.textBaseline = 'alphabetic';

  const measured = [...CANDIDATES].map((glyph) => {
    ctx.clearRect(0, 0, probe.width, probe.height);
    ctx.fillText(glyph, 6, size * 1.4);
    const { data } = ctx.getImageData(0, 0, probe.width, probe.height);
    let ink = 0;
    for (let i = 3; i < data.length; i += 4) ink += data[i];
    return { glyph, ink };
  });
  measured.sort((a, b) => a.ink - b.ink);

  const inked = measured.filter((m) => m.ink > 0);
  const max = inked[inked.length - 1].ink;
  const ramp = [' '];
  for (let level = 1; level < levels; level++) {
    const target = (level / (levels - 1)) * max;
    let best = inked[0];
    for (const m of inked) {
      if (Math.abs(m.ink - target) < Math.abs(best.ink - target)) best = m;
    }
    ramp.push(best.glyph);
  }
  return ramp;
}

/** A stable pseudo-random number in [0, 1) for a cell. */
function hash(x: number, y: number): number {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return n - Math.floor(n);
}

export default function AsciiPortrait() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const { cols, rows, data } = portrait;
    const levels = new Uint8Array(cols * rows);
    const delay = new Float32Array(cols * rows);
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        levels[y * cols + x] = parseInt(data[y][x], 16);
        delay[y * cols + x] = (y / rows) * (1 - JITTER) + hash(x, y) * JITTER;
      }
    }

    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const scrambled = new Map<number, { glyph: string; until: number }>();
    let ramp: string[] = [];
    let cw = 0;
    let ch = 0;
    let progress = still ? 1 : 0;
    let revealStart = 0;
    let frame = 0;
    let disposed = false;

    /** Clears the rows y0..y1 and draws them again. Neighbor rows are drawn too, because glyphs overflow their cell. */
    function repaint(y0: number, y1: number) {
      y0 = Math.max(0, y0);
      y1 = Math.min(rows - 1, y1);
      if (y1 < y0) return;
      const top = Math.floor(y0 * ch);
      const bottom = Math.ceil((y1 + 1) * ch);
      ctx!.save();
      ctx!.beginPath();
      ctx!.rect(0, top, canvas!.width, bottom - top);
      ctx!.clip();
      ctx!.clearRect(0, top, canvas!.width, bottom - top);
      for (let y = Math.max(0, y0 - 1); y <= Math.min(rows - 1, y1 + 1); y++) {
        const baseline = (y + 0.8) * ch;
        for (let x = 0; x < cols; x++) {
          const i = y * cols + x;
          if (levels[i] === 0 || delay[i] > progress) continue;
          ctx!.fillText(scrambled.get(i)?.glyph ?? ramp[levels[i]], x * cw, baseline);
        }
      }
      ctx!.restore();
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.round(canvas!.clientWidth * dpr);
      const height = Math.round(canvas!.clientHeight * dpr);
      if (!width || !height) return;
      canvas!.width = width;
      canvas!.height = height;
      cw = width / cols;
      ch = height / rows;
      ctx!.font = `${WEIGHT} ${cw / CELL}px ${FAMILY}`;
      ctx!.textBaseline = 'alphabetic';
      ctx!.fillStyle = '#000';
      if (ramp.length) repaint(0, rows - 1);
    }

    function tick(now: number) {
      frame = 0;
      if (disposed) return;
      let first = rows;
      let last = -1;

      if (progress < 1) {
        const before = progress;
        progress = Math.min(1, (now - revealStart) / REVEAL_MS);
        first = Math.floor(((before - JITTER) / (1 - JITTER)) * rows);
        last = Math.ceil((progress / (1 - JITTER)) * rows);
      }

      for (const [i, cell] of scrambled) {
        const y = Math.floor(i / cols);
        first = Math.min(first, y);
        last = Math.max(last, y);
        if (cell.until <= now) scrambled.delete(i);
      }

      repaint(first, last);
      if (progress < 1 || scrambled.size) frame = requestAnimationFrame(tick);
    }

    // The glyphs under the pointer change for a moment.
    function onPointerMove(event: PointerEvent) {
      if (still || progress < 1 || event.pointerType !== 'mouse') return;
      const box = canvas!.getBoundingClientRect();
      const cx = ((event.clientX - box.left) / box.width) * cols;
      const cy = ((event.clientY - box.top) / box.height) * rows;
      const rx = 7;
      const ry = rx * CELL;
      if (cx < -rx || cy < -ry || cx > cols + rx || cy > rows + ry) return;

      const now = performance.now();
      for (let y = Math.max(0, Math.floor(cy - ry)); y <= Math.min(rows - 1, Math.ceil(cy + ry)); y++) {
        for (let x = Math.max(0, Math.floor(cx - rx)); x <= Math.min(cols - 1, Math.ceil(cx + rx)); x++) {
          const i = y * cols + x;
          const distance = ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2;
          if (levels[i] === 0 || distance > 1 || Math.random() > 0.4) continue;
          const shift = Math.round((Math.random() - 0.5) * 8);
          const level = Math.min(ramp.length - 1, Math.max(1, levels[i] + shift));
          scrambled.set(i, { glyph: ramp[level], until: now + 120 + Math.random() * 380 });
        }
      }
      if (!frame) frame = requestAnimationFrame(tick);
    }

    const observer = new ResizeObserver(resize);
    const fontReady = document.fonts?.load(`${WEIGHT} 16px "JetBrains Mono Variable"`) ?? Promise.resolve();
    fontReady
      .catch(() => undefined)
      .then(() => {
        if (disposed) return;
        ramp = buildRamp(16);
        resize();
        observer.observe(canvas);
        window.addEventListener('pointermove', onPointerMove, { passive: true });
        if (!still) {
          revealStart = performance.now();
          frame = requestAnimationFrame(tick);
        }
      });

    return () => {
      disposed = true;
      observer.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      className="portrait"
      aria-hidden="true"
      style={{ aspectRatio: `${portrait.cols * CELL} / ${portrait.rows}` }}
    >
      <canvas ref={ref} className="portrait__canvas" />
    </div>
  );
}
