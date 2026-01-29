import { test } from "../../fixtures/test-options";
import userData from "../../test-data/user/users.qa.json";
import { UserMap } from "../../utils/types/login";
import { performLoginFlow } from "../../helpers/login";
import {
  validateInventoryIntegrity,
  validateInventorySorting,
} from "../../helpers/inventory-validate";
import { runCartScenario } from "../../helpers/state-machines/cart-runner";
import { buildFullCartScenario } from "../../helpers/cart";
import { readDataFromFile } from "../../helpers/resource-data-config";
import { InventoryItemData } from "../../utils/types/inventory-item";
import { isSuccessfulUser } from "../../utils/type-guards/guards";

const users = userData as UserMap;

test.describe.parallel("Inventory – Integrity", () => {
  for (const [key, user] of Object.entries(users)) {
    if (!isSuccessfulUser(user)) continue;

    test(`Inventory integrity is correct for ${key}`, async ({ pageManager }) => {
      const inventoryPage = await performLoginFlow(pageManager, user, key);
      const expectedData: Record<string, InventoryItemData> = readDataFromFile(key, "inventory");
      await validateInventoryIntegrity(inventoryPage, user, expectedData, {
        feature: "Inventory",
        scenario: "Integrity",
        user: key,
      });
    });
  }
});


test.describe("Inventory – Sorting", () => {
  // _ is a conventional name for “I’m intentionally not using this”.
  Object.entries(users).forEach(([key, user]) => {
    if (!isSuccessfulUser(user)) return;

    test(`Sorting works for ${key}`, async ({ pageManager }) => {
      const inventoryPage = await performLoginFlow(pageManager, user, key);
      await validateInventorySorting(inventoryPage, user, key);
    });
  });
});

test.describe("Inventory – Cart behavior", () => {
  Object.entries(users).forEach(([key, user]) => {
    if (!isSuccessfulUser(user)) return; // narrow type here
    test(`Cart cart Add/ Remove works for ${key}`, async ({ pageManager }) => {
      const inventoryPage = await performLoginFlow(pageManager, user, key);

      const addAndRemoveActions = buildFullCartScenario(user, key);
      await runCartScenario(inventoryPage, user, addAndRemoveActions);
    });
  });
});
