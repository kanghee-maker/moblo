const blocks = {
  red: { label: "빨강", symbol: "●", kind: "red", type: "pattern" },
  blue: { label: "파랑", symbol: "●", kind: "blue", type: "pattern" },
  yellow: { label: "노랑", symbol: "●", kind: "yellow", type: "pattern" },
  green: { label: "초록", symbol: "●", kind: "green", type: "pattern" },
  move: { label: "앞으로", symbol: "↑", kind: "move", type: "command" },
  left: { label: "왼쪽", symbol: "↺", kind: "left", type: "command" },
  right: { label: "오른쪽", symbol: "↻", kind: "right", type: "command" },
  stop: { label: "멈춰", symbol: "■", kind: "stop", type: "command" },
  repeat: { label: "또 한 번", symbol: "×2", kind: "repeat", type: "command" }
};

const missions = [
  {
    title: "색 블록 두 개",
    prompt: "빨강 다음에 파랑을 놓아볼까?",
    type: "pattern",
    available: ["red", "blue", "yellow"],
    expected: ["red", "blue"],
    hints: ["첫 번째는 빨강이에요.", "두 번째는 파랑이에요.", "두 블록만 놓고 해보기를 눌러요."],
    tags: ["색", "순서"]
  },
  {
    title: "길게 색 순서",
    prompt: "빨강, 노랑, 파랑 순서로 놓아볼까?",
    type: "pattern",
    available: ["red", "blue", "yellow", "green"],
    expected: ["red", "yellow", "blue"],
    hints: ["먼저 빨강이에요.", "가운데는 노랑이에요.", "마지막은 파랑이에요."],
    tags: ["색", "순서"]
  },
  {
    title: "앞으로 한 칸",
    prompt: "캐릭터가 집까지 한 칸 앞으로 가요.",
    type: "path",
    available: ["move", "stop"],
    solution: ["move"],
    start: { x: 1, y: 2, dir: "E" },
    goal: { x: 2, y: 2 },
    hints: ["앞으로 블록 하나면 돼요.", "멈춰 블록은 없어도 괜찮아요.", "놓고 해보기를 눌러요."],
    tags: ["앞으로", "원인과 결과"]
  },
  {
    title: "두 칸 가기",
    prompt: "앞으로, 앞으로. 집까지 두 칸 가요.",
    type: "path",
    available: ["move", "stop"],
    solution: ["move", "move"],
    start: { x: 0, y: 3, dir: "E" },
    goal: { x: 2, y: 3 },
    hints: ["앞으로를 두 번 놓아요.", "첫 블록이 끝나면 다음 블록을 해요.", "캐릭터가 집에서 멈추면 성공이에요."],
    tags: ["순차", "앞으로"]
  },
  {
    title: "오른쪽으로 돌아요",
    prompt: "오른쪽으로 돌고 앞으로 가요.",
    type: "path",
    available: ["move", "right", "left"],
    solution: ["right", "move"],
    start: { x: 2, y: 1, dir: "E" },
    goal: { x: 2, y: 2 },
    hints: ["처음에는 오른쪽 블록이에요.", "그 다음 앞으로 가요.", "왼쪽 블록은 이번 길에서는 쉬어도 돼요."],
    tags: ["방향", "순서"]
  },
  {
    title: "왼쪽으로 돌아요",
    prompt: "왼쪽으로 돌고 앞으로 가요.",
    type: "path",
    available: ["move", "left", "right"],
    solution: ["left", "move"],
    start: { x: 2, y: 3, dir: "E" },
    goal: { x: 2, y: 2 },
    hints: ["처음에는 왼쪽 블록이에요.", "그 다음 앞으로 가요.", "캐릭터 머리 방향을 봐요."],
    tags: ["방향", "순서"]
  },
  {
    title: "멈춰 블록",
    prompt: "앞으로 가고 멈춰요.",
    type: "path",
    available: ["move", "stop", "right"],
    solution: ["move", "stop"],
    start: { x: 1, y: 2, dir: "E" },
    goal: { x: 2, y: 2 },
    mustInclude: ["stop"],
    hints: ["앞으로 먼저 놓아요.", "그 다음 멈춰를 놓아요.", "멈춰 뒤의 블록은 하지 않아요."],
    tags: ["멈춤", "순서"]
  },
  {
    title: "또 한 번",
    prompt: "앞으로 하고, 또 한 번 해볼까?",
    type: "path",
    available: ["move", "repeat", "stop"],
    solution: ["move", "repeat"],
    start: { x: 0, y: 2, dir: "E" },
    goal: { x: 2, y: 2 },
    hints: ["앞으로를 먼저 놓아요.", "또 한 번 블록은 바로 앞 블록을 다시 해요.", "앞으로, 또 한 번이면 두 칸 가요."],
    tags: ["반복 준비", "앞으로"]
  },
  {
    title: "길을 고쳐요",
    prompt: "집으로 못 가면 블록을 하나 치우고 다시 해봐요.",
    type: "path",
    available: ["move", "right", "left", "stop"],
    solution: ["move", "right", "move"],
    start: { x: 1, y: 1, dir: "E" },
    goal: { x: 3, y: 2 },
    prefill: ["move", "left", "move"],
    hints: ["처음 앞으로는 좋아요.", "왼쪽 대신 오른쪽이면 집 쪽을 봐요.", "앞으로, 오른쪽, 앞으로를 만들어봐요."],
    tags: ["디버깅", "방향"]
  },
  {
    title: "장애물 피하기",
    prompt: "회색 길은 피해 가요.",
    type: "path",
    available: ["move", "right", "left"],
    solution: ["move", "right", "move", "left", "move"],
    start: { x: 0, y: 2, dir: "E" },
    goal: { x: 3, y: 3 },
    obstacles: [{ x: 2, y: 2 }],
    hints: ["앞으로 두 번은 막혀요.", "오른쪽으로 돌아 아래 길을 써요.", "앞으로, 오른쪽, 앞으로, 왼쪽, 앞으로를 해봐요."],
    tags: ["문제 해결", "방향"]
  },
  {
    title: "초록까지 색 길",
    prompt: "노랑, 초록, 초록 순서로 놓아요.",
    type: "pattern",
    available: ["red", "yellow", "green", "blue"],
    expected: ["yellow", "green", "green"],
    hints: ["첫 번째는 노랑이에요.", "초록이 두 번 와요.", "같은 블록을 또 놓아도 돼요."],
    tags: ["패턴", "반복 준비"]
  },
  {
    title: "집까지 긴 길",
    prompt: "오른쪽으로 돌고, 두 칸 가요.",
    type: "path",
    available: ["move", "right", "left", "repeat", "stop"],
    solution: ["left", "move", "repeat"],
    start: { x: 1, y: 1, dir: "S" },
    goal: { x: 3, y: 1 },
    hints: ["처음에는 왼쪽으로 돌아 동쪽을 봐요.", "앞으로 두 번 가면 집이에요.", "앞으로 뒤에 또 한 번을 써도 돼요."],
    tags: ["방향", "반복 준비", "순차"]
  }
];

