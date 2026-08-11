import { useCardColors } from "@/components/Card";

type InstallButtonProps = {
  label?: string;
};

export function InstallButton({ label = "Install" }: InstallButtonProps) {
  const colors = useCardColors();

  return (
    <button
      type="button"
      className={`inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-colors ${colors.installClassName}`}
    >
      {label}
    </button>
  );
}
