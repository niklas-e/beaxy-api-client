import * as t from 'io-ts'

import { createPost } from './api-client'
import { tradingApiBaseUrl, TradingApiPaths } from './constants'

const post = createPost(tradingApiBaseUrl)

const AuthRequestBody = t.type({
  api_key_id: t.string,
  api_secret: t.string,
})
const AuthResult = t.type({
  expires_in: t.number,
  access_token: t.string,
  type: t.string,
})
type AuthResult = t.TypeOf<typeof AuthResult>

type Jwt = {
  expiresAt: number
  token: string
}
let jwt: Jwt

/**
 * Call auth endpoint. Note: the expiry time is set with safe margin of 3 minutes.
 * @param key api key
 * @param secret api secret
 * @param enableAutoRefresh set up interval for refreshing the auth - i.e. call this function once and forget auth
 */
export const login = async (
  key: string,
  secret: string,
  enableAutoRefresh = true
): Promise<Jwt> => {
  const authResult = await post(
    { response: AuthResult, body: AuthRequestBody },
    {
      path: TradingApiPaths.Auth,
      body: {
        api_key_id: key,
        api_secret: secret,
      },
    }
  )
  const expiryInMilliseconds = authResult.expires_in * 1000
  const safeExpiryModifier = 1000 * 60 * 3
  jwt = {
    expiresAt: Date.now() + expiryInMilliseconds - safeExpiryModifier,
    token: authResult.access_token,
  }

  if (enableAutoRefresh) {
    const waitRefresh = setInterval(() => {
      if (Date.now() < jwt.expiresAt) return
      clearInterval(waitRefresh)

      login(key, secret, enableAutoRefresh)
    }, 5000)
  }

  return { ...jwt }
}
