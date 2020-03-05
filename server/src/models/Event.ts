import { BuildOptions, DataTypes, Model } from 'sequelize'
import sequelize from '../db'
import Question, { QuestionModelStatic } from './Question'
import { UserModelStatic } from './User'

const { BOOLEAN, STRING, UUID, UUIDV1, DATE } = DataTypes

export class Event extends Model {
  public id!: string
  public code!: string
  public name!: string
  public startAt!: Date
  public endAt!: Date
  public moderation?: boolean

  public owner!: UserModelStatic
  public audiences!: UserModelStatic[]
  public questions!: QuestionModelStatic[]

  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

Event.init(
  {
    id: {
      type: UUID,
      defaultValue: UUIDV1,
      allowNull: false,
      primaryKey: true,
    },
    code: {
      type: STRING,
      unique: true,
    },
    name: STRING,
    startAt: DATE,
    endAt: DATE,
    moderation: {
      type: BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: 'event',
    timestamps: true,
  },
)

Event.hasMany(Question)
Question.belongsTo(Event)

export type EventModelStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): Event
}

export default Event as EventModelStatic
