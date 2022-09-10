#!/bin/bash
FROM node:14-alpine

MAINTAINER seonghyeon.jee@gmail.com


WORKDIR /app
COPY ../../dist/apps/device .

RUN apk --no-cache add --virtual .builds-deps build-base python3

RUN npm install --production

RUN npm install reflect-metadata tslib rxjs pg

EXPOSE 8000

CMD node ./main.js
