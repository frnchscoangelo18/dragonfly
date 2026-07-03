import { GoogleGenAI } from "@google/genai";
import { getNextApiKey } from "./keyCycler";
import { normalizeGenerationTimestamp, runWithModelFallback } from "./utils";
import { ConnectionEnum, ProjectTagEnum } from "../project/types";

export async function generateVisualFlowLogic(
  bomContext: string,
  prompt: string | null,
  image: File | null,
  generationTimestamp?: string,
) {
  const ai = new GoogleGenAI({ apiKey: getNextApiKey() });
  const generationSuffix = normalizeGenerationTimestamp(generationTimestamp);

  const contents = [];
  if (image) {
    const buffer = Buffer.from(await image.arrayBuffer());
    contents.push({
      inlineData: {
        data: buffer.toString("base64"),
        mimeType: image.type,
      },
    });
  }
  if (prompt) {
    contents.push({ text: prompt });
  }
  contents.push({
    text: `Based on the following Bill of Materials (BOM), generate a visual signal and power flow diagram.
    
    BOM CONTEXT:
    ${bomContext}`,
  });

  const result = await runWithModelFallback(
    ai,
    contents,
    {
      systemInstruction: `You are an expert System Architect. Your task is to generate a visual BLOCK DIAGRAM showing the signal and power flow of a system based on the provided Bill of Materials.

CRITICAL INSTRUCTIONS:
1. BLOCK DIAGRAM ONLY: Do NOT generate a circuit diagram. Do NOT create closed-loop circuits or cyclic feedback paths. The diagram must represent a unidirectional functional flow (e.g., Sensor -> MCU -> Actuator).
2. EXHAUSTIVE MAPPING: Every single component identified in the BOM CONTEXT must have a corresponding node.
3. HIERARCHICAL FLOW: Connections should represent functional flow of data, signal, or power, not raw wiring.
4. EDGE TYPES: Assign a type from the following set: 'power', 'signal', 'logic', 'i2c'.
5. STRICT NAMING: The 'id' of each node MUST exactly match the component ID as listed in the BOM.
6. SPATIAL LAYOUT: Enforce a strictly VERTICAL, TOP-TO-BOTTOM layout. Components providing input (sensors, power) should have smaller Y values (at the top). Processing components (MCUs) should be in the middle. Output components (actuators, displays) should have larger Y values (at the bottom). Components at the same logical level should have the same Y value but be separated along the X-axis (min 200px horizontal spacing) to avoid overlap. Ensure a minimum vertical distance of at least 150px between different hierarchical levels (Y-axis spacing) to ensure edges are clearly visible and not too short. Maintain a clean, linear, non-overlapping flow.

Return JSON with the following structure:
{
  "name": string,
  "tag": "Robotics" | "IoT" | "Power" | "Networking" | "Mechatronics" | "N/A",
  "nodes": [
    { "id": string, "componentId": string, "positionX": number, "positionY": number }
  ],
  "edges": [
    { "id": string, "sourceId": string, "targetId": string, "label": string, "type": "power" | "signal" | "logic" | "i2c" }
  ]
}`,
      responseMimeType: "application/json",
    },
    JSON.parse as (text: string) => {
      name: string;
      tag: ProjectTagEnum;
      nodes: {
        id: string;
        componentId: string;
        positionX: number;
        positionY: number;
      }[];
      edges: {
        id: string;
        sourceId: string;
        targetId: string;
        label: string;
        type: ConnectionEnum;
      }[];
    },
  );

  return {
    ...result,
    nodes: result.nodes.map((n) => ({ ...n, id: `${n.id}-${generationSuffix}` })),
    edges: result.edges.map((e) => ({
      ...e,
      id: `${e.id}-${generationSuffix}`,
      sourceId: `${e.sourceId}-${generationSuffix}`,
      targetId: `${e.targetId}-${generationSuffix}`,
    })),
  };
}
