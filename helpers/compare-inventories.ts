import { InventoryItemData } from "../types/inventory-item";
import { User } from "../types/login";
import { toItemMap } from "./inventory";
import {
  ItemAssertion,
  assertItemExists,
} from "./inventory-assertions";

export function compareInventories(
  actualData: InventoryItemData[],
  expectedData: InventoryItemData[],
  user: User,
  context: string,
  assertions: ItemAssertion[]
) {
  const actualMap = toItemMap(actualData);
  const expectedMap = toItemMap(expectedData);

  for (const [title, expected] of expectedMap) {
    const actual = actualMap.get(title);

    assertItemExists(actual, title, context);
    if (!actual) continue;

    for (const assertFn of assertions) {
      assertFn(
        actual,
        expected,
        `${context} → "${title}"`,
        user
      );
    }
  }
}
