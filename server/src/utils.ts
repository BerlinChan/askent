import { sign, verify } from 'jsonwebtoken'
import { Context } from './context'
import { RoleName } from './models/Role'

export interface TokenPayload {
  id: string
  roles: Array<RoleName>
  iat?: number
}

export function signToken(tokenPayload: TokenPayload): string {
  return sign(tokenPayload, process.env.JWT_SECRET as string)
}

export function getAuthedUser(
  context: Context | string,
): TokenPayload | undefined {
  let token = ''
  if (typeof context === 'string') {
    token = context
  } else if (typeof context === 'object') {
    token = context.req?.headers.authorization as string
  }
  if (token) {
    const verifiedToken = verify(
      token,
      process.env.JWT_SECRET as string,
    ) as TokenPayload

    return verifiedToken
  }
}
