<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# book-nook

Early-stage Next.js App Router app. `README.md` is still `create-next-app` boilerplate; trust `package.json` and `next.config.ts` instead.

## Commands

- `npm run dev` — Turbopack dev server. It rewrites the managed Next.js block above; commit that block with your changes.
- `npm run build` / `npm start`
- `npm run lint` — runs bare `eslint` (Next 16 has no `next lint`).
- `npx tsc --noEmit` — typecheck. There is no test runner or `typecheck` script.

Before finishing, run `npm run lint` and `npx tsc --noEmit`.

## Stack quirks

- Next.js 16.4.4 / React 19. APIs differ from older Next.js: read `node_modules/next/dist/docs/` before writing code.
- `cacheComponents` and `partialPrefetching` are enabled in `next.config.ts`. Data is dynamic by default; opt into caching with `'use cache'` plus `cacheLife` / `cacheTag`, and wrap uncached async UI in `<Suspense>`. Pages and GET route handlers use the PPR/static-shell model. Do not add `runtime` segment config or edge runtime.
- React Compiler is enabled (`reactCompiler: true`).
- Tailwind CSS v4 runs through the Turbopack loader (`turbopack.rules` → `@tailwindcss/turbopack`), not PostCSS. There is no `tailwind.config.*`; theme tokens live in `src/app/globals.css`.
- UI uses shadcn `base-nova` style on `@base-ui/react` primitives, not Radix. Add components with `npx shadcn add <name>`; they land in `src/components/ui/`.
- Import `cn` from the `cn` package (`import { cn } from "cn"`); `@/lib/utils` only re-exports it.
- Path alias: `@/*` → `src/*`.

## Layout

- `src/app/` — App Router routes, root layout, global CSS, brand assets.
- `src/components/ui/` — generated shadcn components; edit only when a project-specific change is intended.
- `src/lib/` — shared helpers.

## Home page & app shell

- `src/app/(main)/layout.tsx` renders `SiteNavbar` + `SiteFooter` for every page. The navbar is the required top bar (logo, Home, All Books, Add Book, My Books, My Borrows); there is no sidebar.
- `src/app/(main)/page.tsx` composes the home sections from `src/components/home/`.
- Books come from `getBooks()` in `src/lib/api/books.ts`, which calls `GET /books` on the Express backend at `NEXT_PUBLIC_API_URL` (default `http://localhost:5000`). If the request fails, it logs a warning and renders empty shelves instead of crashing. `getBooks` is cached with `cacheLife("minutes")` and `cacheTag("books")`.
- Theme is `next-themes` with `attribute="class"`; brand tokens and light/dark palettes live in `src/app/globals.css`.
- `src/components/layout/site-navbar.tsx` treats the demo reader as signed in until BetterAuth lands.
- `instant = false` is set on the `(main)` layout and on `/books` and `/books/[id]` because the navbar reads `usePathname()` and those pages read `searchParams` / `params`. Remove it once those reads sit behind `<Suspense>`.

`.env*` is gitignored. The frontend expects `GET /books` from the Express backend; until that route exists, shelves render their empty state.
