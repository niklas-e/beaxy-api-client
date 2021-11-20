#!/usr/bin/env zx

const baseUrl = 'https://services.beaxy.com/api/v2'
const response = await fetch(`${baseUrl}/symbols`)
const result = await response.text()
if (!response.ok) {
  throw new Error(
    `Failed to fetch symbols. ${response.status} - ${response.statusText}\n\n${result}`
  )
}

const symbols = JSON.parse(result)
const typesCommonContent = await fs.readFile('src/types-common.ts', 'utf8')

const symbolNameLiterals = symbols
  .map((x) => `  t.literal('${x.name}'),\n`)
  .join('')
const newSymbolNames = `export const SymbolName = t.union([\n${symbolNameLiterals}])`
const existingSymbolNames = typesCommonContent.match(
  /export const SymbolName = t.union\(\[\n(.+,\n)+]\)/
)[0]
if (newSymbolNames !== existingSymbolNames) {
  console.log('Updating SymbolName')
}

const newBaseCurrencyLiterals = Array.from(
  new Set(symbols.map((x) => `  t.literal('${x.baseCurrency}'),\n`))
).join('')
const newBaseCurrencyNames = `export const BaseCurrencyName = t.union([\n${newBaseCurrencyLiterals}])`
const existingBaseCurrencyNames = typesCommonContent.match(
  /export const BaseCurrencyName = t.union\(\[\n(.+,\n)+]\)/
)[0]
if (newBaseCurrencyNames !== existingBaseCurrencyNames) {
  console.log('Updating BaseCurrencyName')
}

const newTermCurrencyLiterals = Array.from(
  new Set(symbols.map((x) => `  t.literal('${x.termCurrency}'),\n`))
).join('')
const newTermCurrencyNames = `export const TermCurrencyName = t.union([\n${newTermCurrencyLiterals}])`
const existingTermCurrencyNames = typesCommonContent.match(
  /export const TermCurrencyName = t.union\(\[\n(.+,\n)+]\)/
)[0]
if (newTermCurrencyNames !== existingTermCurrencyNames) {
  console.log('Updating TermCurrencyName')
}

const newContents = typesCommonContent
  .replace(existingSymbolNames, newSymbolNames)
  .replace(existingBaseCurrencyNames, newBaseCurrencyNames)
  .replace(existingTermCurrencyNames, newTermCurrencyNames)
await fs.writeFile('src/types-common.ts', newContents)
