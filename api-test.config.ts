import dotenv from 'dotenv'
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '.env') });


const processENV = process.env.TEST_ENV
// run with command prompt
// set TEST_ENV=qa && npx playwright test smokeTest.spec.ts
// you can try to set it as prod and try tags endpoint
const env = processENV || 'qa'
console.log('Test environment is: ' + env)

const config = {
    apiUrl: 'https://conduit-api.bondaracademy.com/api',
    userEmail: 'test1401@test.com',
    userPassword: 'test1401'
}

if( env === 'qa' ) {
    config.userEmail = 'test1401@test.com',
    config.userPassword = 'test1401'
}

if( env === 'prod' ) {
    // if(!process.env.PROD_USERNAME || !process.env.PROD_PASSWORD) {
    //     throw new Error('Missing required environment variables')
    // }
    // making them mandatory, we can avoid specifying them as string
    // but we don't need to use them in every scenario so we wil follow 
    // the usual technique
    config.userEmail = process.env.PROD_USERNAME as string,
    config.userPassword = process.env.PROD_PASSWORD as string
}

export {config};