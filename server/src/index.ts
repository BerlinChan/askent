import dotenv from 'dotenv'
import path from 'path'
import express, { NextFunction, Request, Response } from 'express'
import cors from 'cors'
import expressJwt, { UnauthorizedError as Jwt401Error } from 'express-jwt'
import { ApolloServer } from 'apollo-server-express'
import { schema } from './schema'
import { createContext } from './context'
import { applyMiddleware } from 'graphql-middleware'
import { permissions } from './permissions'

const dotenvResult = dotenv.config({ path: path.join(__dirname, '../.env') })
if (dotenvResult.error) {
  throw dotenvResult.error
}
const { PORT = 4000 } = process.env

const app = express()

//
// Register Node.js middleware
// -----------------------------------------------------------------------------
app.use(cors())

//
// Authentication
// -----------------------------------------------------------------------------
app.use(
  expressJwt({
    secret: process.env.JWT_SECRET as string,
    credentialsRequired: false,
    getToken: req => req.headers.authorization,
  }),
)
// Error handler for express-jwt
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof Jwt401Error) {
    console.error('[express-jwt-error]', req.headers.authorization)
  }
  next(err)
})

//
// Register API middleware
// -----------------------------------------------------------------------------
// https://github.com/graphql/express-graphql#options
const server = new ApolloServer({
  schema: applyMiddleware(schema, permissions),
  context: createContext,
})
server.applyMiddleware({ app })

app.listen({ port: PORT }, () =>
  console.log(
    `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`,
  ),
)
