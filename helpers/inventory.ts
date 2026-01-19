// test-helpers/inventory-helpers.ts
import { expect } from "@playwright/test";
import { InventoryPage } from "../page-objects/inventoryPage";
import {
  CartAction,
  InventoryItemData,
  SortByOption,
  SortKey,
  sortMapping,
} from "../types/inventory-item";
import { CartCapabilities, User } from "../types/login";
import { readInventoryDataFromFile } from "./general";
import {
  assertPrice,
  assertDescription,
  assertImgSrc,
  assertBtnText,
} from "./inventory-assertions";
import { compareInventories } from "./compare-inventories";

/** --- Data Utilities --- **/

const normalizeItem = (item: InventoryItemData): InventoryItemData => ({
  ...item,
  title: item.title.trim(),
  description: item.description.trim(),
  price: item.price.replace("$", "").trim(),
});

export const toItemMap = (
  items: InventoryItemData[]
): Map<string, InventoryItemData> =>
  new Map(items.map((item) => [item.title, normalizeItem(item)]));

/**
 * Returns items to test for cart actions.
 * Respects user capability limits if any.
 */
export const getCartTestItems = (
  allItems: InventoryItemData[],
  cartCaps: CartCapabilities
): string[] =>
  cartCaps.limitedItems?.length
    ? cartCaps.limitedItems
    : allItems.map((i) => i.title);

/**
 * Returns the expected sorted inventory, user-capabilities aware.
 */
export const getExpectedSortedData = (
  items: InventoryItemData[],
  sort: SortByOption | null,
  sortWorks: boolean
): InventoryItemData[] => {
  if (!sort || !sortWorks) {
    return items;
  }

  return [...items].sort((a, b) => {
    let aVal: string | number = a[sort.field];
    let bVal: string | number = b[sort.field];

    if (sort.field === "price") {
      aVal = parseFloat(aVal);
      bVal = parseFloat(bVal);
    }

    if (aVal < bVal) return sort.descending ? 1 : -1;
    if (aVal > bVal) return sort.descending ? -1 : 1;
    return 0;
  });
};


/** --- Validation Helpers --- **/

/**
 * Validates sorting behavior for a user.
 */
export async function validateInventorySorting(
  inventoryPage: InventoryPage,
  user: User,
  key: string
) {
  const baseline = readInventoryDataFromFile(key, "inventory");

  const assertions = [
    assertPrice,
    assertDescription,
    assertImgSrc,
    assertBtnText,
  ];

for (const sortKey of Object.keys(sortMapping) as SortKey[]) {
  if (sortKey !== "default") {
    await inventoryPage.selectSort(sortKey, user);
  }

  const actualData = await inventoryPage.getInventoryData();

  // Default sort should ignore sort bugs entirely
  if (
    sortKey !== "default" &&
    !user.capabilities.sort?.priceAccurate &&
    sortKey !== "az"
  ) {
    continue;
  }

  const expectedData = getExpectedSortedData(
    baseline,
    sortMapping[sortKey],
    !!user.capabilities.sort?.sortWorks
  );

  compareInventories(
    actualData,
    expectedData,
    user,
    `Sort "${sortKey}" failed (user=${key})`,
    assertions
  );
}

}



