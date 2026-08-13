import { useRef, useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "motion/react";
import {
  GitFork,
  FileCode2,
  ChevronDown,
  ArrowRight,
  X,
  Check,
  ShieldOff,
  UserX,
  TerminalSquare,
  MonitorX,
  CloudOff,
  Workflow,
} from "lucide-react";
import { Card, useCardColors } from "@/components/Card";

const reveal = {
  hidden: { opacity: 0, y: 5 },
  visible: { opacity: 1, y: 0 },
};

const SECTIONS = ["intro", "fork", "dataweave", "substitute"] as const;

function IconChip({ icon: Icon }: { icon: typeof GitFork }) {
  const colors = useCardColors();
  return (
    <div
      className={`flex size-10 items-center justify-center rounded-lg ${colors.iconClassName}`}
    >
      <Icon className="size-4" />
    </div>
  );
}

function StepBadge() {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-white/70 backdrop-blur">
      The story
    </span>
  );
}

export default function About() {
  const mainRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ container: mainRef });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActive(
      Math.min(SECTIONS.length - 1, Math.round(v * (SECTIONS.length - 1))),
    );
  });

  const jumpTo = (index: number) => {
    const sections = mainRef.current?.querySelectorAll("section");
    sections?.[index]?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main
      ref={mainRef}
      className="relative z-10 h-dvh w-full snap-y snap-mandatory overflow-y-scroll text-white"
    >
      {/* INTRO — Hypersomnia */}
      <section
        id="intro"
        className="flex h-dvh snap-start flex-col items-center justify-center gap-8 px-6 text-center"
      >
        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="space-y-4"
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
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          className="flex flex-wrap items-center justify-center gap-2"
        >
          {["100% local", "no accounts", "offline", "open source"].map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] text-white/70 backdrop-blur"
            >
              {tag}
            </span>
          ))}
        </motion.div>

        <motion.button
          type="button"
          onClick={() => jumpTo(1)}
          className="absolute bottom-[calc(1.5rem+env(safe-area-inset-bottom,0px))] left-1/2 flex -translate-x-1/2 cursor-pointer flex-col items-center gap-1"
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
        </motion.button>
      </section>

      {/* STEP 1 — Forked from Insomnia */}
      <section
        id="fork"
        className="flex h-dvh snap-start flex-col items-center justify-center gap-8 overflow-y-auto px-6 py-20"
      >
        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="space-y-3 text-center"
        >
          <StepBadge />
          <h1 className="text-5xl font-bold tracking-tight sm:text-7xl">
            <span className="text-white">Forked from </span>
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              Insomnia
            </span>
          </h1>
          <p className="mx-auto max-w-xl text-base text-white/60">
            A local-first response to the API client that started sending your
            data somewhere else.
          </p>
        </motion.div>

        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          className="grid w-full max-w-5xl gap-4 sm:grid-cols-3"
        >
          <Card variant="ink-dark" square={false}>
            <div className="flex h-full flex-col justify-between gap-4">
              <IconChip icon={UserX} />
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-white/90">
                  0 forced accounts
                </h3>
                <p className="text-xs leading-relaxed text-white/60">
                  No sign-in wall to unlock the tool you already installed.
                </p>
              </div>
            </div>
          </Card>
          <Card variant="ink-dark" square={false}>
            <div className="flex h-full flex-col justify-between gap-4">
              <IconChip icon={CloudOff} />
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-white/90">
                  0 cloud sync
                </h3>
                <p className="text-xs leading-relaxed text-white/60">
                  Requests and projects stay on your machine. Always.
                </p>
              </div>
            </div>
          </Card>
          <Card variant="ink-dark" square={false}>
            <div className="flex h-full flex-col justify-between gap-4">
              <IconChip icon={ShieldOff} />
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-white/90">
                  0 tracking
                </h3>
                <p className="text-xs leading-relaxed text-white/60">
                  No telemetry, no analytics, nothing phoning home.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </section>

      {/* STEP 2 — DataWeave, run natively */}
      <section
        id="dataweave"
        className="flex h-dvh snap-start flex-col items-center justify-center gap-10 overflow-y-auto px-6 py-20"
      >
        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="space-y-3 text-center"
        >
          <h1 className="text-5xl font-bold tracking-tight sm:text-7xl">
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              DataWeave
            </span>
            <span className="text-white">, run natively</span>
          </h1>
          <p className="mx-auto max-w-xl text-base text-white/60">
            MuleSoft's data language transpiled to JavaScript — no Java
            toolchain required.
          </p>
        </motion.div>

        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          className="grid w-full max-w-5xl gap-4 lg:grid-cols-[1fr_auto_1fr] lg:items-center"
        >
          <Card variant="ink-dark" square={false} className="font-mono">
            <div className="flex h-full flex-col gap-3">
              <div className="flex items-center gap-2">
                <TerminalSquare className="size-4 text-cyan-300" />
                <p className="text-[10px] font-medium uppercase tracking-widest text-white/50">
                  DataWeave 2.x
                </p>
              </div>
              <pre className="overflow-x-auto rounded-lg bg-slate-950/70 p-4 text-xs leading-relaxed text-cyan-200">
{`%dw 2.0
output application/json
---
payload.users map ((u) -> {
  name: u.name as String,
  age: u.age as Number
})`}
              </pre>
            </div>
          </Card>

          <motion.div
            animate={{ x: [0, 4, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="hidden flex-col items-center gap-2 text-white/40 lg:flex"
          >
            <ArrowRight className="size-6 rotate-90" />
            <span className="text-[10px] font-medium uppercase tracking-widest">
              transpile
            </span>
            <ArrowRight className="size-6 -rotate-90" />
          </motion.div>

          <Card variant="ink-dark" square={false} className="font-mono">
            <div className="flex h-full flex-col gap-3">
              <div className="flex items-center gap-2">
                <FileCode2 className="size-4 text-indigo-300" />
                <p className="text-[10px] font-medium uppercase tracking-widest text-white/50">
                  JavaScript
                </p>
              </div>
              <pre className="overflow-x-auto rounded-lg bg-slate-950/70 p-4 text-xs leading-relaxed text-emerald-300">
{`payload.users.map((u) => ({
  name: DW.asString(u.name),
  age: DW.asNumber(u.age)
}))`}
              </pre>
            </div>
          </Card>
        </motion.div>

        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.35, ease: "easeOut" }}
          className="flex flex-wrap items-center justify-center gap-2"
        >
          {["~85 stdlib functions", "decimal-safe math", "full as-type coercion", "null propagation"].map(
            (tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] text-white/70 backdrop-blur"
              >
                {tag}
              </span>
            ),
          )}
        </motion.div>
      </section>

      {/* STEP 3 — A modern Anypoint substitute */}
      <section
        id="substitute"
        className="flex h-dvh snap-start flex-col items-center justify-center gap-10 overflow-y-auto px-6 py-20"
      >
        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="space-y-3 text-center"
        >
          <h1 className="text-5xl font-bold tracking-tight sm:text-7xl">
            <span className="text-white mr-3">A modern</span>
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              Anypoint
            </span>
            <span className="text-white"> substitute</span>
          </h1>
          <p className="mx-auto max-w-xl text-base text-white/60">
            The classic integration IDE, rebuilt as a fast REST client with
            Mule-compatible flows embedded.
          </p>
        </motion.div>

        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          className="grid w-full max-w-5xl gap-4 md:grid-cols-2"
        >
          <Card variant="ink-dark" square={false}>
            <div className="flex h-full flex-col gap-4">
              <div className="flex items-center gap-2">
                <IconChip icon={MonitorX} />
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-widest text-white/50">
                    The old way
                  </p>
                  <h3 className="text-sm font-semibold text-white/90">
                    Anypoint Studio
                  </h3>
                </div>
              </div>
              <ul className="space-y-2">
                {[
                  { label: "Heavy Eclipse-based IDE", icon: X },
                  { label: "Java runtime + Maven setup", icon: X },
                  { label: "Cloud dependencies to sync", icon: X },
                  { label: "REST testing bolted on the side", icon: X },
                ].map(({ label, icon: Icon }) => (
                  <li
                    key={label}
                    className="flex items-center gap-2 text-xs text-white/60"
                  >
                    <Icon className="size-3.5 text-rose-400" />
                    {label}
                  </li>
                ))}
              </ul>
            </div>
          </Card>

          <Card variant="ink-dark" square={false}>
            <div className="flex h-full flex-col gap-4">
              <div className="flex items-center gap-2">
                <IconChip icon={Workflow} />
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-widest text-white/50">
                    The new way
                  </p>
                  <h3 className="text-sm font-semibold text-white">
                    Hypersomnia
                  </h3>
                </div>
              </div>
              <ul className="space-y-2">
                {[
                  { label: "Fast, focused REST client", icon: Check },
                  { label: "Local engine, zero runtime installs", icon: Check },
                  { label: "100% offline, works in the dark", icon: Check },
                  { label: "Mule-compatible flows built in", icon: Check },
                ].map(({ label, icon: Icon }) => (
                  <li
                    key={label}
                    className="flex items-center gap-2 text-xs text-white/85"
                  >
                    <Icon className="size-3.5 text-emerald-400" />
                    {label}
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </motion.div>

        <motion.a
          href="/plugins"
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.35, ease: "easeOut" }}
          className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-medium text-white/90 backdrop-blur transition-colors hover:bg-white/10 hover:text-white"
        >
          See what ships inside
          <ArrowRight className="size-4" />
        </motion.a>
      </section>

      {/* Snap rail */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="fixed right-5 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-center gap-3 md:flex"
      >
        {SECTIONS.map((section, i) => (
          <button
            key={section}
            type="button"
            aria-label={`Go to ${section}`}
            onClick={() => jumpTo(i)}
            className="group relative flex size-4 items-center justify-center"
          >
            <motion.span
              animate={{
                scale: active === i ? 1 : 0.55,
                opacity: active === i ? 1 : 0.35,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className={`size-2 rounded-full ${
                active === i
                  ? "bg-gradient-to-r from-indigo-400 to-fuchsia-400"
                  : "bg-white"
              }`}
            />
            <span className="pointer-events-none absolute right-6 hidden whitespace-nowrap rounded-full border border-white/10 bg-slate-950/80 px-2.5 py-1 text-[10px] font-medium uppercase tracking-widest text-white/70 opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
              {i === 0 ? "about" : `step ${i}`}
            </span>
          </button>
        ))}
      </motion.div>
    </main>
  );
}
