import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Download, ExternalLink } from "lucide-react";
import { useTheme } from "@/lib/theme";
import { HyperLogo } from "@/components/HyperLogo";
import { RotatingWord } from "@/components/RotatingWord";

type Release = {
  tag: string;
  assets: Array<{ id: number; name: string }>;
};

const reveal = {
  hidden: { opacity: 0, y: 5 },
  visible: { opacity: 1, y: 0 },
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
      .catch(() => {});
  }, []);

  const zipAsset = release?.assets.find((a) => a.name.toLowerCase().endsWith(".zip"));

  return (
    <main className="relative z-10 h-screen w-full overflow-hidden text-white">
      <div className="h-full">
        <section className="flex h-full flex-col items-center justify-center px-6 text-center">
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
              <RotatingWord words={["somnia", "Rest", "AI", "Mule"]} className="text-white" />
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
        </section>
      </div>
    </main>
  );
}
