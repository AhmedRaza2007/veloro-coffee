import React, { useEffect, useRef } from 'react';

export default function HeroCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle / Coffee Bean definition
    const numBeans = 32;
    const numGlows = 18;
    const beans = [];
    const glows = [];

    let mouseX = width / 2;
    let mouseY = height / 2;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Initialize Beans
    for (let i = 0; i < numBeans; i++) {
      beans.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 14 + 10,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.02,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: -Math.random() * 0.5 - 0.2,
        opacity: Math.random() * 0.6 + 0.3,
        color: Math.random() > 0.4 ? '#3A2E26' : '#221913'
      });
    }

    // Initialize Gold Ambient Glow Orbs
    for (let i = 0; i < numGlows; i++) {
      glows.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 3 + 1,
        speedY: -Math.random() * 0.3 - 0.1,
        opacity: Math.random() * 0.8 + 0.2
      });
    }

    // Draw single coffee bean shape on canvas
    const drawCoffeeBean = (x, y, size, rotation, opacity, color) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.globalAlpha = opacity;

      // Bean outer ellipse
      ctx.beginPath();
      ctx.ellipse(0, 0, size, size * 0.65, 0, 0, Math.PI * 2);
      
      // Gradient fill for 3D look
      const grad = ctx.createRadialGradient(-size * 0.3, -size * 0.3, 2, 0, 0, size);
      grad.addColorStop(0, '#5C483A');
      grad.addColorStop(0.6, color);
      grad.addColorStop(1, '#0F0B09');
      ctx.fillStyle = grad;
      ctx.fill();

      // Gold subtle border highlight
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.25)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Center S-curve split groove
      ctx.beginPath();
      ctx.moveTo(-size * 0.7, 0);
      ctx.bezierCurveTo(-size * 0.2, size * 0.2, size * 0.2, -size * 0.2, size * 0.7, 0);
      ctx.strokeStyle = 'rgba(243, 229, 171, 0.4)';
      ctx.lineWidth = size * 0.12;
      ctx.stroke();

      ctx.restore();
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Render Floating Orbs (Gold Sparks)
      glows.forEach((g) => {
        g.y += g.speedY;
        if (g.y < -10) g.y = height + 10;

        ctx.beginPath();
        ctx.arc(g.x, g.y, g.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 175, 55, ${g.opacity})`;
        ctx.shadowBlur = 12;
        ctx.shadowColor = '#D4AF37';
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Render Beans
      beans.forEach((b) => {
        // Slight repulsion from mouse cursor
        const dx = mouseX - b.x;
        const dy = mouseY - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 180) {
          const angle = Math.atan2(dy, dx);
          b.x -= Math.cos(angle) * 0.8;
          b.y -= Math.sin(angle) * 0.8;
        }

        b.x += b.speedX;
        b.y += b.speedY;
        b.rotation += b.rotSpeed;

        if (b.y < -30) {
          b.y = height + 30;
          b.x = Math.random() * width;
        }
        if (b.x < -30) b.x = width + 30;
        if (b.x > width + 30) b.x = -30;

        drawCoffeeBean(b.x, b.y, b.size, b.rotation, b.opacity, b.color);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0 opacity-80"
    />
  );
}
