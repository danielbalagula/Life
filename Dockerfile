FROM mhart/alpine-node:8

RUN apk add --no-cache --virtual .gyp \
        python \
        make \
        g++

WORKDIR /app
COPY . .

RUN npm install --production

EXPOSE 3000
CMD ["npm", "start"]