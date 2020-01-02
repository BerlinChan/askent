import {objectType, extendType, stringArg, arg} from 'nexus'
import {getUserId} from "../utils";
import {ObjectDefinitionBlock} from "nexus/dist/definitions/objectType";

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
/*
export const Events = objectType({
    name: 'Events',
    definition(t): void {
        t.list.field('events', {
            type: 'Event',
            resolve: (root, args, context) => {
                const userId = getUserId(context)
                return context.photon.events.findMany({where: {owner: {id: userId}}})
            },
        })
    }
})
*/

export const eventQuery = extendType({
    type: 'Query',
    definition(t) {
        t.crud.events()
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
