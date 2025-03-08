FROM node:20 AS builder

# Disable telemetry
ENV NEXT_TELEMETRY_DISABLED=1

WORKDIR /app

# Building app
COPY --chown=node:node package*.json ./

# Install node modules
# Note: We also install dev deps as TypeScript may be needed
RUN --mount=type=cache,target=~/.npm npm ci

# Copy files. Use dockerignore to avoid copying node_modules
COPY --chown=node:node . .

# Build
RUN npm run build

# Running the app
FROM gcr.io/distroless/nodejs20 AS runner
WORKDIR /app

# Mark as prod, disable telemetry, set port
ENV NODE_ENV=production
ENV PORT=3000
ENV NEXT_TELEMETRY_DISABLED=1

# Copy from build
COPY --from=builder --chown=nonroot:nonroot /app/next.config.mjs ./
COPY --from=builder --chown=nonroot:nonroot /app/public ./public
COPY --from=builder --chown=nonroot:nonroot /app/.next ./.next
COPY --from=builder --chown=nonroot:nonroot /app/node_modules ./node_modules


USER nonroot

# Run app command
CMD ["./node_modules/next/dist/bin/next", "start"]