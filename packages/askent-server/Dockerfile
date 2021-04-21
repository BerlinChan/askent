FROM node:alpine

COPY . /app
RUN npm i yarn
RUN yarn
RUN yarn build

COPY build /app/build

CMD node
