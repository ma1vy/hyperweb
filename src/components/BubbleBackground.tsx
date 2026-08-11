import { useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  type SpringOptions,
} from "framer-motion";

export type BubbleColors = {
  first: string;
  second: string;
  third: string;
  fourth: string;
  fifth: string;
  sixth: string;
};

type Bubble = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
};

export const DEFAULT_COLORS: BubbleColors = {
  first: "18,113,255",
  second: "221,74,255",
  third: "0,220,255",
  fourth: "200,50,50",
  fifth: "180,180,50",
  sixth: "140,100,255",
};

const LINK_DISTANCE = 200;
const MAX_SPEED = 1.2;
const INTERACT_RADIUS = 160;

type BubbleBackgroundProps = {
  interactive?: boolean;
  transition?: SpringOptions;
  colors?: BubbleColors;
} & React.ComponentProps<"div">;

export default function BubbleBackground({
  interactive = false,
  transition = { stiffness: 100, damping: 20 },
  colors = DEFAULT_COLORS,
  ...props
}: BubbleBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, transition);
  const springY = useSpring(mouseY, transition);

  const colorArrayRef = useRef<string[]>(Object.values(colors));
  colorArrayRef.current = Object.values(colors);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let animationId = 0;
    let bubbles: Bubble[] = [];

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const init = () => {
      const colors = colorArrayRef.current;
      const count = Math.max(20, Math.floor((width * height) / 24000));
      bubbles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        radius: 8 + Math.random() * 26,
        color: colors[Math.floor(Math.random() * colors.length)],
      }));
    };

    const drawBubble = (bubble: Bubble) => {
      const gradient = ctx.createRadialGradient(
        bubble.x,
        bubble.y,
        0,
        bubble.x,
        bubble.y,
        bubble.radius,
      );
      gradient.addColorStop(0, `rgba(${bubble.color}, 0.32)`);
      gradient.addColorStop(0.6, `rgba(${bubble.color}, 0.08)`);
      gradient.addColorStop(1, `rgba(${bubble.color}, 0)`);
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
      ctx.fill();
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      const mouse = interactive
        ? { x: springX.get(), y: springY.get() }
        : null;

      for (const bubble of bubbles) {
        bubble.x += bubble.vx;
        bubble.y += bubble.vy;

        if (bubble.x - bubble.radius < 0 || bubble.x + bubble.radius > width) {
          bubble.vx *= -1;
        }
        if (bubble.y - bubble.radius < 0 || bubble.y + bubble.radius > height) {
          bubble.vy *= -1;
        }

        if (mouse) {
          const dx = bubble.x - mouse.x;
          const dy = bubble.y - mouse.y;
          const dist = Math.hypot(dx, dy);
          if (dist < INTERACT_RADIUS && dist > 0) {
            const force = (INTERACT_RADIUS - dist) / INTERACT_RADIUS;
            bubble.vx += (dx / dist) * force * 0.35;
            bubble.vy += (dy / dist) * force * 0.35;
          }
          const speed = Math.hypot(bubble.vx, bubble.vy);
          if (speed > MAX_SPEED) {
            bubble.vx = (bubble.vx / speed) * MAX_SPEED;
            bubble.vy = (bubble.vy / speed) * MAX_SPEED;
          }
        }
      }

      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(255,255,255,0.18)";
      for (let i = 0; i < bubbles.length; i++) {
        for (let j = i + 1; j < bubbles.length; j++) {
          const a = bubbles[i];
          const b = bubbles[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < LINK_DISTANCE) {
            ctx.globalAlpha = (1 - dist / LINK_DISTANCE) * 0.35;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;

      for (const bubble of bubbles) {
        drawBubble(bubble);
      }

      animationId = requestAnimationFrame(draw);
    };

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX.set(event.clientX - rect.left);
      mouseY.set(event.clientY - rect.top);
    };

    resize();
    init();
    draw();

    const observer = new ResizeObserver(resize);
    observer.observe(container);

    if (interactive) {
      window.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      cancelAnimationFrame(animationId);
      observer.disconnect();
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [interactive, mouseX, mouseY, springX, springY]);

  return (
    <div ref={containerRef} className="relative h-full w-full" {...props}>
      <motion.canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 h-full w-full"
      />
    </div>
  );
}
