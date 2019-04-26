FROM node:8-alpine

# Create app directory
WORKDIR /usr/src/app

# Install make
RUN apk add --no-cache make

# Install app dependencies
COPY package.json .
RUN npm install

# Bundle app source
COPY . .

EXPOSE 3000

# Should create Makefile in the root directory
CMD [ "make", "start" ]




    
FROM node:10.9.0-stretch

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package.json /usr/src/app

RUN  npm install
RUN npm build

COPY . /usr/src/app

EXPOSE 3000

CMD ["npm","start"]
