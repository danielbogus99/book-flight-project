# syntax=docker/dockerfile:1

ARG NODE_VERSION=22.13.1

# --- Build stage ---
FROM node:${NODE_VERSION}-slim AS builder
WORKDIR /app

# Install dependencies (only package.json and package-lock.json for cache efficiency)
COPY --link package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci

# Copy the rest of the application source
COPY --link . .

# Build the production-ready static files
RUN npm run build

# Remove dev dependencies to reduce image size
RUN --mount=type=cache,target=/root/.npm \
    npm prune --production

# --- Production stage ---
FROM node:${NODE_VERSION}-slim AS final
WORKDIR /app

# Create a non-root user with a home directory
RUN addgroup --system appgroup && adduser --system --ingroup appgroup --home /home/appuser appuser

# Copy only the built app and production dependencies
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/vite.config.js ./
COPY --from=builder /app/index.html ./

ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=4096"
ENV HOME=/home/appuser

# Ensure permissions
RUN chown -R appuser:appgroup /app /home/appuser

USER appuser

# Expose the port Vite preview uses by default
EXPOSE 4173

# Start the production preview server
CMD ["npx", "serve", "dist", "-l", "4173"]
