FROM node:20.6.1-alpine
LABEL authors="johyeonchang"
RUN apk --no-cache add curl
WORKDIR /app
COPY ./dist .
COPY ./node_modules /node_modules
CMD node ./main.js