// test-helpers/inventory-helpers.ts
import { expect } from "@playwright/test";
import { InventoryPage } from "../page-objects/inventoryPage";
import {
  AssertionContext,
  InventoryItemData,
  ItemAssertion,
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

export function validateInventoryIntegrity(
  actual: Record<string, InventoryItemData>,
  expected: Record<string, InventoryItemData>,
  user: User,
  context: Omit<AssertionContext, "item">
) {
  const actualNorm = normalizeInventoryRecord(actual);
  const expectedNorm = normalizeInventoryRecord(expected);

  const actualKeys = Object.keys(actualNorm);
  const expectedKeys = Object.keys(expectedNorm);

  expect(
    actualKeys,
    `[Inventory] Item set for | user=${context.user} \n Actual: ${actualKeys} | \n Expected: ${expectedKeys} |`
  ).toEqual(expectedKeys);

  // 2️⃣ Field-level assertions
  for (const title of expectedKeys) {
    const actualItem = actualNorm[title];
    const expectedItem = expectedNorm[title];

    const itemCtx: AssertionContext = {
      ...context,
      item: title,
    };

    assertTitle(actualItem, expectedItem, itemCtx);
    assertPrice(actualItem, expectedItem, itemCtx, user);
    assertDescription(actualItem, expectedItem, itemCtx);
    assertImgSrc(actualItem, expectedItem, itemCtx);
    assertBtnText(actualItem, expectedItem, itemCtx);
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
    readInventoryDataFromFile(key, "inventory")
  );

  for (const sortKey of Object.keys(sortMapping) as SortKey[]) {
    if (!shouldValidateSort(sortKey, user)) {
      continue;
    }

    if (sortKey !== "default") {
      await inventoryPage.selectSort(sortKey, user);
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
