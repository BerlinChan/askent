import {objectType, extendType, stringArg} from 'nexus'
import {
    UserSelect,
    UserCreateInput,
    UserWhereUniqueInput,
    UserWhereInput,
} from "@prisma/photon";
import {NexusGenFieldTypes} from 'nexus-typegen'
import {hash, compare} from 'bcryptjs'
import {sign} from 'jsonwebtoken'

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
export const AuthPayload = objectType({
    name: 'AuthPayload',
    definition(t) {
        t.string('token')
        t.field('user', {type: "User"})
    },
})
export const PGP = objectType({
    name: 'PGP',
    definition(t) {
        t.string('pubKey')
    }
})

export const userQuery = extendType({
    type: 'Query',
    definition(t) {
        t.field('nameOrEmailExisted', {
            type: "Boolean",
            description: "Test if a name or email has already existed.",
            args: {
                string: stringArg({required: true}),
            },
            resolve: async (root, {string}, {photon}): Promise<boolean> => {
                if (/@/.test(string)) {
                    return Boolean(await photon.users.findOne({
                        where: {email: string} as UserWhereUniqueInput,
                    }))
                } else {
                    return Boolean(await photon.users.findOne({
                        where: {name: string} as UserWhereUniqueInput,
                    }))
                }
            },
        })
        t.field('PGP', {
            type: 'PGP',
            resolve: (root, args, ctx) => {
                return {pubKey: process.env.PGP_PUB_KEY} as NexusGenFieldTypes['PGP']
            },
        })
    },
})

export const userMutation = extendType({
    type: 'Mutation',
    definition(t) {
        t.field('signup', {
            type: 'AuthPayload',
            description: 'Signup a new user.',
            args: {
                name: stringArg({required: true, description: 'User name'}),
                email: stringArg({required: true, description: 'User Email'}),
                password: stringArg({required: true}),
            },
            resolve: async (root, args, context, info) => {
                // TODO: move hash to client
                // const exist = await root.Query
                const hashedPassword = await hash(args.password, 10)
                const user = await context.photon.users.create({
                    data: {...args, password: hashedPassword} as UserCreateInput,
                    select: {id: true, name: true, email: true} as UserSelect,
                })
                return {
                    token: sign({userId: user.id}, process.env.JWT_SECRET as string),
                    user,
                }
            },
        })
        t.field('login', {
            type: "AuthPayload",
            args: {
                email: stringArg({required: true, description: 'User Email'}),
                password: stringArg({required: true}),
            },
            resolve: async (parent, args: UserWhereInput, context, info) => {
                const user = await context.photon.users.findOne({
                    where: {email: args.email} as UserWhereUniqueInput,
                })
                if (!user) {
                    throw new Error(`No user found for email: ${args.email}`)
                }
                const passwordValid = await compare(args.password as string, user.password)
                if (!passwordValid) {
                    throw new Error('Invalid password')
                }
                // TODO: console.log(user)

                return {
                    token: sign({userId: user.id}, process.env.JWT_SECRET as string),
                    user,
                }
            },
        })
    },
})
