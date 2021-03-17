# Askent Server

FROM node:12.20.1-alpine

WORKDIR "/askent"

COPY ./dist/ ./dist/
COPY ./.env .
COPY ./package.json .
COPY ./yarn.lock .

RUN yarn install --production

EXPOSE 4000

ENTRYPOINT [ "node", "./dist/index.js" ]