# Build stage for React frontend
FROM node:18-alpine as frontend-builder

WORKDIR /app/frontend

# Copy frontend files
COPY frontend/package*.json ./

# Install frontend dependencies
RUN npm ci

# Copy frontend source
COPY frontend/src ./src
COPY frontend/index.html ./
COPY frontend/vite.config.js ./

# Build frontend
RUN npm run build

# Final stage - Node.js backend with served frontend
FROM node:18-alpine

WORKDIR /app

# Install production dependencies globally
RUN npm install -g serve

# Copy backend files
COPY backend/package*.json ./

# Install backend dependencies
RUN npm ci --only=production

# Copy backend source
COPY backend/src ./src
COPY backend/scripts ./scripts
COPY backend/init.sql ./

# Create uploads directory
RUN mkdir -p ./public

# Copy built frontend to backend public folder
COPY --from=frontend-builder /app/frontend/dist ./public

# Create a simple Node.js server that serves frontend and backend
RUN mkdir -p /app/public

# Copy package.json to root for easy access
COPY backend/package.json ./

# Expose port
EXPOSE 3000

# Start backend server
CMD ["node", "src/index.js"]
