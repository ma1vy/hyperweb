import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "motion/react";

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
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { amount: 1, once: true });

  useEffect(() => {
    if (!inView || words.length < 2) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % words.length),
      interval,
    );
    return () => clearInterval(id);
  }, [inView, words.length, interval]);

  return (
    <span
      ref={ref}
      className={`relative inline-block overflow-hidden align-bottom ${className ?? ""}`}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={index}
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="inline-block"
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
