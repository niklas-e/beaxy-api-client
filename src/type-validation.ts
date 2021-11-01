import { fold, isLeft } from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/function'
import * as t from 'io-ts'

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

export const decodeInput = <C extends t.Type<any, any> | undefined>(
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
