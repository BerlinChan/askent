import {
  ObjectType,
  Field,
  ID,
  Resolver,
  Query,
  Arg,
  Ctx,
  Mutation,
} from 'type-graphql'
import { Context } from '../context'
import { Question as QuestionEntity } from '../entity/Question'
import { ReviewStatus } from '../constant'
import { Reply as ReplyEntity } from '../entity/Reply'
import { getRepository, Repository } from 'typeorm'

@ObjectType()
export class Reply {
  constructor() {}

  @Field((returns) => ID)
  public id!: string

  @Field()
  public content!: string

  @Field((returns) => ReviewStatus)
  public reviewStatus!: ReviewStatus

  @Field()
  public createdAt!: Date

  @Field()
  public updatedAt!: Date
}

@Resolver((of) => Reply)
export class ReplyResolver {
  private questionRepository: Repository<QuestionEntity>
  private replyRepository: Repository<ReplyEntity>

  constructor() {
    this.questionRepository = getRepository(QuestionEntity)
    this.replyRepository = getRepository(ReplyEntity)
  }

  @Query((returns) => [Reply])
  async repliesByQuestion(
    @Arg('questionId', (returns) => ID) questionId: string,
    @Ctx() ctx: Context,
  ): Promise<ReplyEntity[]> {
    const replies = await this.replyRepository.find({
      question: { id: questionId },
    })

    return replies
  }

  @Mutation((returns) => Reply)
  async createReply(
    @Arg('questionId', (returns) => ID) questionId: string,
    @Arg('content') content: string,
    @Ctx() ctx: Context,
  ): Promise<ReplyEntity> {
    const authorId = ctx.user?.id
    const question = await this.questionRepository
      .createQueryBuilder('question')
      .leftJoinAndSelect('question.event', 'event')
      .leftJoinAndSelect('event.owner', 'owner', 'owner.id = :authorId', {
        authorId,
      })
      .leftJoinAndSelect('event.guestes', 'guest', 'guest.id = :authorId', {
        authorId,
      })
      .where('question.id = :questionId', { questionId })
      .getOne()
    const reply = this.replyRepository.create({
      content,
      isModerator: Boolean(
        question?.event?.owner || question?.event?.guestes.length,
      ),
      question: { id: questionId },
      author: { id: authorId },
    })

    await this.replyRepository.save(reply)

    return reply
  }
}
