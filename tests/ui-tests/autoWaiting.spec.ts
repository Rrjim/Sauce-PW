import {test, expect} from '@playwright/test'

test.beforeEach(async({page}, testInfo) => {
    await page.goto(process.env.URL)
    await page.getByText('Button Triggering AJAX Request').click()
    // raise the timeout for the tests of this particular suite
    // testInfo.setTimeout(testInfo.timeout + 2000)
})

test('auto waiting', async({page}) => {
    const successButton = page.locator('.bg-success')

    await successButton.waitFor({state: "attached"})
    const text = await successButton.allTextContents()

    expect(text).toContain('Data loaded with AJAX get request.')

    await expect(successButton).toHaveText('Data loaded with AJAX get request.', {timeout: 20000})
    
})


test('alternative waits', async({page}) => {
    const successButton = page.locator('.bg-success')

    // wait for element
    await page.waitForSelector('.bg-success')

    // wait for particular response
    await page.waitForResponse('http://uitestingplayground.com/ajaxdata')

    // wait for network calls to be completed ('NOT RECOMMENDED')
    await page.waitForLoadState('networkidle')

    // hardcoded wait ('NOT RECOMMENDED')
    await page.waitForTimeout(5000)


    const text = await successButton.allTextContents()

    expect(text).toContain('Data loaded with AJAX get request.')
})

test('timeouts', async ({page}) => {
    // test.setTimeout(100000)
    
    const successButton = page.locator('.bg-success')
    await successButton.click()
    // await successButton.click({timeout: 30000})

})