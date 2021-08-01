import { ApolloClient } from "@apollo/client";
import { resolvers, typeDefs } from "./resolvers";
import createCache from "./createCache";
import createLink from "./createLink";

export default function createApolloClient() {
  return new ApolloClient({
    cache: createCache(),
    link: createLink(),
    typeDefs,
    resolvers,
    queryDeduplication: true,
    connectToDevTools: true,
  });
}
