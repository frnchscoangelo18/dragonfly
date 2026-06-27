import { mockInventory } from "./inventory";

export type ProjectTag =
  | "Robotics"
  | "IoT"
  | "Power"
  | "Networking"
  | "Mechatronics";

export type ConnectionType = "power" | "signal" | "logic" | "i2c";

// 1. Interface for React Flow Edges
export interface ProjectConnection {
  id: string;
  source: string; // The ID of the source component
  target: string; // The ID of the target component
  label?: string; // Text to display on the wire (e.g., "5V", "PWM")
  type?: ConnectionType; // Useful for coloring wires differently in React Flow
}

// 2. Updated Project Definition
export interface ProjectDefinition {
  id: string;
  name: string;
  time: string;
  tag: ProjectTag;
  componentIds: string[];
  connections: ProjectConnection[]; // Added visual map connections
  // Maps an original component ID to an array of approved substitute IDs for this specific project
  substitutes?: Record<string, string[]>;
}

// 3. Interface for the UI
export interface ProjectSummary extends ProjectDefinition {
  cost: number;
}

// 4. The Projects with React Flow Wiring Data
const baseProjects: ProjectDefinition[] = [
  {
    id: "proj_01",
    name: "Line-Following Robot",
    time: "2d ago",
    tag: "Robotics",
    componentIds: [
      "comp_mcu_01",
      "comp_sns_01",
      "comp_act_01",
      "comp_act_02",
      "comp_pwr_01",
      "comp_log_01",
      "comp_act_04",
    ],
    // Approved substitutes for this specific robot build
    substitutes: {
      comp_sns_01: ["comp_sns_01_alt1", "comp_sns_01_alt2", "comp_sns_01_alt3"], // Alternatives for the out-of-stock IR Array
      comp_log_01: ["comp_log_01_alt1", "comp_log_01_alt2", "comp_log_01_alt3"], // Alternatives for the out-of-stock NAND Gate
      comp_mcu_01: ["comp_mcu_01_alt1", "comp_mcu_01_alt2", "comp_mcu_01_alt3"],
      comp_act_01: ["comp_act_01_alt1", "comp_act_01_alt2", "comp_act_01_alt3"],
    },
    connections: [
      // Power routing
      {
        id: "e1",
        source: "comp_pwr_01",
        target: "comp_act_01",
        label: "7.4V (VMOT)",
        type: "power",
      },
      {
        id: "e2",
        source: "comp_pwr_01",
        target: "comp_mcu_01",
        label: "7.4V (VIN)",
        type: "power",
      },
      {
        id: "e3",
        source: "comp_mcu_01",
        target: "comp_sns_01",
        label: "5V VCC",
        type: "power",
      },
      {
        id: "e4",
        source: "comp_mcu_01",
        target: "comp_log_01",
        label: "5V VCC",
        type: "power",
      },

      // Signal logic
      {
        id: "e5",
        source: "comp_sns_01",
        target: "comp_mcu_01",
        label: "Digital Array",
        type: "signal",
      },
      {
        id: "e6",
        source: "comp_mcu_01",
        target: "comp_act_01",
        label: "PWM / DIR",
        type: "signal",
      },
      {
        id: "e7",
        source: "comp_act_01",
        target: "comp_act_02",
        label: "Motor Output",
        type: "power",
      },

      // Buzzer logic
      {
        id: "e8",
        source: "comp_mcu_01",
        target: "comp_act_04",
        label: "PWM (Mismatch)",
        type: "signal",
      },
    ],
  },
  {
    id: "proj_02",
    name: "ESP32 Weather Node",
    time: "5d ago",
    tag: "IoT",
    componentIds: ["comp_mcu_02", "comp_sns_02", "comp_act_03", "comp_pwr_02"],
    substitutes: {
      comp_sns_02: ["comp_sns_02_alt1", "comp_sns_02_alt2", "comp_sns_02_alt3"], // Alternatives for out-of-stock BME280
      comp_mcu_02: ["comp_mcu_02_alt1", "comp_mcu_02_alt2", "comp_mcu_02_alt3"],
    },
    connections: [
      // Power routing
      {
        id: "e9",
        source: "comp_pwr_02",
        target: "comp_mcu_02",
        label: "3.7V BAT",
        type: "power",
      },
      {
        id: "e10",
        source: "comp_mcu_02",
        target: "comp_sns_02",
        label: "3.3V VDD",
        type: "power",
      },
      {
        id: "e11",
        source: "comp_mcu_02",
        target: "comp_act_03",
        label: "3.3V VDD",
        type: "power",
      },

      // I2C Bus logic
      {
        id: "e12",
        source: "comp_mcu_02",
        target: "comp_sns_02",
        label: "I2C (SDA/SCL)",
        type: "i2c",
      },
      {
        id: "e13",
        source: "comp_mcu_02",
        target: "comp_act_03",
        label: "I2C (SDA/SCL)",
        type: "i2c",
      },
    ],
  },
  {
    id: "proj_03",
    name: "Motion Detector Alarm",
    time: "1w ago",
    tag: "Mechatronics",
    componentIds: ["comp_sns_03", "comp_log_02", "comp_pas_01", "comp_pas_02"],
    substitutes: {
      comp_sns_03: ["comp_sns_03_alt1", "comp_sns_03_alt2", "comp_sns_03_alt3"],
    },
    connections: [],
  },
  {
    id: "proj_04",
    name: "Automatic 12V Charger",
    time: "1w ago",
    tag: "Power",
    componentIds: [
      "comp_pwr_trans",
      "comp_pwr_rect",
      "comp_log_zener",
      "comp_act_led",
      "comp_pwr_03", // MOSFET
      "comp_act_05", // Relay
    ],
    connections: [
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
        label: "Voltage Ref",
        type: "logic",
      },
      {
        id: "e_relay",
        source: "comp_pwr_03",
        target: "comp_act_05",
        label: "Control",
        type: "signal",
      },
      {
        id: "e_led",
        source: "comp_act_05",
        target: "comp_act_led",
        label: "Status",
        type: "signal",
      },
    ],
    substitutes: {},
  },
];

// 5. Dynamic Cost Calculation
const generateDynamicProjects = (): ProjectSummary[] => {
  return baseProjects.map((project) => {
    const calculatedCost = project.componentIds.reduce((sum, compId) => {
      const inventoryItem = mockInventory.find((item) => item.id === compId);
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
