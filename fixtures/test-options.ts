// fixtures/test-options.ts
import { test as base } from '@playwright/test'
import { PageManager } from '../page-objects/pageManager'

export const test = base.extend<{ pageManager: PageManager }>({

  // --- PageManager fixture ---
  pageManager: async ({ page }, use) => {
    const pm = new PageManager(page)
    await use(pm)
  },
})
