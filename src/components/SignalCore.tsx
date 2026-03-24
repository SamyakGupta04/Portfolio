import { useRef, useEffect, useCallback } from 'react';

/**
 * SignalCore — Geometric centerpiece for the hero
 * Concentric rotating rings with node dots and constellation lines.
 * Purely canvas-based, no 3D libraries.
 */
export default function SignalCore() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return 0;
    const ctx = canvas.getContext('2d');
    if (!ctx) return 0;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const size = Math.min(window.innerWidth * 0.45, 520);
    const dpr = Math.min(window.devicePixelRatio, 2);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = size + 'px';
    canvas.style.height = size + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const cx = size / 2;
    const cy = size / 2;

    const rings = [
      { r: size * 0.18, nodes: 4, speed: 0.0003, opacity: 0.12 },
      { r: size * 0.28, nodes: 6, speed: -0.0002, opacity: 0.09 },
      { r: size * 0.38, nodes: 8, speed: 0.00015, opacity: 0.06 },
      { r: size * 0.46, nodes: 5, speed: -0.0001, opacity: 0.04 },
    ];

    let animId: number;

    function getNodePositions(ring: typeof rings[0], time: number) {
      const positions: { x: number; y: number }[] = [];
      const angle = prefersReduced ? 0 : time * ring.speed;
      for (let i = 0; i < ring.nodes; i++) {
        const a = angle + (Math.PI * 2 * i) / ring.nodes;
        positions.push({
          x: cx + Math.cos(a) * ring.r,
          y: cy + Math.sin(a) * ring.r,
        });
      }
      return positions;
    }

    function render(time: number) {
      ctx!.clearRect(0, 0, size, size);

      // Center glow
      const grd = ctx!.createRadialGradient(cx, cy, 0, cx, cy, size * 0.15);
      grd.addColorStop(0, 'rgba(90, 124, 255, 0.08)');
      grd.addColorStop(1, 'transparent');
      ctx!.fillStyle = grd;
      ctx!.fillRect(0, 0, size, size);

      // Center dot
      ctx!.beginPath();
      ctx!.arc(cx, cy, 2.5, 0, Math.PI * 2);
      ctx!.fillStyle = 'rgba(90, 124, 255, 0.5)';
      ctx!.fill();

      const allNodes: { x: number; y: number }[] = [];

      // Draw rings and nodes
      for (const ring of rings) {
        // Ring circle
        ctx!.beginPath();
        ctx!.arc(cx, cy, ring.r, 0, Math.PI * 2);
        ctx!.strokeStyle = `rgba(255, 255, 255, ${ring.opacity})`;
        ctx!.lineWidth = 0.5;
        ctx!.stroke();

        // Nodes
        const nodes = getNodePositions(ring, time);
        for (const node of nodes) {
          ctx!.beginPath();
          ctx!.arc(node.x, node.y, 2, 0, Math.PI * 2);
          ctx!.fillStyle = `rgba(90, 124, 255, ${ring.opacity * 3})`;
          ctx!.fill();
          allNodes.push(node);
        }
      }

      // Constellation lines — connect some nearby nodes
      ctx!.lineWidth = 0.3;
      for (let i = 0; i < allNodes.length; i++) {
        for (let j = i + 1; j < allNodes.length; j++) {
          const dx = allNodes[i].x - allNodes[j].x;
          const dy = allNodes[i].y - allNodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < size * 0.22) {
            const alpha = (1 - dist / (size * 0.22)) * 0.06;
            ctx!.beginPath();
            ctx!.moveTo(allNodes[i].x, allNodes[i].y);
            ctx!.lineTo(allNodes[j].x, allNodes[j].y);
            ctx!.strokeStyle = `rgba(90, 124, 255, ${alpha})`;
            ctx!.stroke();
          }
        }
      }

      animId = requestAnimationFrame(render);
    }

    animId = requestAnimationFrame(render);
    return animId;
  }, []);

  useEffect(() => {
    const animId = draw();

    const handleResize = () => draw();
    window.addEventListener('resize', handleResize);

    return () => {
      if (animId) cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      className="signal-core"
      aria-hidden="true"
    />
  );
}
