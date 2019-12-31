import {Photon} from '@prisma/photon'

const photon = new Photon()

async function main() {
    const user1 = await photon.users.create({
        data: {
            email: 'alice@prisma.io',
            name: 'Alice',
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
    const user1Events = await photon.users.findOne({where: {name: 'Bob'}})
    console.log({user1, user2, user1Events})
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await photon.disconnect()
    })
