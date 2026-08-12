import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useMotionValue,
} from "motion/react";

type RotatingWordProps = {
  words: string[];
  interval?: number;
  className?: string;
};

export function RotatingWord({
  words,
  interval = 5000,
  className,
}: RotatingWordProps) {
  const [index, setIndex] = useState(0);
  const [ready, setReady] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const wordRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { amount: 1, once: true });
  const width = useMotionValue(0);

  const measure = useCallback(() => {
    const el = wordRef.current;
    if (!el) return;
    width.set(el.getBoundingClientRect().width);
  }, [width]);

  useEffect(() => {
    let active = true;
    document.fonts?.ready
      .then(() => {
        if (!active) return;
        measure();
        setReady(true);
      })
      .catch(() => setReady(true));
    return () => {
      active = false;
    };
  }, [measure]);

  useLayoutEffect(() => {
    if (!ready) return;
    const onResize = () => measure();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [ready, measure]);

  useEffect(() => {
    if (!ready) return;
    const el = wordRef.current;
    if (!el) return;
    const target = el.getBoundingClientRect().width;
    const controls = animate(width, target, {
      duration: 0.45,
      ease: "easeInOut",
    });
    return () => controls.stop();
  }, [index, words, width, ready]);

  useEffect(() => {
    if (!inView || !ready || words.length < 2) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % words.length),
      interval,
    );
    return () => clearInterval(id);
  }, [inView, ready, words.length, interval]);

  return (
    <span
      ref={ref}
      className={`relative inline-block overflow-hidden align-bottom ${className ?? ""}`}
    >
      <motion.span
        style={ready ? { width } : undefined}
        className="inline-block overflow-hidden whitespace-nowrap align-bottom"
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            ref={wordRef}
            key={index}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="inline-block whitespace-nowrap"
          >
            {words[index]}
          </motion.span>
        </AnimatePresence>
      </motion.span>
    </span>
  );
}
