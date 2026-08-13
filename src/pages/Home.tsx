import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Download, ExternalLink, ChevronDown } from "lucide-react";
import { useTheme } from "@/lib/theme";
import { HyperLogo } from "@/components/HyperLogo";
import RotatingText from "@/components/RotatingText";
import { BENCHMARK, deltaBadge } from "@/data/benchmark";

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

function formatMetric(value: number): string {
  if (value > 100000) {
    return `${(value / 1000).toLocaleString(undefined, {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    })}k`;
  }
  return String(value);
}

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
            <div className="relative flex flex-col items-center">
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
                <p className="pt-2 text-sm text-white/40">Version {release.tag}</p>
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

          <motion.div className="pointer-events-none absolute bottom-[calc(1.5rem+env(safe-area-inset-bottom,0px))] left-1/2 flex -translate-x-1/2 flex-col items-center gap-1">
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
              Comparison
            </span>
            <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
              MuleSoft vs{" "}
              <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                HyperMule
              </span>
            </h2>
            <p className="mx-auto max-w-xl text-base text-white/60">
              dataweave-to-js vs Mule 4.6 EE — same app, same Mule XML,
              single-machine measurements. Tests were run on Linux with Oha.
            </p>
          </div>
          <div className="w-full max-w-3xl rounded-2xl border border-white/10 bg-white/5 backdrop-blur">
            <table className="w-full text-left text-xs whitespace-nowrap sm:text-sm">
              <thead>
                <tr className="border-b border-white/10 text-white/50">
                  <th className="px-2 py-2.5 font-medium sm:px-4 sm:py-3">Metric</th>
                  <th className="px-2 py-2.5 font-medium text-white sm:px-4 sm:py-3">dataweave-to-js</th>
                  <th className="px-2 py-2.5 font-medium sm:px-4 sm:py-3">Mule 4.6 EE</th>
                </tr>
              </thead>
              <tbody className="text-white/80">
                {[
                  { label: "Cold start", dw: BENCHMARK.coldStartMs.dataweaveToJs, mule: BENCHMARK.coldStartMs.mule, unit: "ms" },
                  { label: "p50", dw: BENCHMARK.latencyMs.dataweaveToJs.p50, mule: BENCHMARK.latencyMs.mule.p50, unit: "ms" },
                  { label: "p95", dw: BENCHMARK.latencyMs.dataweaveToJs.p95, mule: BENCHMARK.latencyMs.mule.p95, unit: "ms" },
                  { label: "p99", dw: BENCHMARK.latencyMs.dataweaveToJs.p99, mule: BENCHMARK.latencyMs.mule.p99, unit: "ms" },
                  { label: "Throughput", dw: BENCHMARK.throughputRps.dataweaveToJs, mule: BENCHMARK.throughputRps.mule, unit: "req/s", higherIsBetter: true },
                  { label: "VRAM Usage", dw: BENCHMARK.peakMemoryMB.dataweaveToJs, mule: BENCHMARK.peakMemoryMB.mule, unit: "MB" },
                ].map((row) => {
                  const { pct, isGreen } = deltaBadge(row.dw, row.mule, row.higherIsBetter);
                  return (
                    <tr key={row.label} className="border-b border-white/5 last:border-0">
                      <td className="px-2 py-2.5 text-white/50 sm:px-4 sm:py-3">{row.label}</td>
                      <td className="px-2 py-2.5 font-semibold text-white sm:px-4 sm:py-3">
                        <span className="inline-flex items-baseline gap-1.5">
                          <span>
                            {formatMetric(row.dw)} {row.unit}
                          </span>
                          <span
                            className={`text-[10px] font-medium sm:text-xs ${
                              isGreen ? "text-emerald-400" : "text-rose-400"
                            }`}
                          >
                            +{pct.toFixed(1)}%
                          </span>
                        </span>
                      </td>
                      <td className="px-2 py-2.5 sm:px-4 sm:py-3">
                        {formatMetric(row.mule)} {row.unit}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
