# Beaxy API Client

[![NPM Version][npm-image]][npm-url]
[![build][build-image]][build-url]

Unofficial [Beaxy Exchange](https://beaxy.com) API Client written in TypeScript with runtime type validation ([io-ts](https://www.npmjs.com/package/io-ts)).

## Install

```bash
# npm
npm i beaxy-api-client

# yarn
yarn add beaxy-api-client
```

## Usage

```typescript
import { publicApi } from 'beaxy-api-client'

const getOrderBook = async (symbolName: string) =>
  publicApi.getOrderBook(symbolName)

```

## License

[MIT - Copyright 2021 Niklas Engblom (niklas-e)](./LICENSE.md)

[npm-image]: https://img.shields.io/npm/v/beaxy-api-client.svg
[npm-url]: https://npmjs.org/package/beaxy-api-client
[build-image]: https://github.com/niklas-e/beaxy-api-client/actions/workflows/build.yml/badge.svg
[build-url]: https://github.com/niklas-e/beaxy-api-client/actions/workflows/build.yml