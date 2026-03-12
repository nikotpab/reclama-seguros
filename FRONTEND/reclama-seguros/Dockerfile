# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the Angular application
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy only the necessary files from the build stage for SSR
COPY --from=builder /app/dist/reclama-seguros ./dist/reclama-seguros
COPY package.json package-lock.json ./

# Expose the port the app runs on
EXPOSE 4000

# Start the SSR server
CMD ["npm", "run", "serve:ssr:reclama-seguros"]
