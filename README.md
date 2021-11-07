# Beaxy API Client

[![NPM Version][npm-image]][npm-url]
[![build][build-image]][build-url]

> ⚠️ Note: this is a prerelease version and things might change quite a bit before version 1.0.0, so you should use exact version as your dependency to avoid unexpected (potentially breaking) changes ⚠️

Unofficial [Beaxy Exchange](https://beaxy.com) API Client written in TypeScript with runtime type validation ([io-ts](https://www.npmjs.com/package/io-ts)).

Beaxy Exchange trading API client is based on newer API (<https://tradewith.beaxy.com/api/v2>) which does not have official documentation yet.

Beaxy Exchange public API client is based on the API documented here: <https://beaxyapiv2.docs.apiary.io/>

## Install

```bash
# npm
npm i beaxy-api-client

# yarn
yarn add beaxy-api-client
```

## Usage

```typescript
import { publicApi, tradingApi } from 'beaxy-api-client'

const doMagicWithOrderBook = async (symbolName: string) => {
  const book = await publicApi.getOrderBook(symbolName)
  // ...do something
}

const buyMarket = async (symbol: string, quantity: number) => {
  await tradingApi.placeOrder({
    symbol,
    quantity,
    side: 'buy',
    type: 'market'
  })
}

```

## License

[MIT - Copyright 2021 Niklas Engblom (niklas-e)](https://github.com/niklas-e/beaxy-api-client/blob/main/LICENSE.md)

[npm-image]: https://img.shields.io/npm/v/beaxy-api-client.svg
[npm-url]: https://npmjs.org/package/beaxy-api-client
[build-image]: https://github.com/niklas-e/beaxy-api-client/actions/workflows/build.yml/badge.svg
[build-url]: https://github.com/niklas-e/beaxy-api-client/actions/workflows/build.yml