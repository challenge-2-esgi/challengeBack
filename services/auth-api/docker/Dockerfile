# build stage
FROM node:18.16.1-alpine3.17 AS build

WORKDIR /app

COPY . .

RUN npm install
RUN npm run build

# production stage
FROM node:18.16.1-alpine3.17

WORKDIR /app

COPY --from=build /app/package.json ./
COPY --from=build /app/package-lock.json ./
# copy only src as build folder contains prisma seed files
COPY --from=build /app/dist/src ./dist 
COPY --from=build /app/prisma ./prisma

RUN npm install --omit=dev

RUN npx prisma generate

ENV NODE_ENV=prod

CMD [ "npm", "run", "start:migrate:prod" ]