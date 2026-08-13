# dataweave-to-js

Transpiles MuleSoft XML applications and DataWeave 2.x scripts into executable
JavaScript, hosted as an HTTP server. Zero runtime dependencies. Runs under
Bun and Node.js.

## What it covers

- **Language** — full DataWeave 2.x surface: Pratt parser with correct operator
  precedence, literals (numbers, strings with `${}` interpolation, dates,
  periods, regex), `as` coercion matrix, selectors (`.name`, `..descendant`,
  `.*multi`, `[index]`, `[a to b]`), lambdas, `if/else`, `match/case`,
  `do {}`, `using`, `default`, ~40 infix stdlib functions.
- **Stdlib** — ~85 functions: `map`, `filter`, `reduce`, `groupBy`, `orderBy`,
  `distinctBy`, `pluck`, `flatMap`, `joinBy`, `splitBy`, `daysBetween`,
  `matches`, `contains`, `startsWith`, `endsWith`, `zip`, `unzip`, plus Core,
  Strings, encoding/URL, crypto (MD5/SHA1/SHA256), math.
- **Mule XML** — `<flow>`, `<sub-flow>`, `<choice>`, `<scatter-gather>`,
  `<foreach>`, `<try>`/`<error-handler>`, `<flow-ref>`, `<logger>`,
  `<set-payload>`, `<set-variable>`, `<transform>`/`<ee:transform>`,
  `<http:listener>`, `<http:request>`, `<api:router>`, `${}` config properties.
- **Runtime** — decimal-safe arithmetic (`0.1 + 0.2 == 0.3`), DataWeave null
  propagation, deep structural equality, compiled once at load, HTTP server on
  `node:http` (runs under Bun and Node).

See the project's own `docs/dw2-coverage.md` and `docs/dw2-coverage-gaps.md`
for the full supported / unsupported lists. Connectors outside the table (DB,
VM, JMS, SFTP, S3, Salesforce, batch, EE parallel constructs) throw
`MULE:UNSUPPORTED_COMPONENT`.

## `--build`: precompiled server

`dataweave-to-js --build --projects=<dir> -o server.js` emits a single
self-contained `server.js` that serves the app over `Bun.serve`. Every
DataWeave script becomes a top-level `new Function` created **once at module
load** (zero per-request compilation), flow closures are cached, and the
built-in dry-run check pass is skipped by default. Run it with:

```bash
bun server.js --port=8081
```

The normal `dist/dataweave-to.js --projects=...` path stays node-compatible;
the built artifact is Bun-optimized.

## Benchmark

Methodology: same Mule XML app (`sample-local-api`, 3 endpoints — a mapped
list transform, a groupBy/orderBy import transform, and a choice/logger
summary) deployed to Mule 4.6 EE and to dataweave-to-js. Same port 8081, warmup
then p50/p95/p99 latency + sustained req/s at concurrency 50, plus cold start
(process launch → first HTTP 200) and peak memory. dataweave-to-js was measured
with the `--build` precompiled artifact (multi-worker, 8 processes).

> Tests were run on Linux with Oha.

| Metric | dataweave-to-js (`--build`) | Mule 4.6 EE |
|---|---|---|
| Cold start | 694 ms | 16428 ms |
| Latency p50 | 0.6 ms | 0.7 ms |
| Latency p95 | 2.0 ms | 8.4 ms |
| Latency p99 | 4.1 ms | 18.1 ms |
| Throughput | ~205.8k req/s | ~86.1k req/s |
| Peak memory | 637 MB | 1557 MB |

Latency/throughput are aggregated over the 3 endpoints. Every request in every
run returned HTTP 200 on both runtimes.

## Performance work

Hot-path changes shipped alongside `--build`:

- **Cached script functions** — each `CompiledScript` compiles to a
  `Function` once; `evalCompiled` reuses it instead of calling `new Function`
  per request (~6× on realistic scripts).
- **Cached flow closures** — `createFlow` memoizes per app+flow, and the
  per-request dry-run check pass is now opt-in (`--check`) instead of running
  twice per request.
- **Bun.serve host** in the built artifact — native Bun HTTP instead of
  `node:http`, with memoized route resolution.
- **Memoized date formatting** — `formatDate` compiles its pattern to a token
  list once and caches it (15.7× on the hot path), plus fixes two formatting
  bugs (single-letter `d`/`M`/`H` tokens and the `a` AM/PM token matching
  inside day names).
- **Multi-worker parallelism** — the built artifact forks `--workers` processes
  (default CPU count) that share the port via `reusePort`, scaling across cores.
  Windows lacks OS-level reusePort distribution and falls back to single-worker;
  on Linux this is what crosses 200k rps.

Throughput went from a 17.1k rps single-process baseline to **205.8k rps**
with 8 workers — over 12× — while cutting p50 to 0.6 ms and keeping cold start
near 700 ms.

## Comparison with Mule

| Aspect | dataweave-to-js | Mule 4.6 EE |
|---|---|---|
| Runtime | Node.js/Bun event loop | JVM (thread pools) |
| Cold start | ~0.7 s | ~16 s (JVM + Spring + connector bootstrap) |
| Request latency | ~0.6 ms p50 (built artifact) | ~0.7 ms p50 |
| Throughput | ~206k req/s measured | ~86k req/s measured |
| Peak memory | ~637 MB | ~1557 MB |
| Startup model | compile once at load, in-memory closures | app packaged as jar, deployed to runtime |
| Footprint | single JS file, zero deps | full runtime distribution |
| Coverage | DataWeave + core Mule components | all connectors |
| Best for | local dev, MuleKnight/insomnium, testing, CI | production integration workloads |

**How does it beat Mule?** The combination of precompiled script functions,
cached flow closures, native `Bun.serve`, and multi-worker `reusePort`
parallelism lets dataweave-to-js scale across CPU cores with per-request
latency around 0.6 ms p50. Mule's JVM precompiles flows and uses a thread pool,
but the startup cost (Spring + connector bootstrap) and heavier memory footprint
leave it behind on cold start, latency tails, throughput, and memory. The
earlier per-request overheads — `new Function` recompilation and a double
check+real pass — were eliminated first, then parallelism unlocked the rest.
