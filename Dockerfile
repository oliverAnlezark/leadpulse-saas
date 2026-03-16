FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application files
COPY server ./server
COPY client ./client
COPY db ./db

# Build frontend
RUN npm run build

# Expose port
EXPOSE 5000

# Start server
CMD ["npm", "start"]
