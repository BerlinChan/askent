import { ReviewStatus } from '../entity/Question'
import { registerEnumType } from 'type-graphql'

export enum OrderByArg {
  Asc = 'Asc',
  Desc = 'Desc',
}
registerEnumType(OrderByArg, { name: 'OrderByArg' })

enum QuestionFilterExtend {
  Starred = 'Starred',
  // Anwsered = 'Anwsered',
  // Dismissed = 'Dismissed',
}
export const QuestionFilter = {
  ...ReviewStatus,
  ...QuestionFilterExtend,
}
export type QuestionFilter = ReviewStatus | QuestionFilterExtend
registerEnumType(QuestionFilter, { name: 'QuestionFilter' })

export enum QuestionOrder {
  Popular = 'Popular',
  Recent = 'Recent',
  Oldest = 'Oldest',
  Starred = 'Starred',
}
registerEnumType(QuestionOrder, { name: 'QuestionOrder' })
