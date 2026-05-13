import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  color: string;
  opacityDelta: number;
}

const COLORS = ["#00f5ff", "#7c3aed", "#00f5ff", "#a78bfa", "#00e5ff"];

function createParticle(width: number, height: number): Particle {
  return {
    x: Math.random() * width,
    y: height + Math.random() * 20,
    vx: (Math.random() - 0.5) * 0.4,
    vy: -(0.3 + Math.random() * 0.7),
    radius: 1 + Math.random() * 2.5,
    opacity: 0.1 + Math.random() * 0.5,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    opacityDelta: (Math.random() - 0.5) * 0.008,
  };
}

export function ParticleBackground({ count = 70 }: { count?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number>(0);
  const pausedRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Init particles
    particlesRef.current = Array.from({ length: count }, () =>
      createParticle(canvas.width, canvas.height),
    );

    const handleVisibility = () => {
      pausedRef.current = document.visibilityState === "hidden";
    };
    document.addEventListener("visibilitychange", handleVisibility);

    const draw = () => {
      animFrameRef.current = requestAnimationFrame(draw);
      if (pausedRef.current) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const particles = particlesRef.current;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.opacity += p.opacityDelta;

        if (p.opacity <= 0.05 || p.opacity >= 0.65) p.opacityDelta *= -1;

        // Reset when out of bounds
        if (p.y < -10 || p.x < -10 || p.x > canvas.width + 10) {
          particles[i] = createParticle(canvas.width, canvas.height);
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fill();
        ctx.globalAlpha = 1;

        // Soft glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 3, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(
          p.x,
          p.y,
          0,
          p.x,
          p.y,
          p.radius * 3,
        );
        gradient.addColorStop(0, `${p.color}33`);
        gradient.addColorStop(1, `${p.color}00`);
        ctx.fillStyle = gradient;
        ctx.fill();
      }
    };

    draw();

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      ro.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [count]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}
