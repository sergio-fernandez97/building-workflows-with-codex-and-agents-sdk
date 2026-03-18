# Bug Busters – One‑Page UI/UX Spec (Designer)

## Purpose and flow
- 20‑second, single‑screen clicker game. Player clicks the moving bug to earn points. At 0s, show final score; allow Restart. Optionally, enter a name and submit score to a backend; show top‑10 leaderboard.

## Screen layout (responsive)
- Mobile (<= 768px):
  1) Title row
  2) HUD row: Score (left) • Time (right)
  3) Play Area (fills remaining height)
  4) Footer controls: Name + Submit (optional) • Restart
  5) Leaderboard (optional) below controls
- Desktop (>= 769px):
  - Left: Title, HUD, Play Area stacked
  - Right: Leaderboard panel (fixed width ~280px)

## ASCII wireframe
```
+--------------------------------------------------------------+
| Bug Busters                                                  |
| Score: 00                                   Time: 20         |
+-------------------------------+------------------------------+
|                               |  Leaderboard (Top 10)        |
|           PLAY AREA           |  1. AAA 12                   |
|    [   🐞 bug moves here ]    |  2. BOB 10                   |
|                               |  ...                         |
+-------------------------------+------------------------------+
| Name: [__________] [Submit]        [Restart]                 |
+--------------------------------------------------------------+
```

## Visual design
- Palette: background #F7F8FA; text #1F2937; primary #2D6CDF; success #2EBF5E; warn/time‑low #E03B3B; panel/bg #FFFFFF; subtle shadow rgba(0,0,0,0.08).
- Typography: System stack ("-apple-system", "Segoe UI", Roboto, Arial, sans-serif). Title 24–28px; HUD 16–18px; body 14–16px; leaderboard 14–16px/1.3.
- Spacing and sizes: 8px base grid. Play Area min‑height 320px (mobile) / flexible to fill viewport. Bug size ~48–56px square. Buttons min‑height 40–44px.
- Components:
  - Title: centered on mobile; left‑aligned on desktop.
  - HUD: Score left, Time right. Time text turns #E03B3B when <= 5s.
  - Play Area: contained box with light border #E5E7EB and subtle shadow; bug always fully within bounds.
  - Bug: simple inline SVG or emoji; hover/click feedback: scale 1.0→1.15 for ~120ms plus a slight drop shadow.
  - End Panel (game over): centered overlay card with final score, Name input, Submit (optional), Restart. Dismiss overlay on Restart.
  - Leaderboard: table/list with rank, name, score. Empty state: “No scores yet.” Error state: “Leaderboard unavailable.”

## Interaction rules
- Start: On page load or Restart, set score=0, time=20; place bug randomly within bounds.
- Movement: reposition bug randomly within Play Area about every 700ms (parameterizable). Ensure 8px padding from edges so it’s fully visible.
- Scoring: click/tap bug → +1; animate pop (120ms). Debounce double clicks within the same animation frame.
- Timer: tick every 1s; at 0s stop movement and inputs except Restart and (optional) Submit.
- Accessibility: 44–48px tap target; visible focus outlines; sufficient contrast (WCAG AA). Announce score and time via aria‑live="polite". Buttons have aria‑labels.
- Offline backend: hide/disable Submit and show small note; game remains playable.

## Content and copy
- Title: “Bug Busters”
- HUD labels: “Score”, “Time”
- Buttons: “Submit Score”, “Restart”
- Messages: empty leaderboard → “No scores yet.”; backend down → “Leaderboard unavailable.”; end panel → “Final score: XX”

## Implementation notes (for devs)
- Coordinate math: randomX in [bugRadius+padding, areaWidth - bugRadius - padding]; same for Y. Use clientWidth/Height of the Play Area.
- Layout: CSS grid/flex; container max‑width ~960px; leaderboard panel ~280px on desktop.
- Keep JS modular: state (score, time, running), movement interval, timer interval, event handlers (click bug, restart, submit).
- Optional polish: small CSS transition on hover; timer color transition when low.
