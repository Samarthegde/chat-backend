FROM node:20-alpine3.21

WORKDIR /app

COPY package*.json .

RUN yarn install

COPY . .

CMD ["yarn", "start"]