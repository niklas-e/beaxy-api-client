import * as t from 'io-ts'

import { createGet } from './api-client'
import { publicApiBaseUrl, PublicApiPaths } from './constants'
import {
  ChartBarType,
  ChartData,
  Currency,
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
  get(
    { response: t.array(ExchangeSymbol) },
    { path: `${PublicApiPaths.Symbols}` }
  )

export const getOrderBook = async (
  symbol: SymbolName,
  depth: OrderBookDepth = '5'
): Promise<OrderBook> =>
  get(
    { response: OrderBook },
    {
      path: `${PublicApiPaths.Symbols}/${symbol}/book`,
      queryParameters: {
        depth,
      },
    }
  )

export const getTrades = async (symbol: SymbolName): Promise<Array<Trade>> =>
  get(
    { response: t.array(Trade) },
    { path: `${PublicApiPaths.Symbols}/${symbol}/trades` }
  )

export const getRate = async (symbolName: SymbolName): Promise<Rate> =>
  get(
    { response: Rate },
    { path: `${PublicApiPaths.Symbols}/${symbolName}/rate` }
  )

export const getRates = async (): Promise<Rates> =>
  get({ response: Rates }, { path: `${PublicApiPaths.Symbols}/rates` })

export const getChartData = async (
  symbolName: SymbolName,
  barType: ChartBarType,
  count = ''
): Promise<ChartData> =>
  get(
    { response: ChartData },
    {
      path: `${PublicApiPaths.Symbols}/${symbolName}/chart`,
      queryParameters: { count, barType },
    }
  )

export const getCurrencies = async (): Promise<Array<Currency>> =>
  get({ response: t.array(Currency) }, { path: `${PublicApiPaths.Currencies}` })
