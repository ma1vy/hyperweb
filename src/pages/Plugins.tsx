import { motion } from "motion/react";

const reveal = {
  hidden: { opacity: 0, y: 5 },
  visible: { opacity: 1, y: 0 },
};

export default function Plugins() {
  return (
    <main className="relative z-10 h-screen w-full overflow-hidden text-white">
      <div className="h-full">
        <section className="flex h-full flex-col items-center justify-center px-6 text-center">
          <motion.div
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <h1 className="text-6xl font-bold tracking-tight sm:text-8xl">
              <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                Plug
              </span>
              <span className="text-white">ins</span>
            </h1>
          </motion.div>
        </section>
      </div>
    </main>
  );
}
