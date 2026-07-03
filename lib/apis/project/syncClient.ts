import {
  createProject,
  createProjectComponent,
  createProjectEdge,
  createProjectNode,
} from "./client";
import { createItem } from "../inventory/client";
import { uploadToStorage } from "../storage/client";
import { createReport } from "./reportClient";
import {
  GeneratedBOMItem,
  GeneratedSpecs,
  GeneratedFlow,
  GeneratedBOM,
} from "../generate/types";
import {
  ProjectComponentModel,
  ProjectEdgeModel,
  ProjectNodeModel,
  ProjectEdge,
  ProjectNode,
  ProjectTagEnum,
} from "./types";
import { ItemCategory } from "../inventory/types";

export async function syncGeneratedData(
  projectName: string,
  specsData: GeneratedSpecs,
  bomResult: GeneratedBOM,
  flowResult: GeneratedFlow,
  pdfBytes: ArrayBuffer,
): Promise<{
  project: any;
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
  const componentIdMap: Record<string, string> = {};
  const projectComponents: ProjectComponentModel[] = [];

  await Promise.all(
    bomResult.items.map(async (item: GeneratedBOMItem, idx: number) => {
      // Map AI category to valid ItemCategory enum
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

      // Item already created in generateBomLogic, but ensure it's consistent
      const newItem = await createItem({
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
      });

      // Link this item to the project
      const projectComp = await createProjectComponent(project.id, {
        id: `comp-proj-gen-${Date.now()}-${idx}-${Math.random()
          .toString(36)
          .substr(2, 5)}`,
        inventoryId: newItem.id,
        qty: 1,
        name: item.name,
        partNumber: item.partNumber,
        category: validCategory,
        specs: item.specs || "",
        unitPrice: item.unitPrice,
        stock: item.stock,
        stockCount: item.stockCount,
        pins: item.pins || [],
      });

      projectComponents.push(projectComp);

      // Map the AI component ID to the database ProjectComponent ID
      if (item.id) {
        componentIdMap[item.id] = projectComp.id;
      }
    }),
  );

  // 5. Save Visual Flow Nodes
  const nodeDbIds: Record<string, string> = {};
  const nodes: ProjectNodeModel[] = [];
  
  if (flowResult && flowResult.nodes) {
    await Promise.all(
      flowResult.nodes.map(async (node: ProjectNode) => {
        const compId = componentIdMap[node.id];

        if (!compId) return;

        const nodeId = `node-gen-${Date.now()}-${Math.random()
          .toString(36)
          .substr(2, 9)}`;
        nodeDbIds[node.id] = nodeId;

        const createdNode = await createProjectNode({
          id: nodeId,
          projectId: project.id,
          componentId: compId,
          positionX: node.positionX,
          positionY: node.positionY,
        });
        nodes.push(createdNode);
      }),
    );
  }

  // 6. Save Visual Flow Edges
  const edges: ProjectEdgeModel[] = [];
  if (flowResult && flowResult.edges) {
    await Promise.all(
      flowResult.edges.map(async (edge: ProjectEdge) => {
        const sourceId = nodeDbIds[edge.sourceId];
        const targetId = nodeDbIds[edge.targetId];

        if (!sourceId || !targetId) return;

        const createdEdge = await createProjectEdge({
          id: `edge-gen-${Date.now()}-${Math.random()
            .toString(36)
            .substr(2, 9)}`,
          projectId: project.id,
          sourceId: sourceId,
          targetId: targetId,
          label: edge.label,
          type: edge.type,
        });
        edges.push(createdEdge);
      }),
    );
  }

  return { project, projectTag, projectComponents, nodes, edges };
}
