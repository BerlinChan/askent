import { generate } from "@graphql-codegen/cli";
import config from "../src/config";

async function codegen() {
  try {
    await generate(
      {
        generates: {
          "src/generated/graphqlHooks.tsx": {
            documents: [
              "./src/**/*.{graphql,ts,tsx}",
              "!./src/**/*.hasura.graphql",
            ],
            schema: [config.apiUri, "./src/graphql/resolvers.ts"],
            plugins: [
              "typescript",
              "typescript-operations",
              "typescript-react-apollo",
            ],
            config: {
              withHooks: true,
            },
          },
          "src/generated/hasuraHooks.tsx": {
            documents: "./src/**/*.hasura.graphql",
            schema: {
              [config.hasuraUri]: {
                  headers: {
                      'x-hasura-admin-secret': process.env.HASURA_GRAPHQL_ADMIN_SECRET,
                  },
              },
          },
            plugins: [
              "typescript",
              "typescript-operations",
              "typescript-react-apollo",
            ],
            config: {
              withHooks: true,
            },
          },
        },
      },
      true
    );
  } catch (error) {
    console.error(error);
  }
}

codegen();