const freeMission = {
  type: "path",
  available: ["move", "left", "right", "stop", "repeat"],
  start: { x: 2, y: 2, dir: "N" },
  goal: { x: 4, y: 1 },
  obstacles: []
};

const state = {
  currentMission: 0,
  program: [],
  freeProgram: [],
  hintIndex: 0,
  actor: null,
  freeActor: null,
  running: false,
  freeRunning: false,
  records: loadRecords()
};

const directionOrder = ["N", "E", "S", "W"];
const directionDelta = {
  N: { x: 0, y: -1 },
  E: { x: 1, y: 0 },
  S: { x: 0, y: 1 },
  W: { x: -1, y: 0 }
};

const board = document.querySelector("#board");
const freeBoard = document.querySelector("#freeBoard");
const programStrip = document.querySelector("#programStrip");
const freeProgramStrip = document.querySelector("#freeProgramStrip");
const palette = document.querySelector("#blockPalette");
const freePalette = document.querySelector("#freePalette");
const referenceBox = document.querySelector("#referenceBox");
const referenceStrip = document.querySelector("#referenceStrip");
const statusLine = document.querySelector("#statusLine");
const freeStatusLine = document.querySelector("#freeStatusLine");
const dragGhost = document.querySelector("#dragGhost");

document.querySelectorAll(".mode-tab").forEach((button) => {
  button.addEventListener("click", () => switchView(button.dataset.view));
});

