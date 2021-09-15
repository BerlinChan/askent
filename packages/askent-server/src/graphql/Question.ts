import {
  ObjectType,
  Field,
  ID,
  InputType,
  Root,
  Resolver,
  Arg,
  Ctx,
  Mutation,
  Int,
  ArgsType,
  Args,
} from "type-graphql";
import { Context } from "../context";
import { User as UserEntity } from "../entity/User";
import { ReviewStatus } from "../constant";
import { QUESTION_CONTENT_MAX_LENGTH } from "askent-common/src/constant";
import { Event as EventEntity } from "../entity/Event";
import { Question as QuestionEntity } from "../entity/Question";
import { Event } from "./EventType";
import { User } from "./User";
import { getRepository, Repository } from "typeorm";
import { MaxLength } from "class-validator";

@ObjectType()
export class Question {
  private questionRepository: Repository<QuestionEntity>;

  constructor() {
    this.questionRepository = getRepository(QuestionEntity);
  }

  @Field((returns) => ID)
  public id!: string;

  @Field()
  public content!: string;

  @Field()
  public anonymous!: boolean;

  @Field((returns) => ReviewStatus)
  public reviewStatus!: ReviewStatus;

  @Field()
  public star!: boolean;

  @Field()
  public top!: boolean;

  @Field((returns) => Int)
  public voteUpCount!: number;

  @Field((returns) => Int)
  public replyCount!: number;

  @Field((returns) => Event)
  async event(@Root() root: Question): Promise<EventEntity> {
    const event = await this.questionRepository
      .createQueryBuilder()
      .relation(QuestionEntity, "event")
      .of(root.id)
      .loadOne();

    return event;
  }

  @Field((returns) => User, { nullable: true })
  async author(@Root() root: Question): Promise<UserEntity | undefined> {
    if (!root.anonymous) {
      const user = await this.questionRepository
        .createQueryBuilder()
        .relation(QuestionEntity, "author")
        .of(root.id)
        .loadOne();

      return user;
    }
  }

  @Field((returns) => Boolean)
  voted(@Root() root: Question, @Ctx() ctx: Context): Promise<boolean> {
    return getVoted(ctx, root.id);
  }

  @Field()
  public createdAt!: Date;

  @Field()
  public updatedAt!: Date;
}

@InputType()
class CreateQuestionInput implements Partial<Question> {
  @Field((returns) => ID)
  public eventId!: string;

  @Field()
  @MaxLength(QUESTION_CONTENT_MAX_LENGTH)
  public content!: string;

  @Field({ nullable: true, defaultValue: false })
  public anonymous: boolean = false;
}

@ArgsType()
class UpdateQuestionContentArgsType {
  @Field((type) => ID)
  questionId!: string;

  @Field((type) => String)
  @MaxLength(QUESTION_CONTENT_MAX_LENGTH)
  content!: string;
}

@Resolver((of) => Question)
export class QuestionResolver {
  private userRepository: Repository<UserEntity>;
  private eventRepository: Repository<EventEntity>;
  private questionRepository: Repository<QuestionEntity>;

  constructor() {
    this.userRepository = getRepository(UserEntity);
    this.eventRepository = getRepository(EventEntity);
    this.questionRepository = getRepository(QuestionEntity);
  }

  @Mutation((returns) => Question, { description: "Create question" })
  async createQuestion(
    @Arg("input", (returns) => CreateQuestionInput) input: CreateQuestionInput,
    @Ctx() ctx: Context
  ): Promise<QuestionEntity> {
    const { eventId, content, anonymous } = input;
    const authorId = ctx.user?.id as string;
    const author = await this.userRepository.findOneOrFail(authorId);
    const event = await this.eventRepository.findOneOrFail(eventId);
    const question = this.questionRepository.create({
      reviewStatus: event?.moderation
        ? ReviewStatus.Review
        : ReviewStatus.Publish,
      content,
      anonymous: anonymous || author.name === "",
      author,
      event,
    });
    await this.questionRepository.save(question);

    return question;
  }

  @Mutation((returns) => Question, {
    description: "Update a question review status.",
  })
  async updateQuestionReviewStatus(
    @Arg("questionId", (returns) => ID) questionId: string,
    @Arg("reviewStatus", (returns) => ReviewStatus) reviewStatus: ReviewStatus
  ): Promise<QuestionEntity> {
    await this.questionRepository.update(
      questionId,
      Object.assign(
        { reviewStatus },
        reviewStatus === ReviewStatus.Archive
          ? { top: false }
          : reviewStatus === ReviewStatus.Review
          ? { top: false, star: false }
          : {}
      )
    );
    const question = await this.questionRepository.findOneOrFail(questionId, {
      relations: ["event"],
    });

    return question;
  }

