FROM node:16-alpine

WORKDIR /app

COPY 00-initial-setup/backend .

WORKDIR /app/backend

RUN npm install

EXPOSE 8000

CMD [ "npm", "start" ]
