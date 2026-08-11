import { Link } from "react-router-dom";

function Home() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-slate-950 px-6 text-white">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          hyperweb
        </h1>
        <p className="mt-4 text-lg text-white/60">
          React + Vite + Bun + Hono sample project.
        </p>
        <nav className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/plugins"
            className="rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-medium transition-colors hover:bg-white/10"
          >
            /plugins
          </Link>
        </nav>
      </div>
    </main>
  );
}

export default Home;
