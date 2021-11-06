import * as t from 'io-ts'

import { createPost } from './api-client'
import { tradingApiBaseUrl, TradingApiPaths } from './constants'
import { getTokenClaims, PermissionClaim } from './jwt'

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
  permissions: PermissionClaim[]
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
  const claims = getTokenClaims(authResult.access_token)
  jwt = {
    expiresAt: Date.now() + expiryInMilliseconds - safeExpiryModifier,
    token: authResult.access_token,
    permissions: claims.prm,
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

const assertPermission = (requiredPermission: PermissionClaim) => {
  if (!jwt) {
    throw new Error(
      'You must use login() before using other trading API endpoints'
    )
  }
  if (jwt.permissions.includes(requiredPermission)) return

  throw new Error(
    `Auth token does not have required permissions to perform the action.`
  )
}

