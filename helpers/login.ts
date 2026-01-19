import { InventoryPage } from "../page-objects/inventoryPage";
import { PageManager } from "../page-objects/pageManager";
import { User } from "../types/login";

export async function loginAndOpenInventory(
  pageManager: PageManager,
  user: User
): Promise<InventoryPage> {
  const loginPage = pageManager.onLoginPage();
  const inventoryPage = pageManager.onInventoryPage();

  const password =
    process.env[user.passwordKey] ?? user.passwordKey;

  await loginPage.open();
  await loginPage.login(user.username, password);
  await inventoryPage.assertPageUrl();
  await inventoryPage.isPageLoaded();

  return inventoryPage;
}
