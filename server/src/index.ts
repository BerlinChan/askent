import 'reflect-metadata'
import dotenv from 'dotenv'
import path from 'path'
import { ApolloServer } from 'apollo-server'
import { buildSchema } from './schema'
import { createContext } from './context'
import { connectPostgres, connectMongo } from './db'
import { getAuthedUser } from './utils'

const dotenvResult = dotenv.config({ path: path.join(__dirname, '../.env') })
if (dotenvResult.error) {
  throw dotenvResult.error
}
const { PORT = 4000 } = process.env

async function bootstrap() {
  await connectPostgres()
  await connectMongo()

  type ConnectionParamsType = {
    Authorization?: string
  }

  const server = new ApolloServer({
    schema: await buildSchema(),
    context: createContext,
    subscriptions: {
      onConnect: (
        connectionParams: ConnectionParamsType,
        websocket,
        context,
      ) => {
        if (connectionParams?.Authorization) {
          return getAuthedUser(connectionParams.Authorization)
        }
      },
    },
    debug: process.env.NODE_ENV !== 'production',
    playground: process.env.NODE_ENV !== 'production',
  })

  // Start the server
  const { url, subscriptionsUrl } = await server.listen({ port: PORT })
  console.log(`Server is running, GraphQL Playground available at ${url}`)
  console.log(`🚀 Subscriptions ready at ${subscriptionsUrl}`)
}

bootstrap()
