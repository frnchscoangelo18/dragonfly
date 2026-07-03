import {
  GeneratedSpecs,
  GeneratedFlow,
  GeneratedBOM,
} from "@/lib/apis/generate/types";
import { ConnectionEnum, ProjectTagEnum } from "@/lib/apis/project/types";
import { ItemCategory, StockStatus } from "@/lib/apis/inventory/types";

export const getMockData = () => {
  const timestamp = Date.now();
  return {
    specsData: {
      specs: [
        {
          componentName: "MCU",
          computedSpecs: "Test",
          reasoning: "Test",
          calculation: { formula: "1+1", result: "2" },
        },
      ],
      summary: "Test Summary",
    },
    bomResult: {
      tag: "IoT",
      items: [
        {
          id: `comp-1-${timestamp}`,
          name: "MCU",
          partNumber: "123",
          unitPrice: 10,
          stock: StockStatus.IN_STOCK,
          stockCount: 5,
          category: "MCU",
          pins: [],
          storeOptions: [],
        },
        {
          id: `comp-2-${timestamp}`,
          name: "Sensor",
          partNumber: "456",
          unitPrice: 5,
          stock: StockStatus.IN_STOCK,
          stockCount: 10,
          category: "Sensor",
          pins: [],
          storeOptions: [],
        },
      ],
      alerts: [],
    },
    flowResult: {
      name: "Mock Project",
      tag: ProjectTagEnum.IOT,
      nodes: [
        {
          id: `node-1-${timestamp}`,
          componentId: `comp-1-${timestamp}`,
          positionX: 100,
          positionY: 100,
        },
        {
          id: `node-2-${timestamp}`,
          componentId: `comp-2-${timestamp}`,
          positionX: 100,
          positionY: 250,
        },
      ],
      edges: [
        {
          id: `edge-1-${timestamp}`,
          sourceId: `node-1-${timestamp}`,
          targetId: `node-2-${timestamp}`,
          label: "link",
          type: ConnectionEnum.I2C,
        },
      ],
    },
  };
};
