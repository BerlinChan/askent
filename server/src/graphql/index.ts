import { UserResolver } from './User'
import { RoleResolver } from './Role'
import { EventResolver } from './Event-resolver'
import { QuestionResolver } from './Question'
import { ReplyResolver } from './Reply'
import { QuestionSubscription } from './QuestionSubscription'
import { SeedResolver } from './Seed'

export default [
  UserResolver,
  RoleResolver,
  EventResolver,
  QuestionResolver,
  QuestionSubscription,
  ReplyResolver,
  SeedResolver,
] as const
