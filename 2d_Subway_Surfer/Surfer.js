// Get element references
var player = document.getElementById("player");
var barrier_1 = document.getElementById("barrier_1");
var barrier_2 = document.getElementById("barrier_2");
var barrier_3 = document.getElementById("barrier_3");
const score_display = document.getElementById("score_display");


// ----- Config -----
const DEBUG = true;                 // toggle visual hitboxes
const HITBOX_INSET = { x: 8, y: 12 }; // shrink hitbox to reduce false positives

// ----- Lane Layout (shared with CSS/HTML) -----
const LANE_LEFTS = [25, 225, 425]; // exact lane lefts used across the game
const LANE_GAP = 200;              // distance between lane lefts

function getTopPx(el) {
  return parseInt(window.getComputedStyle(el).getPropertyValue("top"));
}
function getLeftPx(el) {
  return parseInt(window.getComputedStyle(el).getPropertyValue("left"));
}
function laneIndexFromLeft(leftPx) {
  return Math.round((leftPx - LANE_LEFTS[0]) / LANE_GAP); // 0,1,2
}
function isVisible(el) {
  const t = getTopPx(el);
  return t < window.innerHeight && t > -200; // treat -200..viewport as active
}

const BARRIERS = () => [barrier_1, barrier_2, barrier_3];

function occupiedLanes(excludeEl) {
  const occ = new Set();
  BARRIERS().forEach((b) => {
    if (b === excludeEl) return;
    if (!isVisible(b)) return;
    const li = laneIndexFromLeft(getLeftPx(b));
    if (li >= 0 && li <= 2) occ.add(li);
  });
  return occ; 
}

function pickLane(excludeEl) {
  const occ = occupiedLanes(excludeEl);
  const candidates = [0,1,2].filter((i) => !occ.has(i));
  if (candidates.length) {
    return candidates[Math.floor(Math.random() * candidates.length)];
  }
  // Fallback: choose the lane with the greatest vertical separation from nearest barrier
  let bestLane = 0;
  let bestGap = -Infinity;
  const spawnTop = -200; // approximate restart top
  for (let i = 0; i < 3; i++) {
    let nearest = Infinity;
    BARRIERS().forEach((b) => {
      const li = laneIndexFromLeft(getLeftPx(b));
      if (li === i) {
        const gap = Math.abs(spawnTop - getTopPx(b));
        if (gap < nearest) nearest = gap;
      }
    });
    if (nearest === Infinity) nearest = 99999; // lane empty
    if (nearest > bestGap) {
      bestGap = nearest;
      bestLane = i;
    }
  }
  return bestLane;
}

// ----- Movement -----
function moveLeft() {
  let left = parseInt(window.getComputedStyle(player).getPropertyValue("left"));
  let width = parseInt(window.getComputedStyle(player).getPropertyValue("width"));
  if (width === 150) {
    left -= 200;
    if (left >= 25) player.style.left = left + "px";
  }
}

function moveRight() {
  let left = parseInt(window.getComputedStyle(player).getPropertyValue("left"));
  let width = parseInt(window.getComputedStyle(player).getPropertyValue("width"));
  if (width === 150) {
    left += 200;
    if (left <= 575) player.style.left = left + "px";
  }
}

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") moveLeft();
  if (event.key === "ArrowRight") moveRight();
});

// ----- Barrier randomization + scoring -----
let score = 0;
function updateScore() {
  score_display.textContent = score;
}

function randomizeBarrier(barrier) {
  const lane = pickLane(barrier);
  const left = LANE_LEFTS[lane];
  barrier.style.left = left + "px";
  var carColor = Math.random() < 0.5 ? "redcar" : "bluecar";
  barrier.style.backgroundImage = `url('assets/${carColor}.png')`;
}

barrier_1.addEventListener("animationiteration", () => {
  randomizeBarrier(barrier_1);
  score += 1; // increment once per cycle
  updateScore();
});

barrier_2.addEventListener("animationiteration", () => {
  randomizeBarrier(barrier_2);
  score += 1;
  updateScore();
});

barrier_3.addEventListener("animationiteration", () => {
  randomizeBarrier(barrier_3);
  score += 1;
  updateScore();
});

// ----- Collision + Debug Rendering (AABB) -----
function getRect(el) {
  const r = el.getBoundingClientRect();
  return { x: r.left, y: r.top, w: r.width, h: r.height };
}

