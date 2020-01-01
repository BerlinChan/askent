import {objectType, extendType, stringArg} from 'nexus'
import {
    UserSelect,
    UserCreateInput,
    UserWhereUniqueInput,
    UserWhereInput,
} from "@prisma/photon";
import {genSalt, hash, compare} from 'bcrypt'

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
        t.model.password()
    },
})

export const userQuery = extendType({
    type: 'Query',
    definition(t) {
        t.field('login', {
            type: 'User',
            args: {
                email: stringArg({required: true, description: 'User Email'}),
                password: stringArg({required: true}),
            },
            resolve: async (parent, args: UserWhereInput, context, info) => {
                const findUser = await context.photon.users.findOne({
                    where: {email: args.email} as UserWhereUniqueInput,
                })
                return findUser
                // TODO: console.log(findUser)
              /*  if (!(<any>findUser).data) {
                    return context.res.status(400).send('Cannot find user')
                }
                try {
                    if (await compare(args.password, (<any>findUser).data.password)) {
                        return findUser
                    } else {
                        // return context.res.send('Not Allowed')
                    }
                } catch {
                    // return context.res.status(500).send()
                }*/
            },
        })
    },
})

export const userMutation = extendType({
    type: 'Mutation',
    definition(t) {
        t.field('register', {
            type: 'User',
            args: {
                name: stringArg({required: true, description: 'User name'}),
                email: stringArg({required: true, description: 'User Email'}),
                password: stringArg({required: true}),
            },
            resolve: async (parent, args: UserCreateInput, context, info) => {
                const salt = await genSalt()
                const hashedPassword = await hash(args.password, salt)
                return await context.photon.users.create({
                    data: {...args, password: hashedPassword},
                    select: {id: true, name: true, email: true} as UserSelect,
                })
            },
        })

        // t.crud.createOneUser()
    },
})
