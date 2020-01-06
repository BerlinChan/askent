import gql from "graphql-tag";

export const typeDefs = gql`
    extend type PackageInfo{
      version: String!
      description: String!
    }
    extend type Query {
      packageInfo:PackageInfo!
    }
    extend type Mutation {
      packageInfo(version:String,description:String):PackageInfo!
    }
`;

export const resolvers = {};
