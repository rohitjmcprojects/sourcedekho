# Sourcedekho

Sourcedekho is a Next.js exam-preparation portal built around an exam-first structure. The home dashboard lists exams, and each exam leads to a course/category experience.

## Project structure

```text
app/
  (dashboard)/
    page.tsx            # landing page showing exam cards
  api/
    init-db/
      route.ts          # creates DB tables and seeds exam data
  globals.css
  layout.tsx
components/
  BrandRibbon.tsx
  DashboardContainer.tsx
  LectureDashboardClient.tsx
  LoggedInUser.tsx
  Sidebar.tsx
lib/
  communityData.ts      # fallback exam/community data for empty DB states
  db.ts                 # PostgreSQL connection client
sql/
  test-questions.sql    # sample SQL for subject/test-question data
public/
  hcs.png
  telegram.png
```

## App flow

1. The landing page shows exam cards from the `exams` table.
2. Clicking an exam routes to the exam-specific course/category area.
3. Category and subject logic lives under the exam/course route, not on the home page.

## Core rule

The homepage must read from `exams`, not from `courses`.

## Database setup

Initialize the schema and seed data once:

```bash
http://localhost:3000/api/init-db
```

This route creates the required tables, including:

- `exams`
- `courses`
- `subjects`
- `day_wise`
- `syllabus_wise`

## Local development

```bash
npm install
npm run dev
```

Then open:

```text
http://localhost:3000
```

## Fallback behavior

If the database is not ready or the `exams` table is empty, the app falls back to data from `lib/communityData.ts` so the page still renders without crashing.

## Important conventions

- Keep `/` as an exam selection page only.
- Keep course/category logic under the exam route.
- Use `exams` as the source of truth for the dashboard.
- Keep fallback/demo data in `lib/communityData.ts` for recovery and testing.
