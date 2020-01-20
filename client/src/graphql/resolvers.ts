import gql from "graphql-tag";
import { Resolvers } from "apollo-client";
import { CACHE_PERSIST, AUTH_TOKEN } from "../constant";

export const typeDefs = gql`
  type PackageInfo {
    version: String!
    description: String!
  }

  extend type Query {
    token: String
    packageInfo: PackageInfo!
  }
  extend type Mutation {
    token(newToken: String!): String!
    packageInfo(version: String, description: String): PackageInfo!
  }
`;

export const resolvers: Resolvers = {
  Mutation: {
    token: (parent, { newToken }, context) => {
      localStorage.setItem(AUTH_TOKEN, newToken);

      return newToken;
    },
    packageInfo: (parent, args, context) => {
      console.log(args);
      return args;
    }
  }
};
