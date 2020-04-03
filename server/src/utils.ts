import { sign, verify } from 'jsonwebtoken'
import { RoleName } from './entity/Role'
import { Request } from 'express'

export type TokenPayload = {
  id: string
  roles: Array<RoleName>
  iat?: number
}

export function signToken(tokenPayload: TokenPayload): string {
  return sign(tokenPayload, process.env.JWT_SECRET as string)
}

export function getAuthedUser(token: string): TokenPayload | undefined
export function getAuthedUser(req: Request): TokenPayload | undefined
export function getAuthedUser(arg: string | Request): TokenPayload | undefined {
  let token = ''
  if (typeof arg === 'string') {
    token = arg
  } else if (typeof arg === 'object') {
    token = arg?.headers.authorization as string
  }
  if (token) {
    const verifiedToken = verify(
      token,
      process.env.JWT_SECRET as string,
    ) as TokenPayload

    return verifiedToken
  }
}
