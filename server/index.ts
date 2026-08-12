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

const STAR_CACHE = new Map<string, { stars: number; at: number }>();
const STAR_CACHE_TTL = 60 * 60 * 1000;

const normalizeRepo = (raw: string) =>
  raw
    .replace(/^git\+/, "")
    .replace(/\.git$/, "")
    .replace(/^ssh:\/\/git@github\.com\//, "https://github.com/")
    .replace(/^git@github\.com:/, "https://github.com/")
    .replace(/^github:/, "https://github.com/");

const repoOwnerRepo = (raw: string): string => {
  const m = raw.match(/github\.com\/([^/\s]+)\/([^/\s#?]+)/);
  return m ? `${m[1]}/${m[2]}` : "";
};

const extractImage = (description: string): string => {
  const img = description.match(/<img\s[^>]*src=["']([^"']+)["']/i);
  if (img) return img[1];
  const md = description.match(/!\[[^\]]*\]\((https?:\/\/[^)\s]+)\)/);
  return md ? md[1] : "";
};

const fetchStars = async (repo: string): Promise<number> => {
  const cached = STAR_CACHE.get(repo);
  if (cached && Date.now() - cached.at < STAR_CACHE_TTL) return cached.stars;
  try {
    const res = await github(`repos/${repo}`);
    if (res.ok) {
      const data = (await res.json()) as { stargazers_count?: number };
      const stars = data.stargazers_count ?? 0;
      STAR_CACHE.set(repo, { stars, at: Date.now() });
      return stars;
    }
  } catch {}
  STAR_CACHE.set(repo, { stars: 0, at: Date.now() });
  return 0;
};

type PluginEntry = {
  name: string;
  version: string;
  description: string;
  image: string;
  keywords: string[];
  repository: string;
  date: string;
  stars: number;
};

const PLUGINS_CACHE_TTL_MS = (() => {
  const raw = process.env.PLUGINS_CACHE_TTL_MINUTES;
  if (raw && /^\d+$/.test(raw)) return Number(raw) * 60 * 1000;
  return (process.env.NODE_ENV === "development" ? 15 : 24 * 60) * 60 * 1000;
})();

let pluginsCache: PluginEntry[] | null = null;
let pluginsCacheAt = 0;

async function getPlugins(): Promise<PluginEntry[]> {
  if (pluginsCache && Date.now() - pluginsCacheAt < PLUGINS_CACHE_TTL_MS) {
    return pluginsCache;
  }
  const res = await fetch(
    "https://registry.npmjs.org/-/v1/search?text=keywords:insomnia-plugin&size=250",
    { headers: { Accept: "application/vnd.npm.install-v1+json" } },
  );
  if (!res.ok) {
    throw new Error(`npm registry returned ${res.status}`);
  }
  const body = (await res.json()) as {
    objects: Array<{
      package: {
        name: string;
        version: string;
        description: string;
        keywords?: string[];
        date: string;
        links?: { repository?: string };
      };
    }>;
  };

  const plugins = body.objects
    .map(({ package: pkg }) => ({
      name: pkg.name,
      version: pkg.version,
      description: pkg.description ?? "",
      image: extractImage(pkg.description ?? ""),
      keywords: pkg.keywords ?? [],
      repository: normalizeRepo(pkg.links?.repository ?? ""),
      date: pkg.date,
    }))
    .filter(
      (p) =>
        p.keywords.some((k) => k.toLowerCase().includes("insomnia")) &&
        p.keywords.some((k) => k.toLowerCase().includes("plugin")),
    );

  const repos = [
    ...new Set(plugins.map((p) => repoOwnerRepo(p.repository)).filter(Boolean)),
  ];
  const stars = new Map<string, number>();
  const concurrency = 8;
  for (let i = 0; i < repos.length; i += concurrency) {
    const chunk = repos.slice(i, i + concurrency);
    const results = await Promise.all(
      chunk.map(async (repo) => [repo, await fetchStars(repo)] as const),
    );
    for (const [repo, count] of results) stars.set(repo, count);
  }

  const withStars = plugins
    .map((p) => ({ ...p, stars: stars.get(repoOwnerRepo(p.repository)) ?? 0 }))
    .sort((a, b) => b.stars - a.stars);

  pluginsCache = withStars;
  pluginsCacheAt = Date.now();
  return pluginsCache;
}

app.get("/api/plugins", async (c) => {
  const page = Math.max(1, Math.floor(Number(c.req.query("page") ?? 1)) || 1);
  const size = Math.min(
    100,
    Math.max(1, Math.floor(Number(c.req.query("size") ?? 18)) || 18),
  );
  let plugins: PluginEntry[];
  try {
    plugins = await getPlugins();
  } catch {
    return c.json({ error: `npm registry returned an error` }, 502);
  }
  const total = plugins.length;
  const totalPages = Math.max(1, Math.ceil(total / size));
  const start = (page - 1) * size;
  return c.json({
    total,
    page,
    size,
    totalPages,
    plugins: plugins.slice(start, start + size),
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

const DEV = process.env.NODE_ENV === "development";
const VITE_ORIGIN = process.env.VITE_ORIGIN ?? "http://localhost:5173";

if (DEV) {
  app.use("*", async (c) => {
    const reqUrl = new URL(c.req.url);
    const target = new URL(reqUrl.pathname + reqUrl.search, VITE_ORIGIN);
    const requestHeaders = new Headers(c.req.header());
    for (const name of [
      "host",
      "connection",
      "keep-alive",
      "transfer-encoding",
      "content-length",
      "upgrade",
    ]) {
      requestHeaders.delete(name);
    }
    try {
      const res = await fetch(target, {
        method: c.req.method,
        headers: requestHeaders,
        body: ["GET", "HEAD"].includes(c.req.method) ? undefined : c.req.raw.body,
      });
      return new Response(res.body, { status: res.status, headers: res.headers });
    } catch {
      return c.text(
        `Vite dev server not reachable at ${VITE_ORIGIN}. Run \`bun run start:dev\`.`,
        502,
      );
    }
  });
} else {
  app.use("*", serveStatic({ root: DIST_DIR }));
  app.use("*", async (c) => {
    try {
      const index = await readFile(join(DIST_DIR, "index.html"), "utf-8");
      return c.html(index);
    } catch {
      return c.text("Built app not found. Run `bun run build` first.", 500);
    }
  });
}

const port = Number(process.env.PORT ?? 3000);

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`hyperweb server running at http://localhost:${info.port}`);
});
