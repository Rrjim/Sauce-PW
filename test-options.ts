import {test as base} from '@playwright/test'
import { PageManager } from '../pw-practice-app/page-objects/pageManager'
import { LoginPage } from './page-objects/loginPage'

export type TestOptions = {
    globalsQaURL: string
    formLayoutsPage: string
    pageManager: PageManager
}

export const test = base.extend<TestOptions>({
    globalsQaURL: ['', {option: true}],

    formLayoutsPage: async({page}, use) => {
        await page.goto('/')
        await page.getByText('Forms').click()
        await page.getByText('Form Layouts').click()
        // formLayoutsPage feature string activation
        await use('')
        console.log('Tear down')
    },
    // create a fixture for launching it for every test before beforeEach/ beforeAll hooks
    //     formLayoutsPage: [async({page}, use) => {
    //     await page.goto('/')
    //     await page.getByText('Forms').click()
    //     await page.getByText('Form Layouts').click()
    //     // formLayoutsPage feature string activation
    //     await use('')
    // }, {auto: true}]

    // Here formLayouts page is passed as a parameter in order to initialize it before pageManager
    // then pageManager constractor is called and then we call use(pm) in order to define that the
    // precondition of our test is to instantiate pagemanger and having as prerequisite the dependency
    // on formLayoutsPage
    pageManager: async({page, formLayoutsPage}, use) => {
        const pm = new PageManager(page)
        // pageManager feature activation
        await use(pm)
    }
})




