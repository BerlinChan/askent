FROM node:lts-alpine AS build

COPY . /app
WORKDIR /app
RUN yarn
RUN yarn build

CMD yarn start
