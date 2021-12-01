FROM node:lts-alpine AS build

COPY ./packages/askent-server /app/askent-server
COPY ./packages/askent-common /app/askent-common
WORKDIR /app/askent-server
RUN yarn
RUN yarn build


FROM node:lts-alpine

COPY --from=build /app/askent-server/dist /app
COPY --from=build /app/askent-server/.env.production /app/askent-server/.env
COPY --from=build /app/askent-server/ormconfig.production.js /app/askent-server/ormconfig.js
COPY --from=build /app/askent-server/package.json /app/askent-server/package.json
WORKDIR /app/askent-server
RUN yarn install --production

EXPOSE 4000

CMD yarn start
