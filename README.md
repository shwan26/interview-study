# Interview Sprint

A 30-day full-stack and DSA interview prep tracker. Next.js (App Router, TypeScript). No backend, no accounts.
Progress is saved in the browser (localStorage). Use "Download backup" on the 30 days tab to move it between devices.

## Run locally
    pnpm install
    pnpm dev            # http://localhost:3000

## Deploy to Vercel
1. Push this folder to a GitHub repo.
2. On vercel.com choose Add New > Project, import the repo, keep the defaults (Framework: Next.js), press Deploy.

## Edit the plan
- `lib/data.json`: the 30 days, problems and interview questions.
- `lib/patterns.ts`: pattern hints, VisuAlgo / W3Schools / HackerRank links, SVG drawings.
- `app/globals.css`: colors and fonts (CSS variables at the top).
- Default start date is set in `defState()` in `lib/util.ts`; you can also change it in the app.
# interview-study
