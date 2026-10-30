# LinkOp Frontend

Event management for meetups, parties, happy hours and formal meetings.
SvelteKit 5 · Houdini (GraphQL) · Tailwind 4 · Keycloak.

## Setup

1. `pnpm install`
2. `cp .env.example .env` and fill in the values.
3. In Keycloak (realm `linkop`), create a **public** OpenID Connect client named after
   `VITE_KEYCLOAK_CLIENT_ID` (default `linkop-frontend`):
   - Standard flow on, PKCE `S256`
   - Valid redirect URIs: `http://localhost:5173/*`
   - Web origins: `http://localhost:5173`
4. Start the backend (`dotnet run` in `../LinkOp`, serves `http://localhost:8000/graphql`).
5. `pnpm dev`, then open http://localhost:5173

In dev, `/graphql` is proxied to the backend, so no CORS setup is needed.

## Scripts

| Script             | What it does                                         |
| ------------------ | ---------------------------------------------------- |
| `pnpm dev`         | Dev server                                           |
| `pnpm check`       | Type-check                                           |
| `pnpm lint`        | Prettier + ESLint                                    |
| `pnpm pull-schema` | Refresh `schema.graphql` from `VITE_APP_SERVER_API_URL` |
| `pnpm generate`    | Regenerate Houdini stores from `src/**/*.gql`        |

## Structure

```
src/
  components/   general (Button, Badge…), custom (Modal, Tabs…), layout (Sidebar, Navbar…)
  features/     <feature>/components + <feature>/services (*.gql, helpers)
                events · reminders · notifications · users · dashboard · settings
  stores/       auth (Keycloak), session (LinkOp user profile), breadcrumbs
  routes/(app)/ dashboard · events · events/create · events/[id] · events/[id]/edit
                invites · reminders · people (admin) · settings
```

Event covers are either an image URL or a built-in gradient saved as `linkop:cover/<id>`
(see `features/events/services/covers.ts`).