document.querySelector("#hintButton").addEventListener("click", showHint);
document.querySelector("#speakButton").addEventListener("click", speakMission);
document.querySelector("#prevMission").addEventListener("click", () => changeMission(-1));
document.querySelector("#nextMission").addEventListener("click", () => changeMission(1));
document.querySelector("#undoButton").addEventListener("click", () => removeLast(false));
document.querySelector("#clearButton").addEventListener("click", () => clearProgram(false));
document.querySelector("#runButton").addEventListener("click", () => runCurrentMission(false));
document.querySelector("#freeUndoButton").addEventListener("click", () => removeLast(true));
document.querySelector("#freeClearButton").addEventListener("click", () => clearProgram(true));
document.querySelector("#freeRunButton").addEventListener("click", () => runCurrentMission(true));
document.querySelector("#resetProgressButton").addEventListener("click", resetRecords);

renderMission();
renderFree();
renderParent();

function switchView(viewName) {
  document.querySelectorAll(".mode-tab").forEach((button) => {
    button.classList.toggle("active", button.dataset.view === viewName);
  });
  document.querySelectorAll(".view").forEach((view) => view.classList.remove("active"));
  document.querySelector(`#${viewName}View`).classList.add("active");
  if (viewName === "parent") {
    renderParent();
  }
}

function renderMission() {
  const mission = missions[state.currentMission];
  state.hintIndex = 0;
  state.program = [...(mission.prefill || [])];
  state.actor = getInitialActor(mission);

  document.querySelector("#missionStep").textContent = `${state.currentMission + 1} / ${missions.length}`;
  document.querySelector("#missionTitle").textContent = mission.title;
  document.querySelector("#missionPrompt").textContent = mission.prompt;
  document.querySelector("#hintText").textContent = "";
  statusLine.textContent = "블록을 놓아볼까요?";

  renderProgressDots();
  renderReference(mission);
  renderBoard(board, mission, state.actor);
  renderPalette(palette, mission.available, false);
  renderProgram(programStrip, state.program, false);
}

function renderFree() {
  state.freeActor = getInitialActor(freeMission);
  renderBoard(freeBoard, freeMission, state.freeActor);
  renderPalette(freePalette, freeMission.available, true);
  renderProgram(freeProgramStrip, state.freeProgram, true);
  freeStatusLine.textContent = "마음대로 놓고 해보기!";
}

function renderProgressDots() {
  const dots = document.querySelector("#progressDots");
  dots.innerHTML = "";
  missions.forEach((_, index) => {
    const dot = document.createElement("span");
    dot.className = "progress-dot";
    if (state.records.completed.includes(index)) dot.classList.add("done");
    if (index === state.currentMission) dot.classList.add("current");
    dots.append(dot);
  });
}

function renderReference(mission) {
  const guide = mission.expected || mission.solution || [];
  referenceBox.hidden = guide.length === 0;
  referenceStrip.innerHTML = "";
  guide.forEach((blockId) => {
    const block = createBlock(blockId, { source: "reference", isFree: false });
    block.classList.add("reference-block");
    block.tabIndex = -1;
    referenceStrip.append(block);
  });
}

function renderBoard(targetBoard, mission, actor) {
  targetBoard.innerHTML = "";
  for (let y = 0; y < 5; y += 1) {
    for (let x = 0; x < 5; x += 1) {
      const cell = document.createElement("div");
      cell.className = "cell path";
      if (mission.goal && samePoint(mission.goal, { x, y })) cell.classList.add("goal");
      if (mission.start && samePoint(mission.start, { x, y })) cell.classList.add("start");
      if ((mission.obstacles || []).some((point) => samePoint(point, { x, y }))) cell.classList.add("obstacle");
      cell.dataset.x = x;
      cell.dataset.y = y;
      targetBoard.append(cell);
    }
  }
  if (mission.type === "path") {
    placeActor(targetBoard, actor);
  }
}

