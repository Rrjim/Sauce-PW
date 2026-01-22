// test-helpers/cart/cart-scenarios.ts

import { CartAction, InventoryItemData } from "../types/inventory-item";
import { User } from "../types/login";
import { readDataFromFile } from "./general";
import { getCartTestItems } from "./inventory";

export const fullCartLifecycle = (titles: string[]): CartAction[] => [
  ...titles.map((title): CartAction => ({ type: "ADD", title })),
  ...titles.map((title): CartAction => ({ type: "REMOVE", title })),
];

// OR  [As const ensures that type will remain ADD and won't be changed]

// export const fullCartLifecycle = (titles: string[]): CartAction[] => [
//   ...titles.map((title) => ({ type: "ADD" as const, title })),
//   ...titles.map((title) => ({ type: "REMOVE" as const, title })),
// ];

export function buildFullCartScenario(user: User, key: string) {
  const fileData = readDataFromFile<InventoryItemData>(key, "inventory");

  const titles = getCartTestItems(fileData, user.capabilities.cart);
  return fullCartLifecycle(titles);
}
