# Home comparison table — delta badges on dataweave-to-js column

## Goal

In the home page comparison table (`src/pages/Home.tsx`, section "Comparison"),
render a small `+X%` badge to the right of each `dataweave-to-js` cell value.
The badge shows the absolute percentage difference between the two columns and
is colored green or red based on which engine is faster for that metric.

## Requirements

- No new table column — the badge is inline inside the existing
  `dataweave-to-js` cell, next to the value.
- Badge format: `+X%` with one decimal place (e.g. `+92.9%`). Always positive
  (absolute difference), always prefixed with `+`.
- Percentage computed as `|dataweave − mule| / mule × 100`.
- Color is direction-aware per metric:
  - Lower-is-better metrics (Cold start, Latency p50/p95/p99): dataweave value
    `<` mule value → green, otherwise red.
  - Higher-is-better metrics (Throughput): dataweave value `>` mule value →
    green, otherwise red.

## Data source

Values come from `src/data/benchmark.ts` (`BENCHMARK`), same numbers already
used by the table.

## Implementation

- Add a small pure helper (in `src/data/benchmark.ts`) that takes both values
  plus a `higherIsBetter` flag and returns `{ pct, isGreen }`.
- In `Home.tsx`, turn the table rows from arrays into objects that carry the
  metric metadata (label, dataweave value, mule value, higherIsBetter), and
  render the dataweave cell as value + inline `<span>` badge.
- Badge styling: small muted text with green (`emerald`) or red (`rose`) color
  to match the existing theme.

## Out of scope

- Changing the Mule column or adding a new column.
- Modifying metrics/card section (only the Comparison table).
- Benchmark data changes.
