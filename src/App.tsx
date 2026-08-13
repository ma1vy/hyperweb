import { Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "@/lib/theme";
import { NavBar } from "@/components/NavBar";
import { PersistentBackground } from "@/components/PersistentBackground";
import Home from "./pages/Home";
import Plugins from "./pages/Plugins";
import About from "./pages/About";
import Features from "./pages/Features";
import BgGallery from "./pages/BgGallery";
import QuickStart from "./pages/QuickStart";

export default function App() {
  const { pathname } = useLocation();
  const hideNav = pathname === "/quick-start";

  return (
    <ThemeProvider>
      <PersistentBackground />
      {!hideNav && <NavBar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/plugins" element={<Plugins />} />
        <Route path="/about" element={<About />} />
        <Route path="/features" element={<Features />} />
        <Route path="/bg-gallery" element={<BgGallery />} />
        <Route path="/quick-start" element={<QuickStart />} />
      </Routes>
    </ThemeProvider>
  );
}
