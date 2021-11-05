export enum TradingApiPaths {
  Auth = '/auth',
  Wallets = '/wallets',
  Health = '/health',
  Orders = '/orders',
}

export enum PublicApiPaths {
  Symbols = '/symbols',
  Currencies = '/currencies',
}

export const publicApiBaseUrl = 'https://services.beaxy.com/api/v2'
export const tradingApiBaseUrl = 'https://tradewith.beaxy.com/api/v2'
