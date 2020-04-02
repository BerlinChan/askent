import { DeepstreamClient } from '@deepstream/client'
import { RecordData } from '@deepstream/client/dist/constants'
import { RPCResponse } from '@deepstream/client/dist/rpc/rpc-response'
import { ListenResponse } from '@deepstream/client/dist/util/listener'
import { MD5, enc } from 'crypto-js'
import { MongoDBConnection } from './connection'
import { QuestionSearchInput } from '../../../graphql/Question'

export interface RealtimeSearch {
  whenReady: () => Promise<void>
  stop: () => Promise<void>
}

export interface RealtimeSearchCallbacks {
  onResultsChanged: (entries: string[]) => void
}

export interface DatabaseClient {
  getSearch(query: Query, callbacks: RealtimeSearchCallbacks): RealtimeSearch
}

export interface Query extends QuestionSearchInput {}

export interface RealtimeSearchConfig {
  rpcName: string
  listNamePrefix: string
  metaRecordPrefix: string
  heartbeatInterval: number
}

const defaultConfig: RealtimeSearchConfig = {
  rpcName: 'question_realtime_search',
  listNamePrefix: 'question_realtime_search/list_',
  metaRecordPrefix: 'question_realtime_search/meta_',
  heartbeatInterval: 60 * 1000,
}

export class Provider {
  private searches = new Map<string, RealtimeSearch>()
  private databaseClient!: DatabaseClient
  private config: RealtimeSearchConfig
  private hashReplaceRegex: RegExp

  constructor(
    private deepstreamClient: DeepstreamClient,
    config?: Partial<RealtimeSearchConfig>,
  ) {
    this.config = { ...defaultConfig, ...config }
    this.hashReplaceRegex = new RegExp(`^${this.config.listNamePrefix}(.*)`)
    this.databaseClient = new MongoDBConnection()
  }

  /**
   * Starts the provider. The provider will emit a
   * 'ready' event once started
   */
  public async start() {
    this.setupRPC()

    const pattern = `${this.config.listNamePrefix}.*`
    console.log(`listening for ${pattern}`)
    this.deepstreamClient.record.listen(pattern, this.onSubscription.bind(this))

    console.log('realtime search provider ready')
  }

  /**
   * Stops the provider. Closes the deepstream
   * connection and disconnects from db
   */
  public async stop() {
    try {
      this.deepstreamClient.close()
    } catch (e) {
      console.error('Error shutting down realtime search', e)
    }
  }

  private setupRPC() {
    this.deepstreamClient.rpc.provide(
      this.config.rpcName,
      async (query: Query, response: RPCResponse) => {
        try {
          if (typeof query === 'string') {
            if (query === '__heartbeat__') {
              return response.send('success')
            }
            return response.error(
              'Invalid query parameters, structure should be an object with at least the table',
            )
          }

          const hash = this.hashQueryString(query)
          console.log(`Created hash ${hash} for realtime-search using RPC`)

          const exists = await this.deepstreamClient.record.has(
            `${this.config.metaRecordPrefix}${hash}`,
          )
          if (exists === true) {
            // Query already exists, so use that
            response.send(hash)
            return
          }

          try {
            await this.deepstreamClient.record.setDataWithAck(
              `${this.config.metaRecordPrefix}${hash}`,
              ({
                query,
                hash,
              } as unknown) as RecordData,
            )
            response.send(hash)
          } catch (e) {
            console.error(
              `Error saving hash in ${
                this.config.rpcName
              } rpc method for ${JSON.stringify(query)}: `,
              e,
            )
            response.error('Error saving search hash. Check the server logs')
            return
          }
        } catch (e) {
          console.error(
            `Error in ${this.config.rpcName} rpc method for ${JSON.stringify(
              query,
            )}: `,
            e,
          )
          response.error(
            `Error in ${this.config.rpcName} rpc method. Check the server logs`,
          )
        }
      },
    )

    // This heartbeat is for debugging resilience to ensure that the RPC is actually provided.
    // It also means if the connection to deepstream is lost or the provider is offline for any
    // reason it will restart to ensure a clean state.
    this.config.heartbeatInterval &&
      setInterval(async () => {
        try {
          await this.deepstreamClient.rpc.make(
            this.config.rpcName,
            '__heartbeat__',
          )
          console.debug(`${this.config.rpcName} heartbeat succeeded`)
        } catch (e) {
          console.error(
            `${this.config.rpcName} heartbeat check failed, restarting rpc provider`,
          )
        }
      }, this.config.heartbeatInterval || 30000)

    console.log(`Providing rpc method "${this.config.rpcName}"`)
  }

  /**
   * Callback for the 'listen' method. Gets called everytime a new
   * subscription to the specified pattern is made. Parses the
   * name and - if its the first subscription made to this pattern -
   * creates a new instance of Search
   */
  private async onSubscription(name: string, response: ListenResponse) {
    console.log(`received subscription for ${name}`)
    const result = await this.onSubscriptionAdded(name)
    if (result === true) {
      response.accept()
      response.onStop(() => {
        this.onSubscriptionRemoved(name)
      })
    } else {
      response.reject()
    }
  }

  /**
   * When a search has been started
   */
  private async onSubscriptionAdded(name: string): Promise<boolean> {
    const hash = name.replace(this.hashReplaceRegex, '$1')
    const recordName = `${this.config.metaRecordPrefix}${hash}`

    let query: Query

    try {
      ;({ query } = ((await this.deepstreamClient.record.snapshot(
        recordName,
      )) as unknown) as { query: Query })
    } catch (e) {
      console.error(`Error retrieving snapshot of ${recordName}`, e)
      return false
    }

    if (query === undefined) {
      console.error(`Query is missing for ${recordName}`)
      return false
    }

    console.log(`new search instance being made for search ${hash}`)

    const search = this.databaseClient.getSearch(query, {
      onResultsChanged: this.onResultsChanged.bind(
        this,
        `${this.config.listNamePrefix}${hash}`,
      ),
    })
    await search.whenReady()
    this.searches.set(hash, search)
    return true
  }

  /**
   * When a search has been removed
   */
  private async onSubscriptionRemoved(name: string) {
    const hash = name.replace(this.hashReplaceRegex, '$1')

    console.log(`old search instance being removed for search ${hash}`)

    const search = this.searches.get(hash)

    if (search) {
      search.stop()
      this.searches.delete(hash)
    } else {
      console.error(`Error finding search with hash ${hash}`)
    }

    const record = this.deepstreamClient.record.getRecord(
      `${this.config.metaRecordPrefix}${hash}`,
    )
    await record.whenReady()
    await record.delete()

    const list = this.deepstreamClient.record.getRecord(
      `${this.config.listNamePrefix}${hash}`,
    )
    await list.whenReady()
    await list.delete()
  }

  private hashQueryString(query: Query) {
    return MD5(JSON.stringify(query)).toString(enc.Hex)
  }

  private async onResultsChanged(listName: string, entries: string[]) {
    try {
      await this.deepstreamClient.record.setDataWithAck(listName, entries)
      console.debug(`Updated ${listName} with ${entries.length} entries`)
    } catch (e) {
      console.error(`Error setting entries for list ${listName}`, e)
    }
  }
}
