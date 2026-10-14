# Stage 1: Build the React Application
FROM node:20-alpine AS build

WORKDIR /app

# Install dependencies with npm ci for clean, deterministic builds
COPY package*.json ./
RUN npm ci

# Copy client source code
COPY . .

# Pass API URL during build (defaults to relative /api which Nginx proxies)
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL

# Build production bundle to /app/dist
RUN npm run build

# Stage 2: Serve production bundle using official lightweight Nginx Alpine
FROM nginx:alpine

# Remove default boilerplate configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom Nginx configuration with reverse proxy & SPA fallback
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy static assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose HTTP port 80
EXPOSE 80

# Run Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
