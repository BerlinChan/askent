import { buildSchema } from "type-graphql";
import resolvers from "./graphql";

export default function () {
  return buildSchema({
    resolvers,
    emitSchemaFile: false,
  });
}
