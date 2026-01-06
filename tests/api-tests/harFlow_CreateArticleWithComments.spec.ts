import { test } from '../../utils/fixtures';
import { expect } from '../../utils/custom-expect';
import { getNewRandomArticle } from '../../utils/data-generator';
import { faker } from '@faker-js/faker';

test('HAR Flow - Create article and add comment', async ({ api }) => {
    // Step 1: List articles
    const articlesList = await api
        .path('/articles')
        .params({ limit: 10, offset: 0 })
        .getRequest(200)
    await expect(articlesList).shouldMatchSchema('articles', 'GET_articles', true)

    // Step 2: Get tags
    const tagsResponse = await api
        .path('/tags')
        .getRequest(200)
    await expect(tagsResponse).shouldMatchSchema('tags', 'GET_tags', true)

    // Step 3: Create article (use generator to avoid HAR hardcoded data)
    const articleRequest = getNewRandomArticle()
    const createArticleResponse = await api
        .path('/articles')
        .body(articleRequest)
        .postRequest(201)
    await expect(createArticleResponse).shouldMatchSchema('articles', 'POST_articles', true)
    const articleSlug = createArticleResponse.article.slug

    // Step 4: Get created article by slug
    const articleDetail = await api
        .path(`/articles/${articleSlug}`)
        .getRequest(200)
    await expect(articleDetail).shouldMatchSchema('articles', 'GET_articles', true)

    // Step 5: Get comments for the article (should be empty initially)
    const commentsBefore = await api
        .path(`/articles/${articleSlug}/comments`)
        .getRequest(200)
    await expect(commentsBefore).shouldMatchSchema('articles', 'GET_articles_comments', true)

    // Step 6: Post a comment
    const commentBody = faker.lorem.sentence()
    const postCommentResponse = await api
        .path(`/articles/${articleSlug}/comments`)
        .body({ comment: { body: commentBody } })
        .postRequest(200)
    await expect(postCommentResponse).shouldMatchSchema('articles', 'POST_articles_comments', true)
    const commentId = postCommentResponse.comment.id

    // Quick assertion to ensure posted comment matches
    expect(postCommentResponse.comment.body).shouldEqual(commentBody)
})
