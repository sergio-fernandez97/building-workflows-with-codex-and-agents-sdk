Bug Busters – Agent Tasks

Designer
- Project: Bug Busters
- Required deliverables
  - /design/design_spec.md: One-page UI/UX spec with simple wireframe. Include: layout, colors, typography, spacing, component sizes, interaction notes (bug movement cadence, click feedback, end-of-game flow), and leaderboard states (enabled/disabled).
- Key notes and constraints
  - Target: single-screen, minimal chrome, high contrast, large tap targets (~48px), mobile-friendly.
  - Keep spec compact and beginner-friendly; propose one bug graphic approach (CSS shape, emoji, or a tiny SVG/PNG).

Frontend Developer
- Project: Bug Busters
- Required deliverables
  - /frontend/index.html: Single page containing the game UI.
  - /frontend/style.css: Styles matching the design.
  - /frontend/app.js: Game logic (movement, scoring, timer, end panel, optional leaderboard fetch/submit).
- Key technical notes and constraints
  - Vanilla JS only; no frameworks or build tools.
  - Game loop: move bug within bounds about every 700 ms; increment score on click; countdown from 20 to 0 then stop.
  - Ensure bug is always fully visible in the play area; add simple click feedback.
  - Optional leaderboard: read name input; POST score to http://localhost:3000/scores; GET top-10 and render. If fetch fails, hide/disable with a small note.
  - Keep files small and commented; make it easy to restart a round without page reload.

Backend Developer
- Project: Bug Busters
- Required deliverables
  - /backend/server.js: Minimal Node http server implementing GET /health, GET /scores, POST /scores with in-memory storage and CORS.
- Key technical notes and constraints
  - Node >=18; no external DB or frameworks. Use http, url, and crypto (if needed) from stdlib.
  - Data model: { name: string (<=20), score: integer (>=0), ts: number } stored in an array. Keep up to 100 recent entries; return top 10 by score desc, then ts asc.
  - CORS: allow GET/POST from any origin during local dev; include OPTIONS handling.
  - Validation: trim name, clamp to 20 chars, require non-negative integer score; respond 400 on invalid.
  - Listen on PORT env or 3000.

Tester
- Project: Bug Busters
- Required deliverables
  - /tests/smoke_tests.sh: Bash script using curl to verify backend routes (health, create score, list scores, invalid payload).
  - (Optional) /tests/TEST_PLAN.md: Brief plan, manual steps for frontend (play a round, submit score, verify leaderboard).
- Key technical notes and constraints
  - Script should exit 1 on any failure; print PASS/FAIL per check; assume server at http://localhost:3000.
  - Keep outputs readable; no external dependencies beyond bash and curl.
