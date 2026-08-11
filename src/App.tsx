import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Plugins from "./pages/Plugins";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/plugins" element={<Plugins />} />
    </Routes>
  );
}
