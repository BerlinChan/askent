import { ApolloClient } from "@apollo/client";
import { resolvers, typeDefs } from "./resolvers";
import createCache from "./createCache";
import createLink from "./createLink";

const cache = createCache();
const link = createLink();

export default function createApolloClient() {
  return new ApolloClient({
    cache,
    link,
    typeDefs,
    resolvers,
    queryDeduplication: true,
    connectToDevTools: true,
  });
}
