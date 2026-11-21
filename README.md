# LinkOp Frontend

Event management for meetups, parties, happy hours and formal meetings.
SvelteKit 5 · Houdini (GraphQL) · Tailwind 4 · Keycloak.

## Setup

1. `pnpm install`
2. `pnpm dev`, then open http://localhost:5173

The committed `.env` is the only env file. It points both `pnpm dev` and the Vercel build
at the online API (`https://api-linkop.duckdns.org`) and Keycloak
(`https://auth-linkop.duckdns.org`, realm `linkop`, client `linkop`). Its values all ship
to the browser, so never put secrets in it.

The `linkop` Keycloak client must allow each address the app runs on:

- Valid redirect URIs: `http://localhost:5173/*` and `https://linkop-frontend.vercel.app/*`
- Web origins: `http://localhost:5173` and `https://linkop-frontend.vercel.app`

In dev, `/graphql` is proxied to the API, so no CORS setup is needed locally.

## Scripts

| Script             | What it does                                            |
| ------------------ | ------------------------------------------------------- |
| `pnpm dev`         | Dev server                                              |
| `pnpm check`       | Type-check                                              |
| `pnpm lint`        | Prettier + ESLint                                       |
| `pnpm pull-schema` | Refresh `schema.graphql` from `VITE_APP_SERVER_API_URL` |
| `pnpm generate`    | Regenerate Houdini stores from `src/**/*.gql`           |

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

## Calendar invitations

Create an event with a start and end time, then invite another registered user.
The guest opens the event from **Invites**, chooses **Accept invitation**, then
**Add to Google Calendar**. The calendar draft contains the event title,
description, location and UTC time range. The guest must choose **Save** in
Google Calendar; accepting the LinkOp invitation does not save it automatically.
The accepted RSVP and calendar action remain available after reloading.

`npm test` runs calendar URL, response handling and date validation tests.
`npm run test:e2e` runs the two-user flow against the real local API on port 8000,
Keycloak on port 8080 (realm/client `linkop`), and the frontend on port 5173.
It uses installed Chrome and provisions synthetic local users using the local
Keycloak admin (`admin` / `admin` by default; override with
`E2E_KEYCLOAK_ADMIN_USERNAME` and `E2E_KEYCLOAK_ADMIN_PASSWORD`). Test users and
private test events remain for inspection. The test verifies the persisted RSVP,
calendar contents, mobile layout and Google handoff. Saving inside a Google
account requires a separate signed-in verification.
