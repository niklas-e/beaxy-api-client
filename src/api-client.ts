import { fold, isLeft } from 'fp-ts/Either'
import { pipe } from 'fp-ts/function'
import * as t from 'io-ts'
import { request } from 'undici'
import { HttpMethod } from 'undici/types/dispatcher'

const RequestMethod = t.union([t.literal('get'), t.literal('post')])
type RequestMethod = t.TypeOf<typeof RequestMethod>

const RequestOptions = t.type({
  method: RequestMethod,
})
type RequestOptions = {
  method: RequestMethod
  body?: string
}

const formatValidationError = (error: t.ValidationError) => {
  const path = error.context.map(({ key }) => key).join('.')
  const actualError = error.context[error.context.length - 1]

  return `${path} (expected ${actualError.type.name}, but instead got ${actualError.actual})`
}

const toErrorReporter = <T>(v: t.Validation<T>): Array<string> =>
  pipe(
    v,
    fold(
      (errors: t.Errors) => errors.map(formatValidationError),
      () => []
    )
  )

const decodeInput = <C extends t.Type<any, any> | undefined>(
  codec: C,
  input: any
): C extends t.Type<infer V> ? V : undefined => {
  if (!codec) return undefined as any
  const decoded = codec.decode(input)
  if (isLeft(decoded)) {
    const errors = toErrorReporter(decoded)
    throw new Error(`Invalid input: ${errors.join(', ')}`)
  }

  return decoded.right
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
