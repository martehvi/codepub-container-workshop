FROM node:16-alpine

WORKDIR /app

COPY backend .

WORKDIR /app/backend

RUN npm install

CMD [ "npm", "start" ]
