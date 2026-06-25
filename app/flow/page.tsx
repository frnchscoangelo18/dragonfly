"use client";
import { motion } from "framer-motion";
import { useBom } from "../../features/bom/store";

const categoryColor: Record<string, string> = {
  MCU: "bg-primary/20 text-primary ring-primary/40",
  Sensor: "bg-accent/20 text-accent ring-accent/40",
  Actuator: "bg-warning/20 text-warning ring-warning/40",
  Logic: "bg-white/10 text-foreground ring-white/20",
  Power: "bg-destructive/15 text-destructive ring-destructive/30",
  Passive: "bg-white/5 text-muted-foreground ring-white/10",
};

export default function FlowScreen() {
  const { items } = useBom();
  const mcu = items.find((i) => i.category === "MCU");
  const power = items.find((i) => i.category === "Power");
  const peripherals = items.filter(
    (i) => i.category !== "MCU" && i.category !== "Power",
  );

  return (
    <div className="flex flex-col gap-6 px-5 pt-14">
      <header>
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          Visual flow
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
          How it wires up
        </h1>
        <p className="mt-1 text-xs text-muted-foreground">
          A minimalist node tree of signal & power paths.
        </p>
      </header>

      <div className="relative flex flex-col items-center gap-8 rounded-3xl border border-white/5 bg-surface/40 p-6">
        {power && (
          <Node
            label={power.name}
            sub={power.specs}
            category={power.category}
          />
        )}
        <Trace />
        {mcu && (
          <Node
            label={mcu.name}
            sub={mcu.specs}
            category={mcu.category}
            accent
          />
        )}
        <Trace branches />
        <div className="grid w-full grid-cols-2 gap-3">
          {peripherals.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
              className="flex flex-col gap-1 rounded-2xl border border-white/5 bg-surface-elevated/60 p-3"
            >
              <span
                className={`w-fit rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ${categoryColor[p.category]}`}
              >
                {p.category}
              </span>
              <p className="mt-1 truncate text-xs font-medium">{p.name}</p>
              {p.pins && (
                <p className="font-mono text-[10px] text-muted-foreground">
                  → {p.pins.join(", ")}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Node({
  label,
  sub,
  category,
  accent,
}: {
  label: string;
  sub: string;
  category: string;
  accent?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`relative flex w-full max-w-xs flex-col items-center gap-1 rounded-2xl border bg-surface-elevated px-4 py-3 text-center ${
        accent ? "border-primary/40 glow-soft" : "border-white/10"
      }`}
    >
      <span
        className={`rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ${categoryColor[category]}`}
      >
        {category}
      </span>
      <p className="text-sm font-medium">{label}</p>
      <p className="text-[10px] text-muted-foreground">{sub}</p>
    </motion.div>
  );
}

function Trace({ branches }: { branches?: boolean }) {
  return (
    <div className="relative flex h-10 w-full items-center justify-center">
      <div className="h-full w-px bg-gradient-to-b from-primary/60 to-primary/10" />
      {branches && (
        <div className="absolute top-1/2 h-px w-3/4 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      )}
    </div>
  );
}

