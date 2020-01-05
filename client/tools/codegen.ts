import { generate } from '@graphql-codegen/cli';

export default async function codegen() {

await generate(
    {
      schema: builtSchema.typeDefs,
      documents: './src/**/*.{graphql,ts,tsx}',
      generates: {
        [genTargetDir]: {
          plugins: [
            'typescript',
            'typescript-operations',
            'typescript-react-apollo',
          ],
        },
      },
    },
    true,
  );
}