function placeActor(targetBoard, actor) {
  const oldActor = targetBoard.querySelector(".actor");
  if (oldActor) oldActor.remove();
  const cell = targetBoard.querySelector(`[data-x="${actor.x}"][data-y="${actor.y}"]`);
  if (!cell) return;
  const actorNode = document.createElement("div");
  actorNode.className = "actor";
  actorNode.dataset.dir = actor.dir;
  actorNode.textContent = "나";
  cell.append(actorNode);
}

function renderPalette(targetPalette, available, isFree) {
  targetPalette.innerHTML = "";
  available.forEach((blockId) => {
    targetPalette.append(createBlock(blockId, { source: "palette", isFree }));
  });
}

function renderProgram(targetStrip, program, isFree) {
  targetStrip.innerHTML = "";
  const maxSlots = 8;
  for (let index = 0; index < maxSlots; index += 1) {
    const slot = document.createElement("div");
    slot.className = "slot";
    if (program[index]) {
      const block = createBlock(program[index], { source: "program", isFree, index });
      block.classList.add("in-strip");
      slot.append(block);
    } else {
      slot.classList.add("empty");
    }
    targetStrip.append(slot);
  }
}

function createBlock(blockId, options) {
  const data = blocks[blockId];
  const node = document.createElement("button");
  node.className = "block";
  node.type = "button";
  node.dataset.block = blockId;
  node.dataset.kind = data.kind;
  node.setAttribute("aria-label", `${data.label} 블록`);
  node.innerHTML = `<span class="block-symbol">${data.symbol}</span><span class="block-label">${data.label}</span>`;

  if (options.source === "palette") {
    attachDrag(node, blockId, options.isFree);
  } else if (options.source === "program") {
    node.addEventListener("click", () => removeAt(options.index, options.isFree));
  }

  return node;
}

function attachDrag(node, blockId, isFree) {
  let pointerId = null;
  let startX = 0;
  let startY = 0;
  let dragging = false;
  let lastPointerAdd = 0;

  node.addEventListener("click", () => {
    if (Date.now() - lastPointerAdd < 350) return;
    addBlock(blockId, isFree);
  });

  node.addEventListener("pointerdown", (event) => {
    if (state.running || state.freeRunning) return;
    pointerId = event.pointerId;
    startX = event.clientX;
    startY = event.clientY;
    dragging = false;
    node.setPointerCapture(pointerId);
  });

  node.addEventListener("pointermove", (event) => {
    if (pointerId !== event.pointerId) return;
    const distance = Math.hypot(event.clientX - startX, event.clientY - startY);
    if (!dragging && distance > 6) {
      dragging = true;
      dragGhost.className = "drag-ghost active";
      dragGhost.innerHTML = "";
      const ghostBlock = createBlock(blockId, { source: "ghost", isFree });
      ghostBlock.classList.add("dragging");
      dragGhost.append(ghostBlock);
    }
    if (dragging) {
      dragGhost.style.transform = `translate(${event.clientX - 46}px, ${event.clientY - 33}px)`;
    }
  });

  node.addEventListener("pointerup", (event) => {
    if (pointerId !== event.pointerId) return;
    node.releasePointerCapture(pointerId);
    const strip = isFree ? freeProgramStrip : programStrip;
    const stripBox = strip.getBoundingClientRect();
    const droppedInStrip =
      event.clientX >= stripBox.left &&
      event.clientX <= stripBox.right &&
      event.clientY >= stripBox.top &&
      event.clientY <= stripBox.bottom;

    if (!dragging || droppedInStrip) {
      addBlock(blockId, isFree);
      lastPointerAdd = Date.now();
    }

    dragging = false;
    pointerId = null;
    dragGhost.className = "drag-ghost";
    dragGhost.style.transform = "translate(-9999px, -9999px)";
    dragGhost.innerHTML = "";
  });

  node.addEventListener("pointercancel", () => {
    dragging = false;
    pointerId = null;
    dragGhost.className = "drag-ghost";
    dragGhost.style.transform = "translate(-9999px, -9999px)";
    dragGhost.innerHTML = "";
  });
}

