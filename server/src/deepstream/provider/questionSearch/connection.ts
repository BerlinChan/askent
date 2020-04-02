import { DatabaseClient, RealtimeSearchCallbacks } from '.'
import { MongoDBSearch } from './search'
import { Query } from '.'
import { RealtimeSearch } from '.'

export class MongoDBConnection implements DatabaseClient {
  public getSearch(
    query: Query,
    callbacks: RealtimeSearchCallbacks,
  ): RealtimeSearch {
    return new MongoDBSearch(query, callbacks)
  }
}
