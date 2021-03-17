import { UserResolver } from './User'
import { RoleResolver } from './Role'
import { EventResolver } from './EventResolver'
import { QuestionResolver } from './Question'
import { QuestionSubscription } from './QuestionSubscription'
import { ReplyResolver } from './Reply'
import { ReplySubscription } from './ReplySubscription'
import { SeedResolver } from './Seed'

export default [
  UserResolver,
  RoleResolver,
  EventResolver,
  QuestionResolver,
  QuestionSubscription,
  ReplyResolver,
  ReplySubscription,
  SeedResolver,
] as const
