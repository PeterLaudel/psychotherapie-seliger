FROM node:24 AS builder

# Disable telemetry
ENV NEXT_TELEMETRY_DISABLED=1

WORKDIR /app

# install xmllint for XML validation
RUN apt-get update && apt-get install -y libxml2-utils && rm -rf /var/lib/apt/lists/*

# Building app
COPY --chown=node:node package*.json ./

# Install node modules
# Note: We also install dev deps as TypeScript may be needed
RUN --mount=type=cache,target=/root/.npm npm ci

# Copy files. Use dockerignore to avoid copying node_modules
COPY --chown=node:node . .

# Build
RUN npm run build

FROM builder AS e2e

# Install playwright browsers
RUN npx playwright install --with-deps

RUN NODE_ENV=e2e npm run db:create && NODE_ENV=e2e npm run db:migrate && NODE_ENV=e2e npm run db:seed

# Running the app
FROM gcr.io/distroless/nodejs24 AS runner
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