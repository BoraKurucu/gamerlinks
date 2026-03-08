import { useEffect, useRef } from 'react';

export default function ParticleTrail({ children }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.pointerEvents = 'none';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '1';
    canvas.width = el.offsetWidth;
    canvas.height = el.offsetHeight;
    el.appendChild(canvas);
    canvasRef.current = canvas;
    const ctx = canvas.getContext('2d');

    let particles = [];
    let raf = null;

    function createParticle(e) {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      particles.push({
        x, y,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        life: 20,
        size: Math.random() * 2 + 1,
      });
    }

    function draw() {
      if (!canvasRef.current) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles = particles.filter((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 1;
        const theme = document.documentElement.getAttribute('data-theme') || 'blue';
        const colors = { blue: '0, 229, 255', purple: '188, 19, 254', green: '57, 255, 20' };
        const rgb = colors[theme] || colors.blue;
        ctx.fillStyle = `rgba(${rgb}, ${p.life / 20})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        return p.life > 0;
      });
      if (particles.length > 0) {
        raf = requestAnimationFrame(draw);
      }
    }

    const onMouseMove = (e) => {
      createParticle(e);
      if (particles.length === 1) draw();
    };
    el.addEventListener('mousemove', onMouseMove);

    const resize = () => {
      canvas.width = el.offsetWidth;
      canvas.height = el.offsetHeight;
    };
    window.addEventListener('resize', resize);

    return () => {
      el.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', resize);
      if (raf) cancelAnimationFrame(raf);
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    };
  }, []);

  return <div ref={containerRef} style={{ position: 'relative', display: 'inline-block' }}>{children}</div>;
}

