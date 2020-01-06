const { generate } = require("@graphql-codegen/cli");

async function codegen() {
  const generatedFiles = await generate(
    {
      schema: "http://localhost:4000/graphql",
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

exports.default = codegen;
