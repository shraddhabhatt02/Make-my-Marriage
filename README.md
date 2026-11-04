# Make My Marriage

Wedding planning application for couples and their invited organisers.

## Development

- Node.js 20.9 or newer (Node.js 24 LTS recommended)
- npm

```bash
npm install
npm run dev
```

The initial foundation uses Next.js App Router, TypeScript, Tailwind CSS, and Zod. Product modules and integrations will be added in dependency order after their requirements are resolved. See `docs/` for the current product and architecture documents.

## Checks

```bash
npm run lint
npm run typecheck
```

## Tests

Vitest is configured for unit and integration tests. Place test files alongside their module or under `tests/`, using `.test.ts` or `.test.tsx` filenames.

```bash
npm test
npm run test:watch
```

No test cases have been added yet. Browser-based end-to-end testing will be configured when its framework is selected.

## Environment

Copy `.env.example` to `.env.local` when local server-side configuration is introduced. Do not commit credentials.
