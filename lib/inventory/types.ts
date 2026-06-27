export enum StockStatus {
  IN_STOCK = "IN_STOCK",
  LOW = "LOW",
  OUT = "OUT",
}

export enum ComponentCategory {
  MCU = "MCU",
  Sensor = "Sensor",
  Actuator = "Actuator",
  Logic = "Logic",
  Power = "Power",
  Passive = "Passive",
}

export enum MountType {
  THROUGH_HOLE = "THROUGH_HOLE",
  SMD = "SMD",
}

export interface ComponentDetails {
  componentId: string;
  mounting: MountType;
  package: string;
  voltageMin: number;
  voltageMax: number;
  primaryValue?: string;
  powerRating?: string;
  tolerance?: string;
  forwardVoltage?: string;
  maxCurrent?: string;
  thresholdVoltage?: string;
  logicFamily?: string;
  ioVoltage?: number;
  pinCount?: number;
  nominalVoltage?: number;
  currentDraw?: string;
  contactRating?: string;
}

export interface Component {
  id: string;
  name: string;
  partNumber: string;
  specs: string;
  unitPrice: number;
  qty: number;
  stock: StockStatus;
  stockCount?: number;
  category: ComponentCategory;
  pins: string[];
  details?: ComponentDetails;
}
