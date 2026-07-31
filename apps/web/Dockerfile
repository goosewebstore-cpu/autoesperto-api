FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
COPY apps/web/package.json apps/web/
COPY packages/types/package.json packages/types/
RUN npm install
COPY . .
RUN npm run build --workspace=apps/web

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/apps/web/.next ./apps/web/.next
COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder /app/apps/web/package.json ./apps/web/
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
WORKDIR /app/apps/web
EXPOSE 3000
CMD ["npm", "start"]
