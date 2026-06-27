import { mockInventory } from "./inventory";

export type ProjectTag =
  | "Robotics"
  | "IoT"
  | "Power"
  | "Networking"
  | "Mechatronics";

export type ConnectionType = "power" | "signal" | "logic" | "i2c";

export const edgeColors: Record<ConnectionType, string> = {
  power: "#ef4444", // Red for high voltage/current
  signal: "#3b82f6", // Blue for data/PWM
  logic: "#8b5cf6", // Purple for triggers/comparators
  i2c: "#10b981", // Green for communication protocols
};

// 1. Interface for React Flow Nodes (Includes Explicit Layout)
export interface ProjectNode {
  id: string; // Matches the component ID in inventory
  position: { x: number; y: number };
}

// 2. Interface for React Flow Edges
export interface ProjectEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  type?: ConnectionType;
}

// 3. Updated Project Definition
export interface ProjectDefinition {
  id: string;
  name: string;
  time: string;
  tag: ProjectTag;
  nodes: ProjectNode[]; // Replaces componentIds
  edges: ProjectEdge[]; // Replaces connections
  substitutes?: Record<string, string[]>;
}

// 4. Interface for the UI
export interface ProjectSummary extends ProjectDefinition {
  cost: number;
}

// 5. The Projects with Hardcoded Top-to-Bottom Coordinates
const baseProjects: ProjectDefinition[] = [
  {
    id: "proj_01",
    name: "Line-Following Robot",
    time: "2d ago",
    tag: "Robotics",
    nodes: [
      // Level 0: Inputs & Power (Top)
      { id: "comp_pwr_01", position: { x: 150, y: 0 } },
      { id: "comp_sns_01", position: { x: 450, y: 0 } },
      // Level 1: Processing (Middle)
      { id: "comp_mcu_01", position: { x: 300, y: 150 } },
      { id: "comp_log_01", position: { x: 600, y: 150 } },
      // Level 2: Actuation (Lower Middle)
      { id: "comp_act_01", position: { x: 150, y: 300 } },
      { id: "comp_act_04", position: { x: 450, y: 300 } },
      // Level 3: Final Output (Bottom)
      { id: "comp_act_02", position: { x: 150, y: 450 } },
    ],
    substitutes: {
      comp_sns_01: ["comp_sns_01_alt1", "comp_sns_01_alt2", "comp_sns_01_alt3"],
      comp_log_01: ["comp_log_01_alt1", "comp_log_01_alt2", "comp_log_01_alt3"],
      comp_mcu_01: ["comp_mcu_01_alt1", "comp_mcu_01_alt2", "comp_mcu_01_alt3"],
      comp_act_01: ["comp_act_01_alt1", "comp_act_01_alt2", "comp_act_01_alt3"],
    },
    edges: [
      {
        id: "e5",
        source: "comp_sns_01",
        target: "comp_mcu_01",
        label: "Sensor Data",
        type: "signal",
      },
      {
        id: "e6",
        source: "comp_mcu_01",
        target: "comp_act_01",
        label: "PWM/DIR",
        type: "signal",
      },
      {
        id: "e7",
        source: "comp_act_01",
        target: "comp_act_02",
        label: "Drive Current",
        type: "power",
      },
      {
        id: "e1",
        source: "comp_pwr_01",
        target: "comp_act_01",
        label: "VMOT",
        type: "power",
      },
      {
        id: "e2",
        source: "comp_pwr_01",
        target: "comp_mcu_01",
        label: "VCC",
        type: "power",
      },
      {
        id: "e8",
        source: "comp_mcu_01",
        target: "comp_act_04",
        label: "Mismatch",
        type: "signal",
      },
    ],
  },
  {
    id: "proj_02",
    name: "ESP32 Weather Node",
    time: "5d ago",
    tag: "IoT",
    nodes: [
      // Level 0: Inputs & Power
      { id: "comp_pwr_02", position: { x: 150, y: 0 } },
      { id: "comp_sns_02", position: { x: 450, y: 0 } },
      // Level 1: MCU
      { id: "comp_mcu_02", position: { x: 300, y: 150 } },
      // Level 2: Output Display
      { id: "comp_act_03", position: { x: 300, y: 300 } },
    ],
    substitutes: {
      comp_sns_02: ["comp_sns_02_alt1", "comp_sns_02_alt2", "comp_sns_02_alt3"],
      comp_mcu_02: ["comp_mcu_02_alt1", "comp_mcu_02_alt2", "comp_mcu_02_alt3"],
    },
    edges: [
      {
        id: "e12",
        source: "comp_sns_02",
        target: "comp_mcu_02",
        label: "I2C Data",
        type: "i2c",
      },
      {
        id: "e13",
        source: "comp_mcu_02",
        target: "comp_act_03",
        label: "Display Data",
        type: "i2c",
      },
      {
        id: "e9",
        source: "comp_pwr_02",
        target: "comp_mcu_02",
        label: "Battery",
        type: "power",
      },
    ],
  },
  {
    id: "proj_03",
    name: "Motion Detector Alarm",
    time: "1w ago",
    tag: "Mechatronics",
    nodes: [
      // Level 0: Sensor & Passives
      { id: "comp_sns_03", position: { x: 150, y: 0 } },
      { id: "comp_pas_01", position: { x: 350, y: 0 } },
      { id: "comp_pas_02", position: { x: 550, y: 0 } },
      // Level 1: Logic Processing
      { id: "comp_log_02", position: { x: 350, y: 150 } },
      // Level 2: Actuation
      { id: "comp_act_04", position: { x: 350, y: 300 } },
    ],
    substitutes: {
      comp_sns_03: ["comp_sns_03_alt1", "comp_sns_03_alt2", "comp_sns_03_alt3"],
    },
    edges: [
      {
        id: "e_in",
        source: "comp_sns_03",
        target: "comp_log_02",
        label: "Trigger",
        type: "signal",
      },
      {
        id: "e_rc1",
        source: "comp_pas_01",
        target: "comp_log_02",
        label: "Timing R",
        type: "logic",
      },
      {
        id: "e_rc2",
        source: "comp_pas_02",
        target: "comp_log_02",
        label: "Timing C",
        type: "logic",
      },
      {
        id: "e_out",
        source: "comp_log_02",
        target: "comp_act_04",
        label: "Alarm Signal",
        type: "signal",
      },
    ],
  },
  {
    id: "proj_04",
    name: "Automatic 12V Charger",
    time: "1w ago",
    tag: "Power",
    nodes: [
      // Level 0: Mains Input
      { id: "comp_pwr_trans", position: { x: 250, y: 0 } },
      // Level 1: Rectification & Reference
      { id: "comp_pwr_rect", position: { x: 150, y: 150 } },
      { id: "comp_log_zener", position: { x: 350, y: 150 } },
      // Level 2: Power Control Switch
      { id: "comp_pwr_03", position: { x: 250, y: 300 } },
      // Level 3: Output State
      { id: "comp_act_05", position: { x: 150, y: 450 } },
      { id: "comp_act_led", position: { x: 350, y: 450 } },
    ],
    edges: [
      {
        id: "e_trans",
        source: "comp_pwr_trans",
        target: "comp_pwr_rect",
        label: "12V AC",
        type: "power",
      },
      {
        id: "e_rect",
        source: "comp_pwr_rect",
        target: "comp_pwr_03",
        label: "DC Bus",
        type: "power",
      },
      {
        id: "e_zener",
        source: "comp_log_zener",
        target: "comp_pwr_03",
        label: "V-Ref",
        type: "logic",
      },
      {
        id: "e_relay",
        source: "comp_pwr_03",
        target: "comp_act_05",
        label: "Cutoff",
        type: "signal",
      },
      {
        id: "e_led",
        source: "comp_act_05",
        target: "comp_act_led",
        label: "Full Status",
        type: "signal",
      },
    ],
    substitutes: {},
  },
];

// 6. Dynamic Cost Calculation
const generateDynamicProjects = (): ProjectSummary[] => {
  return baseProjects.map((project) => {
    const calculatedCost = project.nodes.reduce((sum, node) => {
      const inventoryItem = mockInventory.find((item) => item.id === node.id);
      if (inventoryItem) {
        return sum + inventoryItem.unitPrice * inventoryItem.qty;
      }
      return sum;
    }, 0);

    return {
      ...project,
      cost: calculatedCost,
    };
  });
};

export const recentProjects = generateDynamicProjects();
