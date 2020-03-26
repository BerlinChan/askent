import sequelize from '../../db'
import { Client } from 'pg'
import {
  DatabaseClient,
  RealtimeSearchConfig,
  RealtimeSearchCallbacks,
} from '../provider'
import { PostgresSearch } from './search'
import { Query } from '../provider'
import { RealtimeSearch } from '../provider'

interface PostgresConfig extends RealtimeSearchConfig {}

export class PostgresConnection implements DatabaseClient {
  private pgClient!: Client

  constructor(private config: PostgresConfig) {}

  public async start(): Promise<void> {
    console.log('Initializing Postgres Connection')
    try {
      this.pgClient = await sequelize.connectionManager.getConnection({
        type: 'read',
      })

      console.log(`Connected successfully to Postgres database ${this.config}`)
    } catch (e) {
      console.log('Error connecting to Postgres', e)
    }
  }

  public getSearch(
    query: Query,
    callbacks: RealtimeSearchCallbacks,
  ): RealtimeSearch {
    return new PostgresSearch(
      query,
      callbacks,
      this.pgClient,
      this.config.primaryKey,
    )
  }

  public async stop(): Promise<void> {
    await this.pgClient.end()
  }
}
