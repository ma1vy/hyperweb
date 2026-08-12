import { spawn, type ChildProcess } from "node:child_process";

const bun = process.execPath;

const vite = spawn(bun, ["x", "vite"], { stdio: "inherit" });

const server = spawn(bun, ["--watch", "server/index.ts"], {
  stdio: "inherit",
  env: { ...process.env, NODE_ENV: "development" },
});

const children: ChildProcess[] = [vite, server];
let shuttingDown = false;

function shutdown(code: number): void {
  if (shuttingDown) return;
  shuttingDown = true;
  for (const child of children) child.kill();
  process.exit(code);
}

for (const child of children) {
  child.on("exit", (code) => shutdown(typeof code === "number" ? code : 0));
}

process.on("SIGINT", () => shutdown(130));
process.on("SIGTERM", () => shutdown(143));
