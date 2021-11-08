import * as t from 'io-ts'
import { request } from 'undici'
import { HttpMethod } from 'undici/types/dispatcher'

import { decodeInput } from './type-validation'

const RequestMethod = t.union([
  t.literal('GET'),
  t.literal('POST'),
  t.literal('DELETE'),
])
type RequestMethod = t.TypeOf<typeof RequestMethod>

const RequestOptions = t.type({
  method: RequestMethod,
})
type RequestOptions = {
  method: RequestMethod
  body?: string
  headers?: { [key: string]: string }
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
  const { body, statusCode } = await request(url, {
    ...options,
    method: options.method.toUpperCase() as HttpMethod,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  const result = await body.text()
  if (statusCode >= 200 && statusCode < 300) {
    return decodeInput(types.response, JSON.parse(result))
  }

  throw new Error(
    `API returned with status ${statusCode}. Response body: ${result}`
  )
}

type GetRequestParams<QueryParams> = {
  path: string
  queryParameters?: QueryParams
  headers?: { [key: string]: string }
}
export const createGet =
  (baseUrl: string) =>
  async <Response, QueryParams>(
    types: Partial<{
      response: t.Type<Response, any>
      query: t.Type<QueryParams, any>
    }>,
    { path, queryParameters, headers }: GetRequestParams<QueryParams>
  ): Promise<Response> => {
    const params = new URLSearchParams(queryParameters ?? {})
    return await apiRequest(
      { response: types.response, query: types.query },
      `${baseUrl}${path}?${params.toString()}`,
      { method: 'GET', headers }
    )
  }

type PostRequestParams<Body, QueryParams> = {
  path: string
  body: Body
  queryParameters?: QueryParams
  headers?: { [key: string]: string }
}

export const createPost =
  (baseUrl: string) =>
  async <Response, Body, QueryParams>(
    types: Partial<{
      response: t.Type<Response, any>
      body: t.Type<Body, any>
      query: t.Type<QueryParams, any>
    }>,
    {
      path,
      body,
      queryParameters,
      headers,
    }: PostRequestParams<Body, QueryParams>
  ): Promise<Response> => {
    const params = new URLSearchParams(queryParameters ?? {})
    return await apiRequest(
      { response: types.response, query: types.query, body: types.body },
      `${baseUrl}${path}?${params.toString()}`,
      { method: 'POST', body: JSON.stringify(body), headers }
    )
  }

type DeleteRequestParams<QueryParams> = {
  path: string
  queryParameters?: QueryParams
  headers?: { [key: string]: string }
}
export const createDelete =
  (baseUrl: string) =>
  async <Response, QueryParams>(
    types: Partial<{
      response: t.Type<Response, any>
      query: t.Type<QueryParams, any>
    }>,
    { path, queryParameters, headers }: DeleteRequestParams<QueryParams>
  ): Promise<Response> => {
    const params = new URLSearchParams(queryParameters ?? {})
    return await apiRequest(
      { response: types.response, query: types.query },
      `${baseUrl}${path}?${params.toString()}`,
      { method: 'DELETE', headers }
    )
  }
