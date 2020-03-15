import { BuildOptions, DataTypes, Model } from 'sequelize'
import sequelize from '../db'
import Question, { QuestionModelStatic } from './Question'
import { UserModelStatic } from './User'
import { isAfter, isBefore, isEqual } from 'date-fns'

const { BOOLEAN, STRING, UUID, UUIDV4, DATE, VIRTUAL } = DataTypes

export enum EventDateStatusEnum {
  Active = 'ACTIVE',
  Upcoming = 'UPCOMING',
  Past = 'PAST',
}

export class Event extends Model {
  public id!: string
  public code!: string
  public name!: string
  public startAt!: Date
  public endAt!: Date
  public moderation?: boolean

  public dateStatus!: EventDateStatusEnum

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
      defaultValue: UUIDV4,
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
    dateStatus: {
      type: VIRTUAL,
      get(this: Event) {
        const now = new Date()
        if (
          isAfter(now, new Date(this.getDataValue('startAt'))) &&
          isBefore(now, new Date(this.getDataValue('endAt')))
        ) {
          return EventDateStatusEnum.Active
        } else if (
          isAfter(now, new Date(this.getDataValue('endAt'))) ||
          isEqual(now, new Date(this.getDataValue('endAt')))
        ) {
          return EventDateStatusEnum.Past
        } else if (
          isBefore(now, new Date(this.getDataValue('startAt'))) ||
          isEqual(now, new Date(this.getDataValue('startAt')))
        ) {
          return EventDateStatusEnum.Upcoming
        }
      },
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
