// page-objects/pageManager.ts
import { Page } from '@playwright/test'
import { LoginPage } from './loginPage'
import { InventoryPage } from './inventoryPage'
import { CartPage } from './cartPage'
import { CheckoutPage } from './checkoutPage'
import { CheckoutOverviewPage } from './checkoutOverview.Page'

export class PageManager {
  private loginPage?: LoginPage
  private inventoryPage?: InventoryPage
  private cartPage?: CartPage
  private checkoutPage?: CheckoutPage
  private checkoutOverviewPage?: CheckoutOverviewPage

  constructor(private readonly page: Page) {}

  getPage(): Page {
    return this.page;
  }

  onLoginPage() {
    if (!this.loginPage) this.loginPage = new LoginPage(this.page, this)
    return this.loginPage
  }

  onInventoryPage() {
    if (!this.inventoryPage) this.inventoryPage = new InventoryPage(this.page, this)
    return this.inventoryPage
  }

  onCartPage() {
    if (!this.cartPage) this.cartPage = new CartPage(this.page, this)
    return this.cartPage
  }

  onCheckoutPage() {
    if (!this.checkoutPage) this.checkoutPage = new CheckoutPage(this.page, this)
    return this.checkoutPage
  }

  onCheckoutOverviewPage() {
    if(!this.checkoutOverviewPage) this.checkoutOverviewPage = new CheckoutOverviewPage(this.page, this)
    return this.checkoutOverviewPage
  }
}
