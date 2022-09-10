#!/bin/bash
FROM node:14-alpine

MAINTAINER seonghyeon.jee@gmail.com

WORKDIR /app
#COPY package*.json ./
COPY /home/runner/work/iot-framework/iot-framework/dist/apps/api .

#RUN npm install

RUN apk --no-cache add --virtual .builds-deps build-base python3

#COPY . .
RUN npm install --production

# NestJS Dependencies
RUN npm install reflect-metadata tslib rxjs @nestjs/platform-express pg
#RUN npm run build



EXPOSE 7777
CMD node ./main.js

#CMD ["npm", "run", "start:prod"]
