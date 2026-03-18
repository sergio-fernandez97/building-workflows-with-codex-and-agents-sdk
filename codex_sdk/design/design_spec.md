# Bug Busters — One-Page UI/UX Spec (Designer)

Overview
- Single-screen, beginner-friendly browser game. Player clicks a moving bug to gain points during a 20-second round. Final score is shown with option to restart and (optionally) submit to a local leaderboard.
- Readability and simplicity over visual flair. No images required; use emoji or CSS shapes.

Layout (single screen)
- Header: game title ("Bug Busters").
- HUD bar: timer (mm:ss) on the left, score on the right.
- Play area: centered rectangle with visible border; contains the moving bug.
- Controls: Start/Restart button below the play area.
- Leaderboard (optional): small panel that appears to the right of the play area on wide screens, or below on narrow screens. Hidden if backend is offline.

Responsive rules
- Desktop-first fixed max width (e.g., 640–720px). On narrow screens (< 640px), stack vertically (Title → HUD → Play Area → Controls → Leaderboard).
- Play area suggested size: 480×320 (min 320×240). Keep the bug fully within bounds at all times.

Visual tokens (beginner friendly)
- Font: system UI stack (e.g., -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif).
- Colors:
  - Background: #f7f7fb
  - Surface (cards/panels): #ffffff with 1px #e5e7eb border and 8px radius
  - Text primary: #111827
  - Accent: #2563eb (links, emphasis)
  - Action (Start button): #22c55e (green) with darker hover #16a34a; text #0b1b0f
  - Danger/stop (not required): #ef4444
- Focus outline: 2px solid #2563eb (or browser default) for interactive elements.

Components
- Title: H1 centered.
- HUD bar: horizontally spaced; Timer (left, bold), Score (right, bold). Use monospace for the timer (e.g., ui-monospace, SFMono, Menlo, Consolas, monospace).
- Play area: position: relative; background #ffffff; 1px solid #e5e7eb; 8px radius; overflow hidden.
- Bug element: 40×40 px square area, circular via border-radius: 50% OR an emoji (🐞). If CSS circle: fill #ef4444, thin black border. Cursor: pointer; has aria-label="bug".
- Controls: primary button labeled “Start” (idle), “Restart” (game over). Disable the Start button while playing.
- Final score panel: simple surface card appearing below the play area after time ends; shows score; optional name input + submit if backend available.
- Leaderboard: small list (Top 10). Each row: rank, name, score. If offline, hide panel and show a small note under the controls: “Leaderboard unavailable (backend offline).”

States and interactions
- Idle: Start button enabled; timer reads 00:20; score 0; bug hidden.
- Playing (20s):
  - Start button disabled.
  - Timer counts down each second (visible).
  - Bug visible and repositions at least every 300–600ms to a random location fully inside the play area.
  - Clicking the bug increments score by +1 per click.
- Game Over:
  - Bug stops moving and is hidden or frozen.
  - Show final score panel with: “Your score: X” and two actions: “Play Again” (primary) and, if backend is reachable, a small form (Name [2–12 chars], Submit Score).
  - On Submit success, refresh leaderboard list; on error, show inline message and keep the panel open.

Copy (suggested)
- Title: “Bug Busters”
- Start button: “Start” → After round: “Play Again”
- Timer label: “Time”
- Score label: “Score”
- Final score: “Time’s up! Your score: X”
- Submit score: input placeholder “Your name (2–12 chars)” + button “Submit Score”
- Offline note: “Leaderboard unavailable (backend offline).”

Accessibility
- Buttons have discernible text; ensure 4.5:1 contrast ratio for text on buttons.
- Focus states visible on Start/Restart, Submit, and name input.
- Provide aria-live="polite" region for timer/score updates or ensure they are programmatically updated but not overly verbose.
- Bug has role="button" and aria-label="bug" to aid assistive tech; size >= 40×40 px for easy clicking.

Implementation notes for developers
- All measurements approximate; prioritize clarity.
- Keep DOM small: #title, #hud (timer, score), #play-area, #bug, #controls, #final-panel (hidden initially), #leaderboard (optional).
- A single backendURL constant gates leaderboard visibility. If fetch fails, hide leaderboard and show the offline note.