function insetRect(rect, inset) {
  return {
    x: rect.x + inset.x,
    y: rect.y + inset.y,
    w: Math.max(0, rect.w - inset.x * 2),
    h: Math.max(0, rect.h - inset.y * 2),
  };
}

function intersects(a, b) {
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  );
}

// Ensure at most 2 unique lanes are blocked near the player so there's always a path
function enforceOpenLane(pRect) {
  // Define a vertical window around the player where a clear lane must exist
  const playerMidY = pRect.y + pRect.h / 2;
  const DANGER_TOP = pRect.y - 160;     // tune buffers to taste
  const DANGER_BOTTOM = pRect.y + pRect.h + 200;

  // Collect barriers currently within the danger window
  const items = [barrier_1, barrier_2, barrier_3].map((el) => ({
    el,
    top: getTopPx(el),
    left: getLeftPx(el),
  })).filter(({ top }) => top >= DANGER_TOP && top <= DANGER_BOTTOM);

  // If fewer than 3 barriers are in the window, we're already safe
  if (items.length < 3) return;

  // Compute unique occupied lanes
  const lanesUsed = new Set(items.map(({ left }) => laneIndexFromLeft(left)));
  if (lanesUsed.size <= 2) return; // already has a free lane

  // We have 3 unique lanes blocked in the window; force one to share a lane
  // Choose the barrier farthest from the player's vertical center to minimize jarring swaps
  let farthest = null; let farDist = -1;
  for (const it of items) {
    const dist = Math.abs((it.top) - playerMidY);
    if (dist > farDist) { farDist = dist; farthest = it; }
  }

  // Pick a lane from one of the other two barriers to duplicate (leaving 1 lane free)
  const others = items.filter((it) => it.el !== farthest.el);
  const laneChoice = laneIndexFromLeft(others[Math.floor(Math.random() * others.length)].left);
  farthest.el.style.left = LANE_LEFTS[laneChoice] + "px";
}

let gameOver = false;
function handleGameOver() {
  if (gameOver) return;
  gameOver = true;
  // small delay so you can see the collision
  setTimeout(() => document.location.reload(), 100);
}

// Single canvas overlay for debug hitboxes (fast + no DOM churn)
let debugCanvas, ctx;
function ensureDebugCanvas() {
  if (!DEBUG) return;
  if (!debugCanvas) {
    debugCanvas = document.createElement("canvas");
    debugCanvas.id = "debugCanvas";
    debugCanvas.style.position = "fixed";
    debugCanvas.style.top = "0";
    debugCanvas.style.left = "0";
    debugCanvas.style.pointerEvents = "none";
    debugCanvas.style.zIndex = "9999";
    document.body.appendChild(debugCanvas);
    ctx = debugCanvas.getContext("2d");
    const resize = () => {
      debugCanvas.width = window.innerWidth;
      debugCanvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);
  }
}

function drawRect(r, strokeStyle) {
  ctx.strokeStyle = strokeStyle;
  ctx.lineWidth = 2;
  ctx.strokeRect(r.x, r.y, r.w, r.h);
}

function renderDebug(playerR, barriers) {
  if (!DEBUG) return;
  ensureDebugCanvas();
  ctx.clearRect(0, 0, debugCanvas.width, debugCanvas.height);
  // drawRect(playerR, "lime");
  barriers.forEach(({ rect, color }) => drawRect(rect, color));
}

function frame() {
  if (gameOver) return; // stop loop after collision

  // Compute inset rects each frame using layout at that moment
  const pRect = insetRect(getRect(player), HITBOX_INSET);

  // Enforce that within the player's vertical corridor there is always a free lane
  enforceOpenLane(pRect);

  // Recompute barrier rects after any enforced lane change
  const b1Rect = insetRect(getRect(barrier_1), HITBOX_INSET);
  const b2Rect = insetRect(getRect(barrier_2), HITBOX_INSET);
  const b3Rect = insetRect(getRect(barrier_3), HITBOX_INSET);

  // Debug draw
  renderDebug(pRect, [
    // { rect: b1Rect, color: "red" },
    // { rect: b2Rect, color: "orange" },
    // { rect: b3Rect, color: "blue" },
  ]);

  // Collision checks (AABB)
  if (intersects(pRect, b1Rect) || intersects(pRect, b2Rect) || intersects(pRect, b3Rect)) {
    handleGameOver();
  } else {
    requestAnimationFrame(frame);
  }
}

// Kick things off
updateScore();
requestAnimationFrame(frame);