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

export const edgeColors: Record<ConnectionEnum, string> = {
  [ConnectionEnum.POWER]: "#ef4444",
  [ConnectionEnum.SIGNAL]: "#3b82f6",
  [ConnectionEnum.LOGIC]: "#8b5cf6",
  [ConnectionEnum.I2C]: "#10b981",
};
