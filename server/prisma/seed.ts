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
                    },
                    {
                        code: 'Follow Prisma on Twitter',
                        name: 'https://twitter.com/prisma/',
                    },
                ],
            },
        },
    })
    console.log({user1, user2})
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await photon.disconnect()
    })
