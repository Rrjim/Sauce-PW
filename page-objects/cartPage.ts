import { BasePage } from "./basePage";
import { Page } from "@playwright/test";
import urls from "../test-data/url/urls.qa.json";
import { CartItem } from "./components/individual/cartItem";
import { ItemList } from "./components/list/itemList";
import { CartItemData } from "../utils/types/inventory-item";
import { PageManager } from "./pageManager";
import { CheckoutPage } from "./checkoutPage";

export class CartPage extends BasePage {
  url = urls.cart;
  pageReadyLocator = this.page.locator("[data-test='title']");
  readonly items: ItemList<CartItem>;
  readonly checkOutButton = this.page.getByRole("button", { name: "checkout" });
  readonly continueShoppingButton = this.page.getByRole("button", {
    name: "continue-shopping",
  });

  constructor(page: Page, pageManager: PageManager) {
    super(page, pageManager);
    this.items = new ItemList(page, CartItem);
  }

  async goToCheckout(): Promise<CheckoutPage> {
    await this.checkOutButton.click();
    const checkoutPage = this.pageManager.onCheckoutPage();
    await checkoutPage.assertPageLoaded();
    return checkoutPage;
  }

  async getItemQuantities(): Promise<Record<string, number>> {
    const data = await this.items.getData();
    const quantities: Record<string, number> = {};
    // CartItemData cast is mandatory here to say that our data items has quantity property
    for (const [title, item] of Object.entries(data) as [
      string,
      CartItemData,
    ][]) {
      quantities[title] = item.quantity;
    }
    return quantities;
  }
}
