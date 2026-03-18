# Agent Tasks — Bug Busters

Project name: Bug Busters

Common constraints for all roles
- Keep outputs small, readable, and beginner-friendly. No frameworks or build tools. No external services or databases.
- Place your files in a clearly named folder for your role. Do not alter files outside your folder except where specified.

## Designer
Project name: Bug Busters
Required deliverables (file names and purpose)
- /design/design_spec.md — One-page UI/UX spec and basic wireframe for the single-screen game.

Key technical notes and constraints
- Provide: layout diagram (ASCII or simple embedded image link), color and typography tokens, component specs (title, play area, bug, score, timer, controls, final-score panel, leaderboard section), interaction states (idle/playing/game-over), and accessibility notes (contrast, focus, button labels).
- Keep to a single screen. Use a neutral color palette with one accent color. Suggest a readable web-safe font stack.
- Assume the leaderboard may be hidden if backend unavailable; include copy variants for both states.

## Frontend Developer
Project name: Bug Busters
Required deliverables (file names and purpose)
- /frontend/index.html — Single page containing the game UI.
- /frontend/styles.css — Minimal styling for layout, play area, and states.
- /frontend/script.js — Game logic and optional backend integration.

Key technical notes and constraints
- Vanilla HTML/CSS/JS only. No bundlers or frameworks.
- Implement game states: idle → playing (20s) → game over → restart.
- The bug is a simple element (emoji, SVG, or CSS circle). It must remain within the play area bounds.
- Movement: update position at least every 500ms; use requestAnimationFrame or setInterval; keep code simple.
- Expose a single constant backendURL (e.g., const backendURL = 'http://localhost:3000';) at the top of script.js to toggle leaderboard. If null/empty, skip network calls.
- Gracefully handle fetch errors; hide leaderboard UI if offline; no unhandled promise rejections.
- Keep total code size small (~300 LOC across files, if possible) and add brief comments for beginners.

## Backend Developer
Project name: Bug Busters
Required deliverables (file names and purpose)
- /backend/server.js — Minimal Node.js server implementing GET /health and GET/POST /scores with in-memory storage.

Key technical notes and constraints
- Node.js >= 18, no external dependencies; use http, url, and crypto (if helpful) from Node core.
- Port: 3000, host: 0.0.0.0. Add basic request logging to stdout.
- Data: store up to 100 recent entries in memory (name, score, ts). GET returns top 10 sorted desc by score.
- Validation: name 2–12 chars (letters/digits/space/-/_), score integer ≥ 0. Respond 400 with JSON {error:"..."} on invalid.
- Responses: JSON with content-type application/json and CORS headers for GET, POST, OPTIONS.
- Provide minimal inline comments explaining the code and how to run (node backend/server.js).

## Tester
Project name: Bug Busters
Required deliverables (file names and purpose)
- /tests/test_plan.md — Brief plan covering gameplay and API routes.
- /tests/verify_routes.sh or /tests/verify_routes.js — Simple script to verify /health, /scores (GET/POST) happy and error paths.

Key technical notes and constraints
- Script should exit non-zero on failure and print a concise summary.
- Prefer zero external dependencies: use curl in shell or built-in https/fetch in Node 18+.
- Include a short README section at top of the script or in test_plan.md explaining how to run it.
