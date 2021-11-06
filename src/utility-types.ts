import * as t from 'io-ts'

export interface UUIDBrand {
  readonly UUID: unique symbol
}
export type UUID = t.Branded<string, UUIDBrand>
const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
export const UUID = t.brand(t.string, (s): s is UUID => regex.test(s), 'UUID')

export type Override<T1, T2> = Omit<T1, keyof T2> & T2
