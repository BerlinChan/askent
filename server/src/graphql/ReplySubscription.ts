import {
  Subscription,
  Resolver,
  ObjectType,
  Field,
  ID,
  ResolverFilterData,
  Root,
  ArgsType,
  Args,
  Ctx,
  Int,
} from 'type-graphql'
import { Context } from '../context'
import { Reply, findReplyAndCountAll } from './Reply'
import { Reply as ReplyEntity } from '../entity/Reply'
import { ReplyQueryMeta } from '../entity/ReplyQueryMeta'
import { getRepository, Repository } from 'typeorm'
import * as R from 'ramda'
import { SubscriptionTopics } from '../constant'

@ObjectType()
export class ReplyRealtimeSearchPayload {
  @Field((returns) => ID)
  public questionId!: string
}

@ArgsType()
export class ReplyRealtimeSearchArgs {
  @Field()
  public questionId!: string

  @Field()
  public hash!: string
}

@ObjectType()
export class ReplyRealtimeSearchResult {
  @Field((returns) => Int)
  public totalCount!: number

  @Field((returns) => [Reply])
  public insertList!: ReplyEntity[]

  @Field((returns) => [Reply])
  public updateList!: ReplyEntity[]

  @Field((returns) => [ID])
  public deleteList!: string[]
}

@Resolver((of) => Reply)
export class ReplySubscription {
  private replyQueryMetaRepo: Repository<ReplyQueryMeta>

  constructor() {
    this.replyQueryMetaRepo = getRepository(ReplyQueryMeta)
  }

  @Subscription((returns) => ReplyRealtimeSearchResult, {
    topics: SubscriptionTopics.REPLY_REALTIME_SEARCH,
    filter: ({
      payload,
      args,
      context,
    }: ResolverFilterData<
      ReplyRealtimeSearchPayload,
      ReplyRealtimeSearchArgs,
      Context
    >) => {
      return payload.questionId === args.questionId
    },
  })
  async replyRealtimeSearch(
    @Root() payload: ReplyRealtimeSearchPayload,
    @Args() { questionId, hash }: ReplyRealtimeSearchArgs,
    @Ctx() ctx: Context,
  ): Promise<ReplyRealtimeSearchResult> {
    const replyMeta = await this.replyQueryMetaRepo.findOneOrFail(hash)
    const oldList = (JSON.parse(replyMeta.list) as ReplyEntity[]).map(
      (item) => ({
        ...item,
        updatedAt: new Date(item.updatedAt),
      }),
    )
    const { totalCount, list: newList } = await findReplyAndCountAll(
      replyMeta.query,
      replyMeta.query.asRole,
      ctx.connection?.context.id as string,
    )
    await this.replyQueryMetaRepo.update(hash, {
      list: JSON.stringify(
        newList.map((item) => ({ id: item.id, updatedAt: item.updatedAt })),
      ),
    })
    const insertList = R.differenceWith(
      (x, y) => x.id === y.id,
      newList,
      oldList,
    )
    const updateList = newList.filter((newReply) => {
      const findOldReply = oldList.find((oldItem) => oldItem.id === newReply.id)
      return findOldReply && newReply.updatedAt > findOldReply.updatedAt
    })
    const deleteList = R.differenceWith(
      (x, y) => x.id === y.id,
      oldList,
      newList,
    ).map((item) => item.id)

    return {
      totalCount,
      insertList,
      updateList,
      deleteList,
    }
  }
}
