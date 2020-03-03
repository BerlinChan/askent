import { BuildOptions, DataTypes, Model } from 'sequelize'
import sequelize from '../db'
import { PlayerModelStatic } from './Player'

const { STRING, UUID, UUIDV1 } = DataTypes

export class Game extends Model {
  public id!: string
  public title!: string

  public readonly player?: PlayerModelStatic[]
}

Game.init(
  {
    id: {
      type: UUID,
      defaultValue: UUIDV1,
      allowNull: false,
      primaryKey: true,
    },
    title: STRING,
  },
  {
    sequelize,
    modelName: 'game',
    timestamps: false,
  },
)

export type GameModelStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): Game
}

export default Game as GameModelStatic
