import {objectType, extendType, stringArg} from 'nexus'

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

export const userMutation = extendType({
    type: 'Mutation',
    definition(t) {
        t.field('createUser', {
            type: 'User',
            args: {
                name: stringArg(),
                email: stringArg(),
                password: stringArg(),
            },
            resolve: (parent, args, context, info) => {
                return context.photon.users.create({
                    data: args,
                    select: {id: true, name: true, email: true, password: false},
                })
            },
        })

        // t.crud.createOneUser()
    },
})
