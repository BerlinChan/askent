import { isAfter, isBefore, isEqual } from "date-fns";
import { ObjectType, ID, InputType, Root, ArgsType, Field } from "type-graphql";
import { User } from "./User";
import { User as UserEntity } from "../entity/User";
import { Event as EventEntity } from "../entity/Event";
import { Question as QuestionEntity } from "../entity/Question";
import { IPagedType } from "./Pagination";
import { Question } from "./Question";
import { EventDateStatus } from "../constant";
import {
  EVENT_CODE_MAX_LENGTH,
  EVENT_NAME_MAX_LENGTH,
} from "askent-common/src/constant";
import { IsDate, MaxLength } from "class-validator";

@ObjectType()
export class Event {
  @Field((returns) => ID)
  public id!: string;

  @Field((returns) => String)
  public code!: string;

  @Field((returns) => String)
  public name!: string;

  @Field((returns) => Date)
  public startAt!: Date;

  @Field((returns) => Date)
  public endAt!: Date;

  @Field((returns) => Boolean)
  public moderation!: boolean;

  @Field((returns) => EventDateStatus)
  dateStatus(@Root() root: Event): EventDateStatus {
    const NOW = new Date();
    if (
      isAfter(NOW, new Date(root.startAt)) &&
      isBefore(NOW, new Date(root.endAt))
    ) {
      return EventDateStatus.Active;
    } else if (
      isBefore(NOW, new Date(root.startAt)) ||
      isEqual(NOW, new Date(root.startAt))
    ) {
      return EventDateStatus.Upcoming;
    } else {
      // if (
      // isAfter(NOW, new Date(root.endAt)) ||
      // isEqual(NOW, new Date(root.endAt))
      // )
      return EventDateStatus.Past;
    }
  }

  @Field((returns) => User)
  public owner!: UserEntity;

  @Field((returns) => [User])
  public guestes!: UserEntity[];

  @Field((returns) => [User])
  public audiences!: UserEntity[];

  @Field((returns) => [Question])
  public questions!: QuestionEntity[];

  @Field()
  public createdAt!: Date;

  @Field()
  public updatedAt!: Date;
}

@ObjectType({ implements: IPagedType })
export class EventPaged implements IPagedType {
  offset!: number;
  limit!: number;
  totalCount!: number;
  hasNextPage!: boolean;

  @Field((returns) => [Event])
  public list!: EventEntity[];
}

@InputType()
export class UpdateEventInput implements Partial<Event> {
  @Field((returns) => ID)
  public eventId!: string;

  @Field({ nullable: true })
  @MaxLength(EVENT_CODE_MAX_LENGTH)
  public code?: string;

  @Field({ nullable: true })
  @MaxLength(EVENT_NAME_MAX_LENGTH)
  public name?: string;

  @Field({ nullable: true })
  @IsDate()
  public startAt?: Date;

  @Field({ nullable: true })
  @IsDate()
  public endAt?: Date;

  @Field({ nullable: true })
  public moderation?: boolean;
}

@ArgsType()
export class EventByCodeArgsType {
  @Field({ nullable: true, defaultValue: "" })
  @MaxLength(EVENT_CODE_MAX_LENGTH)
  code?: string;
}

@ArgsType()
export class CheckEventCodeExistArgsType {
  @Field()
  @MaxLength(EVENT_CODE_MAX_LENGTH)
  code!: string;
}

@ArgsType()
export class CreateEventArgsType {
  @Field()
  @MaxLength(EVENT_CODE_MAX_LENGTH)
  code!: string;

  @Field()
  @MaxLength(EVENT_NAME_MAX_LENGTH)
  name!: string;

  @Field((type) => Date)
  @IsDate()
  startAt!: Date;

  @Field((type) => Date)
  @IsDate()
  endAt!: Date;
}
