import * as t from 'io-ts'
import { request } from 'undici'

import { decodeInput } from './type-validation'
import { NonEmptyString } from './utility-types'

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

const apiRequest = async <Body, Response>(
  types: Partial<{
    body: t.Type<Body, any>
    response: t.Type<Response, any>
  }>,
  url: string,
  options: RequestOptions
): Promise<Response> => {
  const { body, statusCode } = await request(url, {
    ...options,
    method: options.method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  const result = await body.text()
  if (statusCode >= 200 && statusCode < 300) {
    return decodeInput(
      types.response,
      NonEmptyString.is(result) ? JSON.parse(result) : undefined
    )
  }

  throw new Error(
    `API returned with status ${statusCode}. Response body: ${result}`
  )
}

type GetRequestParams = {
  path: string
  queryParameters?: { [key: string]: string | undefined }
  headers?: { [key: string]: string }
}
export const createGet =
  (baseUrl: string) =>
  async <Response>(
    types: Partial<{
      response: t.Type<Response, any>
    }>,
    { path, queryParameters, headers }: GetRequestParams
  ): Promise<Response> => {
    return await apiRequest(
      { response: types.response },
      `${baseUrl}${path}?${toQueryParams(queryParameters ?? {})}`,
      { method: 'GET', headers }
    )
  }

type PostRequestParams<Body> = {
  path: string
  body: Body
  queryParameters?: { [key: string]: string | undefined }
  headers?: { [key: string]: string }
}

export const createPost =
  (baseUrl: string) =>
  async <Response, Body>(
    types: Partial<{
      response: t.Type<Response, any>
      body: t.Type<Body, any>
    }>,
    { path, body, queryParameters, headers }: PostRequestParams<Body>
  ): Promise<Response> => {
    return await apiRequest(
      { response: types.response, body: types.body },
      `${baseUrl}${path}?${toQueryParams(queryParameters ?? {})}`,
      { method: 'POST', body: JSON.stringify(body), headers }
    )
  }

type DeleteRequestParams = {
  path: string
  queryParameters?: { [key: string]: string | undefined }
  headers?: { [key: string]: string }
}
export const createDelete =
  (baseUrl: string) =>
  async <Response>(
    types: Partial<{
      response: t.Type<Response, any>
    }>,
    { path, queryParameters, headers }: DeleteRequestParams
  ): Promise<Response> => {
    return await apiRequest(
      { response: types.response },
      `${baseUrl}${path}?${toQueryParams(queryParameters ?? {})}`,
      { method: 'DELETE', headers }
    )
  }

const toQueryParams = (values: { [key: string]: string | undefined }) => {
  const definedValues = Object.fromEntries(
    Object.entries(values).filter(([, value]) => value !== undefined)
  ) as { [key: string]: string }
  return new URLSearchParams(definedValues).toString()
}
