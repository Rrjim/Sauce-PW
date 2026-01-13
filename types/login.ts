// types/login.ts
export type LoginResult =
  | 'success'
  | 'locked'
  | 'invalid'
  | 'emptyUsername'
  | 'emptyPassword'

  export type ErrorMessages = Record<
    Exclude<LoginResult, "sucessful">,
    string
  > 

export type UserConfig = {
  username: string
  passwordKey: string
  expect: string
  errorText?: string
} 


export type Users = Record<string, UserConfig>
export type UserKey = keyof Users & string

// --- Fixture types ---
export type LoginAsFixture = {
  loginAs: (userKey: UserKey) => Promise<void>
}

// --- PageManager types (optional, for clarity) ---
import { LoginPage } from '../page-objects/loginPage'

export interface PageManagerType {
  onLoginPage(): LoginPage
}


