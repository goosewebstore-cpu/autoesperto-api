FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/
COPY packages/database/package.json packages/database/
COPY packages/types/package.json packages/types/
RUN npm install
COPY . .
RUN cp packages/database/prisma/schema.postgresql.prisma packages/database/prisma/schema.prisma
RUN npm run db:generate && npm run build --workspace=apps/api

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/package.json ./apps/api/
COPY --from=builder /app/packages/database ./packages/database
COPY --from=builder /app/packages/types ./packages/types
COPY --from=builder /app/node_modules ./node_modules
COPY apps/api/start.sh ./apps/api/start.sh
RUN chmod +x ./apps/api/start.sh
ENV NODE_ENV=production
WORKDIR /app/apps/api
EXPOSE 4000
CMD ["./start.sh"]
