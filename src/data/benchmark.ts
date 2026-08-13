export const BENCHMARK = {
  coldStartMs: { dataweaveToJs: 1008, mule: 15349 },
  latencyMs: {
    dataweaveToJs: { p50: 5.9, p95: 7.6, p99: 9.1 },
    mule: { p50: 1.9, p95: 3.4, p99: 5.2 },
  },
  throughputRps: { dataweaveToJs: 33100, mule: 72800 },
  versions: { mule: "4.6.30", dataweaveToJs: "2.0.0" },
} as const;

export function deltaBadge(dataweave: number, mule: number, higherIsBetter = false) {
  const pct = (Math.abs(dataweave - mule) / mule) * 100;
  const isGreen = higherIsBetter ? dataweave > mule : dataweave < mule;
  return { pct, isGreen };
}
