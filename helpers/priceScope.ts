import { CartPage } from "../page-objects/cartPage";
import { CheckoutOverviewPage } from "../page-objects/checkoutOverview.Page";
import { InventoryPage } from "../page-objects/inventoryPage";
import { PriceScope } from "../utils/types/inventory-item";


export function getPriceScope(
  page: InventoryPage | CartPage | CheckoutOverviewPage
): PriceScope {
  return page instanceof CheckoutOverviewPage ? "checkout" : "unstable";
}