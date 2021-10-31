import * as t from 'io-ts'

export const CurrencyType = t.union([t.literal('crypto'), t.literal('fiat')])
export type CurrencyType = t.TypeOf<typeof CurrencyType>

export const SymbolName = t.union([
  t.literal('ETCBTC'),
  t.literal('GOBTC'),
  t.literal('BTCUSDC'),
  t.literal('ZECBTC'),
  t.literal('BATBTC'),
  t.literal('ALEPHETH'),
  t.literal('BTCUSD'),
  t.literal('ETHUSD'),
  t.literal('BTCEUR'),
  t.literal('AIONBTC'),
  t.literal('ZRXBTC'),
  t.literal('USDCEUR'),
  t.literal('BTCUSDT'),
  t.literal('ETHUSDC'),
  t.literal('EOSBTC'),
  t.literal('GUNTHYBTC'),
  t.literal('USDCUSD'),
  t.literal('WAVESBTC'),
  t.literal('DASHBTC'),
  t.literal('ICXBTC'),
  t.literal('BCHBTC'),
  t.literal('WGRUSD'),
  t.literal('ETHUSDT'),
  t.literal('XTZBTC'),
  t.literal('ETHBTC'),
  t.literal('WGRBTC'),
  t.literal('LINKBTC'),
  t.literal('HIVEBTC'),
  t.literal('BXYBTC'),
  t.literal('USDTUSDC'),
  t.literal('NEOBTC'),
  t.literal('BXYUSDC'),
  t.literal('DRGNUSD'),
  t.literal('BEAMBTC'),
  t.literal('BSVBTC'),
  t.literal('ETHEUR'),
  t.literal('BSVUSD'),
  t.literal('LTCBTC'),
  t.literal('XTZUSD'),
  t.literal('XSNBTC'),
  t.literal('DRGNBTC'),
])
export type SymbolName = t.TypeOf<typeof SymbolName>

export const BaseCurrencyName = t.union([
  t.literal('ETC'),
  t.literal('GO'),
  t.literal('BTC'),
  t.literal('ZEC'),
  t.literal('BAT'),
  t.literal('ALEPH'),
  t.literal('ETH'),
  t.literal('AION'),
  t.literal('ZRX'),
  t.literal('USDC'),
  t.literal('EOS'),
  t.literal('GUNTHY'),
  t.literal('WAVES'),
  t.literal('DASH'),
  t.literal('ICX'),
  t.literal('BCH'),
  t.literal('WGR'),
  t.literal('XTZ'),
  t.literal('LINK'),
  t.literal('HIVE'),
  t.literal('BXY'),
  t.literal('USDT'),
  t.literal('NEO'),
  t.literal('DRGN'),
  t.literal('BEAM'),
  t.literal('BSV'),
  t.literal('LTC'),
  t.literal('XSN'),
])
export type BaseCurrencyName = t.TypeOf<typeof BaseCurrencyName>

export const TermCurrencyName = t.union([
  t.literal('BTC'),
  t.literal('USDC'),
  t.literal('ETH'),
  t.literal('USD'),
  t.literal('EUR'),
  t.literal('USDT'),
])
export type TermCurrencyName = t.TypeOf<typeof TermCurrencyName>

export const ExchangeSymbol = t.type({
  symbol: SymbolName,
  name: SymbolName,
  minimumQuantity: t.number,
  maximumQuantity: t.number,
  quantityIncrement: t.number,
  quantityPrecision: t.number,
  tickSize: t.number,
  baseCurrency: BaseCurrencyName,
  termCurrency: TermCurrencyName,
  pricePrecision: t.number,
  type: CurrencyType,
  suspendedForTrading: t.boolean,
  buyerTakerCommissionProgressive: t.number,
  buyerMakerCommissionProgressive: t.number,
  sellerTakerCommissionProgressive: t.number,
  sellerMakerCommissionProgressive: t.number,
})
export type ExchangeSymbol = t.TypeOf<typeof ExchangeSymbol>

export const Trade = t.type({
  price: t.number,
  size: t.number,
  side: t.union([t.literal('BUY'), t.literal('SELL')]),
  timestamp: t.number,
  matchId: t.union([t.string, t.null]),
})
export type Trade = t.TypeOf<typeof Trade>

export const Rate = t.type({
  ask: t.number,
  bid: t.number,
  low24: t.number,
  high24: t.number,
  volume24: t.number,
  change24: t.number,
  price: t.union([t.number, t.null]),
  volume: t.union([t.number, t.null]),
  timestamp: t.number,
})
export type Rate = t.TypeOf<typeof Rate>

export const Rates = t.record(SymbolName, Rate)
export type Rates = t.TypeOf<typeof Rates>

export const ChartBarType = t.union([
  t.literal('MINUTE'),
  t.literal('MINUTE5'),
  t.literal('MINUTE15'),
  t.literal('MINUTE30'),
  t.literal('HOUR'),
  t.literal('HOUR4'),
  t.literal('HOUR8'),
  t.literal('DAY'),
  t.literal('WEEK'),
])
export const ChartData = t.type({
  symbol: SymbolName,
  barType: ChartBarType,
  bars: t.array(
    t.type({
      closeAsk: t.number,
      closeBid: t.number,
      highAsk: t.number,
      highBid: t.number,
      highMid: t.number,
      lowAsk: t.number,
      lowBid: t.number,
      lowMid: t.number,
      openAsk: t.number,
      openBid: t.number,
      volume: t.number,
      time: t.number,
    })
  ),
})
export type ChartData = t.TypeOf<typeof ChartData>

export const OrderBookEntry = t.type({
  action: t.string,
  side: t.union([t.literal('ASK'), t.literal('BID')]),
  level: t.number,
  numberOfOrders: t.union([t.number, t.null]),
  quantity: t.number,
  price: t.number,
})
export const OrderBook = t.type({
  type: t.string,
  security: SymbolName,
  timestamp: t.number,
  sequenceNumber: t.number,
  entries: t.array(OrderBookEntry),
})
export type OrderBook = t.TypeOf<typeof OrderBook>

export const OrderBookDepth = t.union([
  t.literal('5'),
  t.literal('10'),
  t.literal('20'),
])
export type OrderBookDepth = t.TypeOf<typeof OrderBookDepth>
