import {
  registerEnumType,
  ObjectType,
  Field,
  ID,
  InputType,
  Root,
  Resolver,
  Query,
  Arg,
  Ctx,
  Mutation,
  Int,
} from 'type-graphql'
import { getAuthedUser } from '../utils'
import { Context } from '../context'
import { User as UserEntity } from '../entity/User'
import { QuestionOrder, QuestionFilter } from './FilterOrder'
import { IPagedType, PaginationInput } from './Pagination'
import { ReviewStatus } from '../model/Question'
import {
  EventModel,
  EventSchema,
  QuestionModel,
  QuestionSchema,
} from '../model'
import { Event } from './Event'
import { User } from './User'
import { plainToClass } from 'class-transformer'
import { getRepository } from 'typeorm'
import { RoleName } from '../entity/Role'
import { FilterQuery } from 'mongoose'

registerEnumType(ReviewStatus, { name: 'ReviewStatus' })

@ObjectType()
export class Question {
  @Field(returns => ID)
  public _id!: string

  @Field(returns => ID)
  get id(): string {
    return this._id
  }

  @Field()
  public content!: string

  @Field()
  public anonymous!: boolean

  @Field(returns => ReviewStatus)
  public reviewStatus!: ReviewStatus

  @Field()
  public star!: boolean

  @Field()
  public top!: boolean

  @Field(returns => Int)
  public voteUpCount!: number

  @Field(returns => Event)
  async event(@Root() root: Question): Promise<EventSchema> {
    const question = await QuestionModel.findById(root.id)
      .populate('event')
      .lean(true)
    if (!question?.event) {
      throw new Error()
    }

    return question.event as EventSchema
  }

  @Field(returns => User, { nullable: true })
  async author(@Root() root: Question): Promise<User | undefined> {
    if (!root.anonymous) {
      const question = await QuestionModel.findById(root.id).lean(true)
      const user = await getRepository(UserEntity).findOne(question?.authorId)

      return plainToClass(User, user)
    }
  }

  @Field(returns => Boolean)
  voted(@Root() root: Question, @Ctx() ctx: Context): Promise<boolean> {
    return getVoted(ctx, root.id)
  }

  @Field()
  public createdAt!: Date

  @Field()
  public updatedAt!: Date
}

@ObjectType({ implements: IPagedType })
export class QuestionPaged implements IPagedType {
  offset!: number
  limit!: number
  totalCount!: number
  hasNextPage!: boolean

  @Field(returns => [Question])
  public list!: QuestionSchema[]
}

@InputType()
export class QuestionSearchInput {
  @Field(returns => ID)
  public eventId!: string

  @Field(returns => QuestionFilter, {
    nullable: true,
    defaultValue: QuestionFilter.Publish,
  })
  public questionFilter: QuestionFilter = QuestionFilter.Publish

  @Field({ nullable: true, defaultValue: '' })
  public searchString: string = ''

  @Field(returns => PaginationInput)
  public pagination!: PaginationInput

  @Field(returns => QuestionOrder, {
    nullable: true,
    defaultValue: QuestionOrder.Popular,
  })
  public order: QuestionOrder = QuestionOrder.Popular
}

@InputType()
export class CreateQuestionInput implements Partial<Question> {
  @Field(returns => ID)
  public eventId!: string

  @Field()
  public content!: string

  @Field({ nullable: true, defaultValue: false })
  public anonymous: boolean = false
}

@Resolver(of => Question)
export class QuestionResolver {
  @Query(returns => QuestionPaged, {
    description: 'Query question by event for Role.Admin.',
  })
  async questionsByEvent(
    @Arg('input', returns => QuestionSearchInput) input: QuestionSearchInput,
    @Ctx() ctx: Context,
  ): Promise<QuestionPaged> {
    const { pagination, order } = input
    const { offset, limit } = pagination
    const filter = getQuestionSearchFilter(input, RoleName.Admin, ctx)
    const totalCount = await QuestionModel.countDocuments(filter)
    const questions = await QuestionModel.find(filter)
      .sort(getQuestionSortArg(order, true))
      .skip(offset)
      .limit(limit)
      .lean(true)

    return {
      list: questions,
      hasNextPage: offset + limit < totalCount,
      totalCount,
      ...pagination,
    }
  }

