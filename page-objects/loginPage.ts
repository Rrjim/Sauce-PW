// page-objects/LoginPage.ts
import { expect } from "@playwright/test";
import { BasePage } from "./basePage";
import urls from "../test-data/url/urls.qa.json";

export class LoginPage extends BasePage {
  url = urls.login;
  pageReadyLocator = this.page.locator(".login_logo");
  readonly usernameInput = this.page.locator('[data-test="username"]');
  readonly passwordInput = this.page.locator('[data-test="password"]');
  readonly loginButton = this.page.locator('[data-test="login-button"]');
  readonly errorMessage = this.page.locator('[data-test="error"]');

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async expectError(text: string) {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toHaveText(text);
  }

}
