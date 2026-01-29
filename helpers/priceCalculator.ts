import type { BaseItemData } from "../utils/types/inventory-item";
import { normalizeRecord } from "./inventory-data";

export function calculateItemsTotal<T extends BaseItemData>(
  items: Record<string, T>
): number {
  const normalized = normalizeRecord(items);

  return Object.values(normalized).reduce((sum, item) => {
    const price = Number(item.price);
    const qty = item.quantity ?? 1;
    return sum + price * qty;
  }, 0);
}

