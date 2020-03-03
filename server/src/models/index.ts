import User, { UserModelStatic } from './User'
import Role, { RoleModelStatic } from './Role'
import Event, { EventModelStatic } from './Event'
import Question, { QuestionModelStatic } from './Question'
import Game, { GameModelStatic } from './Game'
import Player, { PlayerModelStatic } from './Player'

export default {
  User,
  Role,
  Event,
  Question,
  Game,
  Player,
}

export interface ModelType {
  User: UserModelStatic
  Role: RoleModelStatic
  Event: EventModelStatic
  Question: QuestionModelStatic
  Game: GameModelStatic
  Player: PlayerModelStatic
}
