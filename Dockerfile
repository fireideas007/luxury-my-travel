# Stage 1: Build React application
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Clean production runtime
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production
COPY --from=builder /app/dist ./dist
COPY server.js ./
COPY certs/ ./certs/

# Expose port 8080 and port 443 matching our HTTPS/HTTP configuration
EXPOSE 8080 443
ENV PORT=8080
ENV NODE_ENV=production

# Start Express server
CMD ["node", "server.js"]
