import { Resolver, Ctx, Mutation, Int, Arg } from 'type-graphql'
import { addDays } from 'date-fns'
import { Context } from '../context'
import { Event as EventEntity } from '../entity/Event'
import { Question as QuestionEntity } from '../entity/Question'
import { ReviewStatus,RoleName } from '../constant'
import { Event } from './EventType'
import { Repository, getRepository } from 'typeorm'
import { User as UserEntity } from '../entity/User'
import { Role as RoleEntity } from '../entity/Role'
import { Reply as ReplyEntity } from '../entity/Reply'

@Resolver((of) => Event)
export class SeedResolver {
  private userRepository: Repository<UserEntity>
  private eventRepository: Repository<EventEntity>
  private questionRepository: Repository<QuestionEntity>
  private roleRepository: Repository<RoleEntity>
  private replyRepository: Repository<ReplyEntity>

  constructor() {
    this.userRepository = getRepository(UserEntity)
    this.eventRepository = getRepository(EventEntity)
    this.questionRepository = getRepository(QuestionEntity)
    this.roleRepository = getRepository(RoleEntity)
    this.replyRepository = getRepository(ReplyEntity)
  }

  @Mutation((returns) => Int)
  async seedRole(): Promise<number> {
    const { identifiers } = await this.roleRepository.insert(
      Object.values(RoleName).map((item) => ({ name: item })),
    )

    return identifiers.length
  }

  @Mutation((returns) => Int)
  async seedEvent(@Ctx() ctx: Context): Promise<number> {
    const userId = ctx.user?.id as string
    const owner = await this.userRepository.findOneOrFail(userId)
    const { identifiers } = await this.eventRepository.insert(
      Array.from({ length: 200 }, () => 'event').map((item, index) => ({
        code: `code_${index}`,
        name: `name_${index}`,
        startAt: addDays(new Date('2020-08-02T01:01:01'), index),
        endAt: addDays(new Date('2020-08-02T01:01:01'), index + 4),
        owner,
      })),
    )

    return identifiers.length
  }

  @Mutation((returns) => Int)
  async seedQuestion(
    @Arg('eventId') eventId: string,
    @Ctx() ctx: Context,
  ): Promise<number> {
    const userId = ctx.user?.id as string
    const author = await this.userRepository.findOneOrFail(userId)
    const event = await this.eventRepository.findOneOrFail(eventId)

    const { identifiers } = await this.questionRepository.insert(
      Array.from({ length: 100 }, () => 'question').map((item, index) => ({
        reviewStatus: ReviewStatus.Publish,
        content: `${Math.floor(Math.random() * 100000)}-${new Date()}`,
        event,
        author,
      })),
    )

    return identifiers.length
  }

  @Mutation((returns) => Int)
  async seedReply(
    @Arg('questionId') questionId: string,
    @Arg('anonymous', { nullable: true }) anonymous: boolean = false,
    @Ctx() ctx: Context,
  ): Promise<number> {
    const authorId = ctx.user?.id as string
    const question = await this.questionRepository
      .createQueryBuilder('question')
      .leftJoinAndSelect('question.event', 'event')
      .leftJoinAndSelect('event.owner', 'owner', 'owner.id = :ownerId', {
        ownerId: authorId,
      })
      .leftJoinAndSelect('event.guestes', 'guest', 'guest.id = :guestId', {
        guestId: authorId,
      })
      .where('question.id = :questionId', { questionId })
      .getOne()

    await this.questionRepository.increment(
      { id: questionId },
      'replyCount',
      100,
    )
    const { identifiers } = await this.replyRepository.insert(
      Array.from({ length: 100 }, () => 'reply').map((item, index) => ({
        content: `${Math.floor(Math.random() * 100000)}-${new Date()}`,
        anonymous,
        isModerator:
          !anonymous &&
          Boolean(question?.event?.owner || question?.event?.guestes.length),
        question: { id: questionId },
        author: { id: authorId },
      })),
    )

    return identifiers.length
  }
}
