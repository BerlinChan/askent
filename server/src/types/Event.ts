import {objectType, extendType, stringArg, arg} from 'nexus'
import {getUserId} from "../utils";

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
        t.field('checkEventCodeExisted', {
            type: 'Boolean',
            description: 'Check if a event code has already existed.',
            args: {
                code: stringArg({required: true}),
            },
            resolve: async (root, {code}, context) => {
                return Boolean(await context.photon.events.findOne({where: {code}}))
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
            resolve: (root, {code, name, startAt, endAt}, ctx) => {
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
