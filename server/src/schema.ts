import { buildSchema as buildGraphQLSchema } from 'type-graphql'
import resolvers from './graphql'

export function buildSchema() {
  return buildGraphQLSchema({
    resolvers,
    emitSchemaFile: false,
  })
}
