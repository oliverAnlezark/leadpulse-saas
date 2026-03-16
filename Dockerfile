FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies
RUN npm ci

# Copy all source files
COPY server ./server
COPY client ./client
COPY db ./db
COPY vite.config.js ./
COPY postcss.config.js ./
COPY tailwind.config.js ./

# Build frontend
WORKDIR /app
RUN npm run build

# Expose port
EXPOSE 5000

# Start server
CMD ["npm", "start"]
