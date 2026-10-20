# Sourcedekho

This project is a Next.js app for an exam preparation portal. The app is structured around a simple flow:

1. The home page shows exam cards.
2. Clicking an exam takes the user to the exam detail/category screen.
3. Category pages are where deeper course/category-specific layouts live.

Important rule: keep the home page as an exam listing only. Do not add category logic to the main dashboard page.

## Project structure

```text
app/
  (dashboard)/
    page.tsx            # landing page for exam cards
  api/
    init-db/
      route.ts          # creates DB tables and seed data
  globals.css
  layout.tsx
components/
  BrandRibbon.tsx
  DashboardContainer.tsx
  LectureDashboardClient.tsx
  LoggedInUser.tsx
  Sidebar.tsx
lib/
  communityData.ts      # fallback data used when DB is missing/empty
  db.ts                 # postgres client
sql/
  test-questions.sql
public/
  hcs.png
  telegram.png
```

## Route logic

### Home page

File: `app/(dashboard)/page.tsx`

Purpose:
- Query the `exams` table
- Render exam cards
- Use each exam name as the route target

The home page is intentionally simple and should only display exams.

### Exam detail page

Expected route pattern:

```text
/courses/[exam]
```

This is the page where category layout should live. For example:
- General Studies
- Practice Tests
- Current Affairs

Do not put category logic on `/`.

## Database structure

The app uses PostgreSQL via `lib/db.ts` and initializes the schema in `app/api/init-db/route.ts`.

Core tables:

- `communities`
- `exams`
- `courses`
- `course_categories`
- `enrollments`
- `subjects`
- `lectures`

### Key rule

The homepage reads from `exams`, not from `courses`.

That is the source of truth for the landing page.

## Fallback behavior

If the database query fails or the table is empty, the app falls back to `lib/communityData.ts`.

This is meant as a safety fallback, not the primary source of truth.

## How to initialize the DB

Run the DB init route once in the app:

```text
/api/init-db
```

This creates the required tables and inserts the default seed data.

## Local development

Start the app:

```bash
npm install
npm run dev
```

Then open:

```text
http://localhost:3000
```

## Important conventions for future work

- Keep `/` as exam selection only.
- Keep category-specific logic under the exam/course route.
- Use `exams` as the landing page data source.
- Use `course_categories` for deeper category/card layouts.
- Keep fallback data in `lib/communityData.ts` for recovery and testing.
- Do not rebuild the app logic around `courses` when the home page is meant to show exams.

## Quick summary

This project uses a two-layer model:

- Exam layer: `exams` table -> dashboard/home page
- Category layer: `course_categories` -> selected exam detail page

If you are changing the homepage, think in terms of exam cards. If you are changing the course page, think in terms of category cards and deeper subject content.
