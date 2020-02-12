import { objectType, extendType } from 'nexus'

export const Role = objectType({
  name: 'Role',
  definition(t) {
    t.model.id()
    t.model.name()
  },
})

export const roleQuery = extendType({
  type: 'Query',
  definition(t) {
    t.crud.role()
    t.crud.roles({ filtering: true, ordering: true })
  },
})

export const roleMutation = extendType({
  type: 'Mutation',
  definition(t) {
    // t.crud.createOneRole()
    // t.crud.updateOneRole()
    // t.crud.upsertOneRole()
    // t.crud.deleteOneRole()
    // t.crud.updateManyRole()
    // t.crud.deleteManyRole()
  },
})
