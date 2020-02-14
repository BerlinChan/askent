import { PrismaClient, QuestionReviewStatus,RoleName } from '@prisma/client'
import { hash } from 'bcryptjs'
import { addDays } from 'date-fns'

const prisma = new PrismaClient()

async function main() {
  await prisma.role.create({ data: { name: RoleName.ADMIN } })
  await prisma.role.create({ data: { name: RoleName.AUDIENCE } })
  await prisma.role.create({ data: { name: RoleName.WALL } })

  const user1 = await prisma.user.create({
    data: {
      email: 'w@w.w',
      name: 'w',
      roles: {
        connect: [{ name: RoleName.ADMIN }, { name: RoleName.AUDIENCE }, { name: RoleName.WALL }],
      },
      password: await hash('w', 10),
      events: {
        create: Array.from({ length: 200 }, () => 'event').map(
          (item, index) => ({
            code: `code${index}`,
            name: `name ${index}`,
            startAt: addDays(new Date('2017-11-02T01:01:01Z'), index),
            endAt: addDays(new Date('2017-11-05T02:02:02Z'), index + 4),
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
        connect: [{ name: RoleName.ADMIN }, { name: RoleName.AUDIENCE }, { name: RoleName.WALL }],
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
    first: 1,
  })
  await prisma.event.update({
    where: { id: user1Events[0].id },
    data: {
      questions: {
        create: Array.from({ length: 200 }, () => 'q').map((item, index) => ({
          content: `Question ${index}`,
          author: { connect: { id: user2.id } },
        })),
      },
    },
  })
  const user1Question = await prisma.question.create({
    data: {
      event: { connect: { id: user1Events[0].id } },
      content: 'How can I use?',
      reviewStatus: QuestionReviewStatus.ARCHIVE,
      author: { connect: { id: user1.id } },
    },
  })

  console.log({ user1, user2, user1Events, user1Question })
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.disconnect()
  })
