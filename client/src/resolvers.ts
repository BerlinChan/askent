import gql from "graphql-tag";

export const typeDefs = gql`
    extend type Query {
    }
    extend type Mutation {
    }
`;

export const resolvers = {
  Mutation: {}
};
