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
    modelName: 'user',
    timestamps: true,
    paranoid: true,
  },
)

User.hasMany(Event, { foreignKey: { name: 'ownerId', allowNull: false } })
Event.belongsTo(User, { foreignKey: { name: 'ownerId', allowNull: false } })

User.hasMany(Question, { foreignKey: { name: 'authorId' } })
Question.belongsTo(User, { foreignKey: { name: 'authorId' } })

User.belongsToMany(Question, { through: 'usersVoteQuestions' })
Question.belongsToMany(User, { through: 'usersVoteQuestions' })

User.belongsToMany(Event, {
  through: 'eventAudiences',
  foreignKey: 'audienceId',
})
Event.belongsToMany(User, { through: 'eventAudiences' })

User.belongsToMany(Role, { through: 'userRoles', targetKey: 'name' })
Role.belongsToMany(User, { through: 'userRoles', sourceKey: 'name' })

export type UserModelStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): User
}

export default User as UserModelStatic
