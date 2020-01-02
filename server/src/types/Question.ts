import {objectType, extendType, stringArg} from 'nexus'
import {getUserId} from "../utils";

export const Question = objectType({
    name: 'Question',
    definition(t) {
        t.model.id()
        t.model.event()
        t.model.user()
        t.model.username()
        t.model.createdAt()
        t.model.updatedAt()
        t.model.content()
        t.model.vote()
    },
})

export const questionQuery = extendType({
    type: 'Query',
    definition(t) {
    },
})

export const questionMutation = extendType({
    type: 'Mutation',
    definition(t) {
        t.field('createQuestion', {
            type: "Question",
            description: "If req.headers.authorization is valid, will assign userId.",
            args: {
                username: stringArg({nullable: true}),
                content: stringArg({required: true}),
                eventId: stringArg({required: true}),
            },
            resolve: async (root, {username, content, eventId}, ctx) => {
                const userId = getUserId(ctx)
                let question: any = {
                    content,
                    event: {connect: {id: eventId}}
                }
                if (userId) {
                    const findUser = await ctx.photon.users.findOne({where: {id: userId}})
                    question = {
                        ...question,
                        user: {connect: {id: userId}},
                        username: findUser?.name
                    }
                } else if (username) {
                    question.username = username
                }

                return ctx.photon.questions.create({
                    data: question,
                })
            },
        })
    },
})