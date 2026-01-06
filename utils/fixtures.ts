import { test as base } from '@playwright/test';
import { RequestHandler } from './request-handler';
import { APILogger } from './logger';
import { setCustomExpectLogger } from './custom-expect';
import { config } from '../api-test.config';
import { createToken } from '../helpers/createToken';

// regular fixtures
export type TestOptions = {
    api: RequestHandler
    config: typeof config
}

// worker fixtures
export type WorkerFixture = {
    authToken: string
}

export const test = base.extend<TestOptions, WorkerFixture>({
    authToken: [ async ({}, use) => {
        const authToken = await createToken(config.userEmail, config.userPassword)
        await use(authToken)
    }, {scope: 'worker'} ],

    api: async({ request, authToken }, use) => {
        const baseUrl = 'https://conduit-api.bondaracademy.com/api' 
        const logger = new APILogger()
        setCustomExpectLogger(logger)
        const requestHandler = new RequestHandler(request, config.apiUrl, logger, authToken)
        await use(requestHandler)
    },
    config: async({}, use) => {
        await use(config)
    }
})