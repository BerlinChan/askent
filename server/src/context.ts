import {Photon} from '@prisma/photon'
import {ExpressContext} from 'apollo-server-express/src/ApolloServer'

const photon = new Photon()

export interface Context extends ExpressContext {
    photon: Photon
}

export function createContext({req, res, connection}: ExpressContext): Context {
    console.log('Authorization:', req.headers.authorization)
    return {photon, req, res, connection}
}
