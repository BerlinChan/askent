import { Resolver, Ctx, Mutation, Int, Arg } from 'type-graphql'
import { addDays } from 'date-fns'
import { Context } from '../context'
import { EventModel, QuestionModel } from '../model'
import { Event } from './Event'
import { ReviewStatus } from '../model/Question'
import { Types } from 'mongoose'

@Resolver(of => Event)
export class SeedResolver {
  @Mutation(returns => Int)
  async seedEvent(@Ctx() ctx: Context): Promise<number> {
    const userId = ctx.user?.id as string
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

  @Mutation(returns => Int)
  async seedQuestion(
    @Arg('eventId') eventId: string,
    @Ctx() ctx: Context,
  ): Promise<number> {
    const userId = ctx.user?.id as string

    const { insertedCount } = await QuestionModel.bulkWrite(
      Array.from({ length: 100 }, () => 'question').map((item, index) => ({
        insertOne: {
          document: {
            reviewStatus: ReviewStatus.Publish,
            content: `${Math.floor(Math.random() * 100000)}-${new Date()}`,
            event: eventId,
            authorId: userId,
            ds_key: Types.ObjectId().toHexString(),
          },
        },
      })),
    )

    return insertedCount as number
  }
}
