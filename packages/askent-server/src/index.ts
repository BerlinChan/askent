import "reflect-metadata";
import { ApolloServer } from "apollo-server";
import buildSchema from "./schema";
import { createContext } from "./context";
import { connectPostgres } from "./db";
import { applyMiddleware } from "graphql-middleware";
import permissions from "./permissions";

const { PORT = 4000 } = process.env;

async function bootstrap() {
  await connectPostgres();

  const server = new ApolloServer({
    schema: applyMiddleware(await buildSchema(), permissions),
    context: createContext,
  });

  // Start the server
  const { url } = await server.listen({ port: PORT });
  console.log(`Server is running at ${url}`);
}

bootstrap();
