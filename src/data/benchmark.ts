export const BENCHMARK = {
  coldStartMs: { dataweaveToJs: 1023, mule: 16428 },
  latencyMs: {
    dataweaveToJs: { p50: 3.8, p95: 5.6, p99: 6.8 },
    mule: { p50: 2.1, p95: 4.5, p99: 8.2 },
  },
  throughputRps: { dataweaveToJs: 37900, mule: 62100 },
  versions: { mule: "4.6.30", dataweaveToJs: "2.0.0" },
} as const;

export function deltaBadge(dataweave: number, mule: number, higherIsBetter = false) {
  const pct = (Math.abs(dataweave - mule) / mule) * 100;
  const isGreen = higherIsBetter ? dataweave > mule : dataweave < mule;
  return { pct, isGreen };
}
