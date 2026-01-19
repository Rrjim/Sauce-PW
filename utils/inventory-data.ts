import { Page } from "@playwright/test";
import fs from "fs";
import { InventoryPage } from "../page-objects/inventoryPage";

export async function extractInventoryData(page: Page, key: string) {
  const items = page.locator(".inventory_item");
  const count = await items.count();

  const itemsData = [];

  for (let i = 0; i < count; i++) {
    const item = items.nth(i);

    itemsData.push({
      title: await item.locator(".inventory_item_name").innerText(),
      description: await item.locator(".inventory_item_desc").innerText(),
      price: await item.locator(".inventory_item_price").innerText(),
      imgSrc: await item.locator("img.inventory_item_img").getAttribute("src"),
      buttonText: await item.locator("button").innerText(),
    });
  }

  // Write the JSON file
  fs.writeFileSync(
    key + "-inventory-data.json",
    JSON.stringify(itemsData, null, 2)
  );
}
