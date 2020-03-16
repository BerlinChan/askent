import { BuildOptions, DataTypes, Model } from 'sequelize'
import sequelize from '../db'
import { UserModelStatic } from './User'
import { EventModelStatic } from './Event'

const { BOOLEAN, STRING, INTEGER, UUID, UUIDV4, ENUM } = DataTypes

export enum ReviewStatus {
  Review = 'REVIEW',
  Publish = 'PUBLISH',
  Archive = 'ARCHIVE',
}

export class Question extends Model {
  public id!: string
  public content!: string
  public anonymous!: boolean
  public reviewStatus!: ReviewStatus
  public star!: boolean
  public top!: boolean
  public voteUpCount!: number

  public event!: EventModelStatic
  public author!: UserModelStatic
  public voteUpUsers!: UserModelStatic[]

  public readonly createdAt!: Date
  public readonly updatedAt!: Date
  public readonly deletedAt?: Date
}

Question.init(
  {
    id: {
      type: UUID,
      defaultValue: UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    content: {
      type: STRING,
      defaultValue: '',
    },
    anonymous: {
      type: BOOLEAN,
      defaultValue: false,
    },
    reviewStatus: {
      type: ENUM({ values: Object.values(ReviewStatus) }),
      defaultValue: ReviewStatus.Publish,
    },
    star: {
      type: BOOLEAN,
      defaultValue: false,
    },
    top: {
      type: BOOLEAN,
      defaultValue: false,
    },
    voteUpCount: {
      type: INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'question',
    timestamps: true,
    paranoid: true,
  },
)

export type QuestionModelStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): Question
}

export default Question as QuestionModelStatic
