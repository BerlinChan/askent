import { objectType, extendType, stringArg } from 'nexus'
import {
  User as UserType,
  UserCreateInput,
  UserWhereUniqueInput,
  UserWhereInput,
} from '@prisma/photon'
import { NexusGenFieldTypes } from 'nexus-typegen'
import { hash, compare } from 'bcryptjs'
import { sign } from 'jsonwebtoken'
import { Context } from '../context'
import { getUserId } from '../utils'

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

export const userQuery = extendType({
  type: 'Query',
  definition(t) {
    t.field('me', {
      type: 'User',
      description: 'Query my user info.',
      resolve: (root, args, ctx) => {
        return ctx.photon.users.findOne({
          where: { id: getUserId(ctx) },
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
      resolve: async (root, args, context, info) => {
        // TODO: move hash to client
        if (await checkNameOrEmailExist(context, args.name)) {
          throw new Error(`Name "${args.name}" has already exist.`)
        } else if (await checkNameOrEmailExist(context, args.email)) {
          throw new Error(`Email "${args.email}" has already exist.`)
        }
        const hashedPassword = await hash(args.password, 10)
        const user = await context.photon.users.create({
          data: { ...args, password: hashedPassword } as UserCreateInput,
        })
        return {
          token: sign({ userId: user.id }, process.env.JWT_SECRET as string),
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
      resolve: async (parent, args: UserWhereInput, context, info) => {
        const user = await context.photon.users.findOne({
          where: { email: args.email } as UserWhereUniqueInput,
        })
        if (!user) {
          throw new Error(`No user found for email: ${args.email}`)
        }
        const passwordValid = await compare(
          args.password as string,
          user.password,
        )
        if (!passwordValid) {
          throw new Error('Invalid password')
        }

        return {
          token: sign({ userId: user.id }, process.env.JWT_SECRET as string),
          user,
        }
      },
    })
  },
})

async function checkNameOrEmailExist(
  context: Context,
  string: string,
): Promise<boolean> {
  if (/@/.test(string)) {
    return Boolean(
      await context.photon.users.findOne({
        where: { email: string } as UserWhereUniqueInput,
      }),
    )
  } else {
    return Boolean(
      await context.photon.users.findOne({
        where: { name: string } as UserWhereUniqueInput,
      }),
    )
  }
}
