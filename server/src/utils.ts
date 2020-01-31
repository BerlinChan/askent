import { verify } from 'jsonwebtoken'
import { Context } from './context'
import { NexusGenEnums } from 'nexus-typegen'
import { sign } from 'jsonwebtoken'

interface TokenPayload {
  userId: string
  role: NexusGenEnums['Role']
  iat?: number
}

export function signToken(tokenPayload: TokenPayload): string {
  return sign(tokenPayload, process.env.JWT_SECRET as string)
}

export function getAdminUserId(context: Context) {
  const token = context.req.headers.authorization as string
  if (token) {
    const verifiedToken = verify(
      token,
      process.env.JWT_SECRET as string,
    ) as TokenPayload
    return verifiedToken.role === 'Admin' ? verifiedToken.userId : ''
  }
}

export function getAudienceUserId(context: Context) {
  const token = context.req.headers.authorizationaudience as string
  if (token) {
    const verifiedToken = verify(
      token,
      process.env.JWT_SECRET as string,
    ) as TokenPayload
    return verifiedToken.role === 'Audience' ? verifiedToken.userId : ''
  }
}
