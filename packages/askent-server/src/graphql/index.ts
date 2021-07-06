import { UserResolver } from './User'
import { RoleResolver } from './Role'
import { EventResolver } from './EventResolver'
import { QuestionResolver } from './Question'
import { ReplyResolver } from './Reply'
import { SeedResolver } from './Seed'

export default [
  UserResolver,
  RoleResolver,
  EventResolver,
  QuestionResolver,
  ReplyResolver,
  SeedResolver,
] as const
