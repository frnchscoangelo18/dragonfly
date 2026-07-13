import { Globe, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface VisibilityBadgeProps {
  isPublic: boolean;
  className?: string;
}

export function VisibilityBadge({ isPublic, className }: VisibilityBadgeProps) {
  if (isPublic) {
    return (
      <span
        className={cn(
          "inline-flex shrink-0 items-center gap-1 rounded-full bg-cyan-400/15 px-2 py-0.5 text-[10px] font-medium text-cyan-300 ring-1 ring-cyan-400/30",
          className,
        )}
      >
        <Globe size={11} /> Public
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1 rounded-full bg-purple-500/15 px-2 py-0.5 text-[10px] font-medium text-purple-300 ring-1 ring-purple-500/30",
        className,
      )}
    >
      <Lock size={11} /> Private
    </span>
  );
}
