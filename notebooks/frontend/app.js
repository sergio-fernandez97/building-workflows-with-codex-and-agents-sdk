// Bug Busters game logic (vanilla JS)
(function () {
  const playArea = document.getElementById('playArea');
  const bug = document.getElementById('bug');
  const endOverlay = document.getElementById('endOverlay');
  const finalScoreText = document.getElementById('finalScoreText');
  const scoreValue = document.getElementById('scoreValue');
  const timeValue = document.getElementById('timeValue');
  const restartBtn = document.getElementById('restartBtn');
  const restartBtn2 = document.getElementById('restartBtn2');

  // Leaderboard & submission elements
  const submitForm = document.getElementById('submitForm');
  const nameInput = document.getElementById('nameInput');
  const submitBtn = document.getElementById('submitBtn');
  const leaderboardPanel = document.getElementById('leaderboardPanel');
  const leaderboardNote = document.getElementById('leaderboardNote');
  const leaderboardList = document.getElementById('leaderboardList');

  // Game state
  let score = 0;
  let timeLeft = 20;
  let running = false;
  let moveTimer = null;
  let tickTimer = null;
  let backendAvailable = false;
  const MOVE_INTERVAL_MS = 700; // per spec
  const EDGE_PADDING = 8;       // keep bug fully visible within bounds

  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
  }

  function updateHUD() {
    scoreValue.textContent = String(score);
    timeValue.textContent = String(timeLeft);
    if (timeLeft <= 5) {
      timeValue.parentElement.classList.add('time-low');
    } else {
      timeValue.parentElement.classList.remove('time-low');
    }
  }

  function placeBugRandomly() {
    const areaRect = playArea.getBoundingClientRect();
    const bugRect = bug.getBoundingClientRect();
    const areaW = playArea.clientWidth;  // width inside padding/border
    const areaH = playArea.clientHeight; // height inside padding/border
    const bugW = bugRect.width;
    const bugH = bugRect.height;

    // Compute max x/y so bug is fully within visible area
    const maxX = Math.max(0, areaW - bugW - EDGE_PADDING);
    const maxY = Math.max(0, areaH - bugH - EDGE_PADDING);

    const x = randInt(EDGE_PADDING, maxX);
    const y = randInt(EDGE_PADDING, maxY);

    // Position relative to the playArea
    bug.style.left = x + 'px';
    bug.style.top = y + 'px';
  }

  function moveLoopStart() {
    if (moveTimer) clearInterval(moveTimer);
    moveTimer = setInterval(() => {
      if (!running) return;
      placeBugRandomly();
    }, MOVE_INTERVAL_MS);
  }

  function timerStart() {
    if (tickTimer) clearInterval(tickTimer);
    tickTimer = setInterval(() => {
      if (!running) return;
      timeLeft -= 1;
      updateHUD();
      if (timeLeft <= 0) {
        endGame();
      }
    }, 1000);
  }

  function startGame() {
    running = true;
    score = 0;
    timeLeft = 20;
    updateHUD();
    endOverlay.hidden = true;
    bug.disabled = false;
    placeBugRandomly();
    moveLoopStart();
    timerStart();
  }

  function endGame() {
    running = false;
    if (moveTimer) clearInterval(moveTimer);
    if (tickTimer) clearInterval(tickTimer);
    bug.disabled = true;
    finalScoreText.textContent = `Final score: ${score}`;
    endOverlay.hidden = false;
    // Attempt to refresh leaderboard after a round
    if (backendAvailable) {
      loadLeaderboard().catch(() => {});
    }
  }

  // Events
  bug.addEventListener('click', () => {
    if (!running) return;
    score += 1;
    updateHUD();
    // Click feedback
    bug.classList.add('clicked');
    setTimeout(() => bug.classList.remove('clicked'), 120);
  });

  restartBtn.addEventListener('click', (e) => {
    e.preventDefault();
    startGame();
  });
  restartBtn2.addEventListener('click', (e) => {
    e.preventDefault();
    startGame();
  });

  // Leaderboard functions
  const API_BASE = 'http://localhost:3000';

  async function checkBackend() {
    try {
      const res = await fetch(`${API_BASE}/health`, { cache: 'no-store' });
      backendAvailable = res.ok;
    } catch (_) {
      backendAvailable = false;
    }

    // Toggle UI based on availability
    if (!backendAvailable) {
      submitForm.style.display = 'none';
      leaderboardNote.hidden = false;
    } else {
      submitForm.style.display = '';
      leaderboardNote.hidden = true;
    }
  }

  async function loadLeaderboard() {
    const res = await fetch(`${API_BASE}/scores`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to load scores');
    const data = await res.json();
    renderLeaderboard(Array.isArray(data.scores) ? data.scores : []);
  }

  function renderLeaderboard(scores) {
    leaderboardList.innerHTML = '';
    if (!scores.length) {
      const li = document.createElement('li');
      li.textContent = 'No scores yet.';
      leaderboardList.appendChild(li);
      return;
    }
    scores.slice(0, 10).forEach((s, idx) => {
      const li = document.createElement('li');
      li.textContent = `${idx + 1}. ${s.name} ${s.score}`;
      leaderboardList.appendChild(li);
    });
  }

  submitForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!backendAvailable) return;
    const name = (nameInput.value || '').trim().slice(0, 20) || 'Player';
    const payload = { name, score };
    submitBtn.disabled = true;
    try {
      const res = await fetch(`${API_BASE}/scores`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Submit failed');
      nameInput.value = '';
      await loadLeaderboard();
    } catch (err) {
      // Show non-blocking note
      leaderboardNote.textContent = 'Leaderboard unavailable.';
      leaderboardNote.hidden = false;
    } finally {
      submitBtn.disabled = false;
    }
  });

  // Initialize
  window.addEventListener('resize', () => {
    // Optionally reposition on resize to keep within bounds
    placeBugRandomly();
  });

  (async function init() {
    updateHUD();
    placeBugRandomly();
    await checkBackend();
    if (backendAvailable) {
      try { await loadLeaderboard(); } catch (_) { /* ignore */ }
    }
    startGame();
  })();
})();
