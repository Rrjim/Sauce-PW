import { Locator } from "@playwright/test";
import { InventoryItemData } from "../types/inventory-item";

// Class representing a single inventory item
export class InventoryItem {
  constructor(private readonly item: Locator) {}

  async titleText(): Promise<string> {
    return (await this.item.locator(".inventory_item_name").textContent())!;
  }

  async descriptionText(): Promise<string> {
    return (await this.item.locator(".inventory_item_desc").textContent())!;
  }

  async priceText(): Promise<string> {
    return (await this.item.locator(".inventory_item_price").textContent())!;
  }

  async imageSrc(): Promise<string | null> {
    return this.item
      .locator("img.inventory_item_img")
      .getAttribute("src");
  }

  async buttonText(): Promise<string> {
    return this.item.locator("button").innerText();
  }

  async addToCart(): Promise<void> {
    await this.item.getByRole("button", { name: /add to cart/i }).click();
  }

  async removeFromCart(): Promise<void> {
    await this.item.getByRole("button", { name: /remove/i }).click();
  }

  async getData(): Promise<InventoryItemData> {
    const [title, description, price, imgSrc, buttonText] = await Promise.all([
      this.titleText(),
      this.descriptionText(),
      this.priceText(),
      this.imageSrc(),
      this.buttonText(),
    ]);

    return { title, description, price, imgSrc, buttonText };
  }
}

