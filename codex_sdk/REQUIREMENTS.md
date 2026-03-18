# Bug Busters — Tiny Browser Game

Product goal
- Build a tiny, single-screen browser game to showcase a simple multi-agent workflow from design to test.

Target users
- Beginners learning web development, hackathon demos, and evaluators reviewing a minimal full-stack workflow.

Core gameplay (must-have)
- Title: "Bug Busters".
- Single screen with a Start button, a visible countdown timer (20 seconds), a moving “bug,” and a live score counter.
- Player earns +1 point per successful click on the moving bug.
- The bug continuously moves around the play area at a beginner-friendly speed and never leaves the visible bounds.
- Game session lasts exactly 20 seconds; then show a final score panel with Restart option.

Optional feature (nice-to-have)
- Leaderboard backed by a minimal local Node.js server (in-memory only). After game over, user can submit a name and score. UI displays top 10 scores if backend is reachable; otherwise, it gracefully hides leaderboard and shows a small note.

API contract (for optional leaderboard)
- Base URL: http://localhost:3000 (configurable in frontend as a single constant)
- Endpoints:
  - GET /health → 200 OK, JSON: { "status": "ok" }
  - GET /scores → 200 OK, JSON: { "scores": [ { "name": "AA", "score": 12, "ts": 1710000000000 } ] }
    - Returns up to top 10 scores descending by score. ts is a server timestamp in ms.
  - POST /scores → 201 Created, JSON: { "ok": true, "saved": { "name": "AA", "score": 12, "ts": 1710000000000 } }
    - Request body JSON: { "name": string (2–12 ASCII letters/digits/space/-/_), "score": integer ≥ 0 }
    - Validate input; reject invalid with 400 and JSON { "error": "..." }.
  - OPTIONS for CORS preflight should return appropriate headers.
- CORS: Access-Control-Allow-Origin: *; methods GET, POST, OPTIONS; header Content-Type allowed.
- Storage: In-memory array only; keep up to last 100 entries; GET returns top 10 by score.

Non-functional requirements and constraints
- Simplicity and readability over features; aimed at beginners.
- No frameworks or build tools required. Use vanilla HTML/CSS/JS for frontend, and Node.js built-ins for backend (no external dependencies).
- Small files only; clear folder names (design, frontend, backend, tests) for role outputs.
- Works on modern desktop browsers (latest Chrome/Firefox/Edge/Safari). No mobile requirements.
- Accessibility: clear focus states, adequate color contrast, and button labels. Keyboard focus should not trap; mouse interaction is primary.

Frontend specifics
- One HTML page with minimal CSS and JS. No assets required; use an emoji or simple CSS shape for the bug.
- Game states: idle (pre-start), playing (timer counts down), game over (final score, submit name if backend available).
- Degrade gracefully if backend is offline (no unhandled promise rejections; show a small note and hide leaderboard/submit).

Backend specifics
- Single file server (server.js), Node.js >= 18, no third-party deps.
- Port 3000 by default; listen on 0.0.0.0.
- Log simple request summaries to stdout (method, path, status).

Assumptions
- Users run the backend locally before launching the frontend if they want leaderboard.
- Scores are transient and reset on server restart.

Out of scope
- Authentication, persistence beyond memory, assets/sounds, multi-bug logic, mobile layout.

Success criteria
- Playable 20s game loop; visible timer; score increments on click; final score shown.
- Optional leaderboard: POST saves, GET shows top 10, and UI handles backend absence gracefully.
