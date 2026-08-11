import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { serveStatic } from "@hono/node-server/serve-static";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

const app = new Hono();

const DIST_DIR = join(process.cwd(), "dist");

app.get("/plugins", async (c) => {
  try {
    const index = await readFile(join(DIST_DIR, "index.html"), "utf-8");
    return c.html(index);
  } catch {
    return c.text(
      "Built app not found. Run `bun run build` first.",
      500,
    );
  }
});

app.use("*", serveStatic({ root: DIST_DIR }));
app.use("*", async (c) => {
  try {
    const index = await readFile(join(DIST_DIR, "index.html"), "utf-8");
    return c.html(index);
  } catch {
    return c.text("Built app not found. Run `bun run build` first.", 500);
  }
});

const port = 3000;

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`hyperweb server running at http://localhost:${info.port}`);
});
