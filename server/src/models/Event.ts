import { BuildOptions, DataTypes, Model } from 'sequelize'
import sequelize from '../db'
import Question from './Question'

const { BOOLEAN, STRING, UUID, UUIDV1, DATE } = DataTypes

export class Event extends Model {
  public id!: string
  public code!: string
  public name!: string
  public startAt!: Date
  public endAt!: Date
  public moderation!: boolean
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
  public readonly deletedAt?: Date
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
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: 'event',
    timestamps: true,
    paranoid: true,
  },
)

Event.hasMany(Question)
Question.belongsTo(Event)

export type EventModelStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): Event
}

export default Event as EventModelStatic
