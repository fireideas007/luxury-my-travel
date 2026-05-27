# Stage 1: Build Next.js application
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Production runtime
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080

# Next.js standalone build places the server script in .next/standalone/server.js
# Copying it to root allows executing standard node server.js
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Expose port 8080 matching AWS Beanstalk load balancer expectations
EXPOSE 8080

CMD ["node", "server.js"]
