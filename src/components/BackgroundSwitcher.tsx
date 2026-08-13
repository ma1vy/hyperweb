import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { BubbleBackground } from "@/components/animate-ui/components/backgrounds/bubble";
import Grainient from "@/components/Grainient";
import GradientWaves from "@/components/GradientWaves";
import MoltenMetal from "@/components/MoltenMetal";
import Prism from "@/components/Prism";
import Silk from "@/components/Silk";
import PixelBlast from "@/components/PixelBlast";
import Beams from "@/components/Beams";
import FaultyTerminal from "@/components/FaultyTerminal";
import DotGrid from "@/components/DotGrid";
import Iridescence from "@/components/Iridescence";

export const BACKGROUNDS = [
  {
    name: "Bubble",
    Component: BubbleBackground,
    description:
      "An interactive background featuring smoothly animated gradient bubbles — a playful, dynamic, and visually engaging backdrop.",
    usage: `<BubbleBackground interactive />`,
  },
  {
    name: "Grainient",
    Component: Grainient,
    description:
      "A dreamy, flowing gradient background with a subtle animated grain — a smooth, organic, and visually engaging backdrop.",
    usage: `<Grainient />`,
  },
  {
    name: "Gradient Waves",
    Component: GradientWaves,
    description:
      "Layered, drifting gradient waves with raymarched depth and parallax — a fluid, immersive backdrop.",
    usage: `<GradientWaves />`,
  },
  {
    name: "Molten Metal",
    Component: MoltenMetal,
    description:
      "Swirling molten metal textures with luminous veins — a bold, liquid-metal backdrop.",
    usage: `<MoltenMetal />`,
  },
  {
    name: "Prism",
    Component: Prism,
    description:
      "Fractured, prismatic light refracted through glass-like planes — a sharp, chromatic backdrop.",
    usage: `<Prism />`,
  },
  {
    name: "Silk",
    Component: Silk,
    description:
      "Gently rippling silk fabric rendered in flowing color — a soft, elegant backdrop.",
    usage: `<Silk />`,
  },
  {
    name: "Pixel Blast",
    Component: PixelBlast,
    description:
      "Glitchy pixel explosions bursting across the screen — a chaotic, retro backdrop.",
    usage: `<PixelBlast />`,
  },
  {
    name: "Beams",
    Component: Beams,
    description:
      "Volumetric light beams sweeping through space — a cinematic, atmospheric backdrop.",
    usage: `<Beams />`,
  },
  {
    name: "Faulty Terminal",
    Component: FaultyTerminal,
    description:
      "A glitching, scanlined terminal readout with chromatic aberration — a retro-futuristic backdrop.",
    usage: `<FaultyTerminal />`,
  },
  {
    name: "Dot Grid",
    Component: DotGrid,
    description:
      "An interactive dot grid that warps and ripples around the cursor — a playful, tactile backdrop.",
    usage: `<DotGrid />`,
  },
  {
    name: "Iridescence",
    Component: Iridescence,
    description:
      "Luminous iridescent sheen that shifts hue across the surface — a pearlescent, dynamic backdrop.",
    usage: `<Iridescence />`,
  },
] as const;

type BackgroundSwitcherProps = {
  index: number;
  onChange: (index: number) => void;
};

export function BackgroundSwitcher({
  index,
  onChange,
}: BackgroundSwitcherProps) {
  const current = BACKGROUNDS[index];
  const Background = current.Component;

  const prev = () =>
    onChange((index - 1 + BACKGROUNDS.length) % BACKGROUNDS.length);
  const next = () => onChange((index + 1) % BACKGROUNDS.length);

  return (
    <>
      <div className="absolute inset-0">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={current.name}
            className={
              current.name === "Prism" || current.name === "Gradient Waves"
                ? "fixed inset-0"
                : "absolute inset-0"
            }
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <Background />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute left-1/2 top-4 z-40 flex -translate-x-1/2 items-center gap-3 mt-10">
        <button
          type="button"
          onClick={prev}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 backdrop-blur transition-colors hover:bg-white/15 hover:text-white"
          aria-label="Previous background"
        >
          <ChevronLeft className="size-4" />
        </button>
        <span className="rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-white/80 backdrop-blur">
          {current.name}
        </span>
        <button
          type="button"
          onClick={next}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 backdrop-blur transition-colors hover:bg-white/15 hover:text-white"
          aria-label="Next background"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    </>
  );
}
