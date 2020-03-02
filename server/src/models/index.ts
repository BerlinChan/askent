import User, { UserModelStatic } from './User'
import Role, { RoleModelStatic } from './Role'
import Event, { EventModelStatic } from './Event'
import Question, { QuestionModelStatic } from './Question'

export default {
  User,
  Role,
  Event,
  Question,
}

export interface ModelType {
  User: UserModelStatic
  Role: RoleModelStatic
  Event: EventModelStatic
  Question: QuestionModelStatic
}
