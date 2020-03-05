import path from 'path'
import { makeSchema } from 'nexus'
import * as types from './graphql'

export const schema = makeSchema({
  types: types,
  outputs: {
    schema: path.join(__dirname, '../build/schema.graphql'),
    typegen: path.join(
      __dirname,
      '../node_modules/@types/nexus-typegen/index.d.ts',
    ),
  },
  typegenAutoConfig: {
    contextType: 'Context.Context',
    sources: [
      {
        source: require.resolve('./context'),
        alias: 'Context',
      },
    ],
  },
})
