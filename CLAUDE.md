# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm run dev                    # Start dev server (Next.js)

# Build
npm run build                  # Generates blog preview images, then builds Next.js

# Individual steps
npm run generate-previews      # Generate OG preview images for blog posts (outputs to /public/previews/blog/)
next build                     # Next.js build only

# Lint
npm run lint
```

## Architecture Overview

**NfcTool.org** is a Next.js 16 App Router project — a browser-based NFC tooling platform using the Web NFC API (Chrome Android only).

### Server / Client Split

Every interactive page follows a two-file pattern:
- `page.js` — Server Component: exports metadata, renders a `<Suspense>` wrapper, imports the client component
- `*-client.js` — Client Component (`'use client'`): contains all interactivity, Web NFC calls, and localStorage state

### Content Storage

Blog posts and documentation guides are stored as **JSON files**, not MDX:
- `app/blog/posts/*.json` — loaded via `app/lib/posts.js` (with in-memory caching)
- `app/documentation/guides/*.json` — loaded server-side per request

Both use `generateStaticParams()` for SSG at build time.

### Web NFC Pattern

All NFC tools check for browser support before use:
```js
if (!('NDEFReader' in window)) { /* show unsupported message */ }
const ndef = new window.NDEFReader();
await ndef.scan();
ndef.addEventListener("reading", ({ message, serialNumber }) => { ... });
await ndef.write({ records: [...] });
```

### State Management

- **Theme**: `app/context/ThemeContext.js` (React Context + localStorage), provided in root `layout.js`
- **Tool state**: Each tool manages its own state via `useState` + localStorage (no global store)

### Key Registries

- `app/lib/tool-list.js` — central registry of all tools (used for navigation and hub pages)
- `app/documentation/nav-items.js` — documentation sidebar navigation config

### Build-Time Preview Generation

`scripts/generate-blog-previews.js` runs before `next build`. It reads all blog post JSON files and generates 1200×630 PNG Open Graph images into `/public/previews/blog/`. This script uses `@vercel/og` and must run before the Next.js build.

### PWA

- `public/sw.js` — cache-first service worker registered by `app/components/ServiceWorkerRegistrar.js`
- `public/manifest.json` — PWA manifest with app shortcuts (Reader, Writer, vCard, UPI)

### Path Alias

`@/*` maps to the project root (configured in `jsconfig.json`).
