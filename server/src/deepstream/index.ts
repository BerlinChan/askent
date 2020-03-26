import { DeepstreamClient } from '@deepstream/client'
import { EVENT } from '@deepstream/client/dist/constants'
import dotenv from 'dotenv'
import path from 'path'
import { Provider } from './provider'

const dotenvResult = dotenv.config({ path: path.join(__dirname, '../../.env') })
if (dotenvResult.error) {
  throw dotenvResult.error
}

const deepstreamClient = new DeepstreamClient(
  `${process.env.DS_HOST}:${process.env.DS_PORT}`,
  {
    offlineEnabled: false,
    maxReconnectAttempts: Infinity,
    maxReconnectInterval: 5000,
  },
)
deepstreamClient.on('error', (error: Error, event: EVENT) => {
  if (error) {
    console.error(`Client error: ${error.message}`, event as any)
  } else {
    console.error('Missing Client error!', event as any)
  }
})
deepstreamClient.login({}, success => {
  if (success) {
    new Provider({}).start()

    // TODO: test realtime search https://deepstream.io/blog/20191104-realtime-search/
    setTimeout(async () => {
      const hash = await deepstreamClient.rpc.make('realtime_search', {
        eventId: 'e830794a-7f03-46bc-97a6-22cb8cca5dbd',
      })
      const resultList = deepstreamClient.record.getList(
        `realtime_search/list_${hash}`,
      )
      resultList.subscribe(results => {
        console.log(2, results)
      })
    }, 2000)
  } else {
    console.error('ds login failed')
  }
})

export default deepstreamClient
