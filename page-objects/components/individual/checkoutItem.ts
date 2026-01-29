import { Locator } from "@playwright/test";
import { BaseItemData, CheckoutItemData } from "../../../utils/types/inventory-item";
import { BaseItem } from "./baseItem";

export class CheckoutItem extends BaseItem {

  async quantity(): Promise<number> {
    const locator = this.item.locator("[data-test='item-quantity']");
    return (await locator.count()) ? Number(await locator.innerText()) : 1;
  }

  async getData(): Promise<CheckoutItemData> {
    return {
      title: await this.title(),
      description: await this.description(),
      price: await this.price(),
      quantity: await this.quantity(),
    };
  }}
