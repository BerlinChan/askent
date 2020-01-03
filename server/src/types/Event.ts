import {objectType, extendType, stringArg, arg} from 'nexus'
import {getUserId} from "../utils";
import {Context} from "../context";

export const Event = objectType({
    name: 'Event',
    definition(t) {
        t.model.id()
        t.model.code()
        t.model.name()
        t.model.owner()
        t.model.createdAt()
        t.model.updatedAt()
        t.model.startAt()
        t.model.endAt()
        t.model.questions()
    },
})

export const eventQuery = extendType({
    type: 'Query',
    definition(t) {
        t.list.field('events', {
            type: 'Event',
            resolve: async (root, args, context) => {
                const userId = getUserId(context)
                return context.photon.events.findMany({where: {owner: {id: userId}}})
            },
        })
        t.field('checkEventCodeExist', {
            type: 'Boolean',
            description: 'Check if a event code has already exist.',
            args: {
                code: stringArg({required: true}),
            },
            resolve: async (root, {code}, context) => {
                return await checkEventCodeExist(context, code)
            },
        })
    },
})

export const eventMutation = extendType({
    type: 'Mutation',
    definition(t) {
        t.field('createEvent', {
            type: 'Event',
            args: {
                code: stringArg({required: true}),
                name: stringArg({required: true}),
                startAt: arg({type: 'DateTime', required: true}),
                endAt: arg({type: 'DateTime', required: true}),
            },
            resolve: async (root, {code, name, startAt, endAt}, ctx) => {
                if (await checkEventCodeExist(ctx, code)) {
                    throw new Error(`Code "${code}" has already exist.`)
                }
                const userId = getUserId(ctx)
                return ctx.photon.events.create({
                    data: {
                        owner: {connect: {id: userId}},
                        code,
                        name,
                        startAt,
                        endAt,
                    },
                })
            },
        })
    },
})

async function checkEventCodeExist(context: Context, code: string) {
    return Boolean(await context.photon.events.findOne({where: {code}}))
}