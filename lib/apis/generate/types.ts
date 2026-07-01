import { ItemDetails, StockStatus } from "@/lib/apis/inventory/types";
import { BomAlert } from "@/features/bom/data";

export interface GeneratedSpecs {
  specs: Array<{
    componentName: string;
    computedSpecs: string;
    reasoning: string;
    calculation: { formula: string; result: string };
  }>;
  summary: string;
}

export interface GeneratedBOMItem {
  id: string;
  name: string;
  partNumber: string;
  unitPrice: number;
  stock: StockStatus;
  stockCount: number;
  category: string;
  specs?: string;
  pins: string[];
  details?: ItemDetails;
  storeOptions: Array<{
    id: string;
    price: number;
    inStock: boolean;
    isCheapest: boolean;
  }>;
}

export interface GeneratedBOM {
  items: GeneratedBOMItem[];
  alerts: BomAlert[];
  tag: string;
}

export interface GeneratedFlow {
  name: string;
  tag: "Robotics" | "IoT" | "Power" | "Networking" | "Mechatronics" | "N/A";
  nodes: Array<{ id: string; positionX: number; positionY: number }>;
  edges: Array<{
    id: string;
    sourceId: string;
    targetId: string;
    label: string;
    type: "power" | "signal" | "logic" | "i2c";
  }>;
}
