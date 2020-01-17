import http from 'http'
import dotenv from 'dotenv'
import path from 'path'
import express from 'express'
import cors from 'cors'
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
// Register API middleware
// -----------------------------------------------------------------------------
// https://github.com/graphql/express-graphql#options
const server = new ApolloServer({
  schema: applyMiddleware(schema, permissions),
  context: createContext,
})
server.applyMiddleware({ app })

const httpServer = http.createServer(app)
server.installSubscriptionHandlers(httpServer)

// ⚠️ Pay attention to the fact that we are calling `listen` on the http server variable, and not on `app`.
httpServer.listen(PORT, () => {
  console.log(
    `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`,
  )
  console.log(
    `🚀 Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`,
  )
})
