# ==============================================================================
# Production Dockerfile for SnapGreen Version 3 Frontend (Vite + React)
# Multi-stage: Node 20 (Build) -> Nginx Alpine (Lightweight Web Server)
# ==============================================================================

# Stage 1: Build static assets
FROM node:20-alpine AS builder

WORKDIR /app

# Build arguments (can be overridden during docker build)
ARG VITE_API_URL=http://localhost:8000
ENV VITE_API_URL=${VITE_API_URL}

# Install dependencies (layer caching)
COPY package.json package-lock.json* ./
RUN npm ci || npm install

# Build production bundle
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine AS runner

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=3s --retries=3 \
    CMD wget -qO- http://localhost:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
