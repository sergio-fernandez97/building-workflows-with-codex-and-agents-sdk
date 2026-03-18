Bug Busters – Tiny Browser Game

Product goal
- Build a tiny, single-screen browser game to demonstrate a simple multi-agent workflow from design to test.

Target users
- Educators, beginners, and developers exploring multi-agent pipelines; casual players trying a quick 20-second game.

Core gameplay and UI
- Game title: "Bug Busters".
- Single-screen play area with a visible timer and score.
- Player clicks a moving “bug” to earn +1 point per successful click.
- The bug repositions/moves within the play area at a regular interval (about every 500–800 ms) and stays fully visible within bounds.
- Game duration: 20 seconds. When time hits 0, stop movement and show a simple end-of-game panel with final score and a Restart button.
- Basic sound/animation are optional and should be easy to remove.
- Accessibility: provide clear focus states, sufficient contrast; game remains operable with mouse/touch. Keyboard support is optional but nice to have.

Optional leaderboard
- Allow player to enter a short name (<= 20 chars) and submit score to a backend.
- Display top-10 scores sorted by score desc (ties broken by earliest submission time).
- If backend is unavailable, the UI should hide/disable submission and show a light, non-blocking message.

Non-functional and constraints
- Keep everything easy to read for beginners; prefer clarity over cleverness.
- No external database; in-memory storage on the backend is sufficient.
- No frameworks required; prefer vanilla HTML/CSS/JS on the frontend and the Node.js built-in http module on the backend.
- Small files, no build tooling required. The app should run by opening index.html and starting a small Node server.
- Cross-browser: recent Chrome/Firefox/Edge/Safari (desktop and mobile). Don’t over-optimize; graceful degradation is fine.

Tech choices
- Frontend: index.html + style.css + app.js (vanilla). Use setInterval/requestAnimationFrame to move the bug and a separate interval for the countdown timer.
- Backend: Node.js (>=18) with http module; store scores in-memory (array). Allow CORS from any origin for simplicity during local dev.

API contract (minimal)
- GET /health → 200 { "status": "ok" }
- GET /scores → 200 { "scores": [ { "name": string, "score": number, "ts": number } ] } (top 10, sorted desc by score, then asc by ts)
- POST /scores with JSON { name: string<=20, score: integer>=0 }
  - On success: 201 { name, score, ts }
  - On invalid input: 400 { error: string }

Folder structure (outputs will be created by each role)
- /design/design_spec.md
- /frontend/index.html, /frontend/style.css, /frontend/app.js
- /backend/server.js
- /tests/smoke_tests.sh (plus any brief test notes)

Run instructions (dev)
- Backend: Node >= 18. Start with: node backend/server.js (default port 3000)
- Frontend: Open frontend/index.html in a browser. Leaderboard calls http://localhost:3000.

Success criteria
- Game works: moving, clickable bug; score increments; 20s timer; end screen with final score and restart.
- Optional leaderboard works against the provided API when the backend runs; UI degrades gracefully if it does not.
- Code is short, clear, and beginner-friendly.
