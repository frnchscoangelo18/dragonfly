import { GoogleGenAI } from "@google/genai";
import { getNextApiKey } from "./keyCycler";

export async function generateVisualFlowLogic(
  specsContext: string,
  prompt: string | null,
  image: File | null,
) {
  const ai = new GoogleGenAI({ apiKey: getNextApiKey() });
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
    text: `Based on the following technical specifications, generate a visual signal and power flow diagram.
    
    SPECS CONTEXT:
    ${specsContext}`,
  });

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-lite",
    contents: contents,
    config: {
      systemInstruction: `You are an expert System Architect and Electronics Engineer. Your task is to generate a visual dependency and signal flow mapping for an electronic circuit.

CRITICAL INSTRUCTIONS:
1. EXHAUSTIVE MAPPING: Every single component identified in the SPECS CONTEXT must have a corresponding node. Do not omit any component.
2. FULL CONNECTIVITY: Establish edges representing power (VCC/GND), signal, logic, or I2C connections. Every node must be connected to the overall circuit flow via at least one edge to reflect the physical connectivity of the device.
3. EDGE TYPES: For every edge, assign a type from the following set: 'power', 'signal', 'logic', 'i2c'.
4. STRICT NAMING: The 'id' of each node MUST exactly match the component name as listed in the specs. This is critical for database synchronization.
5. SPATIAL LAYOUT: Assign spatial coordinates (positionX, positionY) such that the diagram flows strictly from top to bottom: inputs and power sources should have smaller Y values (top), and outputs or actuators should have larger Y values (bottom). Ensure a clean, non-overlapping layout.

Return JSON with the following structure:
{
  "name": string,
  "tag": "Robotics" | "IoT" | "Power" | "Networking" | "Mechatronics" | "N/A",
  "nodes": [
    { "id": string, "positionX": number, "positionY": number }
  ],
  "edges": [
    { "id": string, "sourceId": string, "targetId": string, "label": string, "type": "power" | "signal" | "logic" | "i2c" }
  ]
}`,
      responseMimeType: "application/json",
    },
  });

  return JSON.parse(response.text || "{}");
}
