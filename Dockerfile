FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080

# Copy the pre-built standalone server files directly
# This avoids running CPU-heavy npm install and next build on the low-resource EC2 instance
COPY .next/standalone ./
COPY .next/static ./.next/static
COPY public ./public

# Expose port 8080 matching AWS Beanstalk load balancer expectations
EXPOSE 8080

CMD ["node", "server.js"]
