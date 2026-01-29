import { BasePage } from "../page-objects/basePage";
import { CartPage } from "../page-objects/cartPage";
import { CheckoutOverviewPage } from "../page-objects/checkoutOverview.Page";
import { InventoryPage } from "../page-objects/inventoryPage";
import { LoginPage } from "../page-objects/loginPage";
import { PageManager } from "../page-objects/pageManager";
import { ItemPage } from "../utils/types/general";
import { BaseItemData, PriceScope } from "../utils/types/inventory-item";


export function getPriceScope<T extends BaseItemData>(
  page: BasePage & ItemPage<T>
): PriceScope {
  return page instanceof CheckoutOverviewPage ? "checkout" : "unstable";
}

