FROM node:latest
COPY . /home/run/PULSeBS
WORKDIR /home/run/PULSeBS
RUN cd client; npm install; cd ..
RUN cd server; npm install; cd ..
CMD CI=true npm start --prefix ./client & npm start --prefix ./server