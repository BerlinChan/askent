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
import { Question, findQuestionAndCountAll } from './Question'
import { Question as QuestionEntity } from '../entity/Question'
import { QuestionQueryMeta } from '../entity/QuestionQueryMeta'
import { getRepository, Repository } from 'typeorm'
import * as R from 'ramda'
import {  SubscriptionTopics } from '../constant'

@ObjectType()
export class QuestionRealtimeSearchPayload {
  @Field((returns) => ID)
  public eventId!: string
}

@ArgsType()
export class QuestionRealtimeSearchArgs {
  @Field({ description: 'Subscription which event?' })
  public eventId!: string

  @Field({ description: 'Hash id returned from questionsByEvent' })
  public hash!: string
}

@ObjectType()
export class QuestionRealtimeSearchResult {
  @Field((returns) => Int)
  public totalCount!: number

  @Field((returns) => [Question])
  public insertList!: QuestionEntity[]

  @Field((returns) => [Question])
  public updateList!: QuestionEntity[]

  @Field((returns) => [ID])
  public deleteList!: string[]
}

@Resolver((of) => Question)
export class QuestionSubscription {
  private questionQueryMetaRepo: Repository<QuestionQueryMeta>

  constructor() {
    this.questionQueryMetaRepo = getRepository(QuestionQueryMeta)
  }

  @Subscription((returns) => QuestionRealtimeSearchResult, {
    topics: SubscriptionTopics.QUESTION_REALTIME_SEARCH,
    filter: ({
      payload,
      args,
      context,
    }: ResolverFilterData<
      QuestionRealtimeSearchPayload,
      QuestionRealtimeSearchArgs,
      Context
    >) => {
      return payload.eventId === args.eventId
    },
  })
  async questionRealtimeSearch(
    @Root() payload: QuestionRealtimeSearchPayload,
    @Args() { eventId, hash }: QuestionRealtimeSearchArgs,
    @Ctx() ctx: Context,
  ): Promise<QuestionRealtimeSearchResult> {
    const questionMeta = await this.questionQueryMetaRepo.findOneOrFail(hash)
    const oldList = (JSON.parse(questionMeta.list) as QuestionEntity[]).map(
      (item) => ({
        ...item,
        updatedAt: new Date(item.updatedAt),
      }),
    )
    const { totalCount, list: newList } = await findQuestionAndCountAll(
      questionMeta.query,
      questionMeta.query.asRole,
      ctx.connection?.context.id as string,
    )
    await this.questionQueryMetaRepo.update(hash, {
      list: JSON.stringify(
        newList.map((item) => ({ id: item.id, updatedAt: item.updatedAt })),
      ),
    })
    const insertList = R.differenceWith(
      (x, y) => x.id === y.id,
      newList,
      oldList,
    )
    const updateList = newList.filter((newQuestion) => {
      const findOldQuestion = oldList.find(
        (oldItem) => oldItem.id === newQuestion.id,
      )
      return (
        findOldQuestion && newQuestion.updatedAt > findOldQuestion.updatedAt
      )
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
