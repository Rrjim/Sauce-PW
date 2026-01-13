import { Page, Locator, expect } from '@playwright/test';

export class HelperBase {

  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // ---------- waits ----------

  async waitForSeconds(seconds: number) {
    await this.page.waitForTimeout(seconds * 1000);
  }

  async waitForVisible(locator: Locator) {
    await expect(locator).toBeVisible();
  }

  async waitForHidden(locator: Locator) {
    await expect(locator).toBeHidden();
  }

  // ---------- actions ----------

  async click(locator: Locator) {
    await this.waitForVisible(locator);
    await locator.click();
  }

  async fill(locator: Locator, value: string) {
    await this.waitForVisible(locator);
    await locator.fill(value);
  }

  async clearAndFill(locator: Locator, value: string) {
    await this.waitForVisible(locator);
    await locator.fill('');
    await locator.fill(value);
  }

  // ---------- assertions ----------

  async expectText(locator: Locator, text: string) {
    await expect(locator).toHaveText(text);
  }

  async expectContainsText(locator: Locator, text: string) {
    await expect(locator).toContainText(text);
  }
}

