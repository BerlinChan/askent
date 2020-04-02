import { DatabaseClient, RealtimeSearchCallbacks } from '../provider'
import { MongoDBSearch } from './search'
import { Query } from '../provider'
import { RealtimeSearch } from '../provider'

export class MongoDBConnection implements DatabaseClient {
  public getSearch(
    query: Query,
    callbacks: RealtimeSearchCallbacks,
  ): RealtimeSearch {
    return new MongoDBSearch(query, callbacks)
  }
}
