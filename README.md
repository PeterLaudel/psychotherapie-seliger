# Psychotherapie Seliger

Public homepage of the psychotherapy practice of Ute Seliger in Leipzig, served at [www.psychotherapie-seliger.de](https://www.psychotherapie-seliger.de). Built with Next.js and Tailwind CSS.

The practice management app (patients, sessions, invoices) used to live here and moved to [Mosaik](https://github.com/PeterLaudel/mosaik).

## Development

```sh
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000); `/` redirects to `/home`.

The contact form posts to the endpoint in `NEXT_PUBLIC_CONTACT_ENDPOINT`. The value is inlined at build time.

## Checks

```sh
npm run ci           # typecheck and lint
npm run build
CI=true npm run e2e  # Playwright against the production build
```

## Deployment

The shared [pipeline](https://github.com/PeterLaudel/actions) builds the Docker image, runs `docker compose run app test` and `app e2e`, pushes the image on `main`, and updates the image tag in the `psychotherapie-seliger-deploy` repository.
