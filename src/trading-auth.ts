import { createPost } from './api-client'
import { tradingApiBaseUrl, TradingApiPaths } from './constants'
import { getTokenClaims, PermissionClaim } from './jwt'
import { AuthRequestBody, AuthResponse } from './types-trading-api'

const post = createPost(tradingApiBaseUrl)

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
    { response: AuthResponse, body: AuthRequestBody },
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

export const assertPermission = (requiredPermission: PermissionClaim) => {
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

export const getAuthHeaders = () => ({
  Authorization: `Bearer ${jwt.token}`,
})
