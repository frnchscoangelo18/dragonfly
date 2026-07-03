import {
  createProject,
  createProjectComponentsBatch,
  createProjectEdgesBatch,
  createProjectNodesBatch,
} from "./client";
import { createItemsBatch } from "../inventory/client";
import { uploadToStorage } from "../storage/client";
import { createReport } from "./reportClient";
import { GeneratedSpecs, GeneratedFlow, GeneratedBOM } from "../generate/types";
import {
  ProjectComponentModel,
  ProjectTagEnum,
  ProjectModel,
  ProjectNodeModel,
  ProjectEdgeModel,
} from "./types";
import { ItemCategory, ItemModel } from "../inventory/types";

export async function syncGeneratedData(
  projectName: string,
  specsData: GeneratedSpecs,
  bomResult: GeneratedBOM,
  flowResult: GeneratedFlow,
  pdfBytes: ArrayBuffer,
): Promise<{
  project: ProjectModel;
  projectTag: ProjectTagEnum;
  projectComponents: ProjectComponentModel[];
  nodes: ProjectNodeModel[];
  edges: ProjectEdgeModel[];
}> {
  // Convert tag from string to ProjectTagEnum
  const tagMap: Record<string, ProjectTagEnum> = {
    Robotics: ProjectTagEnum.ROBOTICS,
    IoT: ProjectTagEnum.IOT,
    Power: ProjectTagEnum.POWER,
    Networking: ProjectTagEnum.NETWORKING,
    Mechatronics: ProjectTagEnum.MECHATRONICS,
    "N/A": ProjectTagEnum.NA,
  };
  const projectTag = tagMap[bomResult.tag] || ProjectTagEnum.NA;

  // 1. Create the Project
  const projectId = `proj-gen-${Date.now()}`;
  const project = await createProject({
    id: projectId,
    name: projectName,
    time: new Date().toISOString(),
    tag: projectTag,
  });

  // 2. Upload PDF to Storage (only once)
  const pdfFile = new File([new Blob([pdfBytes])], `${projectName}.pdf`, {
    type: "application/pdf",
  });
  const uploadResult = await uploadToStorage(
    pdfFile,
    `reports/${projectName}-${Date.now()}.pdf`,
  );
  const pdfUrl = uploadResult.url;

  // 3. Create Report
  await createReport({
    project_id: projectId,
    report_name: `${projectName} Report`,
    report_data: specsData,
    pdf_url: pdfUrl,
  });

  // 4. Save Inventory Items & Link to Project Components
  const inventoryItems: ItemModel[] = bomResult.items.map((item, idx) => {
    const categoryMap: Record<string, ItemCategory> = {
      MCU: ItemCategory.MCU,
      Sensor: ItemCategory.Sensor,
      Actuator: ItemCategory.Actuator,
      Logic: ItemCategory.Logic,
      Power: ItemCategory.Power,
      Passive: ItemCategory.Passive,
      IoT: ItemCategory.MCU,
      Robotics: ItemCategory.Actuator,
      Networking: ItemCategory.Logic,
      Mechatronics: ItemCategory.Actuator,
    };
    const validCategory = categoryMap[item.category] || ItemCategory.Logic;

    return {
      id: item.id,
      name: item.name,
      partNumber: item.partNumber,
      category: validCategory,
      specs: item.specs || "",
      details: item.details,
      unitPrice: item.unitPrice,
      stock: item.stock,
      stockCount: item.stockCount,
      pins: item.pins || [],
    };
  });
  await createItemsBatch(inventoryItems);

  const projectComponents = await createProjectComponentsBatch(
    project.id,
    bomResult.items.map((item, idx) => {
      const categoryMap: Record<string, ItemCategory> = {
        MCU: ItemCategory.MCU,
        Sensor: ItemCategory.Sensor,
        Actuator: ItemCategory.Actuator,
        Logic: ItemCategory.Logic,
        Power: ItemCategory.Power,
        Passive: ItemCategory.Passive,
        IoT: ItemCategory.MCU,
        Robotics: ItemCategory.Actuator,
        Networking: ItemCategory.Logic,
        Mechatronics: ItemCategory.Actuator,
      };
      const validCategory = categoryMap[item.category] || ItemCategory.Logic;

      return {
        id: item.id,
        inventoryId: item.id,
        qty: 1,
        name: item.name,
        partNumber: item.partNumber,
        category: validCategory,
        specs: item.specs || "",
        unitPrice: item.unitPrice,
        stock: item.stock,
        stockCount: item.stockCount,
        pins: item.pins || [],
      };
    }),
  );

  // 5. Save Visual Flow Nodes
  const nodes = flowResult.nodes
    ? await createProjectNodesBatch(projectId, flowResult.nodes)
    : [];

  // 6. Save Visual Flow Edges
  const edges = flowResult.edges
    ? await createProjectEdgesBatch(projectId, flowResult.edges)
    : [];

  return { project, projectTag, projectComponents, nodes, edges };
}
