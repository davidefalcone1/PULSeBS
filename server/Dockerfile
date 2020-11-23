FROM node:latest

RUN mkdir /project

COPY . /project

WORKDIR /project/PULSeBS/server/

RUN npm install 

EXPOSE 3001

CMD ["node","server.js"]