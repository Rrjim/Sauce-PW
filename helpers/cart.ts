// test-helpers/cart/cart-scenarios.ts

import { CartAction, CartItemData, InventoryItemData } from "../utils/types/inventory-item";
import { User } from "../utils/types/login";
import { readDataFromFile } from "./resource-data-config";
import { getCartTestItems } from "./inventory-data";
import { InventoryPage } from "../page-objects/inventoryPage";
import { CartPage } from "../page-objects/cartPage";

function loadTitles(user: User, key: string): string[] {
  const fileData = readDataFromFile<InventoryItemData>(key, "inventory");
  return getCartTestItems(fileData, user.capabilities.cart);
}

export const fullCartLifecycle = (titles: string[]): CartAction[] => [
  ...titles.map((title): CartAction => ({ type: "ADD", title })),
  ...titles.map((title): CartAction => ({ type: "REMOVE", title })),
];

export const addOnlyCartScenario = (titles: string[]): CartAction[] =>
  titles.map((title): CartAction => ({ type: "ADD", title }));

// OR  [As const ensures that type will remain ADD and won't be changed]

// export const fullCartLifecycle = (titles: string[]): CartAction[] => [
//   ...titles.map((title) => ({ type: "ADD" as const, title })),
//   ...titles.map((title) => ({ type: "REMOVE" as const, title })),
// ];

export function buildFullCartScenario(user: User, key: string) {

  return fullCartLifecycle(loadTitles(user, key));
}

export function buildAddOnlyCartScenario(user: User, key: string) {
  return addOnlyCartScenario(loadTitles(user, key));
}

/**
 * Returns inventory items that should appear in the cart
 * based on ADD actions that were executed.
 */
export async function getExpectedCartItems(
  cartPage: CartPage | InventoryPage,
  actions: CartAction[]
): Promise<Record<string, CartItemData>> {
  const addedTitles = new Set(
    actions
      .filter(action => action.type === "ADD")
      .map(action => action.title)
  );

  const cartData = await cartPage.items.getData();

  return Object.fromEntries(
    Object.entries(cartData).filter(
      ([_, item]) => addedTitles.has(item.title)
    )
  );
}

