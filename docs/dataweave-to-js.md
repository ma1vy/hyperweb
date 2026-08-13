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

## Benchmark

Methodology: same Mule XML app (`sample-local-api`, 3 endpoints — a mapped
list transform, a groupBy/orderBy import transform, and a choice/logger
summary) deployed to Mule 4.6 EE standalone and to dataweave-to-js. Both on
one Windows machine, port 8081, run sequentially. Warmup then p50/p95/p99
latency + sustained req/s at concurrency 50, plus cold start (process launch →
first HTTP 200).

| Metric | dataweave-to-js | Mule 4.6 EE |
|---|---|---|
| Cold start | 1017 ms | 14305 ms |
| Latency p50 | 10.1 ms | 2.0 ms |
| Latency p95 | 13.0 ms | 3.6 ms |
| Latency p99 | 16.0 ms | 5.4 ms |
| Throughput | ~17.1k req/s | ~69.8k req/s |

Latency/throughput are aggregated over the 3 endpoints. Single machine, not a
certified benchmark — treat as directional. Every request in every run returned
HTTP 200 on both runtimes.

## Comparison with Mule

| Aspect | dataweave-to-js | Mule 4.6 EE |
|---|---|---|
| Runtime | Node.js/Bun event loop | JVM (thread pools) |
| Cold start | ~1 s | ~14 s (JVM + Spring + connector bootstrap) |
| Request latency | higher per-request cost (flow recompiled per request) | lower (flows precompiled, thread pool) |
| Throughput | ~17k req/s measured | ~70k req/s measured |
| Startup model | compile once at load, in-memory closures | app packaged as jar, deployed to runtime |
| Footprint | single JS file, zero deps | full runtime distribution |
| Coverage | DataWeave + core Mule components | all connectors |
| Best for | local dev, MuleKnight/insomnium, testing, CI | production integration workloads |

**Why the latency/throughput gap?** dataweave-to-js compiles each flow to
JavaScript via `new Function` at request time (a deliberate design for
inspectable, debuggable output and `--watch` reloads), and each request runs a
dry-run check plus the real flow. Mule precompiles flows at deployment and
serves them from a pooled JVM. Cold start flips the picture: dataweave-to-js
serves its first request in about a second, Mule takes roughly 14 seconds of
JVM + Spring + connector bootstrap.
