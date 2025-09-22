FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY next.config.js ./
COPY tsconfig.json ./
COPY tsconfig.backend.json ./
COPY tailwind.config.js ./
COPY postcss.config.js ./

# Install all dependencies
RUN npm ci

# Install TypeScript globally
RUN npm install -g typescript ts-node

# Copy source code
COPY src/ ./src/
COPY .env.railway ./.env

# Create public directory if needed
RUN mkdir -p public

# Build the Next.js frontend
RUN npm run build

# Expose port 
EXPOSE 3000

# Environment variables
ENV NODE_ENV=production
ENV NEXT_PUBLIC_API_URL=/api

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Start only the backend server (which now serves both API and frontend)
CMD ["ts-node", "--project", "tsconfig.backend.json", "src/backend/simple-server.ts"]