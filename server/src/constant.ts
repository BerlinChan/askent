import { registerEnumType } from 'type-graphql'

export const DEFAULT_PAGE_OFFSET = 0
export const DEFAULT_PAGE_LIMIT = 50

export enum ReviewStatus {
  Review = 'Review',
  Publish = 'Publish',
  Archive = 'Archive',
}
registerEnumType(ReviewStatus, { name: 'ReviewStatus' })

export enum RoleName {
  Admin = 'Admin',
  Guest = 'Guest',
  Audience = 'Audience',
  Wall = 'Wall',
}
registerEnumType(RoleName, { name: 'RoleName' })

export enum EventDateStatus {
  Active = 'Active',
  Upcoming = 'Upcoming',
  Past = 'Past',
}
registerEnumType(EventDateStatus, { name: 'EventDateStatus' })

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
