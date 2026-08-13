import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Download, ExternalLink, ChevronDown } from "lucide-react";
import { useTheme } from "@/lib/theme";
import { HyperLogo } from "@/components/HyperLogo";
import RotatingText from "@/components/RotatingText";
import { Card } from "@/components/Card";
import { BENCHMARK } from "@/data/benchmark";

type Release = {
  tag: string;
  assets: Array<{ id: number; name: string }>;
};

const reveal = {
  hidden: { opacity: 0, y: 5 },
  visible: { opacity: 1, y: 0 },
};

const MOCK_RELEASE: Release = {
  tag: "v0.0.0",
  assets: [],
};

export default function Home() {
  const { dark } = useTheme();
  const [release, setRelease] = useState<Release | null>(null);

  useEffect(() => {
    fetch("/api/hypersomnia/latest")
      .then(async (res) => {
        if (!res.ok) throw new Error(`Request failed (${res.status})`);
        return res.json();
      })
      .then(setRelease)
      .catch(() => setRelease(MOCK_RELEASE));
  }, []);

  const zipAsset = release?.assets.find((a) => a.name.toLowerCase().endsWith(".zip"));

  return (
    <main className="relative z-10 h-dvh w-full snap-y snap-mandatory overflow-y-scroll text-white">
      <div className="h-full">
        <section className="flex h-dvh snap-start flex-col items-center justify-center px-6 text-center">
          <motion.div
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <h1 className="mx-auto flex w-full flex-col items-center justify-center gap-1 text-6xl font-bold tracking-tight sm:flex-row sm:gap-0 sm:text-8xl">
              <motion.span
                layout
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="inline-flex items-center"
              >
                <HyperLogo className="-mr-2 h-[1.4em] w-auto mb-4" />
                <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                  yper
                </span>
              </motion.span>
              <RotatingText
                texts={["DEV", "Rest", "AI", "Mule"]}
                mainClassName="px-2 sm:px-2 md:px-3 text-white overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg"
                staggerFrom="last"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "-120%" }}
                staggerDuration={0.025}
                splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
                transition={{ type: "spring", damping: 30, stiffness: 400 }}
                rotationInterval={2000}
                splitBy="characters"
                auto
                loop
              />
            </h1>
          </motion.div>

          <motion.div
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
            className="pt-6"
          >
            <p className="text-base font-semibold tracking-wide text-white sm:text-lg">
              Rest. Test. Repeat.
            </p>
            <p className="mt-3 text-sm tracking-wide text-white/40 sm:text-base">
              Built-in MuleSoft compatibility
            </p>
          </motion.div>

          <motion.div
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.6, ease: "easeOut" }}
            className="flex flex-wrap items-center justify-center gap-4 pt-10"
          >
            <div className="relative flex flex-col items-center gap-3">
              <a
                href={zipAsset ? `/api/hypersomnia/download/${zipAsset.id}` : "#"}
                aria-disabled={!zipAsset}
                className={`inline-flex items-center gap-3 rounded-2xl px-14 py-6 text-2xl font-semibold transition-colors ${
                  dark
                    ? "bg-white text-slate-950 hover:bg-white/90"
                    : "bg-slate-950 text-white hover:bg-slate-800"
                }`}
              >
                Download
                <Download className="size-6" />
              </a>
              {release?.tag && (
                <p className="absolute left-1/2 top-full -translate-x-1/2 pt-2 text-sm text-white/40">
                  Version {release.tag}
                </p>
              )}
            </div>
            <a
              href="https://github.com/ma1vy/hypersomnia/releases"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-3 rounded-2xl border border-white/20 bg-transparent px-14 py-6 text-2xl font-semibold text-white/90 backdrop-blur transition-colors hover:bg-white/10 hover:text-white"
            >
              All Releases
              <ExternalLink className="size-6" />
            </a>
          </motion.div>

          <motion.div
            className="pointer-events-none absolute bottom-[calc(1.5rem+env(safe-area-inset-bottom,0px))] left-1/2 flex -translate-x-1/2 flex-col items-center gap-1"
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
        </section>
        <section className="flex h-dvh snap-start" />
        <section className="flex h-dvh snap-start flex-col items-center justify-center gap-8 px-6">
          <div className="space-y-3 text-center">
            <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-white/70 backdrop-blur">
              dataweave-to-js
            </span>
            <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
              <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                Met
              </span>
              rics
            </h2>
            <p className="mx-auto max-w-xl text-base text-white/60">
              Measured locally against Mule 4.6 EE on the same machine, same
              Mule XML, port 8081.
            </p>
          </div>
          <div className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { label: "Cold start", value: `${BENCHMARK.coldStartMs.dataweaveToJs} ms`, note: `${BENCHMARK.coldStartMs.mule} ms on Mule 4.6 EE` },
              { label: "Latency p50", value: `${BENCHMARK.latencyMs.dataweaveToJs.p50} ms`, note: `vs ${BENCHMARK.latencyMs.mule.p50} ms on Mule` },
              { label: "Latency p95", value: `${BENCHMARK.latencyMs.dataweaveToJs.p95} ms`, note: `vs ${BENCHMARK.latencyMs.mule.p95} ms on Mule` },
              { label: "Latency p99", value: `${BENCHMARK.latencyMs.dataweaveToJs.p99} ms`, note: `vs ${BENCHMARK.latencyMs.mule.p99} ms on Mule` },
              { label: "Throughput", value: `${BENCHMARK.throughputRps.dataweaveToJs} req/s`, note: `vs ${BENCHMARK.throughputRps.mule} req/s on Mule` },
              { label: "Artifact", value: "1 file, 0 deps", note: "single-file JS, runs on Bun and Node" },
            ].map((m) => (
              <Card key={m.label} variant="ink-dark" square={false}>
                <div className="flex h-full flex-col justify-between gap-3">
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-white/90">{m.label}</h3>
                    <p className="text-2xl font-bold tracking-tight text-white">{m.value}</p>
                    <p className="text-xs leading-relaxed text-white/60">{m.note}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
        <section className="flex h-dvh snap-start flex-col items-center justify-center gap-8 px-6">
          <div className="space-y-3 text-center">
            <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-white/70 backdrop-blur">
              Comparison
            </span>
            <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
              <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                Mule
              </span>{" "}
              vs
            </h2>
            <p className="mx-auto max-w-xl text-base text-white/60">
              dataweave-to-js vs Mule 4.6 EE — same app, same machine,
              single-machine measurements (not a certified benchmark).
            </p>
          </div>
          <div className="w-full max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-white/50">
                  <th className="px-4 py-3 font-medium">Metric</th>
                  <th className="px-4 py-3 font-medium text-white">dataweave-to-js</th>
                  <th className="px-4 py-3 font-medium">Mule 4.6 EE</th>
                </tr>
              </thead>
              <tbody className="text-white/80">
                {[
                  ["Cold start", `${BENCHMARK.coldStartMs.dataweaveToJs} ms`, `${BENCHMARK.coldStartMs.mule} ms`],
                  ["Latency p50", `${BENCHMARK.latencyMs.dataweaveToJs.p50} ms`, `${BENCHMARK.latencyMs.mule.p50} ms`],
                  ["Latency p95", `${BENCHMARK.latencyMs.dataweaveToJs.p95} ms`, `${BENCHMARK.latencyMs.mule.p95} ms`],
                  ["Latency p99", `${BENCHMARK.latencyMs.dataweaveToJs.p99} ms`, `${BENCHMARK.latencyMs.mule.p99} ms`],
                  ["Throughput", `${BENCHMARK.throughputRps.dataweaveToJs} req/s`, `${BENCHMARK.throughputRps.mule} req/s`],
                ].map((row) => (
                  <tr key={row[0]} className="border-b border-white/5 last:border-0">
                    <td className="px-4 py-3 text-white/50">{row[0]}</td>
                    <td className="px-4 py-3 font-semibold text-white">{row[1]}</td>
                    <td className="px-4 py-3">{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
