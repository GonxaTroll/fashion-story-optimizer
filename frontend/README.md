# FashStOpt — Frontend

React + TypeScript frontend for the Fashion Story Optimizer.

## Stack

- **React 19 + TypeScript** — UI
- **Vite** — dev server and bundler
- **Tailwind CSS 4** — styling
- **Framer Motion** — animations
- **Lucide React** — icons

## Structure

```
src/
  pages/
    dashboard.tsx   # home — last results overview
    scheduler.tsx   # weekly availability grid
    optimizer.tsx   # run the MILP solver
    results.tsx     # optimized schedule table + CSV export
    account.tsx     # profile and password settings
    sign-in.tsx
    sign-up.tsx
  components/
    AppFooter.tsx       # shared footer
    FooterInfoModal.tsx # About / Support / Privacy / Terms modal
    AccountTab.tsx      # account settings form
  hooks/
    use-current-user.ts # fetches logged-in user info
    use-scheduler.ts    # scheduler grid state
```

## Running locally

```bash
docker compose up frontend --build
```

App at `http://localhost:5173`.
