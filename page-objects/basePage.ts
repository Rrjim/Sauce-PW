import { Page, Locator, expect } from "@playwright/test";

export abstract class BasePage {
  protected readonly page: Page;
  protected abstract readonly url: string;
  protected abstract readonly pageReadyLocator: Locator;

  constructor(page: Page) {
    this.page = page;
  }

  async open() {
    await this.page.goto(this.url);
  }

  async isPageLoaded() {
      await expect(this.pageReadyLocator).toBeVisible();
  }

  async assertPageUrl() {
      await expect(this.page).toHaveURL(this.url);
  }

  // --- Abstract method ---
  // If a page has extra checks (like multiple key elements), it can implement this
  // abstract assertPageReady(): Promise<void>;
}
