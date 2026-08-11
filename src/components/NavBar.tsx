import { Link } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/theme";

export function NavBar() {
  const { dark, toggle } = useTheme();

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between gap-4 px-6 py-4">
      <Link
        to="/"
        className="flex items-center gap-2 text-sm font-semibold tracking-tight text-white/90"
      >
        <span className="text-lg">Hypersomnia</span>
      </Link>

      <div className="flex items-center gap-2">
        <Link
          to="/plugins"
          className="rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/70 backdrop-blur transition-colors hover:bg-white/10 hover:text-white"
        >
          Plugins
        </Link>
        <button
          type="button"
          onClick={toggle}
          aria-label="Toggle theme"
          className="inline-flex size-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 backdrop-blur transition-colors hover:bg-white/15 hover:text-white"
        >
          {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </button>
      </div>
    </nav>
  );
}
