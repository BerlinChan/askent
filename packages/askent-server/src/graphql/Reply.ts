import {
  ObjectType,
  Field,
  ID,
  Resolver,
  Arg,
  Ctx,
  Mutation,
  InputType,
  Root,
} from "type-graphql";
import { Context } from "../context";
import { Question as QuestionEntity } from "../entity/Question";
import { Question } from "./Question";
import { User } from "./User";
import { User as UserEntity } from "../entity/User";
import { ReviewStatus } from "../constant";
import { REPLY_CONTENT_MAX_LENGTH } from "askent-common/src/constant";
import { Reply as ReplyEntity } from "../entity/Reply";
import { getRepository, Repository } from "typeorm";
import { MaxLength } from "class-validator";

@ObjectType()
export class Reply {
  private replyRepository: Repository<ReplyEntity>;

  constructor() {
    this.replyRepository = getRepository(ReplyEntity);
  }

  @Field((returns) => ID)
  public id!: string;

  @Field()
  public content!: string;

  @Field((returns) => ReviewStatus)
  public reviewStatus!: ReviewStatus;

  @Field({ description: "If author is a moderator of the event?" })
  public isModerator!: boolean;

  @Field()
  public anonymous!: boolean;

  @Field((returns) => Question)
  async question(@Root() root: Reply): Promise<QuestionEntity> {
    const question = await this.replyRepository
      .createQueryBuilder()
      .relation(ReplyEntity, "question")
      .of(root.id)
      .loadOne();

    return question;
  }

  @Field((returns) => User, { nullable: true })
  async author(@Root() root: Reply): Promise<UserEntity | undefined> {
    if (!root.anonymous) {
      const user = await this.replyRepository
        .createQueryBuilder()
        .relation(ReplyEntity, "author")
        .of(root.id)
        .loadOne();

      return user;
    }
  }

  @Field()
  public createdAt!: Date;

  @Field()
  public updatedAt!: Date;
}

@InputType()
export class CreateReplyInput implements Partial<Reply> {
  @Field((returns) => ID)
  public questionId!: string;

  @Field()
  @MaxLength(REPLY_CONTENT_MAX_LENGTH)
  public content!: string;

  @Field()
  public anonymous!: boolean;
}

@Resolver((of) => Reply)
export class ReplyResolver {
  private questionRepository: Repository<QuestionEntity>;
  private replyRepository: Repository<ReplyEntity>;

  constructor() {
    this.questionRepository = getRepository(QuestionEntity);
    this.replyRepository = getRepository(ReplyEntity);
  }

  @Mutation((returns) => Reply)
  async createReply(
    @Arg("input", (returns) => CreateReplyInput) input: CreateReplyInput,
    @Ctx() ctx: Context
  ): Promise<ReplyEntity> {
    const { questionId, content, anonymous } = input;
    const authorId = ctx.user?.id;
    const question = await this.questionRepository
      .createQueryBuilder("question")
      .leftJoinAndSelect("question.event", "event")
      .leftJoinAndSelect("event.owner", "owner", "owner.id = :ownerId", {
        ownerId: authorId,
      })
      .leftJoinAndSelect("event.guestes", "guest", "guest.id = :authorId", {
        authorId,
      })
      .where("question.id = :questionId", { questionId })
      .getOne();
    await this.questionRepository.increment(
      { id: questionId },
      "replyCount",
      1
    );
    const reply = this.replyRepository.create({
      content,
      anonymous,
      isModerator:
        !anonymous &&
        Boolean(question?.event?.owner || question?.event?.guestes.length),
      question: { id: questionId },
      author: { id: authorId },
    });
    await this.replyRepository.save(reply);

    return reply;
  }

  @Mutation((returns) => Reply, {
    description: "Update a reply's content.",
  })
  async updateReplyContent(
    @Arg("replyId", (returns) => ID) replyId: string,
    @Arg("content") content: string
  ): Promise<ReplyEntity> {
    await this.replyRepository.update(replyId, { content });
    const reply = await this.replyRepository.findOneOrFail(replyId, {
      relations: ["question"],
    });

    return reply;
  }

  @Mutation((returns) => Reply, {
    description: "Update a reply's review status.",
  })
  async updateReplyReviewStatus(
    @Arg("replyId", (returns) => ID) replyId: string,
    @Arg("reviewStatus", (returns) => ReviewStatus) reviewStatus: ReviewStatus
  ): Promise<ReplyEntity> {
    await this.replyRepository.update(replyId, { reviewStatus });
    const reply = (await this.replyRepository
      .createQueryBuilder("reply")
      .leftJoinAndSelect("reply.question", "question")
      .leftJoinAndSelect("question.event", "event")
      .where("reply.id = :replyId", { replyId })
      .getOne()) as ReplyEntity;
    if (reviewStatus === ReviewStatus.Publish) {
      await this.questionRepository.increment(
        { id: reply.question.id },
        "replyCount",
        1
      );
    } else {
      await this.questionRepository.decrement(
        { id: reply.question.id },
        "replyCount",
        1
      );
    }

    return reply;
  }

  @Mutation((returns) => Reply, {
    description: "Delete a reply by id.",
  })
  async deleteReply(
    @Arg("replyId", (returns) => ID) replyId: string
  ): Promise<Pick<ReplyEntity, "id">> {
    const reply = (await this.replyRepository
      .createQueryBuilder("reply")
      .leftJoinAndSelect("reply.question", "question")
      .leftJoinAndSelect("question.event", "event")
      .where("reply.id = :replyId", { replyId })
      .getOne()) as ReplyEntity;
    await this.replyRepository.softDelete(replyId);
    await this.questionRepository.decrement(
      { id: reply.question.id },
      "replyCount",
      1
    );

    return { id: replyId };
  }
}
