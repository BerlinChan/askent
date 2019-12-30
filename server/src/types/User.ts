import {objectType, extendType} from 'nexus'

export const User = objectType({
    name: 'User',
    definition(t) {
        t.model.id()
        t.model.createdAt()
        t.model.updatedAt()
        t.model.lastLoginAt()
        t.model.name()
        t.model.email()
        t.model.events()
        t.model.questions()
    },
})

export const userQuery = extendType({
    type: 'Query',
    definition(t) {
        t.crud.user()
        t.crud.users()
    },
})

export const userMutation = extendType({
    type: 'Mutation',
    definition(t) {
        t.crud.createOneUser()
        t.crud.updateOneUser()
        t.crud.upsertOneUser()
        t.crud.deleteOneUser()

        t.crud.updateManyUser()
        t.crud.deleteManyUser()
    },
})
