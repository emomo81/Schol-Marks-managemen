import { cn } from "@/lib/cn";

type BtnVariant = "default" | "primary" | "ghost";
type BtnSize = "md" | "sm";

export function Button({ variant = "default", size = "md", className, children, ...props }: {
  variant?: BtnVariant;
  size?: BtnSize;
  className?: string;
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border font-sans text-[13px] transition-colors cursor-pointer",
        size === "md" ? "px-3 py-[7px]" : "px-2.5 py-1 text-[12px]",
        variant === "default" && "border-rule bg-paper-2 text-ink hover:bg-paper-3",
        variant === "primary" && "border-wine bg-wine text-[#fdf5e6] hover:bg-wine-2",
        variant === "ghost"   && "border-transparent bg-transparent text-ink-2 hover:bg-paper-3",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
