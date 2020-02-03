import {
  objectType,
  extendType,
  stringArg,
  idArg,
  inputObjectType,
  arg,
} from 'nexus'
import {
  User as UserType,
  UserCreateInput,
  UserWhereUniqueInput,
  UserWhereInput,
} from '@prisma/client'
import { NexusGenFieldTypes } from 'nexus-typegen'
import { hash, compare } from 'bcryptjs'
import { Context } from '../context'
import { getAdminUserId, signToken, getAudienceUserId } from '../utils'

export const User = objectType({
  name: 'User',
  definition(t) {
    t.model.id()
    t.model.createdAt()
    t.model.updatedAt()
    t.model.lastLoginAt()
    t.model.role()
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
export const UpdateAudienceInput = inputObjectType({
  name: 'UpdateAudienceInput',
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
          where: { id: getAdminUserId(ctx) },
        }) as Promise<UserType>
      },
    })
    t.field('meAudience', {
      type: 'User',
      description: 'Query my audience user info.',
      resolve: (root, args, ctx) => {
        return ctx.prisma.user.findOne({
          where: { id: getAudienceUserId(ctx) },
        }) as Promise<UserType>
      },
    })
    t.field('checkNameOrEmailExist', {
      type: 'Boolean',
      description: 'Check if a name or email has already exist.',
      args: {
        string: stringArg({ required: true }),
      },
      resolve: async (root, { string }, ctx) => {
        return await checkNameOrEmailExist(ctx, string)
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
        if (await checkNameOrEmailExist(ctx, args.name)) {
          throw new Error(ERROR_MESSAGE.nameExist(args.name))
        } else if (await checkNameOrEmailExist(ctx, args.email)) {
          throw new Error(ERROR_MESSAGE.emailExist(args.email))
        }
        const hashedPassword = await hash(args.password, 10)
        const user = await ctx.prisma.user.create({
          data: {
            ...args,
            password: hashedPassword,
            role: 'Admin',
          } as UserCreateInput,
        })

        return {
          token: signToken({ userId: user.id, role: user.role }),
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
          token: signToken({ userId: user.id, role: user.role }),
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
        if (!user) {
          user = await ctx.prisma.user.create({
            data: {
              fingerprint,
              role: 'Audience',
            },
          })
        }

        return {
          token: signToken({ userId: user.id, role: user.role }),
          user,
        }
      },
    })
    t.field('updateAudienceUser', {
      type: 'User',
      args: { input: arg({ type: 'UpdateAudienceInput', required: true }) },
      resolve: (root, { input }, ctx) => {
        const userId = getAudienceUserId(ctx)
        return ctx.prisma.user.update({
          where: { id: userId },
          data: input,
        })
      },
    })
  },
})

async function checkNameOrEmailExist(
  ctx: Context,
  string: string,
): Promise<boolean> {
  if (/@/.test(string)) {
    return Boolean(
      await ctx.prisma.user.findOne({
        where: { email: string } as UserWhereUniqueInput,
      }),
    )
  } else {
    return Boolean(
      await ctx.prisma.user.findOne({
        where: { name: string } as UserWhereUniqueInput,
      }),
    )
  }
}
async function checkFingerprintExist(
  ctx: Context,
  fingerprint: string,
): Promise<boolean> {
  return Boolean(
    await ctx.prisma.user.findOne({
      where: { fingerprint },
    }),
  )
}

const ERROR_MESSAGE = {
  nameExist: (name: string) => `Name "${name}" has already exist.`,
  emailExist: (email: string) => `Email "${email}" has already exist.`,
  fingerprintExist: (fingerprint: string) =>
    `Fingerprint "${fingerprint}" has already exist.`,
}
