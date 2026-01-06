import { test } from '../../utils/fixtures';
import { expect} from '../../utils/custom-expect';
import { createToken } from '../../helpers/createToken';
import { validateSchema } from '../../utils/schema-validator';
import articleRequestPayload from '../../request-objects/articles/POST_article.json';
import { faker } from '@faker-js/faker';
import { getNewRandomArticle } from '../../utils/data-generator';

// let authToken: string

// test.beforeAll('Get Token', async({ api, config }) => {
//     // const tokenResponse = await api
//     //     .path('/users/login')
//     //     .body({ "user": { "email": config.userEmail, "password": config.userPassword }})
//     //     .postRequest(200)
//     authToken = await createToken( config.userEmail, config.userPassword )
// })


test('get articles', async({ api }) => {

    const response = await api
    // .url('https://conduit-api.bondaracademy.com/api')
    .path('/articles')
    .params({ limit: 10, offset: 0 })
    .getRequest(200)
    // once you generate the schema, erase the flag = true(its optional) to check the existing schema
    // against the new one
    // await expect(response).shouldMatchSchema('articles', 'GET_articles', true)
    await expect(response).shouldMatchSchema('articles', 'GET_articles')

    console.log(response)
    expect(response.articles.length).shouldBeLessThanOrEqual(10)
    expect(response.articlesCount).shouldEqual(10)
})

test('get test tags', async({api}) => {
    const response = await api
        .path('/tags')
        .getRequest(200)
    await expect(response).shouldMatchSchema('tags', 'GET_tags')
    // await validateSchema('tags', 'GET_tags', response)
    expect(response.tags[0]).shouldEqual('Test')
    expect(response.tags.length).shouldBeLessThanOrEqual(10)
})


test('Create and Delete Article', async({api}) => {
    const articleTitle = faker.lorem.sentence(5)
    // pars(stringify) is needed for breaking the reference to the importedarticleRequestPayload
    // so if we run the tests in parallel we don't accidentally set the title or any other value
    // for another test
    // const articleRequest = JSON.parse(JSON.stringify(articleRequestPayload))
    // articleRequest.article.title = articleTitle

    const articleRequest = getNewRandomArticle()

    const createArticleResponse = await api
        .path('/articles')
        .body(articleRequest)
        .postRequest(201)
    await expect(createArticleResponse).shouldMatchSchema('articles', 'POST_articles')

    expect(createArticleResponse.article.title).shouldEqual(articleRequest.article.title)
    const slugId = createArticleResponse.article.slug

    const articlesResponse = await api
        .path('/articles')
        .params({ limit: 10, offset: 0 })
        .getRequest(200)
    await expect(articlesResponse).shouldMatchSchema('articles', 'GET_articles')
    expect(articlesResponse.articles[0].title).shouldEqual(articleRequest.article.title)

    await api
        .path(`/articles/${slugId}`)
        .deleteRequest(204)

    const articlesResponseTwo = await api
        .path('/articles')
        .params({ limit: 10, offset: 0 })
        .getRequest(200)
    await expect(articlesResponseTwo).shouldMatchSchema('articles', 'GET_articles')
    expect(articlesResponseTwo.articles[0].title).not.shouldEqual(articleRequest.article.title)
})


test('Create. Update and Delete Article', async({api}) => {
    const articleTitle = faker.lorem.sentence(5)
    const articleRequest = JSON.parse(JSON.stringify(articleRequestPayload))
    articleRequest.article.title = articleTitle
    const createArticleResponse = await api
        .path('/articles')
        .body(articleRequest)
        .postRequest(201)

    await expect(createArticleResponse).shouldMatchSchema('articles', 'POST_articles')

    expect(createArticleResponse.article.title).shouldEqual(articleTitle)
    const slugId = createArticleResponse.article.slug

    const articleTitleUpdated = faker.lorem.sentence(5)
    articleRequest.article.title = articleTitleUpdated
    const updateArticleResponse = await api
        .path(`/articles/${slugId}`)
        .body(articleRequest)
        .putRequest(200)
    await expect(updateArticleResponse).shouldMatchSchema('articles', 'PUT_articles')

        expect(updateArticleResponse.article.title).shouldEqual(articleTitleUpdated)
        const newSlugId = updateArticleResponse.article.slug

    const articlesResponse = await api
        .path('/articles')
        .params({ limit: 10, offset: 0 })
        .getRequest(200)
    await expect(articlesResponse).shouldMatchSchema('articles', 'GET_articles')
    expect(articlesResponse.articles[0].title).shouldEqual(articleTitleUpdated)

    await api
        .path(`/articles/${newSlugId}`)
        .deleteRequest(204)

    const articlesResponseTwo = await api
        .path('/articles')
        .params({ limit: 10, offset: 0 })
        .getRequest(200)
    await expect(articlesResponseTwo).shouldMatchSchema('articles', 'GET_articles')
    expect(articlesResponseTwo.articles[0].title).not.shouldEqual(articleTitleUpdated)
})

// test('logger', ({}) => {
//     const logger = new APILogger()
//     logger.logRequest('POST', 'https://test.com/api', {Authorization: 'token'}, {foo: 'bar'})
//     logger.logResponse(200, {foo: 'bar'})
//     const logs = logger.getRecentLogs()
//     console.log(logs)
// })