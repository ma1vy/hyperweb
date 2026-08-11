import BubbleBackground from "../components/BubbleBackground";

const SWATCHES = [
  { name: "first", value: "18,113,255" },
  { name: "second", value: "221,74,255" },
  { name: "third", value: "0,220,255" },
  { name: "fourth", value: "200,50,50" },
  { name: "fifth", value: "180,180,50" },
  { name: "sixth", value: "140,100,255" },
];

export default function Plugins() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0">
        <BubbleBackground interactive />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center gap-8 px-6 py-16 text-center">
        <header className="space-y-3">
          <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-white/70 backdrop-blur">
            Plugins
          </span>
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Bubble Background
          </h1>
          <p className="mx-auto max-w-xl text-base text-white/70 sm:text-lg">
            An interactive background featuring smoothly animated gradient
            bubbles — a playful, dynamic, and visually engaging backdrop.
          </p>
        </header>

        <div className="grid w-full gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 text-left backdrop-blur sm:grid-cols-2">
          <section className="space-y-2">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-white/50">
              Usage
            </h2>
            <pre className="overflow-x-auto rounded-lg bg-slate-950/70 p-4 text-xs leading-relaxed text-cyan-200">
              {`<BubbleBackground interactive />`}
            </pre>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-white/50">
              Default colors
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {SWATCHES.map((swatch) => (
                <div key={swatch.name} className="space-y-1">
                  <span
                    className="block h-10 w-full rounded-lg"
                    style={{ backgroundColor: `rgb(${swatch.value})` }}
                  />
                  <span className="block text-center text-[10px] text-white/50">
                    {swatch.name}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-xs text-white/50">
              Move your mouse across the page — the bubbles drift away.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
