import {Photon} from '@prisma/photon'
import {ExpressContext} from 'apollo-server-express/src/ApolloServer'

const photon = new Photon()

export interface Context {
    photon: Photon
}

export function createContext({req, res, connection}: ExpressContext): Context {
    return {photon}
}
