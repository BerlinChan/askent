import {objectType, extendType, stringArg} from 'nexus'
import {UserSelect, UserCreateInput} from "@prisma/photon";

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
        t.field('register', {
            type: 'User',
            args: {
                name: stringArg({required: true, description: 'username'}),
                email: stringArg({required: true}),
                password: stringArg({required: true}),
            },
            resolve: async (parent, args, context, info) => {
                return await context.photon.users.create({
                    data: args as UserCreateInput,
                    select: {id: true, name: true, email: true} as UserSelect,
                })
            },
        })

        // t.crud.createOneUser()
    },
})
