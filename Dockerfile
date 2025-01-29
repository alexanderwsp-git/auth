FROM node:20.16.0 AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

COPY tsconfig.json ./

RUN npm run build

FROM node:20.16.0 AS runner

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/tsconfig.json ./

ENV NODE_ENV=production

EXPOSE 3000

CMD ["npm", "start"]