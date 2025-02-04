FROM node:20-bullseye AS builder

# Disable telemetry
ENV NEXT_TELEMETRY_DISABLED=1

WORKDIR /app

# Building app
COPY --chown=node:node package*.json ./


# Install node modules
# Note: We also install dev deps as TypeScript may be needed
RUN npm install --save npm

COPY --chown=node:node package*.json ./


# Copy files. Use dockerignore to avoid copying node_modules
COPY --chown=node:node . .

# Build
# RUN npm run build
RUN chmod +x ./node_modules/.bin/eslint


# Running the app
FROM gcr.io/distroless/nodejs20-debian12 AS runner
WORKDIR /app

# Mark as prod, disable telemetry, set port
ENV NODE_ENV=production
ENV PORT=3000
ENV NEXT_TELEMETRY_DISABLED=1

ENV PATH="/nodejs/bin:$PATH"

# Copy from build
COPY --from=builder --chown=nonroot:nonroot /app ./
# COPY --from=builder --chown=nonroot:nonroot /app/.next ./.next
COPY --from=builder --chown=nonroot:nonroot /app/node_modules ./node_modules

ENV PATH="/usr/local/bin:$PATH"

USER nonroot

# Run app command
ENTRYPOINT ["/nodejs/bin/node", "docker-entrypoint.js"]
CMD ["run"]