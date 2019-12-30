import { objectType, extendType } from 'nexus'

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
    t.crud.question()
    t.crud.questions()
  },
})

export const questionMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.crud.createOneQuestion()
    t.crud.updateOneQuestion()
    t.crud.upsertOneQuestion()
    t.crud.deleteOneQuestion()

    t.crud.updateManyQuestion()
    t.crud.deleteManyQuestion()
  },
})