# Test Plan and Acceptance Criteria — Bug Busters

General acceptance (Definition of Done)
- The repository contains small, readable files organized under /design, /frontend, /backend, /tests.
- No external dependencies or build steps are required to run either the frontend or backend.
- Frontend plays a 20-second round with a moving, clickable bug; score increments per click; a final score and restart are shown.
- Optional leaderboard works if backend is running and is hidden or noted as unavailable if not.

[Owner: Designer]
Deliverable: /design/design_spec.md
Acceptance criteria
- Contains: overview, layout/wireframe, colors/typography tokens, interaction states (idle/playing/game-over), component specs (start button, timer, score, bug, final modal/panel, leaderboard section), and responsiveness notes.
- Wireframe clearly shows one-screen layout and placement of bug play area, score, timer, and controls.

[Owner: Frontend]
Deliverables: /frontend/index.html, /frontend/styles.css, /frontend/script.js
Acceptance criteria
- index.html loads without console errors.
- Visible controls: title, Start button, score, and 20s countdown timer.
- During play: a bug element moves within a bounded play area at least every 500ms (position changes) and never exits bounds.
- Clicking the bug increments the score by exactly 1 per click.
- After 20 seconds, the game stops moving the bug, shows final score, and presents Restart; previous score resets on restart.
- Optional leaderboard:
  - If backendURL is set (constant in script.js) and backend is reachable: user can enter a name and submit score; top 10 list displays sorted by score desc.
  - If backend unreachable: UI shows a small note and hides leaderboard controls; no unhandled promise rejections.
- Code is plain HTML/CSS/JS, reasonably commented for beginners, fewer than ~300 lines across the three files if feasible.

[Owner: Backend]
Deliverable: /backend/server.js
Acceptance criteria
- Starts with: node backend/server.js (Node >= 18) and listens on port 3000.
- GET /health → 200 and JSON { "status": "ok" } with content-type application/json.
- GET /scores → 200 and JSON with array "scores" of length ≤ 10 sorted by score desc; objects include name (string), score (number), ts (number, ms epoch).
- POST /scores → validates name (2–12 allowed chars) and score (integer ≥ 0); returns 201 with saved object; invalid requests return 400 with JSON error.
- CORS headers present for GET, POST, and OPTIONS.
- In-memory store capped at 100 entries; GET returns top 10.
- No external dependencies (only Node built-ins such as http/url).

Manual verification commands (examples)
- curl -i http://localhost:3000/health
- curl -i http://localhost:3000/scores
- curl -i -X POST http://localhost:3000/scores -H 'Content-Type: application/json' -d '{"name":"AA","score":7}'

[Owner: Tester]
Deliverables: /tests/test_plan.md, and one of /tests/verify_routes.sh (curl-based) or /tests/verify_routes.js (Node-based)
Acceptance criteria
- test_plan.md includes manual steps covering: game idle → start → playing (score increments, bug moves within bounds) → game over → restart; and backend routes success/error cases.
- verify_routes script:
  - Asserts GET /health returns 200 and {status:"ok"}.
  - Asserts GET /scores returns 200 and JSON with scores array.
  - Posts a valid score and confirms 201 and presence of saved.name and saved.score.
  - Posts an invalid score (e.g., name="A") and confirms 400.
  - Exits with non-zero on failure; prints a short summary.
