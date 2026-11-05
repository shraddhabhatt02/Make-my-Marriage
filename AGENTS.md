# Repository guidance

## Project

Make My Marriage is an Indian wedding planning web application. The repository is a Next.js App Router, TypeScript modular monolith. The current route tree is `src/app`; application routes and layouts belong there, while shared server code and configuration remain in their separate root-level directories.

## Source of truth

- `docs/PRD.md` v1.1 is the product requirements baseline and the product source of truth.
- `docs/System_Design .md` v1.3 describes the intended architecture and approved technology stack.
- `docs/Database_Design.md` v1.1 and `docs/API_Design.md` v1.0 provide detailed data and API designs. The API document is marked ready for review and freeze; do not claim it is formally frozen.
- These filenames are the actual repository paths. A standalone ERD is not present.
- If documents conflict, identify the exact statements and sections and ask for a product decision when needed. Do not silently override the PRD or invent requirements.

## Approved stack

Use Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui, MongoDB Atlas, Mongoose, Auth.js, Resend, Cloudflare R2, Google Places API (New), YouTube embeds, and Vercel. Keep this a single-repository modular monolith. Do not introduce microservices, a separate backend application, or replacement technologies without approval.

## Business rules that must remain intact

- An organiser account has at most one active wedding membership.
- Bride and Groom Primary Admin memberships are protected classifications; the only organiser roles are Admin and Manager.
- Enforce wedding-level data isolation and authorisation on the server for every scoped operation.
- Guest access is household-scoped, with invitations and RSVPs per event. Guests do not have accounts or OTP in the MVP.
- No automatic post-event guest-access expiry or wedding archive/closure is in the MVP.
- Gallery-view and guest-upload QR links have separate purposes. The gallery QR locates published gallery content; it is not an authentication credential. The upload token independently authorises photo submission.
- Guest submissions require organiser approval before publication.
- YouTube controls livestream availability and privacy; unlisted links may be forwarded.
- Store expense and payment amounts as whole INR integer rupees, never paise or floating-point decimals.

## Known unresolved requirement conflict

The PRD permission matrix permits Admin deletion of payment records, while the database and API designs require payment history to be retained and corrected through Admin-only voiding. Do not implement either interpretation for payment deletion/correction until this discrepancy is explicitly resolved. Preserve the existing document wording unless asked to update it.

## Implementation conventions

- Keep routes thin; put business workflows and permission checks in server-side application logic.
- Keep database access, credentials, and provider integrations server-only. Never expose secrets through client code or `NEXT_PUBLIC_` variables.
- Validate external and request data at boundaries; never trust client-provided role or wedding ownership fields.
- Use clear, focused changes and preserve existing project documents and configuration unless the task requires changing them.
- Do not add integrations, dependencies, feature modules, or product behavior just because they are common. Explain material tradeoffs when a dependency or architecture decision is needed.
- Run the relevant lint, type-check, build, or tests when requested or when needed to verify a code change; report what was and was not run.

## Project progress tracking

- Maintain `docs/PROJECT_STATUS.md` as the concise, current record of major project milestones and feature progress.
- Whenever a major feature or foundation milestone is completed, update the status file in the same change. Record what was delivered, its current status, and relevant verification; do not mark work complete unless it is implemented.
- Keep the status file factual and consistent with the product documents and repository. Do not use it to silently change requirements or imply approval of future work.
- Before beginning a new major feature, check the status file for context; update it when that feature is completed or its status materially changes.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