function addBlock(blockId, isFree) {
  const program = isFree ? state.freeProgram : state.program;
  if (program.length >= 8) {
    setStatus("블록 길이 가득 찼어요. 하나 치우고 해볼까요?", isFree);
    return;
  }
  program.push(blockId);
  renderProgram(isFree ? freeProgramStrip : programStrip, program, isFree);
  setStatus(`${blocks[blockId].label} 블록을 놓았어요.`, isFree);
}

function removeAt(index, isFree) {
  const program = isFree ? state.freeProgram : state.program;
  program.splice(index, 1);
  renderProgram(isFree ? freeProgramStrip : programStrip, program, isFree);
  setStatus("블록 하나를 치웠어요.", isFree);
}

function removeLast(isFree) {
  const program = isFree ? state.freeProgram : state.program;
  if (!program.length) return;
  program.pop();
  renderProgram(isFree ? freeProgramStrip : programStrip, program, isFree);
  setStatus("마지막 블록을 치웠어요.", isFree);
}

function clearProgram(isFree) {
  if (isFree) {
    state.freeProgram = [];
    state.freeActor = getInitialActor(freeMission);
    renderProgram(freeProgramStrip, state.freeProgram, true);
    renderBoard(freeBoard, freeMission, state.freeActor);
  } else {
    state.program = [];
    state.actor = getInitialActor(missions[state.currentMission]);
    renderProgram(programStrip, state.program, false);
    renderBoard(board, missions[state.currentMission], state.actor);
  }
  setStatus("블록을 모두 치웠어요.", isFree);
}

async function runCurrentMission(isFree) {
  const mission = isFree ? freeMission : missions[state.currentMission];
  const program = isFree ? state.freeProgram : state.program;
  if (isFree ? state.freeRunning : state.running) return;

  if (!program.length) {
    setStatus("블록을 하나 놓고 해볼까요?", isFree);
    return;
  }

  if (mission.type === "pattern") {
    checkPattern(mission);
    return;
  }

  if (isFree) {
    state.freeRunning = true;
    state.freeActor = getInitialActor(mission);
    renderBoard(freeBoard, mission, state.freeActor);
  } else {
    state.running = true;
    state.actor = getInitialActor(mission);
    renderBoard(board, mission, state.actor);
  }

  setStatus("하나씩 움직여요.", isFree);
  const result = await executeProgram(mission, program, isFree);

  if (isFree) {
    state.freeRunning = false;
  } else {
    state.running = false;
  }

  if (isFree) {
    setStatus(result.crashed ? "길 밖으로 나갔어요. 다른 블록을 놓아볼까요?" : "움직였어요. 다른 길도 만들어봐요.", true);
    return;
  }

  const atGoal = samePoint(result.actor, mission.goal);
  const includesRequired = (mission.mustInclude || []).every((blockId) => program.includes(blockId));

  if (atGoal && includesRequired && !result.crashed) {
    completeMission();
  } else if (atGoal && !includesRequired) {
    setStatus("집에 왔어요. 이번에는 멈춰 블록도 같이 놓아볼까요?", false);
  } else if (result.crashed) {
    setStatus("다른 길로 가버렸네요. 블록 하나만 바꿔볼까요?", false);
  } else {
    setStatus("좋은 시도예요. 집 쪽으로 한 번 더 가볼까요?", false);
  }
}

function checkPattern(mission) {
  const sameLength = state.program.length === mission.expected.length;
  const sameOrder = mission.expected.every((blockId, index) => state.program[index] === blockId);

  if (sameLength && sameOrder) {
    completeMission();
  } else {
    setStatus("거의 왔어요. 순서를 다시 볼까요?", false);
  }
}

async function executeProgram(mission, program, isFree) {
  const actor = getInitialActor(mission);
  let crashed = false;
  let lastAction = null;

  for (const blockId of program) {
    const action = blockId === "repeat" ? lastAction : blockId;
    if (!action) {
      await pause(260);
      continue;
    }
    if (action === "stop") {
      await pause(260);
      break;
    }
    applyAction(actor, action, mission, (didCrash) => {
      crashed = didCrash || crashed;
    });
    if (["move", "left", "right"].includes(action)) {
      lastAction = action;
    }
    renderBoard(isFree ? freeBoard : board, mission, actor);
    await pause(520);
  }

  return { actor, crashed };
}

