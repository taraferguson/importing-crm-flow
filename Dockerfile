# Use Node.js 18
FROM node:18-alpine

# Add cache busting
ARG CACHEBUST=1

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci --no-cache

# Copy source code
COPY . .

# Set environment variables for memory optimization
ENV NODE_OPTIONS="--max-old-space-size=2048"
ENV NODE_ENV=production

# Build the application
RUN npm run build

# Make start script executable
RUN chmod +x start.sh

# Expose port (will be overridden by Railway's PORT)
EXPOSE 4200

# Start the application using our custom script
CMD ["./start.sh"] 