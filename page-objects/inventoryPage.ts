import { BasePage } from "./basePage";
import { Page } from "@playwright/test";
import urls from "../test-data/url/urls.qa.json";
import { InventoryItem } from "./components/individual/inventoryItem";
import { ItemList } from "./components/list/itemList";
import { CartPage } from "./cartPage";
import { PageManager } from "./pageManager";

export class InventoryPage extends BasePage {
  url = urls.inventory;
  pageReadyLocator = this.page.locator("[data-test='title']");

  readonly items: ItemList<InventoryItem>;
  readonly shoppingCartBadge = this.page.locator("[data-test='shopping-cart-badge']");
  readonly shoppingCartLink = this.page.locator("[data-test='shopping-cart-link']");

  readonly sortSelect = this.page.locator("[data-test='product-sort-container']");
  readonly burgerMenuButton = this.page.getByRole("button", { name: "Open Menu" });

  constructor(page: Page, pageManager: PageManager) {
    super(page, pageManager);
    this.items = new ItemList(page, InventoryItem);
  }

  async getCartBadgeCount(): Promise<number> {
    if (!(await this.shoppingCartBadge.isVisible())) return 0;
    return Number(await this.shoppingCartBadge.textContent());
  }

  private async clickOnCartButton(): Promise<void> {
    await this.shoppingCartLink.click();
  }

  async goToCart(): Promise<CartPage> {
  await this.shoppingCartLink.click();
  const cartPage = this.pageManager.onCartPage();
  await cartPage.assertPageLoaded();
  return cartPage;
}

}
