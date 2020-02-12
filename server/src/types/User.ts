import {
  objectType,
  extendType,
  stringArg,
  inputObjectType,
  arg,
} from 'nexus'
import {
  RoleName,
  User as UserType,
  UserCreateInput,
  UserWhereUniqueInput,
  UserWhereInput,
} from '@prisma/client'
import { NexusGenFieldTypes } from 'nexus-typegen'
import { hash, compare } from 'bcryptjs'
import { Context } from '../context'
import { getAuthedUser, signToken } from '../utils'

export const User = objectType({
  name: 'User',
  definition(t) {
    t.model.id()
    t.model.createdAt()
    t.model.updatedAt()
    t.model.lastLoginAt()
    t.model.roles()
    t.model.name()
    t.model.email()
    t.model.events()
    t.model.questions()
    // t.model.fingerprint()
    // t.model.password()
  },
})
export const AuthPayload = objectType({
  name: 'AuthPayload',
  definition(t) {
    t.string('token')
    t.field('user', { type: 'User' })
  },
})
export const PGP = objectType({
  name: 'PGP',
  definition(t) {
    t.string('pubKey')
  },
})

export const UpdateUserInput = inputObjectType({
  name: 'UpdateUserInput',
  definition(t) {
    t.string('name')
    t.string('email')
  },
})

export const userQuery = extendType({
  type: 'Query',
  definition(t) {
    t.field('me', {
      type: 'User',
      description: 'Query my user info.',
      resolve: (root, args, ctx) => {
        return ctx.prisma.user.findOne({
          where: { id: getAuthedUser(ctx)?.id },
        }) as Promise<UserType>
      },
    })
    t.field('checkEmailExist', {
      type: 'Boolean',
      description: 'Check if a email has already exist.',
      args: {
        email: stringArg({ required: true }),
      },
      resolve: async (root, { email }, ctx) => {
        return await checkEmailExist(ctx, email)
      },
    })
    t.field('PGP', {
      type: 'PGP',
      resolve: (root, args, ctx) => {
        return { pubKey: process.env.PGP_PUB_KEY } as NexusGenFieldTypes['PGP']
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
        name: stringArg({ required: true, description: 'User name' }),
        email: stringArg({ required: true, description: 'User Email' }),
        password: stringArg({ required: true }),
      },
      resolve: async (root, args, ctx, info) => {
        if (await checkEmailExist(ctx, args.email)) {
          throw new Error(ERROR_MESSAGE.emailExist(args.email))
        }
        const hashedPassword = await hash(args.password, 10)
        const userRoles: Array<RoleName> = ['ADMIN', 'AUDIENCE', 'WALL']
        const user = await ctx.prisma.user.create({
          data: {
            ...args,
            password: hashedPassword,
            roles: { connect: userRoles.map(role => ({ name: role })) },
          } as UserCreateInput,
        })

        return {
          token: signToken({ id: user.id, roles: userRoles }),
          user,
        }
      },
    })
    t.field('login', {
      type: 'AuthPayload',
      args: {
        email: stringArg({ required: true, description: 'User Email' }),
        password: stringArg({ required: true }),
      },
      resolve: async (parent, args: UserWhereInput, ctx, info) => {
        const user = await ctx.prisma.user.findOne({
          where: { email: args.email } as UserWhereUniqueInput,
          include: { roles: true },
        })
        if (!user) {
          throw new Error(`No user found for email: ${args.email}`)
        }
        const passwordValid = await compare(
          args.password as string,
          user.password as string,
        )
        if (!passwordValid) {
          throw new Error('Invalid password')
        }

        return {
          token: signToken({
            id: user.id,
            roles: user.roles.map(role => role.name),
          }),
          user,
        }
      },
    })
    t.field('loginAudience', {
      type: 'AuthPayload',
      description: `Audience 登陆。
      若 fingerprint 的 User 已存在则返回 token，
      若 fingerprint 的 User 不存在则 create 并返回 token`,
      args: { fingerprint: stringArg({ required: true }) },
      resolve: async (root, { fingerprint }, ctx) => {
        let user = await ctx.prisma.user.findOne({
          where: { fingerprint },
        })
        const userRoles: Array<RoleName> = ['AUDIENCE']
        if (!user) {
          user = await ctx.prisma.user.create({
            data: {
              fingerprint,
              roles: { connect: userRoles.map(role => ({ name: role })) },
            },
          })
        }

        return {
          token: signToken({ id: user.id, roles: userRoles }),
          user,
        }
      },
    })
    t.field('updateUser', {
      type: 'User',
      args: { input: arg({ type: 'UpdateUserInput', required: true }) },
      resolve: (root, { input }, ctx) => {
        const userId = getAuthedUser(ctx)?.id
        return ctx.prisma.user.update({
          where: { id: userId },
          data: input,
        })
      },
    })
  },
})

async function checkEmailExist(ctx: Context, email: string): Promise<boolean> {
  return Boolean(
    await ctx.prisma.user.findOne({
      where: { email } as UserWhereUniqueInput,
    }),
  )
}

const ERROR_MESSAGE = {
  emailExist: (email: string) => `Email "${email}" has already exist.`,
}
