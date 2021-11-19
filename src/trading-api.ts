import * as t from 'io-ts'

import { createDelete, createGet, createPost } from './api-client'
import { tradingApiBaseUrl, TradingApiPaths } from './constants'
import {
  assertPermission,
  getAuthHeaders,
  login as tradingLogin,
} from './trading-auth'
import { SymbolName } from './types-common'
import {
  OrderResponse,
  PlaceOrderResponse,
  TradesResponse,
  TradingSettings,
  Wallet,
} from './types-trading-api'
import { UUID } from './utility-types'

const post = createPost(tradingApiBaseUrl)
const get = createGet(tradingApiBaseUrl)
const deleteRequest = createDelete(tradingApiBaseUrl)

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
        ...getAuthHeaders(),
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
        ...getAuthHeaders(),
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
        ...getAuthHeaders(),
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
        ...getAuthHeaders(),
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
        ...getAuthHeaders(),
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
        ...getAuthHeaders(),
      },
    }
  )
}

export const cancelOpenOrders = async (symbol?: SymbolName): Promise<void> => {
  assertPermission('Trade')

  return deleteRequest(
    {
      response: t.void,
    },
    {
      path: `${TradingApiPaths.Orders}/open`,
      queryParameters: { symbol },
      headers: {
        ...getAuthHeaders(),
      },
    }
  )
}

export const cancelOrderById = async (orderId: UUID): Promise<void> => {
  assertPermission('Trade')

  return deleteRequest(
    {
      response: t.void,
    },
    {
      path: `${TradingApiPaths.Orders}/open/${orderId}`,
      headers: {
        ...getAuthHeaders(),
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
        ...getAuthHeaders(),
      },
    }
  )
}

export const getTradingSettings = async (): Promise<TradingSettings> => {
  assertPermission('Read')

  return get(
    { response: TradingSettings },
    {
      path: `${TradingApiPaths.TradingSettings}`,
      headers: {
        ...getAuthHeaders(),
      },
    }
  )
}

export const getWallets = async (): Promise<Wallet[]> => {
  assertPermission('Read')

  return get(
    { response: t.array(Wallet) },
    {
      path: `${TradingApiPaths.Wallets}`,
      headers: {
        ...getAuthHeaders(),
      },
    }
  )
}

export const getWalletById = async (walletId: UUID): Promise<Wallet> => {
  assertPermission('Read')

  return get(
    { response: Wallet },
    {
      path: `${TradingApiPaths.Wallets}/${walletId}`,
      headers: {
        ...getAuthHeaders(),
      },
    }
  )
}

export const login = tradingLogin
