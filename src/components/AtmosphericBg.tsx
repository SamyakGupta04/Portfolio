import { useEffect, useRef } from 'react';

/**
 * AtmosphericBg — 2-layer canvas background
 * Layer 1: Slow perspective grid (structural depth)
 * Layer 2: Drifting micro-particles (ambient life)
 * + CSS radial light blooms positioned at section breaks
 */
export default function AtmosphericBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let w = 0, h = 0;

    // Check reduced motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Particles
    interface Particle { x: number; y: number; vx: number; vy: number; r: number; a: number; }
    const particles: Particle[] = [];
    const PARTICLE_COUNT = window.innerWidth < 768 ? 30 : 60;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio, 2);
      w = window.innerWidth;
      h = document.documentElement.scrollHeight || window.innerHeight * 5;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      canvas!.style.width = w + 'px';
      canvas!.style.height = h + 'px';
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function initParticles() {
      particles.length = 0;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.15,
          vy: (Math.random() - 0.5) * 0.1,
          r: Math.random() * 1.2 + 0.3,
          a: Math.random() * 0.3 + 0.05,
        });
      }
    }

    function drawGrid(time: number) {
      if (!ctx) return;
      const spacing = 80;
      const cols = Math.ceil(w / spacing) + 2;
      const rows = Math.ceil(h / spacing) + 2;
      const drift = time * 0.00003;

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.018)';
      ctx.lineWidth = 0.5;

      // Vertical lines with very subtle wave
      for (let i = 0; i < cols; i++) {
        const x = i * spacing;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        for (let y = 0; y < h; y += spacing) {
          const offset = Math.sin(y * 0.001 + drift + i * 0.3) * 2;
          ctx.lineTo(x + offset, y);
        }
        ctx.stroke();
      }

      // Horizontal lines
      for (let j = 0; j < rows; j++) {
        const y = j * spacing;
        ctx.beginPath();
        ctx.moveTo(0, y);
        for (let x = 0; x < w; x += spacing) {
          const offset = Math.sin(x * 0.001 + drift + j * 0.3) * 2;
          ctx.lineTo(x, y + offset);
        }
        ctx.stroke();
      }
    }

    function drawParticles(time: number) {
      if (!ctx) return;
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        // Wrap
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;

        const flicker = 0.5 + 0.5 * Math.sin(time * 0.001 + p.x * 0.01);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180, 190, 255, ${p.a * flicker})`;
        ctx.fill();
      }
    }

    function animate(time: number) {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);
      drawGrid(time);
      drawParticles(time);
      animId = requestAnimationFrame(animate);
    }

    resize();
    initParticles();

    if (!prefersReduced) {
      animId = requestAnimationFrame(animate);
    } else {
      // Draw static grid once
      drawGrid(0);
    }

    const handleResize = () => {
      resize();
      initParticles();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="atmospheric-canvas"
        aria-hidden="true"
      />
      {/* CSS light blooms at strategic Y positions */}
      <div className="atmospheric-blooms" aria-hidden="true">
        <div className="bloom bloom--hero" />
        <div className="bloom bloom--mid" />
        <div className="bloom bloom--bottom" />
      </div>
    </>
  );
}
