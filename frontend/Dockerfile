FROM node:12.18-alpine as build

WORKDIR /spacscanner/frontend
ADD . /spacscanner/frontend

ARG API_URL
ENV HOST_IP_ADDRESS $API_URL

RUN npm install

COPY . /spacscanner/frontend/