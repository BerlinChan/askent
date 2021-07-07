import "reflect-metadata";
import { ApolloServer } from "apollo-server";
import buildSchema from "./schema";
import { createContext } from "./context";
import { connectPostgres } from "./db";
import { getAuthedUser } from "./utils";
import { applyMiddleware } from "graphql-middleware";
import permissions from "./permissions";

const { PORT = 4000 } = process.env;

async function bootstrap() {
  await connectPostgres();

  type ConnectionParamsType = {
    Authorization?: string;
  };

  const server = new ApolloServer({
    schema: applyMiddleware(await buildSchema(), permissions),
    context: createContext,
    subscriptions: {
      // path: '/subscriptions',
      onConnect: (
        connectionParams: ConnectionParamsType,
        websocket,
        context
      ) => {
        if (connectionParams?.Authorization) {
          return getAuthedUser(connectionParams.Authorization);
        }
      },
    },
    cors: {
      origin: /askent\.berlinchan\.com/,
    },
    debug: process.env.NODE_ENV !== "production",
    playground: process.env.NODE_ENV !== "production",
  });

  // Start the server
  const { url, subscriptionsUrl } = await server.listen({ port: PORT });
  console.log(`Server is running, GraphQL Playground available at ${url}`);
  console.log(`🚀 Subscriptions ready at ${subscriptionsUrl}`);
}

bootstrap();
