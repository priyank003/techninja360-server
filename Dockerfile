FROM node:alpine

WORKDIR "/app"

COPY package.json .

ARG NODE_ENV

RUN apt update -y \
    && apt-get install python3-certbot-nginx -y \
    && apt-get clean

RUN if [ "$NODE_ENV" = "development" ]; \
        then npm install; \
        else npm install --only=production; \
        fi

COPY . .

ENV PORT 8000

EXPOSE $PORT

CMD ["node","./src/server.js"]