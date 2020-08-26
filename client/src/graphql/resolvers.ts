import gql from "graphql-tag";
import { Resolvers } from "@apollo/client/core";

export const typeDefs = gql`
  type PackageInfo {
    version: String!
    description: String!
  }

  extend type Query {
    packageInfo: PackageInfo!
  }
  extend type Mutation {
    packageInfo(version: String, description: String): PackageInfo!
  }
`;

export const resolvers: Resolvers = {
  Mutation: {
    packageInfo: (parent, args, ctx) => {
      console.log(args);
      return args;
    }
  }
};
