import {
  BuildOptions,
  DataTypes,
  Model,
  BelongsToGetAssociationMixin,
} from 'sequelize'
import sequelize from '../db'
import { PlayerModelStatic } from './Player'

const { STRING, UUID, UUIDV4 } = DataTypes

export class Game extends Model {
  public id!: string
  public title!: string

  public getPlayer!: BelongsToGetAssociationMixin<PlayerModelStatic>

  public readonly player?: PlayerModelStatic[]
}

Game.init(
  {
    id: {
      type: UUID,
      defaultValue: UUIDV4,
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
