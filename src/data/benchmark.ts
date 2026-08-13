export const BENCHMARK = {
  coldStartMs: { dataweaveToJs: 1017, mule: 14305 },
  latencyMs: {
    dataweaveToJs: { p50: 10.1, p95: 13.0, p99: 16.0 },
    mule: { p50: 2.0, p95: 3.6, p99: 5.4 },
  },
  throughputRps: { dataweaveToJs: 17100, mule: 69800 },
  versions: { mule: "4.6.30", dataweaveToJs: "2.0.0" },
} as const;
