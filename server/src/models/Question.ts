import { BuildOptions, DataTypes, Model } from 'sequelize'
import sequelize from '../db'

const { BOOLEAN, STRING, UUID, UUIDV1, ENUM } = DataTypes

enum ReviewStatus {
  Review = 'REVIEW',
  Publish = 'PUBLISH',
  Archive = 'ARCHIVE',
}

export class Question extends Model {
  public id!: string
  public content!: string
  public reviewStatus!: ReviewStatus
  public star!: boolean
  public top!: boolean
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
  public readonly deletedAt?: Date
}

Question.init(
  {
    id: {
      type: UUID,
      defaultValue: UUIDV1,
      allowNull: false,
      primaryKey: true,
    },
    content: {
      type: STRING,
      defaultValue: '',
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
  },
  {
    sequelize,
    modelName: 'Question',
    timestamps: true,
    paranoid: true,
  },
)

export type QuestionModelStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): Question
}

export default Question as QuestionModelStatic
