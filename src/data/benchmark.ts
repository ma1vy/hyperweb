export const BENCHMARK = {
  coldStartMs: { dataweaveToJs: 694, mule: 16428 },
  latencyMs: {
    dataweaveToJs: { p50: 0.6, p95: 2.0, p99: 4.1 },
    mule: { p50: 0.7, p95: 8.4, p99: 18.1 },
  },
  throughputRps: { dataweaveToJs: 205800, mule: 86100 },
  peakMemoryMB: { dataweaveToJs: 637, mule: 1557 },
  versions: { mule: "4.6.30", dataweaveToJs: "2.0.0" },
} as const;

export function deltaBadge(dataweave: number, mule: number, higherIsBetter = false) {
  const pct = (Math.abs(dataweave - mule) / mule) * 100;
  const isGreen = higherIsBetter ? dataweave > mule : dataweave < mule;
  return { pct, isGreen };
}
