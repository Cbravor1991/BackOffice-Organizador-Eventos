FROM node:12-alpine
RUN apk add --no-cache python2 g++ make

COPY package*.json .

RUN npm install

COPY . .

RUN npm run build 

EXPOSE 3000

CMD ["npm", "start"]