import { generate } from "@graphql-codegen/cli";
import config from "../src/config";

async function codegen() {
  await generate(
    {
      schema: config.apiUri,
      documents: "./src/**/*.{graphql,ts,tsx}",
      generates: {
        "src/generated/graphqlHooks.tsx": {
          schema: "./src/graphql/resolvers.ts",
          plugins: [
            "typescript",
            "typescript-operations",
            "typescript-react-apollo"
          ],
          config: {
            withHooks: true
          }
        }
      }
    },
    true
  );
}

codegen();