function applyAction(actor, action, mission, onCrash) {
  if (action === "left" || action === "right") {
    const index = directionOrder.indexOf(actor.dir);
    const nextIndex = action === "left" ? index - 1 : index + 1;
    actor.dir = directionOrder[(nextIndex + directionOrder.length) % directionOrder.length];
    return;
  }

  if (action !== "move") return;

  const delta = directionDelta[actor.dir];
  const next = { x: actor.x + delta.x, y: actor.y + delta.y };
  const isOutside = next.x < 0 || next.x > 4 || next.y < 0 || next.y > 4;
  const hitsObstacle = (mission.obstacles || []).some((point) => samePoint(point, next));

  if (isOutside || hitsObstacle) {
    onCrash(true);
    return;
  }

  actor.x = next.x;
  actor.y = next.y;
}

function completeMission() {
  const index = state.currentMission;
  if (!state.records.completed.includes(index)) {
    state.records.completed.push(index);
  }
  state.records.attempts[index] = (state.records.attempts[index] || 0) + 1;
  saveRecords();
  renderProgressDots();
  renderParent();
  setStatus("해냈어요! 다음 놀이도 해볼까요?", false);
  const area = document.querySelector(".practice-area");
  area.classList.remove("success-pop");
  window.requestAnimationFrame(() => area.classList.add("success-pop"));
}

function showHint() {
  const mission = missions[state.currentMission];
  const hint = mission.hints[state.hintIndex] || mission.hints[mission.hints.length - 1];
  document.querySelector("#hintText").textContent = hint;
  state.hintIndex = Math.min(state.hintIndex + 1, mission.hints.length - 1);
}

function speakMission() {
  const mission = missions[state.currentMission];
  const text = `${mission.title}. ${mission.prompt}`;
  if (!("speechSynthesis" in window)) {
    setStatus("이 브라우저는 소리 읽기를 지원하지 않아요.", false);
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ko-KR";
  utterance.rate = 0.88;
  utterance.pitch = 1.08;
  window.speechSynthesis.speak(utterance);
}

function changeMission(delta) {
  const next = state.currentMission + delta;
  if (next < 0 || next >= missions.length) return;
  state.currentMission = next;
  renderMission();
}

function renderParent() {
  const completed = state.records.completed.length;
  document.querySelector("#parentSummaryText").textContent =
    `${missions.length}개 중 ${completed}개를 해냈어요. 어려운 날에는 색 순서와 앞으로 한 칸부터 다시 시작하면 좋아요.`;

  const grid = document.querySelector("#recordGrid");
  grid.innerHTML = "";
  missions.forEach((mission, index) => {
    const item = document.createElement("article");
    item.className = "record-item";
    const stateText = state.records.completed.includes(index) ? "완료" : "연습 전";
    item.innerHTML = `
      <strong>${index + 1}. ${mission.title}</strong>
      <p class="record-state">${stateText}</p>
      <div>${mission.tags.map((tag) => `<span>${tag}</span>`).join("")}</div>
    `;
    grid.append(item);
  });
}

function resetRecords() {
  state.records = { completed: [], attempts: {} };
  saveRecords();
  renderProgressDots();
  renderParent();
  setStatus("기록을 초기화했어요.", false);
}

function setStatus(message, isFree) {
  if (isFree) {
    freeStatusLine.textContent = message;
  } else {
    statusLine.textContent = message;
  }
}

function getInitialActor(mission) {
  const start = mission.start || { x: 0, y: 0, dir: "E" };
  return { x: start.x, y: start.y, dir: start.dir || "E" };
}

function samePoint(a, b) {
  return a && b && a.x === b.x && a.y === b.y;
}

function pause(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function loadRecords() {
  try {
    const parsed = JSON.parse(window.localStorage.getItem("moblo-home-records"));
    return {
      completed: Array.isArray(parsed?.completed) ? parsed.completed : [],
      attempts: parsed?.attempts || {}
    };
  } catch {
    return { completed: [], attempts: {} };
  }
}

function saveRecords() {
  window.localStorage.setItem("moblo-home-records", JSON.stringify(state.records));
}
