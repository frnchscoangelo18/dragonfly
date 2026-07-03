import { ConnectionEnum, ProjectTagEnum } from "@/lib/apis/project/types";
import { ItemCategory, StockStatus } from "@/lib/apis/inventory/types";
import {
  GeneratedBOM,
  GeneratedFlow,
  GeneratedSpecs,
} from "@/lib/apis/generate/types";

export const getMockData = (projectId: string) => {
  const timestamp = Date.now();
  const mockData: {
    specsData: GeneratedSpecs;
    bomResult: GeneratedBOM;
    flowResult: GeneratedFlow;
  } = {
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
      tag: ProjectTagEnum.IOT,
      items: [
        {
          id: `item-1-${timestamp}`,
          name: "MCU",
          partNumber: "123",
          unitPrice: 10,
          stock: StockStatus.IN_STOCK,
          stockCount: 5,
          category: ItemCategory.MCU,
          pins: [],
          specs: "Test Specs",
        },
        {
          id: `item-2-${timestamp}`,
          name: "Sensor",
          partNumber: "456",
          unitPrice: 5,
          stock: StockStatus.IN_STOCK,
          stockCount: 10,
          category: ItemCategory.Sensor,
          pins: [],
          specs: "Test Specs",
        },
      ],
      components: [
        {
          id: `comp-1-${projectId}`,
          name: "MCU",
          inventoryId: `item-1-${timestamp}`,
          partNumber: "123",
          unitPrice: 10,
          qty: 1,
          stock: StockStatus.IN_STOCK,
          stockCount: 5,
          category: ItemCategory.MCU,
          pins: [],
          specs: "Test Specs",
        },
        {
          id: `comp-2-${projectId}`,
          name: "Sensor",
          inventoryId: `item-2-${timestamp}`,
          partNumber: "456",
          unitPrice: 5,
          qty: 2,
          stock: StockStatus.IN_STOCK,
          stockCount: 10,
          category: ItemCategory.Sensor,
          pins: [],
          specs: "Test Specs",
        },
      ],
      alerts: [],
    },
    flowResult: {
      name: "Mock Project",
      tag: ProjectTagEnum.IOT,
      nodes: [
        {
          id: `node-1-${projectId}`,
          componentId: `comp-1-${projectId}`,
          positionX: 100,
          positionY: 100,
        },
        {
          id: `node-2-${projectId}`,
          componentId: `comp-2-${projectId}`,
          positionX: 100,
          positionY: 250,
        },
      ],
      edges: [
        {
          id: `edge-1-${timestamp}`,
          sourceId: `node-1-${projectId}`,
          targetId: `node-2-${projectId}`,
          label: "link",
          type: ConnectionEnum.I2C,
        },
      ],
    },
  };
  return mockData;
};
