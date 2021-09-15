# Askent

![Website](https://img.shields.io/website/https/askent.berlinchan.com)
![GitHub Workflow Status (branch)](https://img.shields.io/github/workflow/status/BerlinChan/askent/CI/release)

[https://askent.berlinchan.com](https://askent.berlinchan.com)

[Askent](https://askent.berlinchan.com) is a simple interaction tool for the meeting. Currently, it's especially for the Q&A part, so you can better reach out audience.

Initially, the project's purpose was for tech-exploring, which is still heavily in development. The idea comes from a webinar I attended. It's a clone of [Sli.do](https://www.sli.do/).

## About the name

Askent = Ask + Event

## Blog

- [Where the Askent comes from](https://www.berlinchan.com//2021/07/where-the-askent-comes-from)
- [从零开始，创建一个多端互动演示工具](https://www.berlinchan.com/2019/12/create-presentation-tool-from-scratch)
- [互动演示工具 Askent 已开发出管理与观众端雏形](https://www.berlinchan.com//2020/02/project-askent-admin-audience-client)
- [Askent 项目进展及准备弃用 Prisma2](https://www.berlinchan.com//2020/03/askent-give-up-prisma2)
- [几款多端实时协作、同步的开发工具](https://www.berlinchan.com//2020/03/real-time-multi-device-collaboration-devtools)
- [借助 GraphQL 承载 100万并发活动订阅（实时查询）](https://www.berlinchan.com//2021/03/Scaling-to-1-million-active-GraphQL-subscriptions)
- [Askent 实时消息搜索的问题及 Hasura 替代](https://www.berlinchan.com//2021/03/askent-realtime-search-implement-and-hasura)

## Develop

```sh
yarn
yarn workspace askent-client start
yarn workspace askent-server dev
```

## TODO

- [ ] Test creating question as Anonymous or Named-user
- [ ] About text
- [ ] event edit dialog
- [ ] question support voteDown
- [ ] hide event from join search
- [ ] join event with password
- [ ] admin event list - duplicate event
- [ ] question list refetch after network error recovery
- [ ] [API logout, invalid JWT](https://www.npmjs.com/package/express-jwt)
- [ ] [Benchmark](https://github.com/benawad/node-graphql-benchmarks)

## LICENSE

GNU General Public License v3.0 or later
