// Class representing a single inventory item
import { InventoryItemData } from "../../../utils/types/inventory-item";
import { BaseItem } from "./baseItem";

export class InventoryItem extends BaseItem {
  async imageSrc(): Promise<string> {
    return (await this.item.locator("img.inventory_item_img").getAttribute("src"))
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

  async getData(): Promise<InventoryItemData> {
    return {
      title: await this.title(),
      description: await this.description(),
      price: await this.price(),
      imgSrc: await this.imageSrc(),
      buttonText: await this.buttonText(),
    };
  }
}
