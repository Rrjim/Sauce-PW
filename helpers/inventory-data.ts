import { BaseItemData, InventoryItemData, OptionalFields, SortableField, SortKey } from "../utils/types/inventory-item";
import { CartCapabilities } from "../utils/types/login";
import { sortMapping } from "../utils/types/inventory-item";
import { Normalized } from "../utils/types/general";

export function normalizeRecord<T extends BaseItemData>(
  record: Record<string, T>
): Record<string, Normalized<T>> {
  return Object.fromEntries(
    Object.entries(record).map(([_, item]) => [
      item.title.trim(),
      {
        ...item,
        title: item.title.trim(),
        description: item.description.trim(),
        price: item.price.replace("$", "").trim(),
        imgSrc: (item as any).imgSrc ?? null,
        buttonText: (item as any).buttonText ?? null,
      },
    ])
  );
}


/**
 * 
 * @param allItems Inventory Items
 * @param cartCaps  Capabilities of user regarding cart actions
 * @returns An array of titles
 */
export const getCartTestItems = (
  allItems: Record<string, InventoryItemData>,
  cartCaps: CartCapabilities,
): string[] =>
  cartCaps.limitedItems?.length
    ? cartCaps.limitedItems
    : Object.values(allItems).map((i) => i.title.trim());

/**
 * 
 * @param record Inventory Items
 * @param field Field to sort
 * @returns Either an array of strings or number, it depends on which field we want to use for sorting
 */
export function projectField<T extends BaseItemData>(
  record: Record<string, T>,
  field: SortableField,
): (string | number)[] {
  const items = Object.values(record);

  return field === "price"
    ? items.map((i) => Number(i.price))
    : items.map((i) => i.title);
}



/**
 * 
 * @param baseline Our dataset (expected data)
 * @param sortKey How to sort
 * @returns Sorted Array 
 */
export function getExpectedSortOrder<T extends BaseItemData>(
  baseline: Record<string, T>,
  sortKey: SortKey,
): (string | number)[] {
  const option = sortMapping[sortKey];
  if (!option) return Object.values(baseline).map((i) => i.title);

  const projected = projectField(baseline, option.field);

  const sorted = [...projected].sort((a, b) =>
    a < b ? -1 : a > b ? 1 : 0
  );

  return option.descending ? sorted.reverse() : sorted;
}



// Normalize

/** Object.entries turns an object int an aray of [key, value] pairs */
/**
 * Example Input
 * {
  "  Sauce Labs Backpack ": {
    title: "  Sauce Labs Backpack ",
    description: "  A red backpack  ",
    price: "$29.99 "
  }
}
 */

/**
 * Example Output
 * [
  ["  Sauce Labs Backpack ", { title: "  Sauce Labs Backpack ", description: "  A red backpack  ", price: "$29.99 " }]
]
 */

/** 
 * map Method
 * ([title, item]) => …

Destructures the [key, value] array into:

title → the original key

item → the InventoryItemData object

title.trim()

Removes leading/trailing whitespace from the object key.

{ ...item, ... }

Copies all existing properties from the item (spread syntax)

Then overwrites title, description, and price with cleaned values:

title: item.title.trim() → removes spaces from the item’s title

description: item.description.trim() → removes spaces from description

price: item.price.replace("$", "").trim() → removes $ sign and any spaces
 */

/**
 * Result of map
 * [
  "Sauce Labs Backpack",
  {
    title: "Sauce Labs Backpack",
    description: "A red backpack",
    price: "29.99"
  }
]
 */

/** Finally we convert it back to an Object using:
 * Object.fromEntries(...)
 */

/**
 * {
  "Sauce Labs Backpack": {
    title: "Sauce Labs Backpack",
    description: "A red backpack",
    price: "29.99"
  }
}
 */