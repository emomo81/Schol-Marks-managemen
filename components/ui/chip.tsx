import { cn } from "@/lib/cn";

type ChipKind = "ok" | "warn" | "err" | "wine" | "";

const KIND_CLASSES: Record<ChipKind, string> = {
  ok:   "bg-[#dee9e1] text-ok border-[#c6d8ce]",
  warn: "bg-[#f1e3cd] text-warn border-[#e1d0b3]",
  err:  "bg-[#f1d8d6] text-err border-[#e1bdba]",
  wine: "bg-wine-soft text-wine border-[#e8c5cc]",
  "":   "bg-paper-3 text-ink-2 border-rule",
};

export function Chip({ kind = "", dot, children, className }: {
  kind?: ChipKind;
  dot?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={cn(
      "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11.5px] font-medium tracking-wide border",
      KIND_CLASSES[kind],
      className,
    )}>
      {dot && (
        <span className="w-1.5 h-1.5 rounded-full bg-current inline-block shrink-0" />
      )}
      {children}
    </span>
  );
}
