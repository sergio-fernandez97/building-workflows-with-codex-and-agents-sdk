# Bug Busters — Quick Test Plan

Goal: Verify core gameplay loop and minimal backend routes.

Prereqs
- Node.js >= 18 installed.
- Optional backend running locally: `npm run start` (from repository root) or `node backend/server.js`.
- Modern desktop browser (Chrome/Firefox/Edge/Safari).

Manual gameplay checks
- Load frontend/index.html in the browser (double-click or serve locally).
- Idle state: Start button enabled; timer shows 00:20; score 0; bug hidden.
- Click Start:
  - Start button becomes disabled.
  - Timer counts down every second from 00:20.
  - A circular red “bug” appears and repositions at least twice per second within the play area without leaving bounds.
  - Clicking the bug increments Score by +1 per click.
- When timer reaches 00:00:
  - Bug stops and hides.
  - Final panel shows “Time’s up! Your score: X” and a Play Again button.
  - Clicking Play Again resets score to 0, timer to 00:20, and starts a new round.
- Leaderboard behavior:
  - If backend is not running: a small note appears “Leaderboard unavailable (backend offline)”, and no errors appear in the console.
  - If backend is running: after game over, enter a name (2–12 chars) and Submit Score → on success, list updates; errors show a brief message and UI stays usable.

Backend route checks (can be automated via smoke_test.sh)
- GET /health → 200 and JSON {"status":"ok"}
- GET /scores → 200 and JSON with an array field "scores" (≤ 10 items).
- POST /scores valid → 201 and JSON with "saved" containing name, score, ts.
- POST /scores invalid (name too short) → 400 with JSON {"error": "..."}.

Definition of done
- All manual checks pass; smoke test passes; no console errors in the browser; code matches the minimal, beginner-friendly style.
