import { PageManager } from "../page-objects/pageManager";
import { LoginPage } from "../page-objects/loginPage";
import { InventoryPage } from "../page-objects/inventoryPage";
import { User } from "../utils/types/login";
import { InventoryItemData } from "../utils/types/inventory-item";
import { writeDataToFile } from "./resource-data-config";
import { argosScreenshot } from "@argos-ci/playwright";

// --- Overloads ---
export async function performLoginFlow(
  pageManager: PageManager,
  user: User & { expect: "successful" },
  key: string
): Promise<InventoryPage>;

export async function performLoginFlow(
  pageManager: PageManager,
  user: User & { expect: "unsuccessful" },
  key: string
): Promise<LoginPage>;

// --- Implementation ---
export async function performLoginFlow(
  pageManager: PageManager,
  user: User,
  key: string
): Promise<InventoryPage | LoginPage> {
  const loginPage = pageManager.onLoginPage();
  await loginPage.open();

  const password = process.env[user.passwordKey] ?? user.passwordKey;
  await loginPage.login(user.username, password);

  if (user.expect === "successful") {
    const inventoryPage = pageManager.onInventoryPage();
    await inventoryPage.assertPageLoaded();

    if (process.env.GENERATE_INVENTORY_DATA === "true") {
      const data: Record<string, InventoryItemData> =
        await inventoryPage.items.getData();
      writeDataToFile(key, "inventory", data);
    }

    await argosScreenshot(pageManager.getPage(), `Login Scenarios - ${key}`);
    return inventoryPage;
  } else {
    await loginPage.expectError(user.errorText!);
    await argosScreenshot(pageManager.getPage(), `Login Scenarios - ${key}`);
    return loginPage;
  }
}
