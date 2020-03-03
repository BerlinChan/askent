import { objectType, extendType, stringArg, inputObjectType, arg } from 'nexus'
import { NexusGenFieldTypes } from 'nexus-typegen'
import { hash, compare } from 'bcryptjs'
import { Context } from '../context'
import { getAuthedUser, signToken } from '../utils'
import { Op } from 'sequelize'
import { RoleModelStatic, RoleName } from '../models/Role'

export const User = objectType({
  name: 'User',
  definition(t) {
    t.id('id')
    t.string('email', { nullable: true })
    t.string('name', { nullable: true })

    t.list.field('roles', {
      type: 'Role',
      resolve: async (root, args, ctx) => {
        const user = await ctx.db.User.findOne({ where: { id: root.id } })
        return user.getRoles()
      },
    })
    t.list.field('events', {
      type: 'Event',
      resolve: async (root, args, ctx) => {
        const user = await ctx.db.User.findOne({ where: { id: root.id } })
        return user.getEvents()
      },
    })
    t.list.field('questions', {
      type: 'Question',
      resolve: async (root, args, ctx) => {
        const user = await ctx.db.User.findOne({ where: { id: root.id } })
        return user.getQuestions()
      },
    })
    t.list.field('votedQuestions', {
      type: 'Question',
      resolve: async (root, args, ctx) => {
        const user = await ctx.db.User.findOne({ where: { id: root.id } })
        return user.getVotedQuestions()
      },
    })

    t.field('createdAt', { type: 'DateTime' })
    t.field('updatedAt', { type: 'DateTime' })
    t.field('deletedAt', { type: 'DateTime', nullable: true })

    // t.string('fingerprint', { nullable: true })
    // t.string('password', { nullable: true })
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
        return ctx.db.User.findOne({
          where: {
            id: getAuthedUser(ctx)?.id as string,
          },
        })
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
        return { pubKey: process.env.JWT_PUB_KEY } as NexusGenFieldTypes['PGP']
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
        const hashedPassword = await hash(args.password, 10)
        const userRoles: Array<RoleName> = [
          RoleName.Admin,
          RoleName.Audience,
          RoleName.Wall,
        ]

        const roles = await ctx.db.Role.findAll({
          where: { [Op.or]: userRoles.map(role => ({ name: role })) },
        })
        const user = await ctx.db.User.create({
          ...args,
          password: hashedPassword,
        })
        await user.setRoles(roles)

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
      resolve: async (parent, { email, password }, ctx, info) => {
        const user = await ctx.db.User.findOne({
          where: { email },
          include: ['roles'],
        })
        // const roles = await user.getRoles()

        if (!user) {
          throw new Error(`No user found for email: ${email}`)
        }
        const passwordValid = await compare(password, user.password)
        if (!passwordValid) {
          throw new Error('Invalid password')
        }

        return {
          token: signToken({
            id: user.id,
            roles: user.roles.map((role: RoleModelStatic) => role.name),
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
        let user = await ctx.db.User.findOne({
          where: { fingerprint },
        })
        const roleNames: Array<RoleName> = [RoleName.Audience]
        if (!user) {
          const roles: Array<RoleModelStatic> = await ctx.db.Role.findAll({
            where: { [Op.or]: roleNames },
          })
          user = await ctx.db.User.create({
            fingerprint,
          })
          user.setRoles(roles)
        }

        return {
          token: signToken({ id: user.id, roles: roleNames }),
          user,
        }
      },
    })
    t.field('updateUser', {
      type: 'User',
      args: { input: arg({ type: 'UpdateUserInput', required: true }) },
      resolve: (root, { input }, ctx) => {
        const userId = getAuthedUser(ctx)?.id

        return ctx.db.User.update(input, { where: { id: userId as string } })
      },
    })
  },
})

async function checkEmailExist(ctx: Context, email: string): Promise<boolean> {
  return Boolean(
    await ctx.db.User.findOne({
      where: { email },
    }),
  )
}

const ERROR_MESSAGE = {
  emailExist: (email: string) => `Email "${email}" has already exist.`,
}
