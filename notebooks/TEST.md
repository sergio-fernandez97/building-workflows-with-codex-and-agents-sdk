Test Plan and Task List

[Designer]
Tasks
- Produce a one-page design and UI/UX spec with a basic wireframe for the single-screen game.
- Specify layout: title, play area, score, timer, end-of-game panel, optional leaderboard panel.
- Include states: default, hover/click on the bug, countdown, game-over, disabled leaderboard (backend down).
Acceptance Criteria
- File /design/design_spec.md exists and includes: color palette, font choices, spacing, component sizes, and a simple wireframe diagram.
- Interaction notes cover bug movement cadence, click feedback, and end-of-game flow.

[Frontend]
Tasks
- Implement /frontend/index.html, /frontend/style.css, /frontend/app.js.
- Render title, score, timer, play area (bug appears within bounds), end-of-game panel with restart.
- Bug moves every ~700 ms within the play area; clicking bug increments score by 1 with simple visual feedback.
- Implement 20s timer that cleanly stops the game and shows final score.
- Optional: name input + Submit Score button; load and display top-10 leaderboard.
- Handle backend offline: hide/disable submission and show a non-blocking note.
Acceptance Criteria
- Opening frontend/index.html allows playing a full 20s round; score increments on bug clicks; restart works without reloading page.
- With backend running, submitting a score returns 201 and leaderboard updates accordingly; without backend, UI remains usable without errors.
- No external frameworks required; code is short and well-commented.

[Backend]
Tasks
- Implement /backend/server.js using Node’s http module with in-memory storage.
- Endpoints: GET /health, GET /scores, POST /scores (validate: name string<=20, score integer>=0).
- Sort and return top-10 scores; include timestamp ts (ms since epoch) on entries.
- Enable CORS for GET/POST from http://localhost (any port) and file:// origins for local testing.
Acceptance Criteria
- curl http://localhost:3000/health → 200 {"status":"ok"}
- curl http://localhost:3000/scores → 200 with JSON {scores:[...]}
- curl -X POST http://localhost:3000/scores -H 'Content-Type: application/json' -d '{"name":"A","score":3}' → 201 with created entry.
- Invalid POST (e.g., missing name) → 400 with JSON error.

[Tester]
Tasks
- Provide a concise test plan and a smoke test script to verify core routes.
- Script should start with bash shebang, exit non-zero on failure, and print clear PASS/FAIL lines.
Acceptance Criteria
- /tests/smoke_tests.sh runs against a running backend and verifies: GET /health 200, POST /scores 201 for valid payload, GET /scores contains the posted score, invalid POST returns 400.
- Notes include how to run tests and expected outcomes.

Integration acceptance checks
- Files exist: /design/design_spec.md; /frontend/index.html; /backend/server.js.
- Leaderboard hides or shows based on backend availability without breaking the game loop.
- All code remains beginner-friendly, small, and in clearly named folders.
