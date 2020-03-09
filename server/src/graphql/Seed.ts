import { extendType } from 'nexus'
import { getAuthedUser } from '../utils'
import { addDays } from 'date-fns'
import { EventModelStatic } from '../models/Event'

export const seedMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.list.field('seedEvent', {
      type: 'Event',
      resolve: async (root, args, ctx) => {
        const userId = getAuthedUser(ctx)?.id as string
        const owner = await ctx.db.User.findByPk(userId)
        const events = await ctx.db.Event.bulkCreate(
          Array.from({ length: 200 }, () => 'event').map((item, index) => ({
            code: `code_n${index}`,
            name: `name_n ${index}`,
            startAt: addDays(new Date('2020-01-02T01:01:01Z'), index),
            endAt: addDays(new Date('2020-01-02T01:01:01Z'), index + 4),
          })),
        )
        events.forEach(
          async (event: EventModelStatic & { setOwner: any }) =>
            await event.setOwner(owner),
        )

        return events
      },
    })
  },
})
