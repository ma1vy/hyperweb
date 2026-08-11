import MoltenMetal from "@/components/MoltenMetal";

export function PersistentBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 bg-slate-950">
      <MoltenMetal />
      <div className="absolute inset-0 bg-slate-950/60" />
    </div>
  );
}
