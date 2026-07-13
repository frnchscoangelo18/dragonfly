import {
  Bot,
  Wifi,
  Network,
  Cpu,
  Zap,
  type LucideIcon,
  HelpCircle,
} from "lucide-react";
import { ConnectionEnum, ProjectTagEnum } from "./types";

export const categoryIcons: Record<ProjectTagEnum, LucideIcon> = {
  [ProjectTagEnum.ROBOTICS]: Bot,
  [ProjectTagEnum.IOT]: Wifi,
  [ProjectTagEnum.NETWORKING]: Network,
  [ProjectTagEnum.MECHATRONICS]: Cpu,
  [ProjectTagEnum.POWER]: Zap,
  [ProjectTagEnum.NA]: HelpCircle,
};

// Semantic color coding for the project-type badge, keyed by tag. Distinct from
// the cyan/purple VisibilityBadge so the two never read as the same state.
export const projectTagStyles: Record<ProjectTagEnum, string> = {
  [ProjectTagEnum.ROBOTICS]: "bg-rose-400/15 text-rose-300 ring-1 ring-rose-400/30",
  [ProjectTagEnum.IOT]: "bg-emerald-400/15 text-emerald-300 ring-1 ring-emerald-400/30",
  [ProjectTagEnum.NETWORKING]: "bg-sky-400/15 text-sky-300 ring-1 ring-sky-400/30",
  [ProjectTagEnum.MECHATRONICS]: "bg-violet-400/15 text-violet-300 ring-1 ring-violet-400/30",
  [ProjectTagEnum.POWER]: "bg-amber-400/15 text-amber-300 ring-1 ring-amber-400/30",
  [ProjectTagEnum.NA]: "bg-white/5 text-muted-foreground ring-1 ring-white/10",
};

export const edgeColors: Record<ConnectionEnum, string> = {
  [ConnectionEnum.POWER]: "#ef4444",
  [ConnectionEnum.SIGNAL]: "#3b82f6",
  [ConnectionEnum.LOGIC]: "#8b5cf6",
  [ConnectionEnum.I2C]: "#10b981",
};
