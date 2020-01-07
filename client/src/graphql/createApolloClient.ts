import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { resolvers, typeDefs } from "./resolvers";
import config from '../config'

const cache = new InMemoryCache();
const link = new HttpLink({
  uri: config.api,
  headers: {
    authorization: localStorage.getItem("token")
  }
});

export default function createApolloClient() {
  return new ApolloClient({
    cache,
    link,
    typeDefs,
    resolvers,
    queryDeduplication: true,
    connectToDevTools: true
  });
}
