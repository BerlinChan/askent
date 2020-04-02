import { Query, RealtimeSearch, RealtimeSearchCallbacks } from '../provider'
import { ChangeStream, FilterQuery } from 'mongodb'
import { QuestionModel } from '../../model'

export class MongoDBSearch implements RealtimeSearch {
  private changeStream: ChangeStream
  private mongoQuery: FilterQuery<any> = this.query
  private isReady: boolean = false

  constructor(
    private query: Query,
    private callbacks: RealtimeSearchCallbacks,
  ) {
    this.changeStream = QuestionModel.watch([], {})
    this.changeStream.on('change', this.runQuery.bind(this))
  }

  /**
   * Returns once the initial search is completed
   */
  public async whenReady(): Promise<void> {
    if (!this.isReady) {
      await this.runQuery()
      this.isReady = true
    }
  }

  /**
   * Closes the realtime-cursor. It also deletes the list if called
   * as a result of an unsubscribe call to the record listener, but not if called
   * as a result of the list being deleted.
   */
  public async stop(): Promise<void> {
    this.changeStream.close()
  }

  private async runQuery() {
    try {
      const result = await QuestionModel.find(this.mongoQuery).lean(true)
      const entries = result.map(
        r => `${QuestionModel.collection.collectionName}/${r._id}`,
      )
      this.callbacks.onResultsChanged(entries)
    } catch (error) {
      console.error('Error running query', error)
    }
  }
}
