// page-objects/inventoryPage.ts
import { BasePage } from "./basePage";
import { InventoryItem } from "./inventoryItemPage";
import { Locator, Page, expect } from "@playwright/test";
import urls from "../test-data/url/urls.qa.json";
import type { InventoryItemData } from "../types/inventoryItemData";
import { SortKey } from "../types/inventory-item";
import { writeDataToFile } from "../helpers/general";

export class InventoryPage extends BasePage {
  url = urls.inventory;
  pageReadyLocator = this.page.locator("[data-test='title']");
  readonly inventoryItems: Locator;
  readonly shoppingCartBadge = this.page.locator(
    "[data-test='shopping-cart-badge']"
  );
  readonly shoppingCartLink = this.page.locator(".shopping_cart_link");
  readonly sortSelect = this.page.locator(
    "[data-test='product-sort-container']"
  );
  readonly burgerMenuButton = this.page.getByRole("button", {
    name: "Open Menu",
  });

  constructor(page: Page) {
    super(page);
    this.inventoryItems = this.page.locator(".inventory_item");
  }

  // --- UI DATA EXTRACTION ---

  async getItems(): Promise<InventoryItem[]> {
    // await this.waitForInventoryCount(6)
    const count = await this.inventoryItems.count();
    console.log(`=====` + count);
    return Array.from(
      { length: count },
      (_, i) => new InventoryItem(this.inventoryItems.nth(i))
    );
  }

  async getInventoryData(): Promise<Record<string, InventoryItemData>> {
    const items = await this.getItems();
    const data = await Promise.all(items.map((item) => item.getData()));

    return Object.fromEntries(data.map((item) => [item.title.trim(), item]));
  }

  // --- HIGH-LEVEL ACTIONS ---

  async generateInventoryDatasetByUser(key: string) {
    const data = await this.getInventoryData();
    writeDataToFile(key, "inventory", data);
  }

  async getItemByTitle(title: string): Promise<InventoryItem> {
    const locator = this.inventoryItems.filter({ hasText: title }).first();

    await expect(locator, `Inventory item "${title}" is visible`).toBeVisible();

    return new InventoryItem(locator);
  }

  async addItemToCart(title: string): Promise<void> {
    const item = await this.getItemByTitle(title);
    await item.addToCart();
  }

  async removeItemFromCart(title: string): Promise<void> {
    const item = await this.getItemByTitle(title);
    await item.removeFromCart();
  }

  async getCartBadgeCount(): Promise<number> {
    if (!(await this.shoppingCartBadge.isVisible())) {
      return 0;
    }
    return Number(await this.shoppingCartBadge.textContent());
  }
}
