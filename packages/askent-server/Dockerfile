FROM node:lts-alpine AS build

COPY . /app
WORKDIR /app
RUN yarn
RUN yarn build


FROM node:lts-alpine

COPY --from=build /app/dist /app
COPY --from=build /app/.env /app/.env
COPY --from=build /app/package.json /app/package.json
COPY --from=build /app/hasura /app/hasura
WORKDIR /app
RUN yarn install --production

EXPOSE 4000

CMD yarn start
