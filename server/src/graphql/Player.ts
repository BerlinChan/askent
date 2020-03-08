import { objectType, extendType, stringArg, idArg } from 'nexus'

export const Player = objectType({
  name: 'Player',
  definition(t) {
    t.id('id')
    t.string('name')
    t.list.field('games', {
      type: 'Game',
      resolve: async (root, args, ctx) => {
        const player = await ctx.db.Player.findByPk(root.id)
        return player.getGames()
      },
    })
  },
})

export const playerQuery = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('players', {
      type: 'Player',
      resolve: (root, args, ctx) => {
        return ctx.db.Player.findAll()
      },
    })
  },
})
export const playerMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createPlayer', {
      type: 'Player',
      args: {
        gameId: idArg({ required: true }),
        name: stringArg({ required: true }),
      },
      resolve: async (root, { name, gameId }, ctx, info) => {
        const player = await ctx.db.Player.create({ name })
        const game = await ctx.db.Game.findByPk(gameId)
        await player.addGame(game)

        return player
      },
    })
  },
})