  @Mutation((returns) => Question, {
    description: "Update a question content.",
  })
  async updateQuestionContent(
    @Args((type) => UpdateQuestionContentArgsType)
    { questionId, content }: UpdateQuestionContentArgsType
  ): Promise<QuestionEntity> {
    await this.questionRepository.update(questionId, { content });
    const question = await this.questionRepository.findOneOrFail(questionId, {
      relations: ["event"],
    });

    return question;
  }

  @Mutation((returns) => Question, { description: "Update a question star." })
  async updateQuestionStar(
    @Arg("questionId", (returns) => ID) questionId: string,
    @Arg("star") star: boolean
  ): Promise<QuestionEntity> {
    await this.questionRepository.update(questionId, { star });
    const question = await this.questionRepository.findOneOrFail(questionId, {
      relations: ["event"],
    });

    return question;
  }

  @Mutation((returns) => Question, {
    description: "Top a question. Can only top one question at a time.",
  })
  async updateQuestionTop(
    @Arg("questionId", (returns) => ID) questionId: string,
    @Arg("top") top: boolean
  ): Promise<QuestionEntity> {
    const event = await this.questionRepository
      .createQueryBuilder()
      .relation(QuestionEntity, "event")
      .of(questionId)
      .loadOne();

    if (top) {
      // cancel preview top questions
      await this.questionRepository.update(
        { event, top: true },
        { top: false }
      );
    }

    await this.questionRepository.update(questionId, { top });
    const question = await this.questionRepository.findOneOrFail(questionId);

    return question;
  }

  @Mutation((returns) => Question, {
    description: "Delete a question by id.",
  })
  async deleteQuestion(
    @Arg("questionId", (returns) => ID) questionId: string
  ): Promise<Pick<QuestionEntity, "id">> {
    await this.questionRepository.softDelete(questionId);

    return { id: questionId };
  }

  @Mutation((returns) => Int, {
    description: "Delete all Review questions by event.",
  })
  async deleteAllReviewQuestions(
    @Arg("eventId", (returns) => ID) eventId: string
  ): Promise<number> {
    const event = await this.eventRepository.findOneOrFail(eventId);
    const { affected } = await this.questionRepository.softDelete({
      event,
      reviewStatus: ReviewStatus.Review,
    });

    return Number(affected);
  }

  @Mutation((returns) => Int, {
    description: "Publish all Review questions by event.",
  })
  async publishAllReviewQuestions(
    @Arg("eventId", (returns) => ID) eventId: string
  ): Promise<number> {
    const event = await this.eventRepository.findOneOrFail(eventId);
    const { affected } = await this.questionRepository.update(
      {
        event,
        reviewStatus: ReviewStatus.Review,
      },
      { reviewStatus: ReviewStatus.Publish }
    );

    return Number(affected);
  }

  @Mutation((returns) => Question, { description: "Vote a question." })
  async voteUpQuestion(
    @Arg("questionId", (returns) => ID) questionId: string,
    @Ctx() ctx: Context
  ): Promise<QuestionEntity> {
    const userId = ctx.user?.id as string;
    if (await getVoted(ctx, questionId)) {
      await this.questionRepository
        .createQueryBuilder()
        .relation(QuestionEntity, "voteUpUsers")
        .of(questionId)
        .remove(userId);
      await this.questionRepository.increment(
        { id: questionId },
        "voteUpCount",
        -1
      );
    } else {
      await this.questionRepository
        .createQueryBuilder()
        .relation(QuestionEntity, "voteUpUsers")
        .of(questionId)
        .add(userId);
      await this.questionRepository.increment(
        { id: questionId },
        "voteUpCount",
        1
      );
    }
    const question = await this.questionRepository.findOneOrFail(questionId, {
      relations: ["event"],
    });

    return question;
  }
}

async function getVoted(ctx: Context, questionId: string) {
  const userId = ctx.user?.id as string;
  if (!userId) return false;
  const question = await getRepository(QuestionEntity)
    .createQueryBuilder("question")
    .where({ id: questionId })
    .innerJoin("question.voteUpUsers", "user", "user.id = :userId", { userId })
    .getOne();

  return Boolean(question);
}
