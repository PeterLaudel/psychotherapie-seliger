FROM node:20.11.1-bullseye

WORKDIR /app

COPY --chown=node:node package*.json ./

RUN npm install

COPY --chown=node:node . .
RUN npm run build

USER node

ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["run"]
