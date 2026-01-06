import { test, expect } from "@playwright/test";

test('input fields', async ({ page }, testInfo) => {
  await page.goto("/");

  if (testInfo.project.name == 'mobile')
    await page.locator(".sidebar-toggle").click();
  const formsMenu = page.getByTitle('Forms');
  const formLayouts = page.getByText('Form Layouts')
  console.log(await formsMenu.getAttribute('aria-expanded'))

  if (await page.getByTitle('Forms').getAttribute('aria-expanded') == "false") {
    await formsMenu.click()
    await formLayouts.click()
  }

  if (testInfo.project.name == "mobile")
    await page.locator(".sidebar-toggle").click();
  const usingTheGridEmailInput = page
    .locator("nb-card", { hasText: "Using the Grid" })
    .getByRole("textbox", { name: "Email" });
  await usingTheGridEmailInput.fill("test@test.com");
  await usingTheGridEmailInput.clear();
  await usingTheGridEmailInput.fill("test2@test.com");
});
