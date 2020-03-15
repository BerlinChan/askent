import {
  BuildOptions,
  DataTypes,
  Model,
  HasManyGetAssociationsMixin,
} from 'sequelize'
import sequelize from '../db'
import Event, { EventModelStatic } from './Event'
import Question, { QuestionModelStatic } from './Question'
import Role, { RoleModelStatic } from './Role'

const { STRING, UUID, UUIDV4 } = DataTypes

export class User extends Model {
  public id!: string
  public fingerprint?: string
  public email?: string
  public password?: string
  public name?: string

  public roles!: RoleModelStatic[]
  public events!: EventModelStatic[]
  public questions!: QuestionModelStatic[]
  public voteUpQuestions!: QuestionModelStatic[]

  public getVotedQuestions!: HasManyGetAssociationsMixin<QuestionModelStatic> // Note the null assertions!

  public readonly createdAt!: Date
  public readonly updatedAt!: Date
  public readonly deletedAt?: Date
}

User.init(
  {
    id: {
      type: UUID,
      defaultValue: UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    fingerprint: {
      type: STRING,
      unique: true,
    },
    email: {
      type: STRING,
      unique: true,
    },
    password: {
      type: STRING,
    },
    name: STRING,
  },
  {
    sequelize,
    modelName: 'user',
    timestamps: true,
    paranoid: true,
  },
)

User.hasMany(Event, { foreignKey: { name: 'ownerId' } })
Event.belongsTo(User, { foreignKey: { name: 'ownerId' }, as: 'owner' })

User.hasMany(Question, { foreignKey: { name: 'authorId' } })
Question.belongsTo(User, { foreignKey: { name: 'authorId' }, as: 'author' })

User.belongsToMany(Question, {
  through: 'usersVoteUpQuestions',
  as: 'voteUpQuestions',
})
Question.belongsToMany(User, {
  through: 'usersVoteUpQuestions',
  as: 'voteUpUsers',
})

User.belongsToMany(Event, {
  through: 'eventAudiences',
  foreignKey: 'audienceId',
  as: 'joinedEvents',
})
Event.belongsToMany(User, { through: 'eventAudiences', as: 'audiences' })

User.belongsToMany(Role, { through: 'userRoles' })
Role.belongsToMany(User, { through: 'userRoles' })

export type UserModelStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): User
}

export default User as UserModelStatic
