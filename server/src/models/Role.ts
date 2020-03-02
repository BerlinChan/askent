import { BuildOptions, DataTypes, Model } from 'sequelize'
import sequelize from '../db'

const { ENUM, UUID, UUIDV1 } = DataTypes

enum RoleName {
  Admin = 'ADMIN',
  Audience = 'AUDIENCE',
  Wall = 'WALL',
}

export class Role extends Model {
  public id!: string
  public name!: RoleName
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
  public readonly deletedAt?: Date
}

Role.init(
  {
    id: {
      type: UUID,
      defaultValue: UUIDV1,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: ENUM({ values: Object.values(RoleName) }),
      unique: true,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Role',
    timestamps: true,
    paranoid: true,
  },
)

export type RoleModelStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): Role
}

export default Role as RoleModelStatic
