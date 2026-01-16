FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci

RUN npx prisma generate

COPY tsconfig.json ./
COPY src ./src  

RUN npm run build:docker

RUN npm prune --production

FROM node:22-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules

COPY --from=builder /app/prisma ./prisma

COPY --from=builder /app/dist ./dist

ENV NODE_ENV=production

ENV DATABASE_URL=postgresql://postgres.cgorbjkqjbxlxiuijoco:UNQ1rs2eWw38L1ZQ@aws-0-eu-north-1.pooler.supabase.com:6543/postgres?pgbouncer=true

EXPOSE 8080

CMD ["node", "dist/index.js"]