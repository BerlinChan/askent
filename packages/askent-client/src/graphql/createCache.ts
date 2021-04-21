import { InMemoryCache } from "@apollo/client/cache";

export default function createCache() {
  return new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {},
      },
    },
  });
}
