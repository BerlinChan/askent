import { BuildOptions, DataTypes, Model } from 'sequelize'
import sequelize from '../db'
import Game, { GameModelStatic } from './Game'

const { STRING, UUID, UUIDV1 } = DataTypes

export class Player extends Model {
  public id!: string
  public name!: string

  public readonly games?: GameModelStatic[]
}

Player.init(
  {
    id: {
      type: UUID,
      defaultValue: UUIDV1,
      allowNull: false,
      primaryKey: true,
    },
    name: STRING,
  },
  {
    sequelize,
    modelName: 'player',
    timestamps: false,
  },
)

Player.hasMany(Game)
Game.belongsTo(Player)

export type PlayerModelStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): Player
}

export default Player as PlayerModelStatic
