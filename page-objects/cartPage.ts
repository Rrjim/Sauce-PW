import { BasePage } from "./basePage";
import { Page } from "@playwright/test";
import urls from "../test-data/url/urls.qa.json";
import { CartItem } from "./components/individual/cartItem";
import { ItemList } from "./components/list/itemList";
import { CartItemData } from "../utils/types/inventory-item";
import { PageManager } from "./pageManager";
import { CheckoutPage } from "./checkoutPage";
import { ItemPage } from "../utils/types/general";

export class CartPage extends BasePage implements ItemPage<CartItemData> {
  url = urls.cart;
  pageReadyLocator = this.page.locator("[data-test='title']");
  readonly items: ItemList<CartItem, CartItemData>;
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
    for (const [title, item] of Object.entries(data)) {
      quantities[title] = item.quantity;
    }
    return quantities;
  }
}
