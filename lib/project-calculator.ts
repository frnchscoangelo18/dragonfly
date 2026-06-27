import { ProjectDefinition, type ProjectTag } from "@/data/mock/projects";
import { fetchComponents } from "./inventory/client";
import { Component } from "./inventory/types";

export interface ProjectCartSummary {
  id: string;
  name: string;
  tag: ProjectTag;
  timestamp: string;
  totalPrice: number;
  items: (Component & { qtyPrice: number })[];
}

/**
 * Calculates the summary data from current BOM items.
 */
export const calculateProjectCost = async (
  project: ProjectDefinition,
): Promise<number> => {
  const itemIds = project.nodes.map((node) => node.id);
  const components = await fetchComponents();
  const items = itemIds
    .map((id) => components.find((item) => item.id === id))
    .filter((item) => item !== undefined);

  const itemsWithQtyPrice = items.map((item) => ({
    ...item,
    qtyPrice: item.unitPrice * item.qty,
  }));

  const totalPrice = itemsWithQtyPrice.reduce(
    (sum, item) => sum + item.qtyPrice,
    0,
  );

  return totalPrice;
};
