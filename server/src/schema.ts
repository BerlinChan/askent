import path from 'path'
import {makeSchema} from 'nexus'
import {nexusPrismaPlugin} from 'nexus-prisma'
import * as types from './types'

export const schema = makeSchema({
    types: types,
    plugins: [nexusPrismaPlugin()],
    outputs: {
        schema: path.join(__dirname, '../schema.graphql'),
        typegen: path.join(__dirname, '../node_modules/@types/nexus-typegen/index.d.ts'),
    },
    typegenAutoConfig: {
        contextType: 'Context.Context',
        sources: [
            {
                source: '@prisma/photon',
                alias: 'photon',
            },
            {
                source: require.resolve('./context'),
                alias: 'Context',
            },
        ],
    },
})
