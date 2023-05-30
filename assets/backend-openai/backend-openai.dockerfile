FROM node:16-alpine

WORKDIR /app

COPY . .

WORKDIR /app/backend

RUN npm install

EXPOSE 8080

CMD [ "npm", "start" ]
