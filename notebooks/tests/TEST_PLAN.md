Bug Busters – Quick Test Plan

Scope
- Verify the core gameplay loop (click-to-score, movement, 20s timer, game over, restart).
- Verify optional backend API health and scores routes and basic UI integration.

Prereqs
- Node >= 18. Start backend in a terminal: node backend/server.js (default port 3000).
- Open frontend/index.html in a modern browser.

Manual checks (frontend)
- Start & HUD
  - On load, score = 0, time = 20, bug visible in play area within bounds.
  - Timer counts down every 1s; at <= 5s, Time label turns red.
- Scoring & movement
  - Clicking the bug increments score by 1 and shows a brief pop animation.
  - Bug repositions roughly every ~700ms and stays fully visible (not clipped by edges).
- End of game
  - At 0s, game stops; an overlay shows “Final score: <n>”.
  - Restart button closes overlay and starts a new 20s round with score reset to 0.
- Leaderboard UX (optional)
  - If backend is down: Submit form is hidden and a note “Leaderboard unavailable.” appears; game still works.
  - If backend is up: Submit a score with a name (<=20 chars) and see it appear in the top‑10 list after refresh.

API smoke test (backend)
- GET /health -> 200 {status:"ok"}
- POST /scores with {name:"A", score: 3} -> 201 with returned entry {name, score, ts}.
- GET /scores -> 200 with {scores:[...]} and includes top‑10 sorted by score desc.
- POST /scores invalid (e.g., {name:"A", score: -1}) -> 400 with an error.

Expected outcome
- All checks pass. Game remains usable and readable. No console errors in frontend when backend is down (graceful degradation).
