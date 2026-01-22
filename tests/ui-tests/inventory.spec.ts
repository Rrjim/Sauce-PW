import { test } from "../../fixtures/test-options";
import userData from "../../test-data//user/users.qa.json";
import { UserMap } from "../../types/login";
import { loginAndOpenInventory } from "../../helpers/login";
import {
  getCartTestItems,
  validateInventoryIntegrity,
  validateInventorySorting,
} from "../../helpers/inventory";
import { readDataFromFile } from "../../helpers/general";
import { runCartScenario } from "../../helpers/state-machines/cart-runner";
import { fullCartLifecycle } from "../../helpers/cart";
import { InventoryItemData } from "../../types/inventory-item";

const users = userData as UserMap;

test.describe("Inventory – Integrity", () => {
  for (const [key, user] of Object.entries(users)) {
    if (user.expect === "unsuccessful") continue;

    test(`Inventory integrity is correct for ${key}`, async ({
      pageManager,
    }) => {
      const inventoryPage = await loginAndOpenInventory(pageManager, user);

      await validateInventoryIntegrity(inventoryPage, user, key, {
        feature: "Inventory",
        scenario: "Integrity",
        user: key,
      });
    });
  }
});

test.describe("Inventory – Sorting", () => {
  Object.entries(users)
    .filter(([_, u]) => u.expect === "successful")
    .forEach(([key, user]) => {
      test(`Sorting works for ${key}`, async ({ pageManager }) => {
        const inventoryPage = await loginAndOpenInventory(pageManager, user);
        // --- assert sorting ---
        await validateInventorySorting(inventoryPage, user, key);
      });
    });
});

test.describe("Inventory – Cart behavior", () => {
  Object.entries(users)
    .filter(([_, u]) => u.expect === "successful")
    .forEach(([key, user]) => {
      test(`Cart lifecycle works for ${key}`, async ({ pageManager }) => {
        const inventoryPage = await loginAndOpenInventory(pageManager, user);

        const fileData = readDataFromFile<InventoryItemData>(
          key,
          "inventory"
        );
        const titles = getCartTestItems(fileData, user.capabilities.cart);

        await runCartScenario(inventoryPage, user, fullCartLifecycle(titles));
      });
    });
});
