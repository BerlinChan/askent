import {nexusPrismaPlugin} from 'nexus-prisma'
import {makeSchema} from 'nexus'
import * as types from './types'

export const schema = makeSchema({
    types: types,
    plugins: [nexusPrismaPlugin()],
    outputs: {
        schema: __dirname + '/generated/schema.graphql',
        typegen: __dirname + '/generated/nexus.ts',
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
