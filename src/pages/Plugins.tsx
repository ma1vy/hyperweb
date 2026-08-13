import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Card } from "@/components/Card";

const reveal = {
  hidden: { opacity: 0, y: 5 },
  visible: { opacity: 1, y: 0 },
};

const GALLERY = [
  {
    name: "Mastercard API",
    description: "Tokenize cards and run real-time authorization flows.",
    version: "v2.4",
  },
  {
    name: "Pamcard API",
    description: "Issue virtual cards and fetch transaction history.",
    version: "v1.8",
  },
  {
    name: "PayCore API",
    description: "Recurring billing and payout orchestration.",
    version: "v3.1",
  },
  {
    name: "MuleKit",
    description: "Native MuleSoft compatibility out of the box.",
    version: "v1.0",
  },
  {
    name: "GraphQL Studio",
    description: "Inspect schemas and run GraphQL queries.",
    version: "v2.0",
  },
  {
    name: "SSE Monitor",
    description: "Stream and debug Server-Sent Events live.",
    version: "v1.3",
  },
];

export default function Plugins() {
  const mainRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll({ container: mainRef });
  const [atTop, setAtTop] = useState(true);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setAtTop(latest < 40);
  });

  return (
    <main
      ref={mainRef}
      className="relative z-10 h-screen w-full overflow-y-scroll snap-y snap-mandatory text-white"
    >
      <section className="flex h-screen snap-start flex-col items-center justify-center px-6 text-center">
        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <h1 className="text-6xl font-bold tracking-tight sm:text-8xl">
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              Plug
            </span>
            <span className="text-white">ins</span>
          </h1>
        </motion.div>
      </section>

      <section className="mx-auto flex min-h-screen snap-start flex-col items-center justify-center gap-8 px-6">
        <div className="space-y-3 text-center">
          <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-white/70 backdrop-blur">
            Gallery
          </span>
          <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
            Sample Plugins
          </h2>
          <p className="mx-auto max-w-xl text-base text-white/60">
            A preview of what ships out of the box — REST clients, MuleSoft
            tooling, GraphQL and streaming support.
          </p>
        </div>

        <div className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {GALLERY.map((plugin) => (
            <Card
              key={plugin.name}
              variant="ink-dark"
              square={false}
            >
              <div className="flex h-full flex-col justify-between gap-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold text-white/90">
                      {plugin.name}
                    </h3>
                    <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-white/50">
                      {plugin.version}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed text-white/60">
                    {plugin.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <motion.div
        animate={{ opacity: atTop ? 0.6 : 0 }}
        transition={{ duration: 0.3 }}
        className="pointer-events-none fixed bottom-6 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-1"
      >
        <span className="text-[10px] font-medium uppercase tracking-widest text-white/60">
          scroll down
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="size-5" />
        </motion.div>
      </motion.div>
    </main>
  );
}
