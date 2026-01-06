import { test } from '../../utils/fixtures';
import { expect} from '../../utils/custom-expect';
import { getNewRandomUser } from '../../utils/data-generator';
import { usernameLengthCases } from '../../utils/username-length-cases';

usernameLengthCases.forEach(({usernameLength, usernameErrorMessage}) => {
    test(`Error message validation for a username of ${usernameLength} characters`, async({api}) => {
    const userPayload = getNewRandomUser(usernameLength)
    const newUserResponse = await api
    .path('/users')
    .body(userPayload)
    .clearAuth()
    .postRequest(422)

    await expect(newUserResponse).shouldMatchSchema('users', 'POST_users')

    if(userPayload.user.username.length >= 3 && userPayload.user.username.length <= 20) {
        expect(newUserResponse.errors).not.toHaveProperty('username')
    } else {
        expect(newUserResponse.errors.username[0]).shouldEqual(usernameErrorMessage)
    }
})
})