import { test } from "../../fixtures/test-options";
import userData from "../../test-data//user/users.qa.json";
import { UserMap } from "../../types/login";
import { loginAndOpenInventory } from "../../helpers/login";
import { getCartTestItems, validateAddToCart, validateInventoryIntegrity, validateInventorySorting } from "../../helpers/inventory";
import { readInventoryDataFromFile } from "../../helpers/general";
import { runCartScenario } from "../../helpers/state-machines/cart-runner";
import { fullCartLifecycle } from "../../helpers/cart";
import { timeout } from "rxjs-compat/operator/timeout";
import { $ } from "@faker-js/faker/dist/airline-DF6RqYmq";
import { InventoryItemData } from "../../types/inventory-item";

const users = userData as UserMap;

test.describe("Inventory – Integrity", () => {
  Object.entries(users)
    .filter(([_, u]) => u.expect === "successful")
    .forEach(([key, user]) => {
      test(`Inventory integrity is correct for ${key}`, async ({ pageManager }) => {
        const inventoryPage = await loginAndOpenInventory(
          pageManager,
          user
        );

        const actualData = await inventoryPage.getInventoryData();
        const expectedData = readInventoryDataFromFile(
          key,
          "inventory"
        );

        validateInventoryIntegrity(
          actualData,
          expectedData,
          user,
          {
            feature: "Inventory",
            scenario: "Integrity",
            user: key, // must be string, not User object
          }
        );
      });
    });
});



test.describe("Inventory – Sorting", () => {
  Object.entries(users)
    .filter(([_, u]) => u.expect === "successful")
    .forEach(([key, user]) => {
      test(`Sorting works for ${key}`, async ({ pageManager }) => {
        const inventoryPage = await loginAndOpenInventory(
          pageManager,
          user
        );
        // --- assert sorting ---
        await validateInventorySorting(
          inventoryPage,
          user,
          key,
        );
      });
    });
});


test.describe("Inventory – Cart behavior", () => {
  Object.entries(users)
    .filter(([_, u]) => u.expect === "successful")
    .forEach(([key, user]) => {
      test(`Cart lifecycle works for ${key}`, async ({ pageManager }) => {
        const inventoryPage = await loginAndOpenInventory(
          pageManager,
          user
        );

        const fileData = readInventoryDataFromFile(key, "inventory");
        const titles = getCartTestItems(
          fileData,
          user.capabilities.cart
        );

        await runCartScenario(
          inventoryPage,
          user,
          fullCartLifecycle(titles)
        );
      });
    });
});


