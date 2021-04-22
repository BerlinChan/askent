FROM node:lts-alpine AS build

COPY ../.. /app
WORKDIR /app
RUN yarn
RUN yarn workspace askent-server build


FROM node:lts-alpine

COPY --from=build /app/packages/askent-server/dist /app
# COPY .env /app
WORKDIR /app

RUN env-cmd node src/index
