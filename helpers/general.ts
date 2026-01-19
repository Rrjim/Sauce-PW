// --- FILE HANDLING ---

import fs from "fs";
import path from "path";
import type { InventoryItemData } from "../types/inventoryItemData";

function getFilePath(key: string, from: string): string {
  return path.join(process.cwd(), "test-data", from, `${key}.json`);
}

export function writeInventoryDataToFile(key: string, from, data: Array<any>) {
  fs.writeFileSync(
    getFilePath(key, from),
    JSON.stringify(data, null, 2)
  );
}

export function readInventoryDataFromFile(key: string, from: string): InventoryItemData[] {
  const filePath = getFilePath(key, from);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Inventory data file not found: ${filePath}`);
  }
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}
