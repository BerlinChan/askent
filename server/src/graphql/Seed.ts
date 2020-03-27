import { Resolver, Ctx, Mutation, Int } from 'type-graphql'
import { addDays } from 'date-fns'
import { getAuthedUser } from '../utils'
import { Context } from '../context'
import { EventModel } from '../model'
import { Event } from './Event'

@Resolver(of => Event)
export class SeedResolver {
  @Mutation(returns => Int)
  async seedEvent(@Ctx() ctx: Context): Promise<number> {
    const userId = getAuthedUser(ctx)?.id as string
    const { insertedCount } = await EventModel.bulkWrite(
      Array.from({ length: 200 }, () => 'event').map((item, index) => ({
        insertOne: {
          document: {
            code: `code_${index}`,
            name: `name_${index}`,
            startAt: addDays(new Date('2020-01-02T01:01:01Z'), index),
            endAt: addDays(new Date('2020-01-02T01:01:01Z'), index + 4),
            ownerId: userId,
          },
        },
      })),
    )

    return insertedCount as number
  }
}
