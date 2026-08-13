import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Download, ExternalLink, ChevronDown } from "lucide-react";
import { useTheme } from "@/lib/theme";
import { HyperLogo } from "@/components/HyperLogo";
import RotatingText from "@/components/RotatingText";

type Release = {
  tag: string;
  assets: Array<{ id: number; name: string }>;
};

const reveal = {
  hidden: { opacity: 0, y: 5 },
  visible: { opacity: 1, y: 0 },
};

const MOCK_RELEASE: Release = {
  tag: "v0.0.0",
  assets: [],
};

export default function Home() {
  const { dark } = useTheme();
  const [release, setRelease] = useState<Release | null>(null);

  useEffect(() => {
    fetch("/api/hypersomnia/latest")
      .then(async (res) => {
        if (!res.ok) throw new Error(`Request failed (${res.status})`);
        return res.json();
      })
      .then(setRelease)
      .catch(() => setRelease(MOCK_RELEASE));
  }, []);

  const zipAsset = release?.assets.find((a) => a.name.toLowerCase().endsWith(".zip"));

  return (
    <main className="relative z-10 h-dvh w-full snap-y snap-mandatory overflow-y-scroll text-white">
      <div className="h-full">
        <section className="flex h-dvh snap-start flex-col items-center justify-center px-6 text-center">
          <motion.div
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <h1 className="mx-auto flex w-full flex-col items-center justify-center gap-1 text-6xl font-bold tracking-tight sm:flex-row sm:gap-0 sm:text-8xl">
              <motion.span
                layout
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="inline-flex items-center"
              >
                <HyperLogo className="-mr-2 h-[1.4em] w-auto mb-4" />
                <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                  yper
                </span>
              </motion.span>
              <RotatingText
                texts={["DEV", "Rest", "AI", "Mule"]}
                mainClassName="px-2 sm:px-2 md:px-3 text-white overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg"
                staggerFrom="last"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "-120%" }}
                staggerDuration={0.025}
                splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
                transition={{ type: "spring", damping: 30, stiffness: 400 }}
                rotationInterval={2000}
                splitBy="characters"
                auto
                loop
              />
            </h1>
          </motion.div>

          <motion.div
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
            className="pt-6"
          >
            <p className="text-base font-semibold tracking-wide text-white sm:text-lg">
              Rest. Test. Repeat.
            </p>
            <p className="mt-3 text-sm tracking-wide text-white/40 sm:text-base">
              Built-in MuleSoft compatibility
            </p>
          </motion.div>

          <motion.div
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.6, ease: "easeOut" }}
            className="flex flex-wrap items-center justify-center gap-4 pt-10"
          >
            <div className="relative flex flex-col items-center gap-3">
              <a
                href={zipAsset ? `/api/hypersomnia/download/${zipAsset.id}` : "#"}
                aria-disabled={!zipAsset}
                className={`inline-flex items-center gap-3 rounded-2xl px-14 py-6 text-2xl font-semibold transition-colors ${
                  dark
                    ? "bg-white text-slate-950 hover:bg-white/90"
                    : "bg-slate-950 text-white hover:bg-slate-800"
                }`}
              >
                Download
                <Download className="size-6" />
              </a>
              {release?.tag && (
                <p className="absolute left-1/2 top-full -translate-x-1/2 pt-2 text-sm text-white/40">
                  Version {release.tag}
                </p>
              )}
            </div>
            <a
              href="https://github.com/ma1vy/hypersomnia/releases"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-3 rounded-2xl border border-white/20 bg-transparent px-14 py-6 text-2xl font-semibold text-white/90 backdrop-blur transition-colors hover:bg-white/10 hover:text-white"
            >
              All Releases
              <ExternalLink className="size-6" />
            </a>
          </motion.div>

          <motion.div
            className="pointer-events-none absolute bottom-[calc(1.5rem+env(safe-area-inset-bottom,0px))] left-1/2 flex -translate-x-1/2 flex-col items-center gap-1"
          >
            <span className="text-[10px] font-medium uppercase tracking-widest text-white/60">
              scroll down
            </span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            >
              <ChevronDown className="size-5" />
            </motion.div>
          </motion.div>
        </section>
        <section className="flex h-dvh snap-start" />
      </div>
    </main>
  );
}
