import { Override } from './types'

export type PermissionClaim = 'Trade' | 'Read' | 'Withdraw'
type TokenClaims = {
  iat: string
  jti: string
  uid: string
  aid: string
  ipw: boolean
  ip?: string
  trd: string
  fiat: string
  prm: PermissionClaim[]
  nbf: number
  exp: number
  iss: 'https://tradewith.beaxy.com/'
}
type RawClaims = Override<
  TokenClaims,
  {
    ipw: string
    prm: PermissionClaim | PermissionClaim[]
  }
>
export const getTokenClaims = (token: string): TokenClaims => {
  const parts = token.split('.')
  if (parts.length !== 3) throw new Error('Invalid token, cannot parse.')

  const claims = JSON.parse(
    Buffer.from(parts[1], 'base64').toString('utf8')
  ) as RawClaims

  return normalizeClaims(claims)
}

const normalizeClaims = (claims: RawClaims): TokenClaims => ({
  ...claims,
  ipw: claims.ipw.toLowerCase() === 'true' ? true : false,
  prm: [claims.prm].flat().map((x) => x.toLowerCase() as PermissionClaim),
})
