import { objectType, extendType, stringArg } from 'nexus'

export const Game = objectType({
  name: 'Game',
  definition(t) {
    t.id('id')
    t.string('title')
  },
})

export const gameQuery = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('games', {
      type: 'Game',
      resolve: (root, args, ctx) => {
        return ctx.db.Game.findAll()
      },
    })
  },
})
export const gameMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createGame', {
      type: 'Game',
      args: {
        title: stringArg({ required: true }),
      },
      resolve: async (root, { title }, ctx, info) => {
        const game = await ctx.db.Game.create({ title })

        return game
      },
    })
  },
})
