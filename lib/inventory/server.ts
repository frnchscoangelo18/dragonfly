import { promises as fs } from "fs";
import path from "path";
import { Component } from "./types";

const DATA_PATH = path.join(process.cwd(), "data", "inventory.json");

async function readInventory(): Promise<Component[]> {
  try {
    const data = await fs.readFile(DATA_PATH, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    if ((error as any).code === "ENOENT") {
      return [];
    }
    throw error;
  }
}

async function writeInventory(inventory: Component[]): Promise<void> {
  await fs.writeFile(DATA_PATH, JSON.stringify(inventory, null, 2), "utf-8");
}

export async function getAllComponents(): Promise<Component[]> {
  return await readInventory();
}

export async function getComponentById(id: string): Promise<Component | undefined> {
  const inventory = await readInventory();
  return inventory.find((c) => c.id === id);
}

export async function createComponent(component: Component): Promise<Component> {
  const inventory = await readInventory();
  inventory.push(component);
  await writeInventory(inventory);
  return component;
}

export async function updateComponent(
  id: string,
  updatedComponent: Partial<Component>
): Promise<Component | undefined> {
  const inventory = await readInventory();
  const index = inventory.findIndex((c) => c.id === id);
  if (index === -1) return undefined;

  inventory[index] = { ...inventory[index], ...updatedComponent };
  await writeInventory(inventory);
  return inventory[index];
}

export async function deleteComponent(id: string): Promise<boolean> {
  const inventory = await readInventory();
  const index = inventory.findIndex((c) => c.id === id);
  if (index === -1) return false;

  inventory.splice(index, 1);
  await writeInventory(inventory);
  return true;
}
