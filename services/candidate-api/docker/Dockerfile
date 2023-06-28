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
COPY --from=build /app/dist ./

RUN npm install --omit=dev

CMD [ "node", "main.js" ]