import { Query, RealtimeSearch, RealtimeSearchCallbacks } from '../provider'
import { Client } from 'pg'
import models from '../../model'

export class PostgresSearch implements RealtimeSearch {
  private isReady: boolean = false

  constructor(
    private query: Query,
    private callbacks: RealtimeSearchCallbacks,
    private pgClient: Client,
    private primaryKey: string,
  ) {
    this.pgClient.query(`LISTEN "questions"`)
    this.pgClient.on('notification', this.runQuery.bind(this))
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
    this.pgClient.query(`UNLISTEN "questions"`)
  }

  private async runQuery() {
    try {
      const result = await models.Question.findAll({
        where: { eventId: this.query.eventId },
        attributes: ['id'],
      })
      const entries = result.map(
        (item: { [key: string]: string }) =>
          `questions/${item[this.primaryKey]}`,
      )
      this.callbacks.onResultsChanged(entries)
    } catch (error) {
      console.error('Error running query', error)
    }
  }
}
