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
summary) deployed to Mule 4.6 EE standalone and to dataweave-to-js. Both on
one Windows machine, port 8081, run sequentially. Warmup then p50/p95/p99
latency + sustained req/s at concurrency 50, plus cold start (process launch →
first HTTP 200). dataweave-to-js was measured with the `--build` precompiled
artifact.

| Metric | dataweave-to-js (`--build`) | Mule 4.6 EE |
|---|---|---|
| Cold start | 1008 ms | 15349 ms |
| Latency p50 | 5.9 ms | 1.9 ms |
| Latency p95 | 7.6 ms | 3.4 ms |
| Latency p99 | 9.1 ms | 5.2 ms |
| Throughput | ~33.1k req/s | ~72.8k req/s |

Latency/throughput are aggregated over the 3 endpoints. Single machine, not a
certified benchmark — treat as directional. Every request in every run returned
HTTP 200 on all three runtimes (normal dwjs, built, Mule).

## Performance work

Three hot-path changes shipped alongside `--build`:

- **Cached script functions** — each `CompiledScript` compiles to a
  `Function` once; `evalCompiled` reuses it instead of calling `new Function`
  per request (~6× on realistic scripts).
- **Cached flow closures** — `createFlow` memoizes per app+flow, and the
  per-request dry-run check pass is now opt-in (`--check`) instead of running
  twice per request.
- **Bun.serve host** in the built artifact — native Bun HTTP instead of
  `node:http`, with memoized route resolution.

Together these roughly doubled the measured throughput of the pre-optimization
baseline (17.1k → 33.1k rps) and cut aggregate latency from 10.1ms to 5.9ms
p50, while keeping cold start near 1s.

## Comparison with Mule

| Aspect | dataweave-to-js | Mule 4.6 EE |
|---|---|---|
| Runtime | Node.js/Bun event loop | JVM (thread pools) |
| Cold start | ~1 s | ~15 s (JVM + Spring + connector bootstrap) |
| Request latency | ~6 ms p50 (built artifact) | ~2 ms p50 |
| Throughput | ~33k req/s measured | ~73k req/s measured |
| Startup model | compile once at load, in-memory closures | app packaged as jar, deployed to runtime |
| Footprint | single JS file, zero deps | full runtime distribution |
| Coverage | DataWeave + core Mule components | all connectors |
| Best for | local dev, MuleKnight/insomnium, testing, CI | production integration workloads |

**Why the remaining latency/throughput gap?** Mule precompiles flows at
deployment and serves them from a pooled JVM whose DataWeave engine evaluates
transforms faster than the JS runtime on the transform-heavy endpoint (the
20-item `map` with `now()`/date formatting is ~6× slower in the DW runtime
than Mule's engine). The pre-optimization gap — per-request `new Function`
recompilation plus a double check+real pass per request — is largely closed:
cold start still favors dataweave-to-js by ~15×, and the built artifact
roughly doubles the original throughput.
