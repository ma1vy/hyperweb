import { useState } from "react";
import { Link } from "react-router-dom";
import { Coffee, Menu, Moon, Sun, X } from "lucide-react";
import { motion } from "motion/react";
import { useTheme } from "@/lib/theme";

const links = [
  { to: "/about", label: "About" },
  { to: "/features", label: "Features" },
  { to: "/plugins", label: "Plugins" },
];

const menuVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

export function NavBar() {
  const { dark, toggle } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between gap-4 px-6 py-4">
      <Link
        to="/"
        className="flex items-center gap-2 text-sm font-semibold tracking-tight text-white/90"
      >
        <span className="text-lg">HyperDEV</span>
      </Link>

      {/* Desktop: inline buttons (md and up) */}
      <div className="hidden items-center gap-2 md:flex">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/70 backdrop-blur transition-colors hover:bg-white/10 hover:text-white"
          >
            {link.label}
          </Link>
        ))}
        <button
          type="button"
          onClick={toggle}
          aria-label="Toggle theme"
          className="inline-flex size-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 backdrop-blur transition-colors hover:bg-white/15 hover:text-white"
        >
          {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </button>
      </div>

      {/* Mobile: hamburger (below md) */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Open menu"
        aria-expanded={open}
        className="inline-flex size-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 backdrop-blur transition-colors hover:bg-white/15 hover:text-white md:hidden"
      >
        {open ? <X className="size-4" /> : <Menu className="size-4" />}
      </button>

      {/* Mobile: staggered menu overlay */}
      <motion.div
        initial={false}
        animate={open ? "visible" : "hidden"}
        variants={{
          hidden: { opacity: 0, pointerEvents: "none" as const },
          visible: { opacity: 1, pointerEvents: "auto" as const },
        }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 top-0 z-40 flex items-start justify-center bg-black/70 pt-24 backdrop-blur-md md:hidden"
        onClick={() => setOpen(false)}
      >
        <motion.div
          variants={menuVariants}
          initial="hidden"
          animate={open ? "visible" : "hidden"}
          className="flex w-full max-w-sm flex-col gap-3 px-6"
          onClick={(e) => e.stopPropagation()}
        >
          {links.map((link) => (
            <motion.div key={link.to} variants={itemVariants}>
              <Link
                to={link.to}
                onClick={() => setOpen(false)}
                className="flex w-full items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-4 py-4 text-base font-medium text-white/85 backdrop-blur transition-colors hover:bg-white/10 hover:text-white"
              >
                {link.label}
              </Link>
            </motion.div>
          ))}
          <motion.div variants={itemVariants}>
            <button
              type="button"
              onClick={() => {
                toggle();
                setOpen(false);
              }}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-4 py-4 text-base font-medium text-white/85 backdrop-blur transition-colors hover:bg-white/10 hover:text-white"
            >
              {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
              {dark ? "Light mode" : "Dark mode"}
            </button>
          </motion.div>
          <div className="mt-4 flex justify-center opacity-40">
            <Coffee className="size-5" aria-hidden="true" />
          </div>
        </motion.div>
      </motion.div>
    </nav>
  );
}
