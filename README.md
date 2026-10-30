# Free Period (website + web app)

Turn free periods into future skills. Built for the UCD Student Hackathon challenge:
"How might we prepare UCD graduates for the jobs of the future?"

## Run it

Needs Node.js 18 or newer.

```
npm install
npm run dev
```

Open http://localhost:5173. On your phone (same Wi-Fi): `npm run dev -- --host`, then open the Network address.

Jump straight to a screen with a hash: `#now`, `#week`, `#post`, `#passport`, `#insights`.

## Live link for judges

```
npx vercel
```

Accept the defaults (Vercel detects Vite).

## What's where

- `src/landing/Landing.jsx`: the website (hero, ticker, challenge, how it works, request types, passport, careers, trust).
- `src/app/`: the web app screens (Free now, My week, Post, Skills Passport, Careers insights) and the sidebar shell.
- `src/components/`: timetable grid, timetable upload, request card, detail drawer (with the end-of-session rating), chat with the other student, star display, skill editor, scroll reveal, toast.
- `src/timetable.js`: reads an uploaded `.ics` calendar export or `.csv` (day, start, end, module) into classes, and marks the gaps between classes as free.
- `src/data.js`: all demo content. Your timetable, students, requests, insights and heatmap numbers.
- `src/utils.js`: gap detection, the time-overlap matching rule, skill ranking, sorting (best fit, highest rated, soonest), the smart-match search and the demo chat replies.
- `src/App.jsx`: state, routing and actions (request, accept, withdraw, message, confirm, cancel, credits, post, reset).
- `src/styles.css`: design tokens (light and dark) and all styles. Yellow always means free time.

## Demo path (about 90 seconds)

1. Website hero: your real timetable draws its free hours in yellow. Click "See today's matches".
2. Free now: type "stuck on a pandas merge" into Smart match.
3. Sort by "Highest rated". Open Aoife, tap "Message Aoife first" and ask a question (she replies). Join: the request waits until she accepts (1 credit held), then confirm and rate her (the person who received help rates). Open Cian, offer help, confirm (+1 credit) and see his rating of you.
4. Skills Passport: the sessions are logged. Create the CV summary.
5. Careers insights: biggest skills gap and the best time for a workshop.
6. My week: mark Monday 11:00 free and a new match appears. Or upload your own timetable (.ics or .csv).
