import { enumType } from 'nexus'
import { ReviewStatusEnum } from '../models/Question'

export const OrderByArg = enumType({
  name: 'OrderByArg',
  members: { Asc: 'ASC', Desc: 'DESC' },
})

export enum QuestionFilterEnum {
  Starred = 'STARRED',
  // Anwsered = 'ANWSERED',
  // Dismissed = 'DISMISSED',
}
export const QuestionFilter = enumType({
  name: 'QuestionFilter',
  members: [
    ...Object.values(ReviewStatusEnum),
    ...Object.values(QuestionFilterEnum),
  ],
})

export enum QuestionOrderEnum {
  Popular = 'POPULAR',
  Recent = 'RECENT',
  Oldest = 'OLDEST',
  Starred = 'STARRED',
}
export const QuestionOrder = enumType({
  name: 'QuestionOrder',
  members: Object.values(QuestionOrderEnum),
})
