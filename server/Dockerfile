FROM node:latest

RUN mkdir /project

WORKDIR /project

COPY package*.json /project/

RUN npm install 

EXPOSE 3001
COPY . /project

CMD ["node","server.js"]