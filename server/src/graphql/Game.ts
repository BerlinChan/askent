import { objectType, extendType, stringArg } from 'nexus'
// import { GameModelStatic } from '../models/Game'
// import { PlayerModelStatic } from '../models/Player'
import { dataloaderContext } from '../context'
const { EXPECTED_OPTIONS_KEY } = require('dataloader-sequelize')

export const Game = objectType({
  name: 'Game',
  definition(t) {
    t.id('id')
    t.string('title')

    t.field('player', {
      type: 'Player',
      resolve: async (root, args, ctx) => {
        const game = await ctx.db.Game.findByPk(root.id, {
          [EXPECTED_OPTIONS_KEY]: dataloaderContext,
        })

        return game.getPlayer({
          [EXPECTED_OPTIONS_KEY]: dataloaderContext,
        })
      },
    })

    // t.list.field('chain', {
    //   type: 'Game',
    //   resolve(root, args, ctx) {
    //     const games = ctx.db.Game.findByPk(root.id)
    //       .then((game: GameModelStatic) => game.getPlayer())
    //       .then((player: PlayerModelStatic) => player.getGames())
    //     return games
    //   },
    // })
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
