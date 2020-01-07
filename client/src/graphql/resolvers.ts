import gql from "graphql-tag";

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

export const resolvers = {
  Mutation: {
    packageInfo: (
      parent: any,
      args: { version?: string; description?: string },
      context: any
    ) => {
      console.log(args);
      return args;
    }
  }
};
