import { Bot, Wifi, Network, Cpu, Zap } from "lucide-react";
import { ConnectionType } from "./types";

export const categoryIcons: Record<string, any> = {
  Robotics: Bot,
  IoT: Wifi,
  Networking: Network,
  Mechatronics: Cpu,
  Power: Zap,
};

export const edgeColors: Record<ConnectionType, string> = {
  power: "#ef4444",
  signal: "#3b82f6",
  logic: "#8b5cf6",
  i2c: "#10b981",
};
