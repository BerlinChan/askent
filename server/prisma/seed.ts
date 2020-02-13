import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  await prisma.role.create({ data: { name: 'ADMIN' } })
  await prisma.role.create({ data: { name: 'AUDIENCE' } })
  await prisma.role.create({ data: { name: 'WALL' } })

  const user1 = await prisma.user.create({
    data: {
      email: 'w@w.w',
      name: 'w',
      roles: {
        connect: [{ name: 'ADMIN' }, { name: 'AUDIENCE' }, { name: 'WALL' }],
      },
      password: await hash('w', 10),
      events: {
        create: Array.from({ length: 1500 }, () => 'event').map(
          (item, index) => ({
            code: `code${index}`,
            name: `name${index}`,
            startAt: new Date(),
            endAt: new Date(),
          }),
        ),
      },
    },
  })
  const user2 = await prisma.user.create({
    data: {
      email: 'w2@w.w',
      name: 'w2',
      roles: {
        connect: [{ name: 'ADMIN' }, { name: 'AUDIENCE' }, { name: 'WALL' }],
      },
      password: 'w',
      events: {
        create: [
          {
            code: 'Subscribe',
            name: 'Subscribe to GraphQL Weekly for community news',
            startAt: new Date('2019-11-03T03:03:03Z'),
            endAt: new Date('2019-11-04T04:04:04Z'),
          },
          {
            code: 'Follow',
            name: 'Follow Prisma on Twitter',
            startAt: new Date('2019-12-09T05:05:05Z'),
            endAt: new Date('2019-12-13T05:05:05Z'),
          },
        ],
      },
    },
  })
  const user1Events = await prisma.event.findMany({
    where: { owner: { name: 'w' } },
  })
  const user1Question = await prisma.question.create({
    data: {
      event: { connect: { id: user1Events[0].id } },
      content: 'How can I use?',
      archived: true,
      author: { connect: { id: user1.id } },
    },
  })
  const user2Question = await prisma.question.create({
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
