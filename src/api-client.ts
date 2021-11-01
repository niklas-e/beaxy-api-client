import * as t from 'io-ts'
import { request } from 'undici'
import { HttpMethod } from 'undici/types/dispatcher'

import { decodeInput } from './type-validation'

const RequestMethod = t.union([t.literal('get'), t.literal('post')])
type RequestMethod = t.TypeOf<typeof RequestMethod>

const RequestOptions = t.type({
  method: RequestMethod,
})
type RequestOptions = {
  method: RequestMethod
  body?: string
}

const apiRequest = async <Body, Response, QueryParams>(
  types: Partial<{
    body: t.Type<Body, any>
    response: t.Type<Response, any>
    query: t.Type<QueryParams, any>
  }>,
  url: string,
  options: RequestOptions
): Promise<Response> => {
  const { body } = await request(url, {
    ...options,
    method: options.method.toUpperCase() as HttpMethod,
    headers: {
      Accept: 'application/json',
    },
  })

  const result = await body.json()
  return decodeInput(types.response, result)
}

export const createGet =
  (baseUrl: string) =>
  async <Response, QueryParams>(
    types: Partial<{
      response: t.Type<Response, any>
      query: t.Type<QueryParams, any>
    }>,
    path: string,
    queryParameters?: { [key: string]: string }
  ): Promise<Response> => {
    const params = new URLSearchParams(queryParameters)
    return await apiRequest(
      { response: types.response, query: types.query },
      `${baseUrl}${path}?${params.toString()}`,
      { method: 'get' }
    )
  }
