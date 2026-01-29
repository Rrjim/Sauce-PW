import { CartPage } from "../../page-objects/cartPage"
import { CheckoutOverviewPage } from "../../page-objects/checkoutOverview.Page"
import { CheckoutPage } from "../../page-objects/checkoutPage"
import { InventoryPage } from "../../page-objects/inventoryPage"
import { LoginPage } from "../../page-objects/loginPage"

export interface PageManagerType {
  onLoginPage(): LoginPage
  onInventoryPage(): InventoryPage
  onCartPage(): CartPage
  onCheckoutPage(): CheckoutPage
  onCheckoutOverviewPage(): CheckoutOverviewPage
}
