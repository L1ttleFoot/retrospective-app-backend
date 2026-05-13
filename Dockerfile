FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

COPY prisma ./prisma/

RUN npm ci

RUN npx prisma generate

COPY tsconfig.json ./

COPY ./prisma.config.ts ./

COPY src ./src  

RUN npm run build:docker

RUN npm prune --production

FROM node:22-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules

COPY --from=builder /app/prisma ./prisma

COPY --from=builder /app/dist ./dist

COPY --from=builder /app/prisma.config.ts ./prisma.config.ts

COPY --from=builder /app/src/generated ./dist/generated 

ENV NODE_ENV=production

ENV PORT=8080

ENV DATABASE_URL=postgresql://postgres.cgorbjkqjbxlxiuijoco:G9y5S7SpRBR4YEfJ@aws-0-eu-north-1.pooler.supabase.com:6543/postgres?pgbouncer=true
ENV DIRECT_URL=postgresql://postgres.cgorbjkqjbxlxiuijoco:G9y5S7SpRBR4YEfJ@aws-0-eu-north-1.pooler.supabase.com:5432/postgres

EXPOSE 8080

#CMD ["node", "dist/index.js"]

CMD npx prisma migrate deploy && node dist/index.js