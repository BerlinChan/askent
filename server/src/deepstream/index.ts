import { DeepstreamClient } from '@deepstream/client'
import { EVENT } from '@deepstream/client/dist/constants'
import dotenv from 'dotenv'
import path from 'path'
import { QuestionSearch } from './provider'

const dotenvResult = dotenv.config({ path: path.join(__dirname, '../../.env') })
if (dotenvResult.error) {
  throw dotenvResult.error
}

const deepstreamClient = new DeepstreamClient(
  `${process.env.DEEPSTREAM_HOST}:${process.env.DEEPSTREAM_PORT}`,
  {
    offlineEnabled: false,
    maxReconnectAttempts: Infinity,
    maxReconnectInterval: 5000,
  },
)
deepstreamClient.on('error', (error: Error, event: EVENT) => {
  if (error) {
    console.error(`Client error: ${error.message}`, event)
  } else {
    console.error('Missing Client error!', event)
  }
})
deepstreamClient.login({}, success => {
  if (success) {
    console.log('deepstream login successed')
    new QuestionSearch(deepstreamClient).start()

    // TODO: test realtime search https://deepstream.io/blog/20191104-realtime-search/
    // setTimeout(async () => {
    //   const hash = await deepstreamClient.rpc.make('question_realtime_search', {
    //     eventId: '5e859a953b390a28fe7d85c7',
    //   })
    //   const resultList = deepstreamClient.record.getList(
    //     `question_realtime_search/list_${hash}`,
    //   )
    //   resultList.subscribe(results => {
    //     console.log(2, results)
    //   })
    // }, 2000)
  } else {
    console.error('deepstream login failed')
  }
})

export default deepstreamClient
