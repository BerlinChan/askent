import { objectType, extendType, enumType } from 'nexus'
import { RoleName } from '../models/Role'

export enum AudienceRole {
  All = 'ALL',
  ExcludeAuthor = 'EXCLUDE_AUTHOR',
  OnlyAuthor = 'ONLY_AUTHOR',
}
export const RoleNameEnum = enumType({
  name: 'RoleName',
  members: Object.values(RoleName),
})
export const Role = objectType({
  name: 'Role',
  definition(t) {
    t.id('id')
    t.string('name')
  },
})

export const roleQuery = extendType({
  type: 'Query',
  definition(t) {},
})

export const roleMutation = extendType({
  type: 'Mutation',
  definition(t) {},
})
