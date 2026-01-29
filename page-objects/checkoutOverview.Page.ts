import { BasePage } from "./basePage";
import { extractNumber } from "../utils/data/string-config";
import { calculateItemsTotal } from "../helpers/priceCalculator";
import type { CartItemData } from "../utils/types/inventory-item";
import urls from "../test-data/url/urls.qa.json";
import { expect, Page } from "@playwright/test";
import { ItemList } from "./components/list/itemList";
import { PageManager } from "./pageManager";
import { CheckoutItem } from "./components/individual/checkoutItem";
import { User } from "../utils/types/login";

export class CheckoutOverviewPage extends BasePage {
  url = urls.checkout;
  pageReadyLocator = this.page.locator("[data-test='title']");
  readonly items: ItemList<CheckoutItem>;
  readonly priceItemTotal = this.page.locator("[data-test='subtotal-label']");
  readonly priceTaxTotal = this.page.locator("[data-test='tax-label']");
  readonly priceTotal = this.page.locator("[data-test='total-label']");
  readonly finishBtn = this.page.locator("[data-test='finish']");

  constructor(page: Page, pageManager: PageManager) {
    super(page, pageManager);
    this.items = new ItemList(page, CheckoutItem);
  }

  async getItemSubtotal(): Promise<number> {
    return extractNumber(await this.priceItemTotal.textContent());
  }

  async getTax(): Promise<number> {
    return extractNumber(await this.priceTaxTotal.textContent());
  }

  async getTotal(): Promise<number> {
    return extractNumber(await this.priceTotal.textContent());
  }

  async assertTotalsMatch(
    expectedItems: Record<string, CartItemData>,
    user: User,
  ) {
    if (!user.capabilities.checkout.priceAccurate) {
      // Explicitly documented skip
      return;
    }

    const expectedSubtotal = calculateItemsTotal(expectedItems);
    const actualSubtotal = await this.getItemSubtotal();
    expect(actualSubtotal).toBe(expectedSubtotal);

    const tax = await this.getTax();
    const total = await this.getTotal();
    expect(total).toBe(expectedSubtotal + tax);
  }

  async finish() {
    await this.finishBtn.click();
  }
}
