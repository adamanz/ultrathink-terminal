# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy application files
COPY . .

# Build the React app
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Set NODE_ENV to production
ENV NODE_ENV=production

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy server files and built React app
COPY server-gcp.js ./server.js
COPY --from=builder /app/dist ./dist

# Expose the server port (Cloud Run expects 8080)
EXPOSE 8080

# Start the server
CMD ["node", "server.js"]