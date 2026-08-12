import { motion } from "motion/react";
import { ShieldCheck, Server, Database, Cloud, Search, Radio } from "lucide-react";
import { Card } from "@/components/Card";

const reveal = {
  hidden: { opacity: 0, y: 5 },
  visible: { opacity: 1, y: 0 },
};

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "REST clients",
    description: "Tokenize cards, run real-time authorization flows and issue virtual cards.",
  },
  {
    icon: Server,
    title: "MuleSoft tooling",
    description: "Native MuleSoft compatibility for recurring billing and payout orchestration.",
  },
  {
    icon: Database,
    title: "GraphQL Studio",
    description: "Inspect schemas and run GraphQL queries against your endpoints.",
  },
  {
    icon: Radio,
    title: "SSE Monitor",
    description: "Stream and debug Server-Sent Events live as they arrive.",
  },
  {
    icon: Cloud,
    title: "REST & streaming",
    description: "Drop-in REST clients with first-class streaming support out of the box.",
  },
  {
    icon: Search,
    title: "Schema inspection",
    description: "Explore schemas and monitor payloads to debug faster.",
  },
];

export default function Features() {
  return (
    <main className="relative z-10 h-screen w-full overflow-y-scroll text-white">
      <section className="mx-auto flex min-h-screen flex-col items-center justify-center gap-8 px-6">
        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="space-y-3 text-center"
        >
          <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-white/70 backdrop-blur">
            Features
          </span>
          <h1 className="text-6xl font-bold tracking-tight sm:text-8xl">
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              Fea
            </span>
            <span className="text-white">tures</span>
          </h1>
          <p className="mx-auto max-w-xl text-base text-white/60">
            Everything you need to call, inspect and debug your APIs — without
            leaving the flow.
          </p>
        </motion.div>

        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <Card key={title} variant="ink-dark" square={false}>
              <div className="flex h-full flex-col justify-between gap-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="flex size-9 items-center justify-center rounded-lg bg-slate-800/70 text-white/80">
                      <Icon className="size-4" />
                    </div>
                    <h3 className="text-sm font-semibold text-white/90">{title}</h3>
                  </div>
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
