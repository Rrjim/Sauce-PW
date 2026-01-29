import { expect } from "@playwright/test";
import { InventoryPage } from "../page-objects/inventoryPage";
import {
  AssertionContext,
  BaseItemData,
  OptionalFields,
  SortKey,
} from "../utils/types/inventory-item";
import { User } from "../utils/types/login";
import { readDataFromFile } from "./resource-data-config";
import {
  assertPrice,
  assertProperty,
} from "./inventory-assertions";
import {
  normalizeRecord,
  projectField,
  getExpectedSortOrder,
} from "./inventory-data";
import { CartPage } from "../page-objects/cartPage";
import { CheckoutOverviewPage } from "../page-objects/checkoutOverview.Page";
import { hasButtonText, hasImage } from "../utils/type-guards/guards";
import { getPriceScope } from "./priceScope";
import { ItemPage, PageItem } from "../utils/types/general";
import { BasePage } from "../page-objects/basePage";


export async function validateInventoryIntegrity<
  T extends BaseItemData,
  P extends BasePage & ItemPage<T>
>(
  itemPage: P,
  user: User,
  expectedData: Record<string, T>,
  context: Omit<AssertionContext, "item">,
) {
  const actual = normalizeRecord(await itemPage.items.getData());
  const expected = normalizeRecord(expectedData);
  const priceScope = getPriceScope(itemPage);

  expect(Object.keys(actual)).toEqual(Object.keys(expected));

  for (const title of Object.keys(expected)) {
    const itemCtx: AssertionContext = { ...context, item: title };

    const a = actual[title];
    const e = expected[title];

    // BaseItemData assertions
    assertProperty(a.title, e.title, itemCtx, "Title");
    assertProperty(a.description, e.description, itemCtx, "Description");
    assertPrice(a.price, e.price, itemCtx, user, priceScope);

    // Inventory-only
    if (hasImage(a) && hasImage(e)) {
      assertProperty(a.imgSrc, e.imgSrc, itemCtx, "Image Source");
    }

    // Inventory + Cart
    if (hasButtonText(a) && hasButtonText(e)) {
      assertProperty(a.buttonText, e.buttonText, itemCtx, "Button Text");
    }
  }
}




export async function validateInventorySorting(
  inventoryPage: InventoryPage,
  user: User,
  key: string,
) {
  const baseline = normalizeRecord(
    readDataFromFile(key, "inventory") as Record<
      string,
      BaseItemData & Partial<OptionalFields>
    >,
  );

  const sortMappingModule = (await import("../utils/types/inventory-item"))
    .sortMapping;

  for (const sortKey of Object.keys(sortMappingModule) as SortKey[]) {
    const option = sortMappingModule[sortKey];

    // Decide whether we should validate this sort for the user
    const shouldValidate = (() => {
      if (!option) return true;
      if (!user.capabilities.sort?.sortWorks) return false;
      if (option.field === "price" && !user.capabilities.sort?.priceAccurate)
        return false;
      return true;
    })();

    if (!shouldValidate) continue;

    if (sortKey !== "default") {
      await inventoryPage.sortSelect.selectOption(sortKey);
    }

    if (user.capabilities.sort.alertsOnSort) {
      inventoryPage.handlePageAlert();
    }

    const actual = normalizeRecord(await inventoryPage.items.getData());

    const actualOrder = option
      ? projectField(actual, option.field)
      : Object.values(actual).map((i) => i.title);

    const expectedOrder = getExpectedSortOrder(baseline, sortKey);

    expect(
      actualOrder,
      `[Sorting] Sort: ${sortKey} | user=${key}\n` +
        `Expected: ${expectedOrder}\n` +
        `Actual:   ${actualOrder}`,
    ).toEqual(expectedOrder);
  }
}
