<picture>
  <source srcset="./banner-dark.png" media="(prefers-color-scheme: dark)">
  <source srcset="./banners.png" media="(prefers-color-scheme: light)">
  <img src="./banner-dark.png" alt="Frontal Website Banner">
</picture>

# Frontal OG Image

A production-focused Open Graph image generation service built with `Next.js 16` and `next/og`.

## What It Does

- Generates `1200x628` OG images from `GET /` and `POST /`
- Supports `dark`, `light`, `left-dark`, and `left-light` themes
- Validates request input and returns structured JSON errors
- Exposes `GET /health` and `HEAD /health`
- Applies stable cache and response headers through `proxy.ts`

## API

### `GET /`

```text
/?title=Hello%20World&description=Ship%20it&theme=dark
```

Query parameters:

- `title`: required, trimmed, max `100` chars
- `description`: required, trimmed, max `200` chars
- `theme`: optional, `dark`, `light`, `left-dark`, or `left-light`

### `POST /`

```bash
curl -X POST http://localhost:3000 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Hello World",
    "description": "Ship it",
    "theme": "left-light"
  }'
```

Request body:

```json
{
  "title": "string",
  "description": "string",
  "theme": "dark | light | left-dark | left-light"
}
```

### Error Response

```json
{
  "error": "Title is required",
  "code": "VALIDATION_ERROR",
  "success": false
}
```

## Development

```bash
npm install
npm run dev
```

Quality gates:

```bash
npm run lint
npm run test:run
npm run build
```

## Environment

Copy `.env.example` as needed.

- `NODE_ENV`: `development`, `test`, or `production`
- `OG_HTML_DEBUG`: reserved debug flag, defaults to `0`

## Deployment

This repository is configured as a standard Next.js app for Vercel. The checked-in `vercel.json` only sets function duration limits for the image and health routes.

## Project Layout

```text
src/
  app/
  components/
  config/
  lib/
  services/
```
