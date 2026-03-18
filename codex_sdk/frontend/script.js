/* Bug Busters — vanilla JS game logic
   - 20s round, click the bug to score
   - Optional leaderboard via simple backend
*/

// Set to '' to disable backend calls entirely
const backendURL = 'http://localhost:3000'; // e.g., '' to turn off
const GAME_DURATION = 20; // seconds
const MOVE_INTERVAL_MS = 450; // how often the bug moves

// DOM elements
const timeEl = document.getElementById('time');
const scoreEl = document.getElementById('score');
const playArea = document.getElementById('play-area');
const bug = document.getElementById('bug');
const startBtn = document.getElementById('start-btn');
const finalPanel = document.getElementById('final-panel');
const finalScoreEl = document.getElementById('final-score');
const finalText = document.getElementById('final-text');
const leaderboard = document.getElementById('leaderboard');
const scoreList = document.getElementById('score-list');
const offlineNote = document.getElementById('offline-note');
const submitWrap = document.getElementById('submit-wrap');
const nameInput = document.getElementById('name-input');
const submitBtn = document.getElementById('submit-btn');
const submitMsg = document.getElementById('submit-msg');

let playing = false;
let score = 0;
let timeLeft = GAME_DURATION; // seconds
let timerId = null;
let moverId = null;
let backendAvailable = false;

function fmtTime(s){
  const m = Math.floor(s/60).toString().padStart(2,'0');
  const ss = (s%60).toString().padStart(2,'0');
  return `${m}:${ss}`;
}

function setTimeUI(){ timeEl.textContent = fmtTime(timeLeft); }
function setScoreUI(){ scoreEl.textContent = String(score); }

function randInt(min, max){ return Math.floor(Math.random() * (max - min + 1)) + min; }

function placeBugRandomly(){
  // Ensure bug fully inside bounds
  const areaRect = playArea.getBoundingClientRect();
  const bugRect = bug.getBoundingClientRect();
  const padLeft = 0, padTop = 0;
  const maxLeft = Math.max(0, areaRect.width - bugRect.width);
  const maxTop = Math.max(0, areaRect.height - bugRect.height);
  const left = randInt(padLeft, Math.floor(maxLeft));
  const top = randInt(padTop, Math.floor(maxTop));
  bug.style.left = left + 'px';
  bug.style.top = top + 'px';
}

function startGame(){
  if (playing) return;
  // Reset state
  playing = true;
  score = 0; setScoreUI();
  timeLeft = GAME_DURATION; setTimeUI();
  startBtn.disabled = true;
  finalPanel.hidden = true;

  // Show and move the bug
  bug.hidden = false;
  // Ensure first placement after layout
  requestAnimationFrame(() => { placeBugRandomly(); });

  moverId = setInterval(() => { placeBugRandomly(); }, MOVE_INTERVAL_MS);
  timerId = setInterval(() => {
    timeLeft -= 1; setTimeUI();
    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

function endGame(){
  if (!playing) return;
  playing = false;
  startBtn.disabled = false;
  startBtn.textContent = 'Play Again';
  // Stop movement and hide bug
  clearInterval(moverId); moverId = null;
  clearInterval(timerId); timerId = null;
  bug.hidden = true;

  // Show final score panel
  finalScoreEl.textContent = String(score);
  finalPanel.hidden = false;
  submitMsg.textContent = '';

  if (backendAvailable) {
    submitWrap.hidden = false;
    nameInput.value = '';
    // Focus name to invite submission
    nameInput.focus({ preventScroll: true });
  } else {
    submitWrap.hidden = true;
  }
}

function onBugClick(){
  if (!playing) return;
  score += 1; setScoreUI();
}

function validateName(name){
  // 2–12 of letters/digits/space/-/_
  return /^[A-Za-z0-9 _-]{2,12}$/.test(name);
}

async function detectBackend(){
  if (!backendURL) { backendAvailable = false; return; }
  try{
    const res = await fetch(`${backendURL}/health`, { cache: 'no-store' });
    backendAvailable = res.ok;
  }catch{ backendAvailable = false; }

  leaderboard.hidden = !backendAvailable;
  offlineNote.hidden = backendAvailable; // show note if offline

  if (backendAvailable) {
    await loadScores();
  }
}

async function loadScores(){
  try{
    const res = await fetch(`${backendURL}/scores`, { cache: 'no-store' });
    if (!res.ok) throw new Error('scores failed');
    const data = await res.json();
    const scores = Array.isArray(data.scores) ? data.scores : [];
    renderScores(scores);
  }catch(err){
    // If something goes wrong, hide leaderboard but don’t break the game
    leaderboard.hidden = true;
    offlineNote.hidden = false;
  }
}

function renderScores(list){
  scoreList.innerHTML = '';
  if (!list.length){
    const li = document.createElement('li'); li.textContent = 'No scores yet.'; scoreList.appendChild(li); return;
  }
  list.slice(0,10).forEach((item, idx) => {
    const li = document.createElement('li');
    const name = String(item.name ?? '???');
    const sc = Number(item.score ?? 0);
    li.textContent = `${idx+1}. ${name} — ${sc}`;
    scoreList.appendChild(li);
  });
}

async function submitScore(){
  const name = nameInput.value.trim();
  if (!validateName(name)){
    submitMsg.textContent = 'Please enter 2–12 characters (letters, digits, space, - or _).';
    return;
  }
  submitBtn.disabled = true; submitMsg.textContent = 'Submitting…';
  try{
    const res = await fetch(`${backendURL}/scores`, {
      method:'POST', headers:{ 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, score })
    });
    if (!res.ok){
      const e = await res.json().catch(()=>({error:'Error'}));
      throw new Error(e.error || 'Submit failed');
    }
    submitMsg.textContent = 'Saved!';
    await loadScores();
  }catch(err){
    submitMsg.textContent = 'Could not submit score.';
  }finally{
    submitBtn.disabled = false;
  }
}

// Wire up events
bug.addEventListener('click', onBugClick);
startBtn.addEventListener('click', startGame);
submitBtn.addEventListener('click', (e)=>{ e.preventDefault(); if (backendAvailable) submitScore(); });

// Init UI
setTimeUI(); setScoreUI();
// Try backend detection after DOM ready
window.addEventListener('DOMContentLoaded', () => { detectBackend(); });