  @Query(returns => QuestionPaged, {
    description: 'Query question by event for Role.Audience.',
  })
  async questionsByEventAudience(
    @Arg('input', returns => QuestionSearchInput) input: QuestionSearchInput,
    @Ctx() ctx: Context,
  ): Promise<QuestionPaged> {
    const { pagination, order } = input
    const { offset, limit } = pagination
    const filter = getQuestionSearchFilter(input, RoleName.Audience, ctx)
    const totalCount = await QuestionModel.countDocuments(filter)
    const questions = await QuestionModel.find(filter)
      .sort(getQuestionSortArg(order, true))
      .skip(offset)
      .limit(limit)
      .lean(true)

    return {
      list: questions,
      hasNextPage: offset + limit < totalCount,
      totalCount,
      ...pagination,
    }
  }

  @Query(returns => QuestionPaged, {
    description: 'Query question by event for Role.Wall.',
  })
  async questionsByEventWall(
    @Arg('input', returns => QuestionSearchInput) input: QuestionSearchInput,
    @Ctx() ctx: Context,
  ): Promise<QuestionPaged> {
    const { pagination, order } = input
    const { offset, limit } = pagination
    const filter = getQuestionSearchFilter(input, RoleName.Wall, ctx)
    const totalCount = await QuestionModel.countDocuments(filter)
    const questions = await QuestionModel.find(filter)
      .sort(getQuestionSortArg(order, true))
      .skip(offset)
      .limit(limit)
      .lean(true)

    return {
      list: questions,
      hasNextPage: offset + limit < totalCount,
      totalCount,
      ...pagination,
    }
  }

  @Query(returns => QuestionPaged, {
    description: 'Query question by event for Role.Wall.',
  })
  async questionsByMe(
    @Arg('pagination', returns => PaginationInput) pagination: PaginationInput,
    @Arg('order', returns => QuestionOrder, {
      nullable: true,
      defaultValue: QuestionOrder.Popular,
    })
    order: QuestionOrder,
    @Ctx() ctx: Context,
  ): Promise<QuestionPaged> {
    const { offset, limit } = pagination
    const authorId = getAuthedUser(ctx)?.id as string
    const filter = {
      authorId,
      reviewStatus: { $in: [ReviewStatus.Publish, ReviewStatus.Review] },
    }
    const totalCount = await QuestionModel.countDocuments(filter)
    const questions = await QuestionModel.find(filter)
      .sort(getQuestionSortArg(order))
      .skip(offset)
      .limit(limit)
      .lean(true)

    return {
      list: questions,
      hasNextPage: offset + limit < totalCount,
      totalCount,
      ...pagination,
    }
  }

  @Mutation(returns => Question, { description: 'Create question' })
  async createQuestion(
    @Arg('input', returns => CreateQuestionInput) input: CreateQuestionInput,
    @Ctx() ctx: Context,
  ): Promise<QuestionSchema> {
    const { eventId, content, anonymous } = input
    const authorId = getAuthedUser(ctx)?.id as string
    const event = await EventModel.findById(eventId).lean(true)
    const question = await QuestionModel.create({
      reviewStatus: event?.moderation
        ? ReviewStatus.Review
        : ReviewStatus.Publish,
      content,
      anonymous,
      authorId,
      event: eventId,
    })

    return question
  }

  @Mutation(returns => Question, {
    description: 'Update a question review status.',
  })
  async updateQuestionReviewStatus(
    @Arg('questionId', returns => ID) questionId: string,
    @Arg('reviewStatus', returns => ReviewStatus) reviewStatus: ReviewStatus,
  ): Promise<QuestionSchema> {
    const question = await QuestionModel.findByIdAndUpdate(
      questionId,
      Object.assign(
        { reviewStatus },
        reviewStatus === ReviewStatus.Archive
          ? { top: false }
          : reviewStatus === ReviewStatus.Review
          ? { top: false, star: false }
          : {},
      ),
      { new: true },
    ).lean(true)
    if (!question) {
      throw new Error()
    }

    return question
  }

  @Mutation(returns => Question, { description: 'Update a question content.' })
  async updateQuestionContent(
    @Arg('questionId', returns => ID) questionId: string,
    @Arg('content') content: string,
  ): Promise<QuestionSchema> {
    const question = await QuestionModel.findByIdAndUpdate(
      questionId,
      { content },
      { new: true },
    ).lean(true)
    if (!question) {
      throw new Error()
    }

    return question
  }

  @Mutation(returns => Question, { description: 'Update a question star.' })
  async updateQuestionStar(
    @Arg('questionId', returns => ID) questionId: string,
    @Arg('star') star: boolean,
  ): Promise<QuestionSchema> {
    const question = await QuestionModel.findByIdAndUpdate(
      questionId,
      { star },
      { new: true },
    ).lean(true)
    if (!question) {
      throw new Error()
    }

    return question
  }

