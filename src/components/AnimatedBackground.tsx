import { useEffect, useRef, useCallback } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  pulse: number;
  hue: number;
}

interface AuroraBlob {
  x: number;
  y: number;
  radius: number;
  hue: number;
  speed: number;
  phase: number;
}

interface GeoShape {
  x: number;
  y: number;
  rotation: number;
  rotationSpeed: number;
  size: number;
  opacity: number;
  sides: number;
  drift: number;
}

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number>(0);

  const createParticles = useCallback((width: number, height: number): Particle[] => {
    const count = Math.min(Math.floor((width * height) / 18000), 90);
    return Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      size: Math.random() * 2.5 + 0.5,
      opacity: Math.random() * 0.4 + 0.1,
      pulse: Math.random() * Math.PI * 2,
      hue: 220 + Math.random() * 60,
    }));
  }, []);

  const createAuroraBlobs = useCallback((width: number, height: number): AuroraBlob[] => {
    return [
      { x: width * 0.2, y: height * 0.3, radius: 400, hue: 230, speed: 0.3, phase: 0 },
      { x: width * 0.7, y: height * 0.5, radius: 350, hue: 260, speed: 0.25, phase: Math.PI },
      { x: width * 0.5, y: height * 0.8, radius: 300, hue: 200, speed: 0.35, phase: Math.PI / 2 },
      { x: width * 0.8, y: height * 0.2, radius: 280, hue: 280, speed: 0.2, phase: Math.PI * 1.5 },
    ];
  }, []);

  const createGeoShapes = useCallback((width: number, height: number): GeoShape[] => {
    return Array.from({ length: 6 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.003,
      size: 20 + Math.random() * 40,
      opacity: 0.02 + Math.random() * 0.03,
      sides: Math.random() > 0.5 ? 6 : 3,
      drift: Math.random() * 0.15,
    }));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: Particle[];
    let auroraBlobs: AuroraBlob[];
    let geoShapes: GeoShape[];
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = document.documentElement.scrollHeight;
      particles = createParticles(canvas.width, canvas.height);
      auroraBlobs = createAuroraBlobs(canvas.width, canvas.height);
      geoShapes = createGeoShapes(canvas.width, canvas.height);
    };

    const drawPolygon = (cx: number, cy: number, radius: number, sides: number, rotation: number) => {
      ctx.beginPath();
      for (let i = 0; i <= sides; i++) {
        const angle = (i * 2 * Math.PI) / sides + rotation;
        const x = cx + radius * Math.cos(angle);
        const y = cy + radius * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.004;

      // Layer 1: Aurora blobs
      auroraBlobs.forEach((blob) => {
        const offsetX = Math.sin(time * blob.speed + blob.phase) * 120;
        const offsetY = Math.cos(time * blob.speed * 0.7 + blob.phase) * 80;
        const bx = blob.x + offsetX;
        const by = blob.y + offsetY;
        const pulsingRadius = blob.radius + Math.sin(time * 0.5 + blob.phase) * 50;

        const g = ctx.createRadialGradient(bx, by, 0, bx, by, pulsingRadius);
        const hueShift = Math.sin(time * 0.3 + blob.phase) * 15;
        const h = blob.hue + hueShift;
        g.addColorStop(0, `hsla(${h}, 70%, 55%, 0.07)`);
        g.addColorStop(0.4, `hsla(${h + 20}, 60%, 45%, 0.04)`);
        g.addColorStop(0.7, `hsla(${h + 40}, 50%, 40%, 0.015)`);
        g.addColorStop(1, 'transparent');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      });

      // Layer 2: Geometric shapes
      geoShapes.forEach((shape) => {
        shape.rotation += shape.rotationSpeed;
        shape.y += shape.drift;
        if (shape.y > canvas.height + shape.size) {
          shape.y = -shape.size;
          shape.x = Math.random() * canvas.width;
        }

        const pulsedOpacity = shape.opacity * (0.6 + Math.sin(time * 2 + shape.rotation) * 0.4);
        ctx.strokeStyle = `rgba(79, 110, 247, ${pulsedOpacity})`;
        ctx.lineWidth = 0.5;
        drawPolygon(shape.x, shape.y, shape.size, shape.sides, shape.rotation);
        ctx.stroke();
      });

      // Layer 3: Particles
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y + window.scrollY;

      particles.forEach((p) => {
        // Subtle mouse influence
        const dxm = mx - p.x;
        const dym = my - p.y;
        const distMouse = Math.sqrt(dxm * dxm + dym * dym);
        if (distMouse < 200) {
          const force = (200 - distMouse) / 200 * 0.015;
          p.vx += (dxm / distMouse) * force;
          p.vy += (dym / distMouse) * force;
        }

        // Damping
        p.vx *= 0.998;
        p.vy *= 0.998;

        p.x += p.vx;
        p.y += p.vy;
        p.pulse += 0.015;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        const pulsedOpacity = p.opacity * (0.6 + Math.sin(p.pulse) * 0.4);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 70%, 65%, ${pulsedOpacity})`;
        ctx.fill();
      });

      // Layer 4: Neural network connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            const alpha = 0.05 * (1 - dist / 130);
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(79, 110, 247, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Layer 5: Subtle grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.012)';
      ctx.lineWidth = 0.5;
      const gridSize = 80;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleResize = () => {
      resize();
    };

    resize();
    draw();

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    // Resize canvas when page height changes (content loads)
    const resizeObserver = new ResizeObserver(() => {
      const newHeight = document.documentElement.scrollHeight;
      if (canvas.height !== newHeight) {
        canvas.height = newHeight;
      }
    });
    resizeObserver.observe(document.documentElement);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
    };
  }, [createParticles, createAuroraBlobs, createGeoShapes]);

  return <canvas ref={canvasRef} className="animated-bg-canvas" />;
}
