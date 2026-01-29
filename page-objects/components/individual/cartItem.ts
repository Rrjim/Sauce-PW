import { CartItemData } from "../../../utils/types/inventory-item";
import { BaseItem } from "./baseItem";

export class CartItem extends BaseItem {
  async quantity(): Promise<number> {
    const locator = this.item.locator("[data-test='item-quantity']");
    return (await locator.count()) ? Number(await locator.innerText()) : 1;
  }

    async buttonText(): Promise<string> {
    return (await this.item.locator("button").innerText())
  }

  async addToCart() {
    await this.item.getByRole("button", { name: /add to cart/i }).click();
  }

  async removeFromCart() {
    await this.item.getByRole("button", { name: /remove/i }).click();
  }

  async getData(): Promise<CartItemData> {
    return {
      title: await this.title(),
      description: await this.description(),
      price: await this.price(),
      buttonText: await this.buttonText(),
      quantity: await this.quantity(),
    };
  }
}
