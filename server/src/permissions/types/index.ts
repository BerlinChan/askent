import * as R from 'ramda'
import EventRules from './Event'
import UserRules from './User'
import QuestionRules from './Question'

export const typeRules = R.mergeDeepLeft(
  R.mergeDeepLeft(EventRules, UserRules),
  QuestionRules,
)
