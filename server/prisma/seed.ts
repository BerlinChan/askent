import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const user1 = await prisma.users.create({
    data: {
      email: 'w@w.w',
      name: 'w',
      password: await hash('w', 10),
      events: {
        create: {
          code: 'e1',
          name: 'e1',
          startAt: new Date('2019-11-02T01:01:01Z'),
          endAt: new Date('2019-11-05T02:02:02Z'),
        },
      },
    },
  })
  const user2 = await prisma.users.create({
    data: {
      email: 'w2@w.w',
      name: 'w2',
      password: 'w',
      events: {
        create: [
          {
            code: 'Subscribe to GraphQL Weekly for community news',
            name: 'https://graphqlweekly.com/',
            startAt: new Date('2019-11-03T03:03:03Z'),
            endAt: new Date('2019-11-04T04:04:04Z'),
          },
          {
            code: 'Follow Prisma on Twitter',
            name: 'https://twitter.com/prisma/',
            startAt: new Date('2019-12-09T05:05:05Z'),
            endAt: new Date('2019-12-13T05:05:05Z'),
          },
        ],
      },
    },
  })
  const user1Events = await prisma.events.findMany({
    where: { owner: { name: 'w' } },
  })
  const user1Question = await prisma.questions.create({
    data: {
      event: { connect: { id: user1Events[0].id } },
      content: 'How can I use?',
      archived: true,
      author: { connect: { id: user1.id } },
    },
  })
  const user2Question = await prisma.questions.create({
    data: {
      event: { connect: { id: user1Events[0].id } },
      content: 'An other question by user: w2.',
      author: { connect: { id: user2.id } },
    },
  })

  console.log({ user1, user2, user1Events, user1Question, user2Question })
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.disconnect()
  })
