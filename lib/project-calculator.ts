import { getProjectComponents } from "./project/client";

export const calculateProjectCost = async (
  projectId: string,
): Promise<number> => {
  const components = await getProjectComponents(projectId);

  if (components.length === 0) {
    return 0;
  }

  const totalPrice = components.reduce(
    (sum, component) => sum + component.unitPrice * component.qty,
    0,
  );

  return totalPrice;
};
