import {objectType, extendType, stringArg, idArg} from 'nexus'
import {Question as QuestionType, User} from "@prisma/photon";
import {Context} from "../context";
import {getUserId} from "../utils";

export const Question = objectType({
    name: 'Question',
    definition(t) {
        t.model.id()
        t.model.event()
        t.model.author()
        t.model.username()
        t.model.createdAt()
        t.model.updatedAt()
        t.model.content()
        // t.model.votedUsers()
    },
})

export const questionQuery = extendType({
    type: 'Query',
    definition(t) {
        t.list.field('questions', {
            type: "Question",
            args: {
                // TODO: pagination
            },
            resolve: ((root, args, context) => {
                return context.photon.questions.findMany({where: {author: {id: getUserId(context)}}})
            }),
        })
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
                eventId: idArg({required: true}),
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
                        author: {connect: {id: userId}},
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
        t.field('updateQuestion', {
            type: "Question",
            description: "Update a question's content.",
            args: {
                content: stringArg(),
                questionId: idArg(),
            },
            resolve: async (root, {content, questionId}, ctx) => {
                await checkQuestionExist(ctx, questionId as string)

                return ctx.photon.questions.update({
                    where: {id: questionId},
                    data: {content},
                })
            },
        })
        t.field('deleteQuestion', {
            type: "Question",
            description: "Delete a question.",
            args: {
                questionId: idArg(),
            },
            resolve: async (root, {questionId}, ctx) => {
                await checkQuestionExist(ctx, questionId as string)

                return ctx.photon.questions.delete({
                    where: {id: questionId},
                })
            },
        })
        t.field('voteQuestion', {
            type: "Question",
            description: 'Vote for a question.',
            args: {
                questionId: idArg(),
            },
            resolve: async (root, {questionId}, context) => {
                await checkQuestionExist(context, questionId as string)

                const userId = getUserId(context)
                const votedUsers: User[] = await context.photon.questions.findOne({where: {id: questionId}})
                    .votedUsers({where: {id: userId}})
                return context.photon.questions.update({
                    where: {id: questionId},
                    data: {votedUsers: votedUsers.length ? {disconnect: {id: userId}} : {connect: {id: userId}}}
                })
            },
        })
    },
})

async function checkQuestionExist(context: Context, questionId: QuestionType['id']): Promise<boolean> {
    const findQuestion = await context.photon.questions.findOne({where: {id: questionId}})
    if (!findQuestion) {
        throw new Error(`No question for id: ${questionId}`)
    }
    return true
}