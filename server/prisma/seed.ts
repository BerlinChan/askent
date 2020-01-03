import {Photon} from '@prisma/photon'
import {hash} from 'bcryptjs'

const photon = new Photon()

async function main() {
    const user1 = await photon.users.create({
        data: {
            email: 'w@w',
            name: 'w',
            password: await hash('w', 10),
            events: {
                create: {
                    code: 'graphql',
                    name: 'GraphQL Conf',
                    startAt: new Date('2019-11-02T01:01:01Z'),
                    endAt: new Date('2019-11-05T02:02:02Z'),
                },
            },
        },
    })
    const user2 = await photon.users.create({
        data: {
            email: 'bob@prisma.io',
            name: 'Bob',
            password: '123456',
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
    const user1Events = await photon.events.findMany({where: {owner: {name: 'w'}}})
    const user1Question = await photon.questions.create({
        data: {
            event: {connect: {id: user1Events[0].id}},
            content: 'How can I use?',
            author: {connect: {id: user1.id}},
        },
    })

    console.log({user1, user2, user1Events, user1Question})
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await photon.disconnect()
    })
