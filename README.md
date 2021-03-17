# Askent

[Askent](https://github.com/BerlinChan/askent/) 是一个出于技术实践目的而建设的互动演示工具，产品原型参照 [slido](https://www.sli.do/)，由来请见文章[从零开始，创建一个多端互动演示工具](https://www.berlinchan.com/2019/12/create-presentation-tool-from-scratch)。

还在建设中。

## TODO

- [ ] reply question
- [ ] question support voteDown
- [ ] hide event from join search
- [ ] join event with password
- [ ] homepage - join event
- [ ] admin event list - duplicate event
- [ ] question list refetch after network error recovery
- [ ] event edit dialog
- [ ] GraphQL Server permissions use graphql-shield
- [ ] Build server for production
- [ ] [Benchmark](https://github.com/benawad/node-graphql-benchmarks)
- [ ] [API logout, invalid JWT](https://www.npmjs.com/package/express-jwt)

## Develop

```sh
yarn
cd packages/askent-client
yarn start
cd packages/askent-server
yarn dev
```
