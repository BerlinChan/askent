import { isAfter, isBefore, isEqual } from 'date-fns'
import { ObjectType, Field, ID, InputType, Root } from 'type-graphql'
import { User } from './User'
import { User as UserEntity } from '../entity/User'
import { Event as EventEntity } from '../entity/Event'
import { Question as QuestionEntity } from '../entity/Question'
import { IPagedType } from './Pagination'
import { Question } from './Question'
import { EventDateStatus } from '../constant'

@ObjectType()
export class Event {
  @Field((returns) => ID)
  public id!: string

  @Field((returns) => String)
  public code!: string

  @Field((returns) => String)
  public name!: string

  @Field((returns) => Date)
  public startAt!: Date

  @Field((returns) => Date)
  public endAt!: Date

  @Field((returns) => Boolean)
  public moderation!: boolean

  @Field((returns) => EventDateStatus)
  dateStatus(@Root() root: Event): EventDateStatus {
    const NOW = new Date()
    if (
      isAfter(NOW, new Date(root.startAt)) &&
      isBefore(NOW, new Date(root.endAt))
    ) {
      return EventDateStatus.Active
    } else if (
      isBefore(NOW, new Date(root.startAt)) ||
      isEqual(NOW, new Date(root.startAt))
    ) {
      return EventDateStatus.Upcoming
    } else {
      // if (
      // isAfter(NOW, new Date(root.endAt)) ||
      // isEqual(NOW, new Date(root.endAt))
      // )
      return EventDateStatus.Past
    }
  }

  @Field((returns) => User)
  public owner!: UserEntity

  @Field((returns) => [User])
  public guestes!: UserEntity[]

  @Field((returns) => [User])
  public audiences!: UserEntity[]

  @Field((returns) => [Question])
  public questions!: QuestionEntity[]

  @Field()
  public createdAt!: Date

  @Field()
  public updatedAt!: Date
}

@ObjectType({ implements: IPagedType })
export class EventPaged implements IPagedType {
  offset!: number
  limit!: number
  totalCount!: number
  hasNextPage!: boolean

  @Field((returns) => [Event])
  public list!: EventEntity[]
}

@InputType()
export class UpdateEventInput implements Partial<Event> {
  @Field((returns) => ID)
  public eventId!: string

  @Field({ nullable: true })
  public code?: string

  @Field({ nullable: true })
  public name?: string

  @Field({ nullable: true })
  public startAt?: Date

  @Field({ nullable: true })
  public endAt?: Date

  @Field({ nullable: true })
  public moderation?: boolean
}
