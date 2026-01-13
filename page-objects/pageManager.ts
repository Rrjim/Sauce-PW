// page-objects/pageManager.ts
import { Page } from '@playwright/test'
import { LoginPage } from './loginPage'
import { InventoryPage } from './inventoryPage'

export class PageManager {
  private loginPage?: LoginPage
  private inventoryPage?: InventoryPage

  constructor(private readonly page: Page) {}

  getPage(): Page {
    return this.page;
  }

  onLoginPage() {
    if (!this.loginPage) this.loginPage = new LoginPage(this.page)
    return this.loginPage
  }

  onInventoryPage() {
    if (!this.inventoryPage) this.inventoryPage = new InventoryPage(this.page)
    return this.inventoryPage
  }
}
