FROM node:latest

RUN mkdir /project

WORKDIR /project


COPY package*.json /project/

RUN npm install

EXPOSE 3000
COPY . /project


CMD ["npm","start"]