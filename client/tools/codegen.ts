import { generate } from "@graphql-codegen/cli";
import config from '../src/config'

async function codegen() {
  await generate(
    {
      schema: config.api,
      documents: "./src/**/*.{graphql,ts,tsx}",
      generates: {
        ["src/generated/dataBinders.tsx"]: {
          plugins: [
            "typescript",
            "typescript-operations",
            "typescript-react-apollo"
          ],
          config: {
            withComponent: false,
            withHOC: false,
            withHooks: true
          }
        }
      }
    },
    true
  );
}

codegen();
