import articleRequestPayload from '../request-objects/articles/POST_article.json'
import userRequestPayload from '../request-objects/users/POST_user.json'
import { faker } from '@faker-js/faker';


export function getNewRandomArticle(){
    // shallow copy
    // const articleRequest = JSON.parse(JSON.stringify( articleRequestPayload ))
    // OR better approach to save intellisense
    const articleRequest = structuredClone(articleRequestPayload)
    articleRequest.article.title = faker.lorem.sentence(5)
    articleRequest.article.description = faker.lorem.sentence(3)
    articleRequest.article.body = faker.lorem.paragraph(8)
    return articleRequest
}

export function getNewRandomUser(wordLength: number) {

    const userRequest = structuredClone(userRequestPayload)
    userRequest.user.email = faker.lorem.word(6) + '@test.com'
    userRequest.user.username = faker.lorem.word({length: wordLength,strategy: 'any-length'});
    userRequest.user.password = faker.lorem.word(1)
    return userRequest
}