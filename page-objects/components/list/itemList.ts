import { Page, Locator } from "@playwright/test";
import type { BaseItem } from "../individual/baseItem";

export class ItemList<T extends BaseItem, D = any> {
  constructor(
    private readonly page: Page,
    private readonly itemClass: new (locator: Locator) => T,
    private readonly rootSelector = "[data-test='inventory-item']"
  ) {}

  async getItems(): Promise<T[]> {
    const locators = this.page.locator(this.rootSelector);
    const count = await locators.count();
    return Array.from({ length: count }, (_, i) => new this.itemClass(locators.nth(i)));
  }

  async getData(): Promise<Record<string, D>> {
    const items = await this.getItems();
    const data: D[] = await Promise.all(items.map(item => item.getData() as Promise<D>));
    return Object.fromEntries(data.map((item: any) => [item.title.trim(), item]));
  }

  async getItemByTitle(title: string): Promise<T> {
    const locator = this.page.locator(this.rootSelector).filter({ hasText: title }).first();
    return new this.itemClass(locator);
  }

  async addItemToCart(title: string) {
    const item = await this.getItemByTitle(title);
    if ("addToCart" in item) await (item as any).addToCart();
  }

  async removeItemFromCart(title: string) {
    const item = await this.getItemByTitle(title);
    if ("removeFromCart" in item) await (item as any).removeFromCart();
  }
}
