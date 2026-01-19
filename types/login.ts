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

export type User = {
  username: string
  passwordKey: string
  expect: string
  errorText?: string
  capabilities?: UserCapabilities
} 


export type UserMap = Record<string, User>
export type UserKey = keyof UserMap & string

// --- Fixture types ---
export type LoginAsFixture = {
  loginAs: (userKey: UserKey) => Promise<void>
}

// --- PageManager types (optional, for clarity) ---
import { LoginPage } from '../page-objects/loginPage'

export interface PageManagerType {
  onLoginPage(): LoginPage
}


export interface SortCapabilities {
  sortWorks: boolean;
  priceAccurate?: boolean;
  alertsOnSort?: boolean;
}

export interface CartCapabilities {
  addWorks: boolean;
  removeWorks: boolean;
  badgeAccurate: boolean;
  limitedItems?: string[]; // titles that work
}

export interface UserCapabilities {
  sort: SortCapabilities;
  cart: CartCapabilities;
}
