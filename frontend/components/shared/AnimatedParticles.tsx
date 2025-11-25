'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  opacity: number;
}

export function AnimatedParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 设置画布尺寸
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // 粒子颜色配置（紫色、粉色、蓝色、黄色）
    const colors = [
      'rgba(139, 92, 246, 1)',  // 紫色
      'rgba(236, 72, 153, 1)',   // 粉色
      'rgba(59, 130, 246, 1)',   // 蓝色
      'rgba(234, 179, 8, 1)',    // 黄色
      'rgba(168, 85, 247, 1)',   // 紫罗兰
      'rgba(249, 115, 22, 1)',   // 橙色
    ];

    // 创建粒子 - 优化：减少粒子数量提升性能
    const particles: Particle[] = [];
    const particleCount = Math.min(Math.floor((canvas.width * canvas.height) / 15000), 40); // 从80减到40

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 3 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.5 + 0.3,
      });
    }

    // 动画循环 - 优化：添加FPS控制和性能监测
    let animationFrameId: number;
    let time = 0;
    let lastFrameTime = performance.now();
    let fps = 60;
    const targetFps = 60;
    const frameInterval = 1000 / targetFps;

    const animate = (currentTime: number) => {
      // FPS控制：限制渲染频率
      const deltaTime = currentTime - lastFrameTime;
      if (deltaTime < frameInterval) {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }
      lastFrameTime = currentTime - (deltaTime % frameInterval);

      // 更新FPS
      fps = 1000 / deltaTime;

      time += 0.01;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 绘制连接线（先绘制，这样粒子会在上层）
      // 优化：如果FPS过低，跳过连接线渲染
      if (fps > 30) {
        particles.forEach((p1, i) => {
          particles.slice(i + 1).forEach((p2) => {
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 120) { // 从150减到120，减少连接线数量
            // 计算连接强度（距离越近越亮）
            const strength = 1 - distance / 150;

            // 脉动效果
            const pulse = Math.sin(time * 2 + distance * 0.01) * 0.3 + 0.7;

            // 创建渐变色连接线
            const gradient = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
            const color1 = p1.color.replace('1)', `${strength * pulse * 0.6})`);
            const color2 = p2.color.replace('1)', `${strength * pulse * 0.6})`);
            gradient.addColorStop(0, color1);
            gradient.addColorStop(0.5, `rgba(255, 255, 255, ${strength * pulse * 0.4})`);
            gradient.addColorStop(1, color2);

              // 优化：减少阴影渲染，提升性能
              if (strength > 0.5) {
                ctx.shadowBlur = 4; // 从8减到4
                ctx.shadowColor = `rgba(255, 255, 255, ${strength * 0.3})`; // 降低强度
              }

              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = gradient;
              ctx.lineWidth = strength * 2;
              ctx.stroke();

              // 重置阴影
              ctx.shadowBlur = 0;
            }
          });
        });
      }

      // 更新和绘制粒子
      particles.forEach((particle) => {
        // 更新位置
        particle.x += particle.vx;
        particle.y += particle.vy;

        // 边界检测
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        // 绘制粒子发光效果 - 优化：减少阴影渲染
        if (fps > 40) {
          ctx.shadowBlur = 10; // 从15减到10
          ctx.shadowColor = particle.color;
        }

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color.replace('1)', `${particle.opacity})`);
        ctx.fill();

        // 重置阴影
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate(performance.now());

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ pointerEvents: 'none' }}
    />
  );
}