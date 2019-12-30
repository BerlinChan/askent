import { objectType, extendType } from 'nexus'

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
    t.crud.event()
    t.crud.events()
  },
})

export const eventMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.crud.createOneEvent()
    t.crud.updateOneEvent()
    t.crud.upsertOneEvent()
    t.crud.deleteOneEvent()

    t.crud.updateManyEvent()
    t.crud.deleteManyEvent()
  },
})