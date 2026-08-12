import { motion } from "motion/react";
import { Zap, Workflow, FlaskConical, Boxes } from "lucide-react";
import { Card } from "@/components/Card";

const reveal = {
  hidden: { opacity: 0, y: 5 },
  visible: { opacity: 1, y: 0 },
};

const VALUES = [
  {
    icon: Zap,
    title: "Rest. Test. Repeat.",
    description:
      "A fast, focused workflow for calling and validating REST endpoints without leaving your editor.",
  },
  {
    icon: Workflow,
    title: "MuleSoft compatible",
    description:
      "Native MuleSoft compatibility means your integration tooling just works, right out of the box.",
  },
  {
    icon: FlaskConical,
    title: "Built-in tooling",
    description:
      "GraphQL, streaming and server-sent events are first-class citizens, ready when you are.",
  },
  {
    icon: Boxes,
    title: "Extensible",
    description:
      "A plugin system that grows with your team — add the connectors and flows you actually need.",
  },
];

export default function About() {
  return (
    <main className="relative z-10 h-screen w-full overflow-y-scroll text-white">
      <section className="flex min-h-screen flex-col items-center justify-center gap-8 px-6">
        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="space-y-4 text-center"
        >
          <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-white/70 backdrop-blur">
            About
          </span>
          <h1 className="text-6xl font-bold tracking-tight sm:text-8xl">
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              Hyper
            </span>
            <span className="text-white">somnia</span>
          </h1>
          <p className="mx-auto max-w-xl text-base text-white/60">
            A modern API toolchain built for speed. Rest. Test. Repeat. — with
            built-in MuleSoft compatibility from day one.
          </p>
        </motion.div>

        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {VALUES.map(({ icon: Icon, title, description }) => (
            <Card key={title} variant="ink-dark" square={false}>
              <div className="flex h-full flex-col justify-between gap-3">
                <div className="flex size-9 items-center justify-center rounded-lg bg-slate-800/70 text-white/80">
                  <Icon className="size-4" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-white/90">{title}</h3>
                  <p className="text-xs leading-relaxed text-white/60">{description}</p>
                </div>
              </div>
            </Card>
          ))}
        </motion.div>
      </section>
    </main>
  );
}
