FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/
COPY packages/types/package.json packages/types/
COPY packages/database/package.json packages/database/
COPY packages/database/prisma ./packages/database/prisma
RUN npm install
COPY . .
RUN npm run build --workspace=packages/database && npm run build --workspace=packages/types && npm run build --workspace=apps/api

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/package.json ./apps/api/
COPY --from=builder /app/packages/types ./packages/types
COPY --from=builder /app/packages/database ./packages/database
COPY --from=builder /app/node_modules ./node_modules
COPY apps/api/start.sh ./apps/api/start.sh
RUN chmod +x ./apps/api/start.sh
WORKDIR /app/apps/api
EXPOSE 4000
CMD ["./start.sh"]
