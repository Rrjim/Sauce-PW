import { Locator } from "@playwright/test";
import { BaseItemData } from "../../../utils/types/inventory-item";

export abstract class BaseItem {
  constructor(protected readonly item: Locator) {}

  async title(): Promise<string> {
    return (await this.item.locator("[data-test='inventory-item-name']").textContent())!;
  }

  async description(): Promise<string> {
    return (await this.item.locator("[data-test='inventory-item-desc']").textContent())!;
  }

  async price(): Promise<string> {
    return (await this.item.locator("[data-test='inventory-item-price']").textContent())!;
  }

  // Each subclass must implement its own getData()
  abstract getData(): Promise<BaseItemData>;
}
