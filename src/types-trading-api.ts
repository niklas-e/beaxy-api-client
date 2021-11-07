import * as t from 'io-ts'

import { SymbolName } from './types-common'
import { RfcDatetimeString, UUID } from './utility-types'

export const AuthRequestBody = t.type({
  api_key_id: t.string,
  api_secret: t.string,
})
export const AuthResponse = t.type({
  expires_in: t.number,
  access_token: t.string,
  type: t.string,
})
export type AuthResponse = t.TypeOf<typeof AuthResponse>

export const PlaceOrderResponse = t.type({ order_id: UUID })
export type PlaceOrderResponse = t.TypeOf<typeof PlaceOrderResponse>

export const OrderResponse = t.type({
  order_id: UUID,
  symbol: SymbolName,
  wallet_id: UUID,
  comment: t.union([t.string, t.null]),
  time_in_force: t.union([
    t.literal('good_till_cancel'),
    t.literal('good_till_date'),
    t.literal('immediate_or_cancel'),
    t.literal('fill_or_kill'),
    t.literal('day_till_cancel'),
    t.literal('at_the_open'),
    t.literal('at_the_close'),
    t.literal('good_till_cross'),
  ]),
  order_type: t.union([t.literal('limit'), t.literal('market')]),
  side: t.union([t.literal('buy'), t.literal('sell')]),
  order_status: t.union([
    t.literal('new'),
    t.literal('closed'),
    t.literal('canceled'),
    t.literal('rejected'),
  ]),
  size: t.string,
  limit_price: t.string,
  stop_price: t.union([t.string, t.null]),
  filled_size: t.string,
  average_price: t.union([t.string, t.null]),
  open_time: RfcDatetimeString,
  close_time: t.union([RfcDatetimeString, t.null]),
  pay_with_utility_token: t.boolean,
  post_only: t.boolean,
})
export type OrderResponse = t.TypeOf<typeof OrderResponse>
