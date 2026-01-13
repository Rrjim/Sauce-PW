// fixtures/test-options.ts
import { test as base } from '@playwright/test'
import { PageManager } from '../page-objects/pageManager'

// const users = usersJson as Users

export const test = base.extend<{ pageManager: PageManager }>({

  // --- PageManager fixture ---
  pageManager: async ({ page }, use) => {
    const pm = new PageManager(page)
    await use(pm)
  },

  // --- loginAs fixture (action-only) ---
  // loginAs: async ({ page }, use) => {
  //   await use(async (userKey: UserKey) => {
  //     const user = users[userKey]
  //     const password = process.env[user.passwordKey]

  //     if (!password) throw new Error(`Missing env var: ${user.passwordKey}`)

  //     // Navigate and login
  //     await page.goto('/')
  //     const loginPage = new PageManager(page).onLoginPage()
  //     await loginPage.login(user.username, password)
  //   })
  // }

})
