import { enumType } from 'nexus'
import { ReviewStatus } from '../models/Question'

export const OrderByArg = enumType({
  name: 'OrderByArg',
  members: { Asc: 'ASC', Desc: 'DESC' },
})

export enum EventDateFilterEnum {
  All = 'ALL',
  Active = 'Active',
  Upcoming = 'UPCOMING',
  Past = 'PAST',
}
export const EventDateFilter = enumType({
  name: 'EventDateFilter',
  members: Object.values(EventDateFilterEnum),
})

export enum QuestionFilterEnum {
  Starred = 'STARRED',
  // Anwsered = 'ANWSERED',
  // Dismissed = 'DISMISSED',
}
export const QuestionFilter = enumType({
  name: 'QuestionFilter',
  members: [
    ...Object.values(ReviewStatus),
    ...Object.values(QuestionFilterEnum),
  ],
})

export enum QuestionOrderEnum {
  Popular = 'POPULAR',
  Recent = 'RECENT',
  Oldest = 'OLDEST',
}
export const QuestionOrder = enumType({
  name: 'QuestionOrder',
  members: Object.values(QuestionOrderEnum),
})
