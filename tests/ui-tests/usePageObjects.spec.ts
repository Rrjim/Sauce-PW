import {test, expect} from '@playwright/test'
import { PageManager } from '../../page-objects/pageManager'
import {faker} from '@faker-js/faker'
import { argosScreenshot } from '@argos-ci/playwright'

test.beforeEach(async({page}) => {
    await page.goto('/')
})

// run with "npx playwright test --project=chromium --grep @smoke"
test('navigate to form page @smoke', async({page}) => {
    const pm = new PageManager(page)
    await pm.navigateTo().formLayoutsPage()
    await pm.navigateTo().datepickerPage()
    await pm.navigateTo().smartTablePage()
    await pm.navigateTo().toastrPage()
    await pm.navigateTo().tooltipPage()
})

test('parametrized methods @smoke @regression', async({page}) => {
    const pm = new PageManager(page)
    const randomFullName = faker.person.fullName()
    const randomEmail = `${randomFullName.replace(' ', '')}${faker.number.int(1000)}@test.com`
    await pm.navigateTo().formLayoutsPage()
    await pm.onFormLayoutsPage().submitUsingTheGridFormWithCredentialsAndSelectOption(process.env.USERNAME, process.env.PASSWORD, 'Option 2')
    await page.screenshot({path: 'screenshots/formsLayoutsPage.png'})
    const buffer = await page.screenshot()
    console.log(buffer.toString('base64'))
    await pm.onFormLayoutsPage().submitInlineFormWithNameEmailAndCheckbox(randomFullName, randomEmail, true)
    await page.locator('nb-card', {hasText: "Inline form"}).screenshot({path:'screenshots/inlineForm.png'})
    await pm.navigateTo().datepickerPage()
    await pm.onDatepickerPage().selectCommonDatePickerDateFromToday(4)
    await pm.onDatepickerPage().selectCommonDatePickerWithRangeFromToday(1, 12)
})


test('test with argos ci', async({page}) => {
    const pm = new PageManager(page)
    await pm.navigateTo().formLayoutsPage()
    await argosScreenshot(page, "form layouts page")
    await pm.navigateTo().datepickerPage()
    await argosScreenshot(page, "datepicker page");
})
