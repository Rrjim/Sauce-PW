// --- FILE HANDLING ---

import fs from "fs";
import path from "path";
import type { InventoryItemData } from "../types/inventoryItemData";

function getFilePath(key: string, from: string): string {
  return path.join(process.cwd(), "test-data", from, `${key}.json`);
}

export function writeDataToFile<T extends object>(
  key: string,
  from: string,
  data: Record<string, T>
) {
  fs.writeFileSync(getFilePath(key, from), JSON.stringify(data, null, 2));
}

export function readDataFromFile<T extends object>(
  key: string,
  from: string
): Record<string, T> {
  const filePath = getFilePath(key, from);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Inventory data file not found: ${filePath}`);
  }
  
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}
