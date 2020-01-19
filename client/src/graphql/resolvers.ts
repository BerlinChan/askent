import gql from "graphql-tag";
import { Resolvers } from "apollo-client";
import { AUTH_TOKEN } from "../constant";

export const typeDefs = gql`
  type Persist {
    token: String!
  }
  type PackageInfo {
    version: String!
    description: String!
  }
  extend type Query {
    persist: Persist!
    packageInfo: PackageInfo!
  }
  extend type Mutation {
    persist(token: String!): Persist!
    packageInfo(version: String, description: String): PackageInfo!
  }
`;

export const resolvers: Resolvers = {
  Mutation: {
    persist: (parent, { token }, context) => {
      console.log(1, token, context);
      context.cache.writeData({ data: { token } });
      localStorage.setItem(AUTH_TOKEN, token);
      return token;
    },
    packageInfo: (parent, args, context) => {
      console.log(args);
      return args;
    }
  }
};
