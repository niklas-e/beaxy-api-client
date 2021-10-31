import * as t from 'io-ts'

import { createGet } from './api-client'
import { publicApiBaseUrl, PublicApiPaths } from './constants'
import {
  ChartData,
  CurrencyType,
  ExchangeSymbol,
  OrderBook,
  OrderBookDepth,
  Rate,
  Rates,
  SymbolName,
  Trade,
} from './types'

const get = createGet(`${publicApiBaseUrl}`)

export const getSymbols = async (): Promise<Array<ExchangeSymbol>> =>
  get({ response: t.array(ExchangeSymbol) }, `${PublicApiPaths.Symbols}`)

export const getOrderBook = async (
  symbol: SymbolName,
  depth: OrderBookDepth = '5'
): Promise<OrderBook> =>
  get({ response: OrderBook }, `${PublicApiPaths.Symbols}/${symbol}/book`, {
    depth,
  })

export const getTrades = async (symbol: SymbolName): Promise<Array<Trade>> =>
  get(
    { response: t.array(Trade) },
    `${PublicApiPaths.Symbols}/${symbol}/trades`
  )

export const getRate = async (symbolName: SymbolName): Promise<Rate> =>
  get({ response: Rate }, `${PublicApiPaths.Symbols}/${symbolName}/rate`)

export const getRates = async (): Promise<Rates> =>
  get({ response: Rates }, `${PublicApiPaths.Symbols}/rates`)

export const getChartData = async (
  symbolName: SymbolName,
  barType: string,
  count = ''
): Promise<ChartData> =>
  get(
    { response: ChartData },
    `${PublicApiPaths.Symbols}/${symbolName}/chart`,
    { count, barType }
  )

export const getCurrencies = async (): Promise<Array<Currency>> =>
  get({ response: t.array(Currency) }, `${PublicApiPaths.Currencies}`)

const Currency = t.type({
  currency: t.string,
  name: t.string,
  precision: t.number,
  dailyDepositThreshold: t.number,
  dailyWithdrawalThreshold: t.number,
  weeklyDepositThreshold: t.number,
  weeklyWithdrawalThreshold: t.number,
  monthlyDepositThreshold: t.number,
  monthlyWithdrawalThreshold: t.number,
  dailyDepositLimit: t.number,
  dailyWithdrawalLimit: t.number,
  weeklyDepositLimit: t.number,
  weeklyWithdrawalLimit: t.number,
  monthlyDepositLimit: t.number,
  monthlyWithdrawalLimit: t.number,
  minimalWithdrawal: t.number,
  type: CurrencyType,
})
type Currency = t.TypeOf<typeof Currency>
