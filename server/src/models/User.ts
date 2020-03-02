import { BuildOptions, DataTypes, Model } from 'sequelize'
import sequelize from '../db'
import Event from './Event'
import Question from './Question'
import Role from './Role'

const { STRING, UUID, UUIDV1 } = DataTypes

export class User extends Model {
  public id!: string
  public fingerprint?: string
  public email?: string
  public password?: string
  public name?: string
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
  public readonly deletedAt?: Date
}

User.init(
  {
    id: {
      type: UUID,
      defaultValue: UUIDV1,
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
    modelName: 'User',
    timestamps: true,
    paranoid: true,
  },
)

User.hasMany(Event, { foreignKey: { name: 'ownerId', allowNull: false } })
Event.belongsTo(User)

User.hasMany(Question, { foreignKey: { name: 'authorId' } })
Question.belongsTo(User)

User.belongsToMany(Question, { through: 'UsersVoteQuestions' })
Question.belongsToMany(User, { through: 'UsersVoteQuestions' })

User.belongsToMany(Event, { through: 'EventAudiences' })
Event.belongsToMany(User, { through: 'EventAudiences' })

User.belongsToMany(Role, { through: 'UserRoles' })
Role.belongsToMany(User, { through: 'UserRoles' })

export type UserModelStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): User
}

export default User as UserModelStatic
