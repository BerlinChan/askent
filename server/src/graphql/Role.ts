import { objectType, extendType, enumType } from 'nexus'
import { RoleNameEnum } from '../models/Role'

export enum AudienceRoleEnum {
  All = 'ALL',
  ExcludeAuthor = 'EXCLUDE_AUTHOR',
  OnlyAuthor = 'ONLY_AUTHOR',
}
export const RoleName= enumType({
  name: 'RoleName',
  members: Object.values(RoleNameEnum),
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
