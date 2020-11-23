FROM node:latest

RUN mkdir /project

COPY . /project

WORKDIR /project/PULSeBS/client/

RUN npm install

EXPOSE 3000

CMD ["npm","start"]