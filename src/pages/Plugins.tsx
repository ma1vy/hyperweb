import { useState } from "react";
import { CreditCard, Wallet, Repeat } from "lucide-react";
import {
  Card,
  CARD_VARIANTS,
  useCardColors,
} from "@/components/Card";
import { InstallButton } from "@/components/InstallButton";
import {
  BACKGROUNDS,
  BackgroundSwitcher,
} from "@/components/BackgroundSwitcher";

const SWATCHES = [
  { name: "color1", value: "#FF9FFC" },
  { name: "color2", value: "#5227FF" },
  { name: "color3", value: "#B497CF" },
];

const PLUGINS = [
  {
    name: "Mastercard API",
    description:
      "Tokenize cards, run real-time authorization.",
    version: "v2.4",
    icon: CreditCard,
  },
  {
    name: "Pamcard API",
    description:
      "Issue virtual cards, manage limits.",
    version: "v1.8",
    icon: Wallet,
  },
  {
    name: "PayCore API",
    description:
      "Recurring billing, refunds.",
    version: "v3.1",
    icon: Repeat,
  },
];

type Plugin = (typeof PLUGINS)[number];

function PluginIcon({ plugin }: { plugin: Plugin }) {
  const colors = useCardColors();
  const Icon = plugin.icon;
  return (
    <span
      className={`inline-flex size-9 shrink-0 items-center justify-center rounded-lg ${colors.iconClassName}`}
    >
      <Icon className="size-4.5" />
    </span>
  );
}

const LAYOUTS = [
  {
    name: "stacked",
    Card: ({ plugin }: { plugin: Plugin }) => {
      const colors = useCardColors();
      return (
        <div className="flex flex-col justify-between gap-3">
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <PluginIcon plugin={plugin} />
                <h2 className={`text-sm font-semibold ${colors.nameColor}`}>
                  {plugin.name}
                </h2>
              </div>
              <span
                className={`rounded-full border px-2 py-0.5 text-[10px] ${colors.versionColor}`}
              >
                {plugin.version}
              </span>
            </div>
            <p className={`text-xs leading-relaxed ${colors.descriptionColor}`}>
              {plugin.description}
            </p>
          </div>
          <InstallButton />
        </div>
      );
    },
  },
  {
    name: "inline",
    Card: ({ plugin }: { plugin: Plugin }) => {
      const colors = useCardColors();
      return (
        <div className="flex h-full flex-col justify-between gap-4">
          <div className="flex items-center gap-2">
            <PluginIcon plugin={plugin} />
            <h2 className={`text-sm font-semibold ${colors.nameColor}`}>
              {plugin.name}
            </h2>
          </div>
          <InstallButton />
          <p className={`text-xs leading-relaxed ${colors.descriptionColor}`}>
            {plugin.description}
          </p>
        </div>
      );
    },
  },
  {
    name: "centered",
    Card: ({ plugin }: { plugin: Plugin }) => {
      const colors = useCardColors();
      return (
        <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
          <PluginIcon plugin={plugin} />
          <h2 className={`text-sm font-semibold ${colors.nameColor}`}>
            {plugin.name}
          </h2>
          <p className={`text-xs leading-relaxed ${colors.descriptionColor}`}>
            {plugin.description}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span
              className={`rounded-full border px-2 py-0.5 text-[10px] ${colors.versionColor}`}
            >
              {plugin.version}
            </span>
          </div>
          <div className="w-full max-w-[220px]">
            <InstallButton />
          </div>
        </div>
      );
    },
  },
  {
    name: "editorial",
    Card: ({ plugin }: { plugin: Plugin }) => {
      const colors = useCardColors();
      return (
        <div className="flex h-full flex-col justify-between gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <PluginIcon plugin={plugin} />
              <div className="space-y-0.5">
                <p
                  className={`text-[10px] font-medium uppercase tracking-widest ${colors.descriptionColor}`}
                >
                  {plugin.version}
                </p>
                <h2
                  className={`text-lg font-bold leading-tight tracking-tight ${colors.nameColor}`}
                >
                  {plugin.name}
                </h2>
              </div>
            </div>
            <hr className={`border-t ${colors.hrClassName}`} />
            <p className={`text-[13px] leading-relaxed ${colors.descriptionColor}`}>
              {plugin.description}
            </p>
          </div>
          <div className="space-y-3">
            <hr className={`border-t ${colors.hrClassName}`} />
            <InstallButton label={`Install ${plugin.version}`} />
          </div>
        </div>
      );
    },
  },
  {
    name: "terminal",
    Card: ({ plugin }: { plugin: Plugin }) => {
      const colors = useCardColors();
      return (
        <div className="flex h-full flex-col justify-between gap-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <PluginIcon plugin={plugin} />
              <p
                className={`font-mono text-[10px] uppercase tracking-widest ${colors.nameColor}`}
              >
                {plugin.name}
              </p>
            </div>
            <span
              className={`rounded border px-1.5 py-0.5 font-mono text-[10px] ${colors.versionColor}`}
            >
              {plugin.version}
            </span>
          </div>
          <p
            className={`font-mono text-[11px] leading-relaxed ${colors.descriptionColor}`}
          >
            {plugin.description}
          </p>
          <InstallButton label="install" />
        </div>
      );
    },
  },
] as const;

function VariantRow({
  variantIndex,
}: {
  variantIndex: number;
}) {
  const variant = CARD_VARIANTS[variantIndex];

  return (
    <div className="w-full space-y-3">
      <p className="text-left text-[10px] font-medium uppercase tracking-widest text-white/40">
        {variant.label}
      </p>
      <div className="grid w-full gap-4 sm:grid-cols-5">
        {Array.from({ length: 5 }, (_, i) => {
          const Layout = LAYOUTS[i % LAYOUTS.length];
          const plugin = PLUGINS[i % PLUGINS.length];
          return (
            <Card key={`${variant.label}-${i}`} variant={variantIndex}>
              <Layout.Card plugin={plugin} />
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default function Plugins() {
  const [bgIndex, setBgIndex] = useState(0);
  const current = BACKGROUNDS[bgIndex];

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-slate-950 text-white">
      <BackgroundSwitcher index={bgIndex} onChange={setBgIndex} />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center gap-8 px-6 py-16 text-center">
        <header className="space-y-3">
          <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-white/70 backdrop-blur">
            Plugins
          </span>
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            {current.name}
          </h1>
          <p className="mx-auto max-w-xl text-base text-white/70 sm:text-lg">
            {current.description}
          </p>
        </header>

        {CARD_VARIANTS.map((variant, i) => (
          <VariantRow key={variant.label} variantIndex={i} />
        ))}
        <div className="grid w-full gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 text-left backdrop-blur sm:grid-cols-2">
          <section className="space-y-2">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-white/50">
              Usage
            </h2>
            <pre className="overflow-x-auto rounded-lg bg-slate-950/70 p-4 text-xs leading-relaxed text-cyan-200">
              {current.usage}
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
                    style={{ backgroundColor: swatch.value }}
                  />
                  <span className="block text-center text-[10px] text-white/50">
                    {swatch.name}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-xs text-white/50">
              The gradient shifts and swirls continuously with an animated
              grain overlay.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
