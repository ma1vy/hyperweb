import { createContext, useContext, type ReactNode } from "react";

export type CardColors = {
  nameColor: string;
  descriptionColor: string;
  versionColor: string;
  preClassName: string;
  installClassName: string;
  iconClassName: string;
  hrClassName: string;
};

export type CardVariant = CardColors & {
  label: string;
  bgClassName: string;
};

export const CARD_VARIANTS: CardVariant[] = [
  {
    label: "glass-faint",
    bgClassName: "bg-white/5 border-white/10",
    nameColor: "text-white/90",
    descriptionColor: "text-white/60",
    versionColor: "border-white/10 bg-white/5 text-white/50",
    preClassName: "bg-slate-950/70 text-cyan-200",
    installClassName: "bg-white text-slate-950 hover:bg-white/90",
    iconClassName: "bg-white/10 text-white/80",
    hrClassName: "border-white/10",
  },
  {
    label: "glass-bright",
    bgClassName: "bg-white/20 border-white/25 shadow-xl shadow-black/20",
    nameColor: "text-white",
    descriptionColor: "text-white/80",
    versionColor: "text-white/80 border-white/20 bg-white/10",
    preClassName: "bg-slate-950/70 text-cyan-200",
    installClassName: "bg-white text-slate-950 hover:bg-white/90",
    iconClassName: "bg-white/15 text-white",
    hrClassName: "border-white/15",
  },
  {
    label: "glass-solid",
    bgClassName: "bg-white/80 border-white/40 shadow-xl shadow-black/30",
    nameColor: "text-slate-900",
    descriptionColor: "text-slate-600",
    versionColor: "text-slate-700 border-white/40 bg-white/40",
    preClassName: "bg-slate-100 text-slate-900",
    installClassName: "bg-slate-950 text-white hover:bg-slate-800",
    iconClassName: "bg-slate-200/80 text-slate-800",
    hrClassName: "border-slate-300",
  },
  {
    label: "ink-dark",
    bgClassName: "bg-slate-950/70 border-slate-800 shadow-xl shadow-black/40",
    nameColor: "text-white",
    descriptionColor: "text-white/70",
    versionColor: "text-white/60 border-slate-700 bg-slate-800/60",
    preClassName: "bg-slate-950/70 text-cyan-200",
    installClassName: "bg-white text-slate-950 hover:bg-white/90",
    iconClassName: "bg-slate-800/70 text-white/80",
    hrClassName: "border-slate-700",
  },
  {
    label: "slate-mid",
    bgClassName: "bg-slate-700/50 border-slate-500/50 shadow-xl shadow-black/30",
    nameColor: "text-white",
    descriptionColor: "text-white/75",
    versionColor: "text-white/70 border-slate-500/40 bg-slate-600/40",
    preClassName: "bg-slate-950/70 text-cyan-200",
    installClassName: "bg-white text-slate-950 hover:bg-white/90",
    iconClassName: "bg-slate-600/60 text-white/85",
    hrClassName: "border-slate-500/40",
  },
  {
    label: "amber-glow",
    bgClassName: "bg-amber-100/20 border-amber-200/40 shadow-xl shadow-amber-500/20",
    nameColor: "text-amber-50",
    descriptionColor: "text-amber-100/80",
    versionColor: "text-amber-100 border-amber-200/30 bg-amber-200/10",
    preClassName: "bg-slate-950/70 text-cyan-200",
    installClassName: "bg-white text-slate-950 hover:bg-white/90",
    iconClassName: "bg-amber-200/15 text-amber-50",
    hrClassName: "border-amber-200/30",
  },
  {
    label: "indigo-glass",
    bgClassName: "bg-indigo-500/20 border-indigo-300/40 shadow-xl shadow-indigo-500/25",
    nameColor: "text-indigo-50",
    descriptionColor: "text-indigo-100/80",
    versionColor: "text-indigo-100 border-indigo-300/30 bg-indigo-300/10",
    preClassName: "bg-slate-950/70 text-cyan-200",
    installClassName: "bg-white text-slate-950 hover:bg-white/90",
    iconClassName: "bg-indigo-300/15 text-indigo-50",
    hrClassName: "border-indigo-300/30",
  },
];

const CardColorContext = createContext<CardColors | null>(null);

export function useCardColors(): CardColors {
  const colors = useContext(CardColorContext);
  if (!colors) {
    throw new Error("useCardColors must be used within a Card");
  }
  return colors;
}

export type CardProps = {
  variant?: number | string;
  className?: string;
  children: ReactNode;
};

export function Card({
  variant = 0,
  className,
  children,
}: CardProps) {
  const resolved =
    typeof variant === "number"
      ? CARD_VARIANTS[variant]
      : CARD_VARIANTS.find((v) => v.label === variant) ?? CARD_VARIANTS[0];

  const colors: CardColors = {
    nameColor: resolved.nameColor,
    descriptionColor: resolved.descriptionColor,
    versionColor: resolved.versionColor,
    preClassName: resolved.preClassName,
    installClassName: resolved.installClassName,
    iconClassName: resolved.iconClassName,
    hrClassName: resolved.hrClassName,
  };

  return (
    <CardColorContext.Provider value={colors}>
      <article
        className={`flex aspect-square flex-col justify-between gap-3 overflow-hidden rounded-2xl border p-6 text-left backdrop-blur ${resolved.bgClassName} ${className ?? ""}`}
      >
        {children}
      </article>
    </CardColorContext.Provider>
  );
}
