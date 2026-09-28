# Frontend

The frontend for the organization and complex-management workspace. It is a
Next.js App Router application with a Persian, right-to-left interface for
authentication, dashboards, organization units, users, and the organization
chart.

## Stack

- Next.js `16.3.5` with React `19.2.8` and TypeScript
- Tailwind CSS `4` through `@tailwindcss/postcss`
- `pnpm` `12.5.1`
- Zod and React Hook Form for validation and forms
- Axios for server-side API requests
- Zustand for client state where needed
- `@xyflow/react` and `@dagrejs/dagre` for organization graph layouts
- Lucide React for icons and React Toastify for notifications
- Peyda local font with a Persian RTL document direction

## Getting Started

From the repository root, install dependencies and start both applications:

```bash
pnpm install
pnpm dev
```

The frontend runs at [http://localhost:3001](http://localhost:3001). The
backend runs at port `3000` by default. To run only the frontend:

```bash
pnpm --filter org-chart-authz-frontend dev
```

The frontend package also exposes these commands:

```bash
pnpm --filter org-chart-authz-frontend lint
pnpm --filter org-chart-authz-frontend build
pnpm --filter org-chart-authz-frontend start
```

Create `frontend/.env` from `frontend/.env.example`:

```env
API_URL=http://localhost:3000/api
```

`API_URL` is read by the server-only API client. Keep it server-side; do not
rename it to a `NEXT_PUBLIC_` variable unless the browser must access the API
directly.

## Application Structure

```text
frontend/
├── app/
│   ├── (auth)/                  # Login, signup, and SMS verification
│   ├── (workspace)/             # Authenticated workspace routes and shell
│   ├── actions/auth.ts          # Server actions for auth flows
│   ├── preview/page.dev.tsx     # Development component showcase
│   ├── globals.css              # Tailwind entry point and design tokens
│   ├── layout.tsx               # RTL document, font, metadata, toasts
│   └── page.tsx                 # Public landing page
├── components/
│   ├── auth/                    # Auth forms and session controls
│   ├── common/                  # Shared feature cards and UI primitives
│   ├── dashboard/               # Workspace header and dashboard cards
│   ├── org-units/               # Organization unit views and table
│   ├── units-chart/             # Organization graph and unit cards
│   ├── users/                   # Employee and manager views
│   └── workspace/               # Sidebar, sections, and workspace shell
├── data/                        # Local/mock data used by current views
├── docs/api-spec.json           # Backend OpenAPI snapshot
├── lib/
│   ├── api/                     # API client, response/error handling
│   ├── auth/                    # HTTP-only cookie session helpers
│   ├── schemas/                 # Shared input validation schemas
│   ├── routes.ts                # Named application routes
│   └── workspace-navigation.ts  # Sidebar items and breadcrumbs
├── services/auth/               # Signup and phone-confirmation services
├── types/                       # API, auth, user, and org-unit types
├── utils/                       # Graph, organization, and common helpers
└── public/fonts/                # Peyda-Regular.ttf
```

## Routes

Implemented App Router pages currently include:

| Route                 | Purpose                             |
| --------------------- | ----------------------------------- |
| `/`                   | Public introduction and quick links |
| `/login`              | Login form                          |
| `/signup`             | Account registration                |
| `/verify-sms`         | Phone verification after signup     |
| `/dashboard`          | Authenticated workspace dashboard   |
| `/org-units`          | Organization unit management        |
| `/organization-chart` | Organization graph                  |
| `/users`              | Users, employees, and managers      |

The `(auth)` and `(workspace)` directories are route groups and do not appear
in URLs. The workspace layout checks the `access_token` HTTP-only cookie and
redirects unauthenticated users to `/login`. The auth layout redirects an
already authenticated user to `/dashboard`.

The navigation model also contains planned areas for contracts, finance,
operations, documents, access management, and reports. These entries are
defined in `lib/workspace-navigation.ts`; routes without a dedicated page are
currently handled by `app/(workspace)/[...slug]/page.tsx`.

## Authentication and API Requests

Use server actions for mutations that involve credentials or session state:

1. Form data is validated with the relevant Zod schema in `lib/schemas/auth.ts`.
2. The auth service or `AppApi` sends the request to the backend.
3. The access token is stored in the HTTP-only `access_token` cookie.
4. Signup temporarily stores the username in the HTTP-only
   `pending_username` cookie for SMS verification.

`lib/api/server.ts` exposes `AppApi`, the server-only request helper. It reads
the access token, adds the Bearer header, validates the backend response
envelope, converts failures to `ApiError`, and clears the session on an
authenticated `401`. Keep API calls that depend on cookies in server files or
server actions. Use the shared API response and error types instead of parsing
backend responses ad hoc.

The backend contract snapshot is in [docs/api-spec.json](docs/api-spec.json).
Regenerate or update it when the backend API changes so frontend integrations
remain reviewable.

## UI and Styling Conventions

The root layout sets `lang="fa"`, `dir="rtl"`, and the Peyda font. Reuse the
components in `components/common/ui` before creating a new primitive. Use
`cn` from `lib/cn.ts` when conditionally combining class names, and use Lucide
icons rather than drawing custom icons.

Use semantic color utilities instead of literal colors in new components. The
tokens are defined in `app/globals.css` and include:

- `background`, `surface`, `foreground`, `muted`, `muted-foreground`
- `border`, `input`
- `primary`, `primary-hover`, `primary-active`, `primary-foreground`
- `accent`, `accent-foreground`
- `success`, `success-subtle`
- `warning`, `warning-subtle`
- `destructive`, `destructive-subtle`
- `info`, `info-subtle`

Recommended semantic pairings:

| Foreground           | Background                                   | Use                         |
| -------------------- | -------------------------------------------- | --------------------------- |
| `foreground`         | `background`, `surface`, `muted`             | Main text                   |
| `muted-foreground`   | `background`, `surface`, `muted`             | Supporting or disabled text |
| `primary-foreground` | `primary`, `primary-hover`, `primary-active` | Primary actions             |
| `accent-foreground`  | `accent`                                     | Selected items              |
| `success`            | `success-subtle`                             | Success feedback            |
| `warning`            | `warning-subtle`                             | Warnings                    |
| `destructive`        | `destructive-subtle`                         | Errors                      |
| `info`               | `info-subtle`                                | Informational feedback      |

Use `border` for decorative separators, `input` for meaningful field
boundaries, and `primary` for focus outlines with an offset. Always pair a
status color with readable status text.

## Development Workflow

- Start both services when working on authenticated or API-backed screens.
- Add reusable controls to `components/common/ui` and compose them in feature
  components rather than duplicating styles.
- Keep route-level data loading in server components where possible.
- Keep browser-only state and event handlers in components that explicitly use
  the client boundary.
- Update `lib/workspace-navigation.ts` when adding a workspace destination so
  the sidebar, page title, and breadcrumbs stay consistent.
- Run lint before opening a pull request and run a production build when
  changing routing, server actions, or environment handling.

## Useful References

- [Next.js App Router documentation](https://nextjs.org/docs/app)
- [Tailwind CSS documentation](https://tailwindcss.com/docs)
- [Backend README](../backend/README.md)
- [Repository package scripts](../package.json)
