import {verify} from 'jsonwebtoken'
import {Context} from './context'

interface Token {
    userId: string
    iat: number
}

export function getUserId(context: Context) {
    const token = context.req.headers.authorization
    if (token) {
        const verifiedToken = verify(token, process.env.JWT_SECRET as string) as Token
        return verifiedToken?.userId
    }
}
