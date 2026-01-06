import { request } from "@playwright/test";
import { RequestHandler } from "../utils/request-handler";
import { APILogger } from "../utils/logger";
import { config } from "../api-test.config";
import { expect, setCustomExpectLogger } from "../utils/custom-expect";

export async function createToken( email: string, password: string ) {
    const context = await request.newContext()
    const logger = new APILogger()
    const api = new RequestHandler( context, config.apiUrl, logger)
    setCustomExpectLogger(logger)

    try {
        const tokenResponse = await api
        .path('/users/login')
        .body({ "user": {"email": email, "password": password} })
        .postRequest(200)
        await expect(tokenResponse).shouldMatchSchema('users', 'POST_users_login')
        return `Token ${tokenResponse.user.token}`
    } catch(error) {
        Error.captureStackTrace(error, createToken)
        throw error
    } finally {
        await context.dispose()
    }
}