  @Mutation(returns => Question, {
    description: 'Top a question. Can only top one question at a time.',
  })
  async updateQuestionTop(
    @Arg('questionId', returns => ID) questionId: string,
    @Arg('top') top: boolean,
  ): Promise<QuestionSchema> {
    let question = await QuestionModel.findById(questionId)
    if (!question) {
      throw new Error()
    }
    if (top) {
      // cancel preview top questions
      await QuestionModel.updateMany(
        { eventId: question?.event, top: true },
        { top: false },
      )
    }

    question.top = top
    await question.save()

    return question
  }

  @Mutation(returns => ID, {
    description: 'Delete a question by id.',
  })
  async deleteQuestion(
    @Arg('questionId', returns => ID) questionId: string,
  ): Promise<string> {
    await QuestionModel.deleteOne({ _id: questionId })

    return questionId
  }

  @Mutation(returns => Int, {
    description: 'Delete all Review questions by event.',
  })
  async deleteAllReviewQuestions(
    @Arg('eventId', returns => ID) eventId: string,
  ): Promise<number> {
    const { deletedCount } = await QuestionModel.deleteMany({
      event: eventId,
      reviewStatus: ReviewStatus.Review,
    })

    return deletedCount as number
  }

  @Mutation(returns => Int, {
    description: 'Publish all Review questions by event.',
  })
  async publishAllReviewQuestions(
    @Arg('eventId', returns => ID) eventId: string,
  ): Promise<number> {
    const { nModified } = await QuestionModel.updateMany(
      {
        event: eventId,
        reviewStatus: ReviewStatus.Review,
      },
      { reviewStatus: ReviewStatus.Publish },
    )

    return nModified as number
  }

  @Mutation(returns => Question, { description: 'Vote a question.' })
  async voteUpQuestion(
    @Arg('questionId', returns => ID) questionId: string,
    @Ctx() ctx: Context,
  ): Promise<QuestionSchema> {
    const userId = getAuthedUser(ctx)?.id as string
    const question = await QuestionModel.findByIdAndUpdate(
      questionId,
      (await getVoted(ctx, questionId))
        ? { $pull: { voteUpUsers: userId }, $inc: { voteUpCount: -1 } }
        : { $push: { voteUpUsers: userId }, $inc: { voteUpCount: 1 } },
      { new: true },
    ).lean(true)
    if (!question) {
      throw new Error()
    }

    return question
  }
}

async function getVoted(ctx: Context, questionId: string) {
  const userId = getAuthedUser(ctx)?.id as string
  if (!userId) return false
  const question = await QuestionModel.findOne({
    _id: questionId,
    voteUpUsers: { $all: [userId] },
  }).lean(true)

  return Boolean(question)
}

export function getQuestionSortArg(
  questionOrder: QuestionOrder,
  top?: boolean,
): { [key: string]: 1 | -1 } | {} {
  let arg
  switch (questionOrder) {
    case QuestionOrder.Recent:
      arg = { createdAt: -1, voteUpCount: -1 }
      break
    case QuestionOrder.Oldest:
      arg = { createdAt: 1, voteUpCount: -1 }
      break
    case QuestionOrder.Starred:
      arg = { star: -1, createdAt: -1 }
      break
    default:
      // QuestionOrder.Popular:
      arg = { voteUpCount: -1, createdAt: -1 }
  }

  return Object.assign(top ? { top: -1 } : {}, arg)
}

export function getQuestionSearchFilter(
  input: QuestionSearchInput,
  asRole: RoleName,
  ctx?: Context,
): FilterQuery<QuestionSchema> {
  const { eventId, questionFilter, searchString } = input
  const userId = ctx ? (getAuthedUser(ctx)?.id as string) : ''

  switch (asRole) {
    case RoleName.Admin:
      return Object.assign(
        { event: eventId },
        questionFilter === QuestionFilter.Starred
          ? { star: true }
          : { reviewStatus: questionFilter },
        { content: { $regex: new RegExp(searchString) } },
      )
    case RoleName.Audience:
      return {
        event: eventId,
        $or: [
          { reviewStatus: ReviewStatus.Publish },
          {
            $and: [{ authorId: userId }, { reviewStatus: ReviewStatus.Review }],
          },
        ],
      }
    default:
      // case RoleName.Wall:
      return { event: eventId, reviewStatus: ReviewStatus.Publish }
  }
}
