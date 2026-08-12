import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "motion/react";
import {
  ChevronDown,
  ExternalLink,
  Package,
  PackagePlus,
  Star,
} from "lucide-react";
import { Card, useCardColors } from "@/components/Card";
import { useTheme } from "@/lib/theme";

type Plugin = {
  name: string;
  version: string;
  description: string;
  image: string;
  keywords: string[];
  repository: string;
  date: string;
  stars: number;
};

const reveal = {
  hidden: { opacity: 0, y: 5 },
  visible: { opacity: 1, y: 0 },
};

const formatStars = (stars: number) =>
  stars >= 1000 ? `${(stars / 1000).toFixed(1).replace(/\.0$/, "")}k` : String(stars);

function PluginCard({ plugin }: { plugin: Plugin }) {
  const colors = useCardColors();

  return (
    <div className="flex h-full flex-col justify-between gap-3">
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            {plugin.image ? (
              <img
                src={plugin.image}
                alt={plugin.name}
                loading="lazy"
                className="size-8 shrink-0 rounded-lg bg-white/10 object-cover p-1"
              />
            ) : (
              <div
                className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${colors.iconClassName}`}
              >
                <Package className="size-4" />
              </div>
            )}
            <h3
              className={`truncate font-mono text-xs font-semibold ${colors.nameColor}`}
              title={plugin.name}
            >
              {plugin.name}
            </h3>
          </div>
          <span
            className={`shrink-0 rounded border px-1.5 py-0.5 font-mono text-[10px] ${colors.versionColor}`}
          >
            {plugin.version}
          </span>
        </div>
        <hr className={`border-t ${colors.hrClassName}`} />
        <p
          className={`line-clamp-3 min-h-[3em] text-xs leading-relaxed ${colors.descriptionColor}`}
          title={plugin.description}
        >
          {plugin.description || "No description provided."}
        </p>
      </div>
      <div className="space-y-3">
        <a
          href={`hypersomnia://plugins/install?name=${plugin.name}`}
          className={`inline-flex w-full items-center justify-between gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-colors ${colors.installClassName}`}
        >
          Install
          <PackagePlus className="size-4" />
        </a>
        <div className="flex items-center justify-between gap-2">
          {plugin.repository ? (
            <a
              href={plugin.repository}
              target="_blank"
              rel="noreferrer"
              className={`inline-flex min-w-0 items-center gap-1.5 text-[11px] font-medium underline-offset-2 hover:underline ${colors.descriptionColor}`}
            >
              <span className="truncate">View source</span>
              <ExternalLink className="size-3 shrink-0" />
            </a>
          ) : (
            <span />
          )}
          {plugin.stars > 0 && (
            <span
              className={`inline-flex shrink-0 items-center gap-1 text-[11px] font-semibold ${colors.descriptionColor}`}
            >
              <Star className="size-3" />
              {formatStars(plugin.stars)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Plugins() {
  const { dark } = useTheme();
  const sectionRef = useRef<HTMLElement>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [plugins, setPlugins] = useState<Plugin[] | null>(null);
  const [page, setPage] = useState(
    () => Math.max(1, Number(searchParams.get("page")) || 1),
  );
  const [totalPages, setTotalPages] = useState(1);

  const setPageWithUrl = useCallback(
    (p: number) => {
      const next = new URLSearchParams(searchParams);
      next.set("page", String(p));
      setSearchParams(next, { replace: true });
      setPage(p);
    },
    [searchParams, setSearchParams],
  );

  useEffect(() => {
    setPlugins(null);
    sectionRef.current?.scrollTo({ top: 0 });
    fetch(`/api/plugins?page=${page}&size=18`)
      .then(async (res) => {
        if (!res.ok) throw new Error(`Request failed (${res.status})`);
        return res.json();
      })
      .then((body) => {
        setTotalPages(body.totalPages);
        if (page > body.totalPages) {
          setPageWithUrl(body.totalPages);
          return;
        }
        setPlugins(body.plugins);
      })
      .catch(() => setPlugins([]));
  }, [page, setPageWithUrl]);

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <main className="relative z-10 h-screen w-full snap-y snap-mandatory overflow-y-scroll text-white scroll-smooth">
      <section className="relative flex h-screen snap-start flex-col items-center justify-center px-6 text-center">
        <motion.div
          variants={reveal}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <h1 className="text-6xl font-bold tracking-tight sm:text-8xl">
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              Plug
            </span>
            <span className="text-white">ins</span>
          </h1>
        </motion.div>

        <a
          href="#plugins"
          aria-label="Scroll to plugins"
          className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/50 transition-colors hover:text-white"
        >
          <ChevronDown className="size-8 animate-bounce" />
        </a>
      </section>

      <section
        id="plugins"
        ref={sectionRef}
        className="h-screen snap-start overflow-y-auto"
      >
        <div className="mx-auto flex min-h-full w-full max-w-7xl flex-col items-center justify-center gap-8 px-6 py-16">
          <motion.div
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
              <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                Plug
              </span>
              <span className="text-white">ins</span>
            </h2>
          </motion.div>

          <motion.div
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {plugins === null ? (
              <div className="col-span-full flex flex-col items-center gap-3 py-16">
                <span className="size-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                <p className="text-sm text-white/40">Loading plugins…</p>
              </div>
            ) : plugins.length === 0 ? (
              <p className="col-span-full py-16 text-center text-sm text-white/40">
                No plugins found.
              </p>
            ) : (
              plugins.map((plugin) => (
                <Card
                  key={plugin.name}
                  variant={dark ? "ink-dark" : "glass-solid"}
                  square={false}
                >
                  <PluginCard plugin={plugin} />
                </Card>
              ))
            )}
          </motion.div>

          {plugins !== null && plugins.length > 0 && totalPages > 1 && (
            <nav
              aria-label="Pagination"
              className="sticky bottom-0 z-10 mt-8 flex flex-wrap items-center justify-center gap-2 rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 backdrop-blur"
            >
              <button
                type="button"
                disabled={page === 1}
                onClick={() => setPageWithUrl(Math.max(1, page - 1))}
                className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white disabled:pointer-events-none disabled:opacity-40"
              >
                Prev
              </button>
              {pages.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPageWithUrl(p)}
                  aria-current={p === page ? "page" : undefined}
                  className={`size-8 rounded-lg text-xs font-semibold transition-colors ${
                    p === page
                      ? "bg-white text-slate-950"
                      : "border border-white/15 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                type="button"
                disabled={page === totalPages}
                onClick={() => setPageWithUrl(Math.min(totalPages, page + 1))}
                className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white disabled:pointer-events-none disabled:opacity-40"
              >
                Next
              </button>
            </nav>
          )}
        </div>
      </section>
    </main>
  );
}
