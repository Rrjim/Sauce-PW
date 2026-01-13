// page-objects/inventoryPage.ts
import { BasePage } from "./basePage";
import { expect, Locator, Page } from "@playwright/test";
import urls from "../test-data/urls.qa.json";

export class InventoryPage extends BasePage {

  protected readonly url = urls.inventory;
  protected readonly pageReadyLocator = this.page.locator('.inventory_list');
}

