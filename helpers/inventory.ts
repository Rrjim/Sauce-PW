// test-helpers/inventory-helpers.ts
import { expect } from "@playwright/test";
import { InventoryPage } from "../page-objects/inventoryPage";
import {
  AssertionContext,
  InventoryItemData,
  SortKey,
  sortMapping,
} from "../types/inventory-item";
import { CartCapabilities, User } from "../types/login";
import { readDataFromFile } from "./general";
import {
  assertPrice,
  assertDescription,
  assertImgSrc,
  assertBtnText,
  assertTitle,
} from "./inventory-assertions";

/** --- Data Utilities --- **/

export function normalizeInventoryRecord(
  record: Record<string, InventoryItemData>
): Record<string, InventoryItemData> {
  return Object.fromEntries(
    Object.entries(record).map(([title, item]) => [
      title.trim(),
      {
        ...item,
        title: item.title.trim(),
        description: item.description.trim(),
        price: item.price.replace("$", "").trim(),
      },
    ])
  );
}


/**
 * Returns items to test for cart actions.
 * Respects user capability limits if any.
 */
export const getCartTestItems = (
  allItems: Record<string, InventoryItemData>,
  cartCaps: CartCapabilities
): string[] =>
  cartCaps.limitedItems?.length
    ? cartCaps.limitedItems
    : Object.values(allItems).map(i => i.title.trim());

function shouldValidateSort(
  sortKey: SortKey,
  user: User
): boolean {
  const option = sortMapping[sortKey];

  if (!option) return true; // default

  if (!user.capabilities.sort?.sortWorks) {
    return false;
  }

  if (
    option.field === "price" &&
    !user.capabilities.sort?.priceAccurate
  ) {
    return false;
  }

  return true;
}

function projectField(
  record: Record<string, InventoryItemData>,
  field: "title" | "price"
): (string | number)[] {
  const items = Object.values(record);

  return field === "price"
    ? items.map(i => Number(i.price))
    : items.map(i => i.title);
}


export function projectForSort(
  record: Record<string, InventoryItemData>,
  sortKey: SortKey
): (string | number)[] {
  const items = Object.values(normalizeInventoryRecord(record));

  switch (sortKey) {
    case "az":
    case "za":
      return items.map(i => i.title);

    case "lohi":
    case "hilo":
      return items.map(i => Number(i.price));

    default:
      return [];
  }
}

function getExpectedSortOrder(
  baseline: Record<string, InventoryItemData>,
  sortKey: SortKey
): (string | number)[] {
  const option = sortMapping[sortKey];
  if (!option) return Object.values(baseline).map(i => i.title);

  const projected = projectField(baseline, option.field);

  const sorted = [...projected].sort((a, b) =>
    a < b ? -1 : a > b ? 1 : 0
  );

  return option.descending ? sorted.reverse() : sorted;
}



/** --- Validation Helpers --- **/

export async function validateInventoryIntegrity(
  inventoryPage: InventoryPage,
  user: User,
  key: string,
  context: Omit<AssertionContext, "item">
) {
  const baseline = normalizeInventoryRecord(
    readDataFromFile(key, "inventory")
  );

  const actual = normalizeInventoryRecord(
    await inventoryPage.getInventoryData()
  );

  const expectedKeys = Object.keys(baseline);
  const actualKeys = Object.keys(actual);

  expect(
    actualKeys,
    `[Inventory] Item set | user=${context.user}`
  ).toEqual(expectedKeys);

  for (const title of expectedKeys) {
    const itemCtx: AssertionContext = { ...context, item: title };

    assertTitle(actual[title], baseline[title], itemCtx);
    assertPrice(actual[title], baseline[title], itemCtx, user);
    assertDescription(actual[title], baseline[title], itemCtx);
    assertImgSrc(actual[title], baseline[title], itemCtx);
    assertBtnText(actual[title], baseline[title], itemCtx);
  }
}



/**
 * Validates sorting behavior for a user.
 */
/**
 * Returns the expected sorted inventory, user-capabilities aware.
 */
export async function validateInventorySorting(
  inventoryPage: InventoryPage,
  user: User,
  key: string
) {
  const baseline = normalizeInventoryRecord(
    readDataFromFile(key, "inventory")
  );

  for (const sortKey of Object.keys(sortMapping) as SortKey[]) {
    if (!shouldValidateSort(sortKey, user)) {
      continue;
    }

    if (sortKey !== "default") {
      await inventoryPage.sortSelect.selectOption(sortKey);
    }

    if (user.capabilities.sort.alertsOnSort) { 
      inventoryPage.handlePageAlert()
    }

    const actual = normalizeInventoryRecord(
      await inventoryPage.getInventoryData()
    );

    const option = sortMapping[sortKey];

    const actualOrder = option
      ? projectField(actual, option.field)
      : Object.values(actual).map(i => i.title);

    const expectedOrder = getExpectedSortOrder(
      baseline,
      sortKey
    );

    expect(
      actualOrder,
      `[Sorting] Sort: ${sortKey} | user=${key}\n` +
      `Expected: ${expectedOrder}\n` +
      `Actual:   ${actualOrder}`
    ).toEqual(expectedOrder);
  }
}
