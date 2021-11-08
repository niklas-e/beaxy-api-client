import * as t from 'io-ts'

import { createGet, createPost } from './api-client'
import { tradingApiBaseUrl, TradingApiPaths } from './constants'
import { getTokenClaims, PermissionClaim } from './jwt'
import { SymbolName } from './types-common'
import {
  AuthRequestBody,
  AuthResponse,
  OrderResponse,
  PlaceOrderResponse,
  TradesResponse,
} from './types-trading-api'
import { UUID } from './utility-types'

const post = createPost(tradingApiBaseUrl)
const get = createGet(tradingApiBaseUrl)

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

const OrderParameters = t.intersection([
  t.type({
    symbol: SymbolName,
    quantity: t.number,
    side: t.union([t.literal('buy'), t.literal('sell')]),
    type: t.union([t.literal('market'), t.literal('limit')]),
  }),
  t.partial({
    comment: t.string,
    useUtilityTokenForFees: t.boolean,
    postOnly: t.boolean,
    price: t.number,
  }),
])
type OrderParameters = t.TypeOf<typeof OrderParameters>

export const placeOrder = async (
  params: OrderParameters
): Promise<PlaceOrderResponse> => {
  assertPermission('Trade')

  return post(
    { body: t.UnknownRecord, response: PlaceOrderResponse },
    {
      path: TradingApiPaths.Orders,
      body: {
        symbol: params.symbol,
        order_type: params.type,
        side: params.side,
        size: params.quantity,
        comment: params.comment,
        pay_with_utility_token: params.useUtilityTokenForFees ?? false,
        post_only: params.postOnly ?? false,
        price: params.price,
      },
      headers: {
        Authorization: `Bearer ${jwt.token}`,
      },
    }
  )
}

export const getClosedOrders = async (
  fromDate: string
): Promise<OrderResponse[]> => {
  assertPermission('Read')

  return get(
    {
      response: t.array(OrderResponse),
    },
    {
      path: `${TradingApiPaths.Orders}/closed`,
      queryParameters: { from_date: fromDate },
      headers: {
        Authorization: `Bearer ${jwt.token}`,
      },
    }
  )
}

export const getOpenOrders = async (): Promise<OrderResponse[]> => {
  assertPermission('Read')

  return get(
    { response: t.array(OrderResponse) },
    {
      path: `${TradingApiPaths.Orders}/open`,
      headers: {
        Authorization: `Bearer ${jwt.token}`,
      },
    }
  )
}

export const getOrderById = async (orderId: UUID): Promise<OrderResponse> => {
  assertPermission('Read')

  return get(
    {
      response: OrderResponse,
    },
    {
      path: `${TradingApiPaths.Orders}/${orderId}`,
      headers: {
        Authorization: `Bearer ${jwt.token}`,
      },
    }
  )
}

export const getClosedOrderById = async (
  orderId: UUID
): Promise<OrderResponse> => {
  assertPermission('Read')

  return get(
    {
      response: OrderResponse,
    },
    {
      path: `${TradingApiPaths.Orders}/closed/${orderId}`,
      headers: {
        Authorization: `Bearer ${jwt.token}`,
      },
    }
  )
}

export const getOpenOrderById = async (
  orderId: UUID
): Promise<OrderResponse> => {
  assertPermission('Read')

  return get(
    {
      response: OrderResponse,
    },
    {
      path: `${TradingApiPaths.Orders}/open/${orderId}`,
      headers: {
        Authorization: `Bearer ${jwt.token}`,
      },
    }
  )
}

export const getTrades = async (fromDate: string): Promise<TradesResponse> => {
  assertPermission('Read')

  return get(
    { response: TradesResponse },
    {
      path: `${TradingApiPaths.Orders}/trades`,
      queryParameters: { from_date: fromDate },
      headers: {
        Authorization: `Bearer ${jwt.token}`,
      },
    }
  )
}
