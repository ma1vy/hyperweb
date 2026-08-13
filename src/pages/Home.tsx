import { BENCHMARK, deltaBadge } from "@/data/benchmark";

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
  return (
    <main className="relative z-10 h-dvh w-full snap-y snap-mandatory overflow-y-scroll text-white">
      <div className="h-full">
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
                  { label: "Cold start", dw: BENCHMARK.coldStartMs.dataweaveToJs, mule: BENCHMARK.coldStartMs.mule, unit: "ms" },
                  { label: "Latency p50", dw: BENCHMARK.latencyMs.dataweaveToJs.p50, mule: BENCHMARK.latencyMs.mule.p50, unit: "ms" },
                  { label: "Latency p95", dw: BENCHMARK.latencyMs.dataweaveToJs.p95, mule: BENCHMARK.latencyMs.mule.p95, unit: "ms" },
                  { label: "Latency p99", dw: BENCHMARK.latencyMs.dataweaveToJs.p99, mule: BENCHMARK.latencyMs.mule.p99, unit: "ms" },
                  { label: "Throughput", dw: BENCHMARK.throughputRps.dataweaveToJs, mule: BENCHMARK.throughputRps.mule, unit: "req/s", higherIsBetter: true },
                  { label: "Peak memory", dw: BENCHMARK.peakMemoryMB.dataweaveToJs, mule: BENCHMARK.peakMemoryMB.mule, unit: "MB" },
                ].map((row) => {
                  const { pct, isGreen } = deltaBadge(row.dw, row.mule, row.higherIsBetter);
                  return (
                    <tr key={row.label} className="border-b border-white/5 last:border-0">
                      <td className="px-4 py-3 text-white/50">{row.label}</td>
                      <td className="px-4 py-3 font-semibold text-white">
                        {formatMetric(row.dw)} {row.unit}
                        <span
                          className={`ml-2 text-xs font-medium ${
                            isGreen ? "text-emerald-400" : "text-rose-400"
                          }`}
                        >
                          +{pct.toFixed(1)}%
                        </span>
                      </td>
                      <td className="px-4 py-3">{formatMetric(row.mule)} {row.unit}</td>
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
