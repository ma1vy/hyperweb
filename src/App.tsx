import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/lib/theme";
import { NavBar } from "@/components/NavBar";
import { PersistentBackground } from "@/components/PersistentBackground";
import Home from "./pages/Home";
import Plugins from "./pages/Plugins";
import About from "./pages/About";
import Features from "./pages/Features";
import BgGallery from "./pages/BgGallery";

export default function App() {
  return (
    <ThemeProvider>
      <PersistentBackground />
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/plugins" element={<Plugins />} />
        <Route path="/about" element={<About />} />
        <Route path="/features" element={<Features />} />
        <Route path="/bg-gallery" element={<BgGallery />} />
      </Routes>
    </ThemeProvider>
  );
}
