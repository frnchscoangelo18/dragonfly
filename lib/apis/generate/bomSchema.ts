import { Type, Schema } from "@google/genai";
import { ProjectTagEnum } from "../project/types";
import { ItemCategory } from "../inventory/types";

export const BomExtractionSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    items: {
      type: Type.ARRAY,
      description: "List of components extracted from the schematic.",
      items: {
        type: Type.OBJECT,
        properties: {
          name: {
            type: Type.STRING,
            description: "Generic name (e.g., Motor Driver)",
          },
          partNumber: {
            type: Type.STRING,
            description: "Exact part number (e.g., TB6612FNG)",
          },
          specs: {
            type: Type.STRING,
            description:
              "Computed specs and reasoning for upgrade if applicable",
          },
          qty: { type: Type.INTEGER },
          category: {
            type: Type.STRING,
            enum: Object.values(ItemCategory),
          },
        },
        required: ["name", "partNumber", "specs", "qty", "category"],
      },
    },
    components: {
      type: Type.ARRAY,
      description:
        "List of components with inventory details, derived from the items.",
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          name: { type: Type.STRING },
          inventoryId: { type: Type.STRING },
          partNumber: { type: Type.STRING },
          unitPrice: { type: Type.NUMBER },
          qty: { type: Type.INTEGER },
          stock: { type: Type.STRING },
          stockCount: { type: Type.INTEGER },
          category: { type: Type.STRING },
          pins: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description:
              "List of pin names or numbers for the component, if applicable.",
          },
          specs: { type: Type.STRING },
        },
        required: [
          "id",
          "name",
          "inventoryId",
          "partNumber",
          "unitPrice",
          "qty",
          "stock",
          "stockCount",
          "category",
        ],
      },
    },
    alerts: {
      type: Type.ARRAY,
      description:
        "Circuit compatibility or safety warnings (e.g., missing flyback diodes).",
      items: {
        type: Type.OBJECT,
        properties: {
          severity: { type: Type.STRING, enum: ["warning", "info"] },
          title: { type: Type.STRING },
          message: { type: Type.STRING },
          partReference: {
            type: Type.STRING,
            description: "The partNumber this alert relates to, if any.",
          },
        },
        required: ["severity", "title", "message"],
      },
    },
    tag: {
      type: Type.STRING,
      enum: Object.values(ProjectTagEnum),
      // enum: ["Robotics", "IoT", "Power", "Networking", "Mechatronics", "N/A"],
      description: "The most appropriate category tag for this project.",
    },
  },
  required: ["items", "alerts", "tag"],
};
