FROM node:16-alpine

RUN apk add --no-cache python2 g++ make

COPY package*.json .

RUN npm install

COPY . .

RUN npm run build 

EXPOSE 8000

CMD ["npm", "start"]