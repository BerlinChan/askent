FROM node:lts-alpine AS build

COPY . /app
WORKDIR /app

RUN yarn
RUN yarn build


FROM node:lts-alpine

COPY --from=build /app/dist /app
WORKDIR /app

RUN node src/index
