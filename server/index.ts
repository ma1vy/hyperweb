import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

const GITHUB_REPO = process.env.HYPERSONMIA_REPO ?? "ma1vy/hypersomnia";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN ?? "";

const app = new Hono();

const github = (path: string) =>
  fetch(`https://api.github.com/${path}`, {
    headers: {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "hyperweb",
      ...(GITHUB_TOKEN ? { Authorization: `Bearer ${GITHUB_TOKEN}` } : {}),
    },
  });

app.get("/api/hypersomnia/latest", async (c) => {
  const res = await github(`repos/${GITHUB_REPO}/releases/latest`);
  if (!res.ok) {
    return c.json({ error: `GitHub API returned ${res.status}` }, 502);
  }
  const release = (await res.json()) as {
    tag_name: string;
    name: string;
    published_at: string;
    assets: Array<{
      id: number;
      name: string;
      size: number;
      download_count: number;
    }>;
  };
  return c.json({
    tag: release.tag_name,
    name: release.name,
    published_at: release.published_at,
    assets: release.assets.map((asset) => ({
      id: asset.id,
      name: asset.name,
      size: asset.size,
      download_count: asset.download_count,
    })),
  });
});

app.get("/api/hypersomnia/download/:assetId", async (c) => {
  const assetId = c.req.param("assetId");
  const res = await fetch(
    `https://api.github.com/repos/${GITHUB_REPO}/releases/assets/${assetId}`,
    {
      headers: {
        Accept: "application/octet-stream",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "hyperweb",
        ...(GITHUB_TOKEN ? { Authorization: `Bearer ${GITHUB_TOKEN}` } : {}),
      },
    },
  );
  if (!res.ok) {
    return c.json({ error: `GitHub API returned ${res.status}` }, 502);
  }
  const contentType =
    res.headers.get("content-type") ?? "application/octet-stream";
  const disposition = res.headers.get("content-disposition");
  return new Response(res.body, {
    headers: {
      "Content-Type": contentType,
      ...(disposition ? { "Content-Disposition": disposition } : {}),
    },
  });
});

const DIST_DIR = join(process.cwd(), "dist");

app.use("*", serveStatic({ root: DIST_DIR }));
app.use("*", async (c) => {
  try {
    const index = await readFile(join(DIST_DIR, "index.html"), "utf-8");
    return c.html(index);
  } catch {
    return c.text("Built app not found. Run `bun run build` first.", 500);
  }
});

const port = Number(process.env.PORT ?? 3000);

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`hyperweb server running at http://localhost:${info.port}`);
});
