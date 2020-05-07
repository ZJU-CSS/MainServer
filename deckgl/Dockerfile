FROM node:current-slim

WORKDIR /usr/src/app
COPY package.json .
RUN npm install

EXPOSE 5555

CMD ["yarn","start"]

COPY . .
