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

const levelOptions = {
  age4: { label: "만 4세", shortLabel: "만 4", note: "색, 순서, 한 칸 이동" },
  age5: { label: "만 5세", shortLabel: "만 5", note: "방향 전환, 고치기, 반복 준비" },
  age6: { label: "만 6세", shortLabel: "만 6", note: "우회 경로, 반복, 기억 문제" }
};

const missions = [
  {
    id: "age4-color-two",
    level: "age4",
    title: "색 블록 두 개",
    prompt: "빨강 다음에 파랑을 놓아볼까?",
    type: "pattern",
    available: ["red", "blue", "yellow"],
    expected: ["red", "blue"],
    hints: ["첫 번째는 빨강이에요.", "두 번째는 파랑이에요.", "두 블록만 놓고 해보기를 눌러요."],
    tags: ["색", "순서"]
  },
  {
    id: "age4-yellow-one",
    level: "age4",
    title: "노랑 찾기",
    prompt: "노랑 블록 하나를 놓아볼까?",
    type: "pattern",
    available: ["red", "yellow", "blue"],
    expected: ["yellow"],
    hints: ["노랑 블록은 해님 색이에요.", "하나만 놓아도 돼요.", "놓고 해보기를 눌러요."],
    tags: ["색", "선택"]
  },
  {
    id: "age4-same-green",
    level: "age4",
    title: "같은 색 두 번",
    prompt: "초록을 두 번 놓아볼까?",
    type: "pattern",
    available: ["green", "yellow", "blue"],
    expected: ["green", "green"],
    hints: ["첫 번째도 초록이에요.", "두 번째도 초록이에요.", "같은 블록을 또 놓아도 괜찮아요."],
    tags: ["색", "반복 준비"]
  },
  {
    id: "age4-color-three",
    level: "age4",
    title: "길게 색 순서",
    prompt: "빨강, 노랑, 파랑 순서로 놓아볼까?",
    type: "pattern",
    available: ["red", "blue", "yellow", "green"],
    expected: ["red", "yellow", "blue"],
    hints: ["먼저 빨강이에요.", "가운데는 노랑이에요.", "마지막은 파랑이에요."],
    tags: ["색", "순서"]
  },
  {
    id: "age4-forward-one",
    level: "age4",
    title: "앞으로 한 칸",
    prompt: "채아가 집까지 한 칸 앞으로 가요.",
    type: "path",
    available: ["move", "stop"],
    solution: ["move"],
    start: { x: 1, y: 2, dir: "E" },
    goal: { x: 2, y: 2 },
    hints: ["앞으로 블록 하나면 돼요.", "멈춰 블록은 없어도 괜찮아요.", "놓고 해보기를 눌러요."],
    tags: ["앞으로", "원인과 결과"]
  },
  {
    id: "age4-forward-two",
    level: "age4",
    title: "두 칸 가기",
    prompt: "앞으로, 앞으로. 집까지 두 칸 가요.",
    type: "path",
    available: ["move", "stop"],
    solution: ["move", "move"],
    start: { x: 0, y: 3, dir: "E" },
    goal: { x: 2, y: 3 },
    hints: ["앞으로를 두 번 놓아요.", "첫 블록이 끝나면 다음 블록을 해요.", "채아가 집에서 멈추면 성공이에요."],
    tags: ["순차", "앞으로"]
  },
  {
    id: "age4-stop-after-move",
    level: "age4",
    title: "가고 멈춰요",
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
    id: "age4-turn-right",
    level: "age4",
    title: "오른쪽 보기",
    prompt: "오른쪽으로 돌고 멈춰요.",
    type: "path",
    available: ["right", "left", "stop"],
    solution: ["right", "stop"],
    start: { x: 2, y: 2, dir: "E" },
    goal: { x: 2, y: 2 },
    mustInclude: ["stop"],
    hints: ["오른쪽 블록을 먼저 놓아요.", "돌아본 뒤 멈춰요.", "채아의 방향 표시를 봐요."],
    tags: ["방향", "멈춤"]
  },
  {
    id: "age4-turn-left",
    level: "age4",
    title: "왼쪽 보기",
    prompt: "왼쪽으로 돌고 멈춰요.",
    type: "path",
    available: ["left", "right", "stop"],
    solution: ["left", "stop"],
    start: { x: 2, y: 2, dir: "E" },
    goal: { x: 2, y: 2 },
    mustInclude: ["stop"],
    hints: ["왼쪽 블록을 먼저 놓아요.", "그 다음 멈춰요.", "오른쪽 블록은 이번엔 쉬어요."],
    tags: ["방향", "멈춤"]
  },
  {
    id: "age4-up-one",
    level: "age4",
    title: "위로 한 칸",
    prompt: "위쪽 집으로 한 칸 가요.",
    type: "path",
    available: ["move", "stop"],
    solution: ["move"],
    start: { x: 2, y: 3, dir: "N" },
    goal: { x: 2, y: 2 },
    hints: ["채아가 위쪽을 보고 있어요.", "앞으로 하나면 집이에요.", "놓고 해보기를 눌러요."],
    tags: ["방향", "앞으로"]
  },
  {
    id: "age4-blue-yellow-blue",
    level: "age4",
    title: "색 징검다리",
    prompt: "파랑, 노랑, 파랑 순서로 놓아요.",
    type: "pattern",
    available: ["blue", "yellow", "red"],
    expected: ["blue", "yellow", "blue"],
    hints: ["처음은 파랑이에요.", "가운데는 노랑이에요.", "마지막은 다시 파랑이에요."],
    tags: ["패턴", "순서"]
  },
  {
    id: "age4-four-colors",
    level: "age4",
    title: "네 색 보기",
    prompt: "빨강, 파랑, 노랑, 초록을 차례대로 놓아요.",
    type: "pattern",
    available: ["red", "blue", "yellow", "green"],
    expected: ["red", "blue", "yellow", "green"],
    hints: ["보기 블록을 왼쪽부터 봐요.", "빨강 다음은 파랑이에요.", "마지막은 초록이에요."],
    tags: ["패턴", "순서"]
  },
  {
    id: "age5-right-move",
    level: "age5",
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
    id: "age5-left-move",
    level: "age5",
    title: "왼쪽으로 돌아요",
    prompt: "왼쪽으로 돌고 앞으로 가요.",
    type: "path",
    available: ["move", "left", "right"],
    solution: ["left", "move"],
    start: { x: 2, y: 3, dir: "E" },
    goal: { x: 2, y: 2 },
    hints: ["처음에는 왼쪽 블록이에요.", "그 다음 앞으로 가요.", "채아의 방향 표시를 봐요."],
    tags: ["방향", "순서"]
  },
  {
    id: "age5-corner-down",
    level: "age5",
    title: "ㄱ자 길",
    prompt: "앞으로 가고 오른쪽으로 돌아 집까지 가요.",
    type: "path",
    available: ["move", "right", "left"],
    solution: ["move", "right", "move"],
    start: { x: 1, y: 1, dir: "E" },
    goal: { x: 2, y: 2 },
    hints: ["먼저 앞으로 가요.", "아래쪽 집을 보려면 오른쪽으로 돌아요.", "마지막에 앞으로 가요."],
    tags: ["방향", "순차"]
  },
  {
    id: "age5-corner-up",
    level: "age5",
    title: "ㄴ자 길",
    prompt: "앞으로 가고 왼쪽으로 돌아 집까지 가요.",
    type: "path",
    available: ["move", "left", "right"],
    solution: ["move", "left", "move"],
    start: { x: 1, y: 3, dir: "E" },
    goal: { x: 2, y: 2 },
    hints: ["먼저 앞으로 가요.", "위쪽 집을 보려면 왼쪽으로 돌아요.", "마지막에 앞으로 가요."],
    tags: ["방향", "순차"]
  },
  {
    id: "age5-repeat-move",
    level: "age5",
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
    id: "age5-three-steps-repeat",
    level: "age5",
    title: "세 칸 가기",
    prompt: "앞으로를 반복해서 집까지 세 칸 가요.",
    type: "path",
    available: ["move", "repeat", "stop"],
    solution: ["move", "repeat", "repeat"],
    start: { x: 0, y: 2, dir: "E" },
    goal: { x: 3, y: 2 },
    hints: ["앞으로를 먼저 놓아요.", "또 한 번을 두 번 쓰면 세 칸 가요.", "앞으로, 또 한 번, 또 한 번이에요."],
    tags: ["반복", "앞으로"]
  },
  {
    id: "age5-debug-turn",
    level: "age5",
    title: "길을 고쳐요",
    prompt: "집으로 못 가면 블록을 하나 치우고 다시 해봐요.",
    type: "path",
    available: ["move", "right", "left", "stop"],
    solution: ["move", "right", "move"],
    start: { x: 1, y: 1, dir: "E" },
    goal: { x: 2, y: 2 },
    prefill: ["move", "left", "move"],
    hints: ["처음 앞으로는 좋아요.", "왼쪽 대신 오른쪽이면 집 쪽을 봐요.", "앞으로, 오른쪽, 앞으로를 만들어봐요."],
    tags: ["디버깅", "방향"]
  },
  {
    id: "age5-avoid-one",
    level: "age5",
    title: "장애물 피하기",
    prompt: "회색 길은 피해 가요.",
    type: "path",
    available: ["move", "right", "left", "repeat"],
    solution: ["move", "right", "move", "left", "move", "repeat"],
    start: { x: 0, y: 2, dir: "E" },
    goal: { x: 3, y: 3 },
    obstacles: [{ x: 2, y: 2 }],
    hints: ["앞으로 두 번은 막혀요.", "오른쪽으로 돌아 아래 길을 써요.", "마지막 앞으로는 또 한 번으로 반복해도 돼요."],
    tags: ["문제 해결", "방향"]
  },
  {
    id: "age5-stop-test",
    level: "age5",
    title: "멈춰 뒤는 쉬어요",
    prompt: "집에 간 뒤 멈춰요. 멈춰 뒤 블록은 하지 않아요.",
    type: "path",
    available: ["move", "stop", "right"],
    solution: ["move", "stop", "right"],
    start: { x: 1, y: 2, dir: "E" },
    goal: { x: 2, y: 2 },
    mustInclude: ["stop"],
    hints: ["앞으로 가면 집이에요.", "그 다음 멈춰요.", "멈춰 뒤 오른쪽은 실행하지 않아요."],
    tags: ["멈춤", "순서"]
  },
  {
    id: "age5-green-pattern",
    level: "age5",
    title: "초록까지 색 길",
    prompt: "노랑, 초록, 초록 순서로 놓아요.",
    type: "pattern",
    available: ["red", "yellow", "green", "blue"],
    expected: ["yellow", "green", "green"],
    hints: ["첫 번째는 노랑이에요.", "초록이 두 번 와요.", "같은 블록을 또 놓아도 돼요."],
    tags: ["패턴", "반복 준비"]
  },
  {
    id: "age5-repeat-color",
    level: "age5",
    title: "반복 색 패턴",
    prompt: "빨강, 파랑을 한 번 더 반복해요.",
    type: "pattern",
    available: ["red", "blue", "yellow", "green"],
    expected: ["red", "blue", "red", "blue"],
    hints: ["빨강 다음 파랑이에요.", "같은 순서를 한 번 더 해요.", "빨강, 파랑, 빨강, 파랑이에요."],
    tags: ["패턴", "반복"]
  },
  {
    id: "age5-up-and-right",
    level: "age5",
    title: "위로 가고 오른쪽",
    prompt: "위로 한 칸 가고, 오른쪽으로 돌아 한 칸 더 가요.",
    type: "path",
    available: ["move", "right", "left"],
    solution: ["move", "right", "move"],
    start: { x: 1, y: 3, dir: "N" },
    goal: { x: 2, y: 2 },
    hints: ["처음엔 위를 보고 있어요.", "앞으로 가요.", "오른쪽으로 돌아 앞으로 가요."],
    tags: ["방향", "순차"]
  },
  {
    id: "age5-long-home",
    level: "age5",
    title: "집까지 긴 길",
    prompt: "돌고, 두 칸 가요.",
    type: "path",
    available: ["move", "right", "left", "repeat", "stop"],
    solution: ["left", "move", "repeat"],
    start: { x: 1, y: 1, dir: "S" },
    goal: { x: 3, y: 1 },
    hints: ["처음에는 왼쪽으로 돌아 동쪽을 봐요.", "앞으로 두 번 가면 집이에요.", "앞으로 뒤에 또 한 번을 써도 돼요."],
    tags: ["방향", "반복 준비", "순차"]
  },
  {
    id: "age6-avoid-two",
    level: "age6",
    title: "장애물 둘 피하기",
    prompt: "회색 블록 두 개를 피해 집까지 가요.",
    type: "path",
    available: ["move", "right", "left", "repeat"],
    solution: ["move", "right", "move", "left", "move", "repeat"],
    start: { x: 0, y: 1, dir: "E" },
    goal: { x: 3, y: 2 },
    obstacles: [{ x: 2, y: 1 }, { x: 0, y: 2 }],
    hints: ["앞으로 한 번 간 뒤 아래 길로 돌아요.", "오른쪽, 앞으로, 왼쪽을 써요.", "마지막은 앞으로를 반복해도 돼요."],
    tags: ["우회", "문제 해결"]
  },
  {
    id: "age6-repeat-three",
    level: "age6",
    title: "반복으로 세 칸",
    prompt: "또 한 번을 써서 세 칸을 가요.",
    type: "path",
    available: ["move", "repeat", "stop"],
    solution: ["move", "repeat", "repeat"],
    start: { x: 1, y: 4, dir: "N" },
    goal: { x: 1, y: 1 },
    hints: ["앞으로 하나가 시작이에요.", "또 한 번은 바로 앞 움직임을 다시 해요.", "반복을 두 번 쓰면 세 칸이에요."],
    tags: ["반복", "방향"]
  },
  {
    id: "age6-turn-repeat",
    level: "age6",
    title: "돌기도 반복",
    prompt: "오른쪽으로 두 번 돌고 한 칸 가요.",
    type: "path",
    available: ["right", "repeat", "move", "left"],
    solution: ["right", "repeat", "move"],
    start: { x: 3, y: 2, dir: "E" },
    goal: { x: 2, y: 2 },
    hints: ["오른쪽으로 한 번 돌면 아래를 봐요.", "또 한 번 돌면 왼쪽을 봐요.", "그 다음 앞으로 가요."],
    tags: ["반복", "방향"]
  },
  {
    id: "age6-square-corner",
    level: "age6",
    title: "모서리 돌아가기",
    prompt: "두 번 꺾어서 집에 가요.",
    type: "path",
    available: ["move", "right", "left", "repeat"],
    solution: ["right", "move", "left", "move", "repeat"],
    start: { x: 1, y: 1, dir: "E" },
    goal: { x: 3, y: 2 },
    obstacles: [{ x: 2, y: 1 }],
    hints: ["앞은 막혀 있으니 먼저 오른쪽으로 돌아요.", "아래로 간 뒤 왼쪽으로 돌아요.", "마지막 앞으로는 또 한 번으로 반복해도 돼요."],
    tags: ["우회", "방향"]
  },
  {
    id: "age6-debug-obstacle",
    level: "age6",
    title: "막힌 길 고치기",
    prompt: "회색 블록에 부딪히지 않게 고쳐요.",
    type: "path",
    available: ["move", "right", "left", "repeat"],
    solution: ["right", "move", "left", "move"],
    start: { x: 1, y: 1, dir: "E" },
    goal: { x: 2, y: 2 },
    obstacles: [{ x: 2, y: 1 }],
    prefill: ["move", "move"],
    hints: ["처음 앞으로는 막혀요.", "오른쪽으로 먼저 돌아요.", "아래로 간 뒤 다시 왼쪽을 봐요."],
    tags: ["디버깅", "우회"]
  },
  {
    id: "age6-five-colors",
    level: "age6",
    title: "색 기억 다섯",
    prompt: "다섯 색 순서를 기억해서 놓아요.",
    type: "pattern",
    available: ["red", "blue", "yellow", "green"],
    expected: ["red", "yellow", "blue", "green", "yellow"],
    hints: ["첫 번째는 빨강이에요.", "노랑이 두 번 나와요.", "빨강, 노랑, 파랑, 초록, 노랑이에요."],
    tags: ["기억", "패턴"]
  },
  {
    id: "age6-symmetry-colors",
    level: "age6",
    title: "거울 색 패턴",
    prompt: "앞과 뒤가 같은 색 길을 만들어요.",
    type: "pattern",
    available: ["red", "blue", "green", "yellow"],
    expected: ["red", "blue", "green", "blue", "red"],
    hints: ["가운데는 초록이에요.", "초록 양쪽은 파랑이에요.", "끝과 끝은 빨강이에요."],
    tags: ["패턴", "대칭"]
  },
  {
    id: "age6-stop-mid",
    level: "age6",
    title: "멈춰서 지키기",
    prompt: "집에 도착하면 멈춰요. 뒤 블록은 실행되지 않아요.",
    type: "path",
    available: ["move", "stop", "right", "repeat"],
    solution: ["move", "repeat", "stop", "right"],
    start: { x: 0, y: 0, dir: "E" },
    goal: { x: 2, y: 0 },
    mustInclude: ["stop"],
    hints: ["앞으로 두 칸 가요.", "또 한 번을 쓰면 두 번째 칸이에요.", "집에서 멈추면 뒤 블록은 쉬어요."],
    tags: ["멈춤", "반복"]
  },
  {
    id: "age6-north-detour",
    level: "age6",
    title: "북쪽으로 우회",
    prompt: "막힌 길을 피해 위쪽으로 돌아가요.",
    type: "path",
    available: ["move", "left", "right", "repeat"],
    solution: ["left", "move", "right", "move"],
    start: { x: 1, y: 3, dir: "E" },
    goal: { x: 2, y: 2 },
    obstacles: [{ x: 2, y: 3 }],
    hints: ["앞으로 바로 가면 막혀요.", "먼저 왼쪽으로 돌아 위로 가요.", "오른쪽으로 돌아 집 쪽을 봐요."],
    tags: ["우회", "방향"]
  },
  {
    id: "age6-repeat-turn-mix",
    level: "age6",
    title: "반복과 회전",
    prompt: "두 칸 간 뒤 돌아서 집에 가요.",
    type: "path",
    available: ["move", "repeat", "right", "left"],
    solution: ["move", "repeat", "right", "move"],
    start: { x: 0, y: 1, dir: "E" },
    goal: { x: 2, y: 2 },
    hints: ["앞으로와 또 한 번으로 두 칸 가요.", "오른쪽으로 돌면 아래를 봐요.", "마지막에 앞으로 가요."],
    tags: ["반복", "방향"]
  },
  {
    id: "age6-long-challenge",
    level: "age6",
    title: "긴 길 도전",
    prompt: "여러 블록을 이어 집까지 가요.",
    type: "path",
    available: ["move", "right", "left", "repeat", "stop"],
    solution: ["move", "right", "move", "left", "move", "repeat", "stop"],
    start: { x: 0, y: 2, dir: "E" },
    goal: { x: 3, y: 3 },
    obstacles: [{ x: 2, y: 2 }],
    mustInclude: ["stop"],
    hints: ["앞으로 가고 아래로 돌아요.", "오른쪽, 앞으로, 왼쪽을 써요.", "마지막은 반복하고 멈춰요."],
    tags: ["종합", "도전"]
  },
  {
    id: "age6-hidden-guide",
    level: "age6",
    title: "보기 없이 생각하기",
    prompt: "힌트를 보고 집까지 가는 길을 찾아요.",
    type: "path",
    available: ["move", "right", "left", "repeat"],
    solution: ["left", "move", "right", "move", "repeat"],
    hideGuide: true,
    start: { x: 1, y: 3, dir: "E" },
    goal: { x: 3, y: 2 },
    obstacles: [{ x: 2, y: 3 }],
    hints: ["바로 앞은 막혀 있어요.", "먼저 왼쪽으로 돌아 위로 가요.", "오른쪽으로 돌아 앞으로를 반복해요."],
    tags: ["도전", "추론"]
  }
];

const freeMission = {
  type: "path",
  level: "free",
  available: ["move", "left", "right", "stop", "repeat"],
  start: { x: 2, y: 2, dir: "N" },
  goal: { x: 4, y: 1 },
  obstacles: []
};

const state = {
  currentMission: 0,
  currentLevel: loadCurrentLevel(),
  program: [],
  freeProgram: [],
  hintIndex: 0,
  actor: null,
  freeActor: null,
  running: false,
  freeRunning: false,
  sfxEnabled: loadSfxEnabled(),
  records: loadRecords()
};

state.currentMission = getLevelEntries(state.currentLevel)[0]?.index || 0;

const soundState = {
  context: null
};

const world3dState = {
  worlds: new Set(),
  frame: null
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
const celebration = document.querySelector("#celebration");

document.querySelectorAll(".mode-tab").forEach((button) => {
  button.addEventListener("click", () => switchView(button.dataset.view));
});

document.querySelectorAll(".level-tab").forEach((button) => {
  button.addEventListener("click", () => selectLevel(button.dataset.level));
});

document.querySelector("#hintButton").addEventListener("click", showHint);
document.querySelector("#speakButton").addEventListener("click", speakMission);
document.querySelector("#sfxButton").addEventListener("click", toggleSfx);
document.querySelector("#prevMission").addEventListener("click", () => changeMission(-1));
document.querySelector("#nextMission").addEventListener("click", () => changeMission(1));
document.querySelector("#undoButton").addEventListener("click", () => removeLast(false));
document.querySelector("#clearButton").addEventListener("click", () => clearProgram(false));
document.querySelector("#runButton").addEventListener("click", () => runCurrentMission(false));
document.querySelector("#freeUndoButton").addEventListener("click", () => removeLast(true));
document.querySelector("#freeClearButton").addEventListener("click", () => clearProgram(true));
document.querySelector("#freeRunButton").addEventListener("click", () => runCurrentMission(true));
document.querySelector("#resetProgressButton").addEventListener("click", resetRecords);
document.addEventListener("pointerdown", unlockAudio, { once: true });

renderLevelTabs();
renderSfxButton();
renderMission();
renderFree();
renderParent();

function switchView(viewName) {
  document.querySelectorAll(".mode-tab").forEach((button) => {
    button.classList.toggle("active", button.dataset.view === viewName);
  });
  document.querySelectorAll(".view").forEach((view) => view.classList.remove("active"));
  document.querySelector(`#${viewName}View`).classList.add("active");
  window.requestAnimationFrame(() => {
    if (viewName === "play") updateActorVisual(board, state.actor, false);
    if (viewName === "free") updateActorVisual(freeBoard, state.freeActor, false);
  });
  if (viewName === "parent") {
    renderParent();
  }
}

function selectLevel(level) {
  if (!levelOptions[level]) return;
  state.currentLevel = level;
  state.currentMission = getLevelEntries(level)[0]?.index || 0;
  window.localStorage.setItem("moblo-home-level", level);
  renderLevelTabs();
  renderMission();
  playSound("select");
}

function renderLevelTabs() {
  document.querySelectorAll(".level-tab").forEach((button) => {
    const isActive = button.dataset.level === state.currentLevel;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function getLevelEntries(level = state.currentLevel) {
  return missions
    .map((mission, index) => ({ mission, index }))
    .filter((entry) => entry.mission.level === level);
}

function getCurrentMissionEntry() {
  const entries = getLevelEntries();
  const position = Math.max(0, entries.findIndex((entry) => entry.index === state.currentMission));
  if (!entries.length) {
    return { mission: missions[0], index: 0, position: 0, total: missions.length };
  }
  const entry = position >= 0 ? entries[position] : entries[0];
  state.currentMission = entry.index;
  return { ...entry, position: entries.indexOf(entry), total: entries.length };
}

function renderMission() {
  const { mission, index, position, total } = getCurrentMissionEntry();
  state.hintIndex = 0;
  state.program = [...(mission.prefill || [])];
  state.actor = getInitialActor(mission);

  document.querySelector("#missionStep").textContent = `${levelOptions[state.currentLevel].shortLabel.replace(" ", "")} ${position + 1}/${total}`;
  document.querySelector("#missionTitle").textContent = mission.title;
  document.querySelector("#missionPrompt").textContent = mission.prompt;
  document.querySelector("#hintText").textContent = "";
  statusLine.textContent = "블록을 놓아볼까요?";

  state.currentMission = index;
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
  getLevelEntries().forEach(({ index }) => {
    const dot = document.createElement("span");
    dot.className = "progress-dot";
    if (isMissionCompleted(index)) dot.classList.add("done");
    if (index === state.currentMission) dot.classList.add("current");
    dots.append(dot);
  });
}

function renderReference(mission) {
  const guide = mission.expected || (mission.hideGuide ? [] : mission.solution) || [];
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
  disposeWorld3d(targetBoard);
  targetBoard.innerHTML = "";
  targetBoard.dataset.theme = getMissionTheme(mission);
  targetBoard.classList.toggle("pattern-board", mission.type === "pattern");
  const trail = getMissionTrail(mission);
  for (let y = 0; y < 5; y += 1) {
    for (let x = 0; x < 5; x += 1) {
      const cell = document.createElement("div");
      cell.className = "cell path";
      if (trail.some((point) => samePoint(point, { x, y }))) cell.classList.add("trail");
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
  } else {
    placePatternScene(targetBoard, mission);
  }
  createWorld3d(targetBoard, mission, actor);
}

function placeActor(targetBoard, actor) {
  const oldActor = targetBoard.querySelector(".actor");
  if (oldActor) oldActor.remove();
  const actorNode = document.createElement("div");
  actorNode.className = "actor no-motion";
  actorNode.dataset.dir = actor.dir;
  actorNode.setAttribute("aria-label", "이채아 캐릭터");
  actorNode.innerHTML = `
    <span class="chaea-hair"></span>
    <span class="chaea-face">
      <span class="chaea-eye"></span>
      <span class="chaea-eye"></span>
      <span class="chaea-smile"></span>
    </span>
    <span class="chaea-body"></span>
    <span class="chaea-name">채아</span>
    <span class="actor-pointer" aria-hidden="true"></span>
  `;
  targetBoard.append(actorNode);
  updateActorVisual(targetBoard, actor, false);
  actorNode.getBoundingClientRect();
  actorNode.classList.remove("no-motion");
}

function placePatternScene(targetBoard, mission) {
  const stage = document.createElement("div");
  stage.className = "pattern-scene";
  stage.innerHTML = `
    <div class="pattern-character" aria-label="이채아">
      <span class="chaea-hair"></span>
      <span class="chaea-face">
        <span class="chaea-eye"></span>
        <span class="chaea-eye"></span>
        <span class="chaea-smile"></span>
      </span>
      <span class="chaea-body"></span>
      <span class="chaea-name">채아</span>
    </div>
    <div class="pattern-gate">
      ${(mission.expected || []).map((blockId) => `<i data-kind="${blocks[blockId].kind}"></i>`).join("")}
    </div>
  `;
  targetBoard.append(stage);
}

function getMissionTheme(mission) {
  if (mission.level === "age6") return "space";
  if (mission.level === "age5") return "city";
  if (mission.level === "free") return "play";
  return "meadow";
}

function getMissionTrail(mission) {
  if (mission.type !== "path" || mission.hideGuide) return [];
  const actor = getInitialActor(mission);
  const trail = [{ x: actor.x, y: actor.y }];
  let lastAction = null;

  for (const blockId of mission.solution || []) {
    const action = blockId === "repeat" ? lastAction : blockId;
    if (!action || action === "stop") break;
    if (action === "left" || action === "right") {
      const index = directionOrder.indexOf(actor.dir);
      const nextIndex = action === "left" ? index - 1 : index + 1;
      actor.dir = directionOrder[(nextIndex + directionOrder.length) % directionOrder.length];
      lastAction = action;
      continue;
    }
    if (action === "move") {
      const delta = directionDelta[actor.dir];
      const next = { x: actor.x + delta.x, y: actor.y + delta.y };
      if (next.x < 0 || next.x > 4 || next.y < 0 || next.y > 4) break;
      if ((mission.obstacles || []).some((point) => samePoint(point, next))) break;
      actor.x = next.x;
      actor.y = next.y;
      lastAction = action;
      trail.push({ x: actor.x, y: actor.y });
    }
  }

  return trail;
}

function createWorld3d(targetBoard, mission, actor) {
  if (!window.THREE) {
    targetBoard.classList.remove("has-3d");
    return;
  }

  const THREE = window.THREE;
  const canvas = document.createElement("canvas");
  canvas.className = "world3d-canvas";
  canvas.setAttribute("aria-hidden", "true");
  targetBoard.prepend(canvas);

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
  camera.position.set(3.8, 5.8, 6.8);
  camera.lookAt(0, 0, 0);

  const ambient = new THREE.HemisphereLight(0xffffff, 0x76b487, 1.3);
  scene.add(ambient);
  const sun = new THREE.DirectionalLight(0xffffff, 1.1);
  sun.position.set(-3.5, 8, 4.5);
  scene.add(sun);

  const themeColors = getThemeColors(getMissionTheme(mission));
  scene.add(createSkyPlane(THREE, themeColors));
  scene.add(createGround(THREE, themeColors));

  const trail = getMissionTrail(mission);
  for (let y = 0; y < 5; y += 1) {
    for (let x = 0; x < 5; x += 1) {
      const point = { x, y };
      const tile = createTile3d(THREE, themeColors, {
        trail: trail.some((tilePoint) => samePoint(tilePoint, point)),
        start: mission.start && samePoint(mission.start, point),
        goal: mission.goal && samePoint(mission.goal, point),
        obstacle: (mission.obstacles || []).some((obstacle) => samePoint(obstacle, point))
      });
      tile.position.copy(cellToWorld(point));
      scene.add(tile);
    }
  }

  const actorGroup = createChaea3d(THREE);
  actorGroup.position.copy(cellToWorld(getInitialActor(mission)));
  actorGroup.position.y = 0.42;
  scene.add(actorGroup);

  const patternCubes = [];
  if (mission.type === "pattern") {
    (mission.expected || []).forEach((blockId, index, list) => {
      const cube = createPatternCube3d(THREE, blocks[blockId].kind);
      cube.position.set((index - (list.length - 1) / 2) * 0.42, 0.3, 1.3);
      scene.add(cube);
      patternCubes.push(cube);
    });
    actorGroup.position.set(0, 0.52, -0.22);
  }

  const world = {
    targetBoard,
    mission,
    actorGroup,
    camera,
    renderer,
    scene,
    canvas,
    patternCubes,
    size: { width: 0, height: 0 },
    targetPosition: actorGroup.position.clone(),
    targetDirection: actor?.dir || "N",
    baseY: actorGroup.position.y,
    disposed: false
  };

  targetBoard._world3d = world;
  targetBoard.classList.add("has-3d");
  world3dState.worlds.add(world);
  resizeWorld3d(world);
  if (mission.type === "path") {
    updateWorld3d(targetBoard, actor || getInitialActor(mission), false);
  } else {
    renderWorld3d(world, performance.now());
  }
  startWorld3dLoop();
}

function getThemeColors(theme) {
  const themes = {
    meadow: { sky: 0x8fdfff, ground: 0x6ed198, tile: 0xeafff0, trail: 0xffdf6e, start: 0x9fc9ff, goal: 0xb6efc8, obstacle: 0xb7c6cf },
    city: { sky: 0x8fd8ff, ground: 0x5fd0bb, tile: 0xeaf7ff, trail: 0xffd36e, start: 0x9fc9ff, goal: 0xffcb67, obstacle: 0xaeb8c2 },
    space: { sky: 0x2e3d92, ground: 0x5b4bb0, tile: 0xdfe9ff, trail: 0x9ef2ff, start: 0x9fc9ff, goal: 0xb78cff, obstacle: 0x8490b8 },
    play: { sky: 0x8fdfff, ground: 0xa9e66f, tile: 0xf4ffef, trail: 0xffdf6e, start: 0x9fc9ff, goal: 0xffcb67, obstacle: 0xb7c6cf }
  };
  return themes[theme] || themes.meadow;
}

function createSkyPlane(THREE, colors) {
  const geometry = new THREE.PlaneGeometry(8, 8);
  const material = new THREE.MeshBasicMaterial({ color: colors.sky, transparent: true, opacity: 0.55 });
  const sky = new THREE.Mesh(geometry, material);
  sky.position.set(0, 2.25, -3.4);
  return sky;
}

function createGround(THREE, colors) {
  const geometry = new THREE.BoxGeometry(6.5, 0.16, 6.5);
  const material = new THREE.MeshLambertMaterial({ color: colors.ground });
  const ground = new THREE.Mesh(geometry, material);
  ground.position.y = -0.12;
  return ground;
}

function createTile3d(THREE, colors, flags) {
  const height = flags.obstacle ? 0.46 : flags.goal || flags.start ? 0.2 : 0.11;
  const color = flags.obstacle ? colors.obstacle : flags.goal ? colors.goal : flags.start ? colors.start : flags.trail ? colors.trail : colors.tile;
  const geometry = new THREE.BoxGeometry(0.92, height, 0.92);
  const material = new THREE.MeshLambertMaterial({ color, transparent: true, opacity: flags.trail || flags.goal || flags.start ? 1 : 0.82 });
  const tile = new THREE.Mesh(geometry, material);
  tile.position.y = height / 2;
  return tile;
}

function createPatternCube3d(THREE, kind) {
  const colors = { red: 0xff8a76, blue: 0x70a7ff, yellow: 0xffd86b, green: 0x5fd39a };
  const group = new THREE.Group();
  const cube = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.34, 0.34), new THREE.MeshLambertMaterial({ color: colors[kind] || 0xffffff }));
  cube.position.y = 0.17;
  group.add(cube);
  const peg = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.035, 18), new THREE.MeshLambertMaterial({ color: 0xffffff, transparent: true, opacity: 0.82 }));
  peg.position.y = 0.36;
  group.add(peg);
  return group;
}

function createChaea3d(THREE) {
  const group = new THREE.Group();
  const hairMaterial = new THREE.MeshLambertMaterial({ color: 0x382626 });
  const skinMaterial = new THREE.MeshLambertMaterial({ color: 0xffd0a8 });
  const dressMaterial = new THREE.MeshLambertMaterial({ color: 0xff8ab1 });
  const shoeMaterial = new THREE.MeshLambertMaterial({ color: 0x5d4a56 });
  const arrowMaterial = new THREE.MeshLambertMaterial({ color: 0x2f8dff });

  const hair = new THREE.Mesh(new THREE.SphereGeometry(0.28, 24, 18), hairMaterial);
  hair.scale.set(1.08, 1.05, 0.9);
  hair.position.set(0, 0.82, -0.02);
  group.add(hair);

  const face = new THREE.Mesh(new THREE.SphereGeometry(0.23, 24, 18), skinMaterial);
  face.scale.set(1, 0.96, 0.82);
  face.position.set(0, 0.8, 0.1);
  group.add(face);

  const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0x263645 });
  [-0.08, 0.08].forEach((x) => {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.025, 12, 8), eyeMaterial);
    eye.position.set(x, 0.83, 0.29);
    group.add(eye);
  });

  const body = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.42, 0.24), dressMaterial);
  body.position.set(0, 0.38, 0);
  group.add(body);

  [-0.08, 0.08].forEach((x) => {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.18, 0.08), skinMaterial);
    leg.position.set(x, 0.08, 0);
    group.add(leg);
    const shoe = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.05, 0.12), shoeMaterial);
    shoe.position.set(x, -0.03, 0.03);
    group.add(shoe);
  });

  const arrow = new THREE.Group();
  const cone = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.3, 3), arrowMaterial);
  cone.rotation.x = Math.PI / 2;
  cone.position.z = 0.16;
  arrow.add(cone);
  arrow.position.set(0, 1.24, 0);
  arrow.name = "directionArrow";
  group.add(arrow);

  group.scale.setScalar(0.78);
  return group;
}

function cellToWorld(point) {
  return new window.THREE.Vector3((point.x - 2) * 1.08, 0, (point.y - 2) * 1.08);
}

function updateWorld3d(targetBoard, actor, animate = true) {
  const world = targetBoard._world3d;
  if (!world || !actor) return;
  const target = cellToWorld(actor);
  target.y = world.baseY;
  world.targetPosition.copy(target);
  world.targetDirection = actor.dir || world.targetDirection;
  if (!animate) {
    world.actorGroup.position.copy(world.targetPosition);
    setChaeaDirection(world.actorGroup, world.targetDirection);
  }
  renderWorld3d(world, performance.now());
}

function setChaeaDirection(group, dir) {
  const angle = { N: Math.PI, E: Math.PI / 2, S: 0, W: -Math.PI / 2 }[dir] || 0;
  const arrow = group.getObjectByName("directionArrow");
  if (arrow) arrow.rotation.y = angle;
}

function resizeWorld3d(world) {
  const rect = world.targetBoard.getBoundingClientRect();
  const width = Math.max(1, Math.round(rect.width));
  const height = Math.max(1, Math.round(rect.height));
  if (width === world.size.width && height === world.size.height) return;
  world.size = { width, height };
  world.renderer.setSize(width, height, false);
  world.camera.aspect = width / height;
  world.camera.updateProjectionMatrix();
}

function startWorld3dLoop() {
  if (world3dState.frame) return;
  const tick = (time) => {
    world3dState.frame = null;
    world3dState.worlds.forEach((world) => renderWorld3d(world, time));
    if (world3dState.worlds.size) {
      world3dState.frame = window.requestAnimationFrame(tick);
    }
  };
  world3dState.frame = window.requestAnimationFrame(tick);
}

function renderWorld3d(world, time) {
  if (world.disposed) return;
  resizeWorld3d(world);
  world.actorGroup.position.lerp(world.targetPosition, 0.16);
  world.actorGroup.position.y = world.baseY + Math.sin(time / 360) * 0.035;
  setChaeaDirection(world.actorGroup, world.targetDirection);
  world.patternCubes.forEach((cube, index) => {
    cube.rotation.y += 0.01 + index * 0.001;
    cube.position.y = 0.3 + Math.sin(time / 420 + index) * 0.025;
  });
  world.renderer.render(world.scene, world.camera);
}

function disposeWorld3d(targetBoard) {
  const world = targetBoard._world3d;
  if (!world) return;
  world.disposed = true;
  world3dState.worlds.delete(world);
  world.scene.traverse((object) => {
    if (object.geometry) object.geometry.dispose();
    if (object.material) {
      if (Array.isArray(object.material)) {
        object.material.forEach((material) => material.dispose());
      } else {
        object.material.dispose();
      }
    }
  });
  world.renderer.dispose();
  targetBoard.classList.remove("has-3d");
  targetBoard._world3d = null;
}

function updateActorVisual(targetBoard, actor, animate = true) {
  const actorNode = targetBoard.querySelector(".actor");
  const cell = targetBoard.querySelector(`[data-x="${actor.x}"][data-y="${actor.y}"]`);
  if (!actorNode || !cell) return;

  actorNode.dataset.dir = actor.dir;
  actorNode.classList.toggle("no-motion", !animate);

  const boardBox = targetBoard.getBoundingClientRect();
  const cellBox = cell.getBoundingClientRect();
  const size = Math.min(cellBox.width, cellBox.height) * 0.86;

  actorNode.style.width = `${size}px`;
  actorNode.style.height = `${size}px`;
  actorNode.style.left = `${cellBox.left - boardBox.left + (cellBox.width - size) / 2}px`;
  actorNode.style.top = `${cellBox.top - boardBox.top + (cellBox.height - size) / 2}px`;
  updateWorld3d(targetBoard, actor, animate);
}

function bumpActor(targetBoard) {
  const actorNode = targetBoard.querySelector(".actor");
  if (!actorNode) return;
  actorNode.classList.remove("bump");
  window.requestAnimationFrame(() => actorNode.classList.add("bump"));
}

window.addEventListener("resize", () => {
  window.requestAnimationFrame(() => {
    updateActorVisual(board, state.actor, false);
    updateActorVisual(freeBoard, state.freeActor, false);
  });
});

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
    playSound("error");
    setStatus("블록 길이 가득 찼어요. 하나 치우고 해볼까요?", isFree);
    return;
  }
  program.push(blockId);
  renderProgram(isFree ? freeProgramStrip : programStrip, program, isFree);
  playSound("add");
  setStatus(`${blocks[blockId].label} 블록을 놓았어요.`, isFree);
}

function removeAt(index, isFree) {
  const program = isFree ? state.freeProgram : state.program;
  program.splice(index, 1);
  renderProgram(isFree ? freeProgramStrip : programStrip, program, isFree);
  playSound("remove");
  setStatus("블록 하나를 치웠어요.", isFree);
}

function removeLast(isFree) {
  const program = isFree ? state.freeProgram : state.program;
  if (!program.length) return;
  program.pop();
  renderProgram(isFree ? freeProgramStrip : programStrip, program, isFree);
  playSound("remove");
  setStatus("마지막 블록을 치웠어요.", isFree);
}

function clearProgram(isFree) {
  if (isFree) {
    state.freeProgram = [];
    state.freeActor = getInitialActor(freeMission);
    renderProgram(freeProgramStrip, state.freeProgram, true);
    renderBoard(freeBoard, freeMission, state.freeActor);
  } else {
    const { mission } = getCurrentMissionEntry();
    state.program = [];
    state.actor = getInitialActor(mission);
    renderProgram(programStrip, state.program, false);
    renderBoard(board, mission, state.actor);
  }
  playSound("remove");
  setStatus("블록을 모두 치웠어요.", isFree);
}

async function runCurrentMission(isFree) {
  const mission = isFree ? freeMission : getCurrentMissionEntry().mission;
  const program = isFree ? state.freeProgram : state.program;
  if (isFree ? state.freeRunning : state.running) return;

  if (!program.length) {
    playSound("error");
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

  playSound("run");
  setStatus("하나씩 움직여요.", isFree);
  const result = await executeProgram(mission, program, isFree);

  if (isFree) {
    state.freeRunning = false;
  } else {
    state.running = false;
  }

  if (isFree) {
    playSound(result.crashed ? "error" : "success");
    setStatus(result.crashed ? "길 밖으로 나갔어요. 다른 블록을 놓아볼까요?" : "움직였어요. 다른 길도 만들어봐요.", true);
    return;
  }

  const atGoal = samePoint(result.actor, mission.goal);
  const includesRequired = (mission.mustInclude || []).every((blockId) => program.includes(blockId));

  if (atGoal && includesRequired && !result.crashed) {
    completeMission();
  } else if (atGoal && !includesRequired) {
    playSound("error");
    setStatus("집에 왔어요. 이번에는 멈춰 블록도 같이 놓아볼까요?", false);
  } else if (result.crashed) {
    playSound("error");
    setStatus("다른 길로 가버렸네요. 블록 하나만 바꿔볼까요?", false);
  } else {
    playSound("error");
    setStatus("좋은 시도예요. 집 쪽으로 한 번 더 가볼까요?", false);
  }
}

function checkPattern(mission) {
  const sameLength = state.program.length === mission.expected.length;
  const sameOrder = mission.expected.every((blockId, index) => state.program[index] === blockId);

  if (sameLength && sameOrder) {
    completeMission();
  } else {
    playSound("error");
    setStatus("거의 왔어요. 순서를 다시 볼까요?", false);
  }
}

async function executeProgram(mission, program, isFree) {
  const targetBoard = isFree ? freeBoard : board;
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
      playSound("stop");
      await pause(180);
      break;
    }
    const step = applyAction(actor, action, mission);
    crashed = step.crashed || crashed;
    if (["move", "left", "right"].includes(action)) {
      lastAction = action;
    }
    if (step.crashed) {
      playSound("error");
      bumpActor(targetBoard);
      await pause(300);
    } else {
      playSound(action === "move" ? "move" : "turn");
      updateActorVisual(targetBoard, actor, true);
      await pause(action === "move" ? 470 : 310);
    }
  }

  return { actor, crashed };
}

function applyAction(actor, action, mission) {
  if (action === "left" || action === "right") {
    const index = directionOrder.indexOf(actor.dir);
    const nextIndex = action === "left" ? index - 1 : index + 1;
    actor.dir = directionOrder[(nextIndex + directionOrder.length) % directionOrder.length];
    return { crashed: false };
  }

  if (action !== "move") return { crashed: false };

  const delta = directionDelta[actor.dir];
  const next = { x: actor.x + delta.x, y: actor.y + delta.y };
  const isOutside = next.x < 0 || next.x > 4 || next.y < 0 || next.y > 4;
  const hitsObstacle = (mission.obstacles || []).some((point) => samePoint(point, next));

  if (isOutside || hitsObstacle) {
    return { crashed: true };
  }

  actor.x = next.x;
  actor.y = next.y;
  return { crashed: false };
}

function completeMission() {
  const index = state.currentMission;
  const key = getMissionKey(index);
  if (!isMissionCompleted(index)) {
    state.records.completed.push(key);
  }
  state.records.attempts[key] = (state.records.attempts[key] || 0) + 1;
  saveRecords();
  renderProgressDots();
  renderParent();
  playSound("success");
  showCelebration();
  setStatus("해냈어요! 다음 놀이도 해볼까요?", false);
  const area = document.querySelector(".practice-area");
  area.classList.remove("success-pop");
  window.requestAnimationFrame(() => area.classList.add("success-pop"));
}

function showCelebration() {
  if (!celebration) return;
  celebration.classList.remove("show");
  window.requestAnimationFrame(() => {
    celebration.classList.add("show");
    window.setTimeout(() => celebration.classList.remove("show"), 1050);
  });
}

function showHint() {
  const mission = getCurrentMissionEntry().mission;
  const hint = mission.hints[state.hintIndex] || mission.hints[mission.hints.length - 1];
  document.querySelector("#hintText").textContent = hint;
  state.hintIndex = Math.min(state.hintIndex + 1, mission.hints.length - 1);
  playSound("select");
}

function speakMission() {
  const mission = getCurrentMissionEntry().mission;
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
  const entries = getLevelEntries();
  const position = entries.findIndex((entry) => entry.index === state.currentMission);
  const nextPosition = position + delta;
  if (nextPosition < 0 || nextPosition >= entries.length) return;
  state.currentMission = entries[nextPosition].index;
  renderMission();
  playSound("select");
}

function renderParent() {
  const completed = missions.filter((_, index) => isMissionCompleted(index)).length;
  const levelText = Object.entries(levelOptions)
    .map(([level, meta]) => {
      const entries = getLevelEntries(level);
      const count = entries.filter(({ index }) => isMissionCompleted(index)).length;
      return `${meta.shortLabel} ${count}/${entries.length}`;
    })
    .join(" · ");
  document.querySelector("#parentSummaryText").textContent =
    `${missions.length}개 중 ${completed}개를 해냈어요. ${levelText}. 어려운 날에는 만 4세 색 순서와 앞으로 한 칸부터 다시 시작하면 좋아요.`;

  const grid = document.querySelector("#recordGrid");
  grid.innerHTML = "";
  missions.forEach((mission, index) => {
    const item = document.createElement("article");
    item.className = "record-item";
    const stateText = isMissionCompleted(index) ? "완료" : "연습 전";
    item.innerHTML = `
      <strong>${index + 1}. ${mission.title}</strong>
      <p class="record-level">${levelOptions[mission.level]?.label || ""} · ${levelOptions[mission.level]?.note || ""}</p>
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

function toggleSfx() {
  state.sfxEnabled = !state.sfxEnabled;
  window.localStorage.setItem("moblo-home-sfx", state.sfxEnabled ? "on" : "off");
  renderSfxButton();
  if (state.sfxEnabled) {
    unlockAudio();
    playSound("success");
  }
}

function renderSfxButton() {
  const button = document.querySelector("#sfxButton");
  button.textContent = state.sfxEnabled ? "효과음 켬" : "효과음 끔";
  button.setAttribute("aria-pressed", String(state.sfxEnabled));
}

function unlockAudio() {
  if (!state.sfxEnabled || soundState.context) return;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  soundState.context = new AudioContext();
  if (soundState.context.state === "suspended") {
    soundState.context.resume();
  }
}

function playSound(name) {
  if (!state.sfxEnabled) return;
  unlockAudio();
  const context = soundState.context;
  if (!context) return;

  const patterns = {
    add: [{ frequency: 520, duration: 0.06, type: "triangle", gain: 0.05 }],
    remove: [{ frequency: 260, duration: 0.07, type: "sine", gain: 0.04 }],
    select: [{ frequency: 420, duration: 0.05, type: "sine", gain: 0.035 }],
    run: [{ frequency: 392, duration: 0.06, type: "triangle", gain: 0.04 }, { frequency: 523, duration: 0.07, delay: 0.05, type: "triangle", gain: 0.045 }],
    move: [{ frequency: 660, duration: 0.07, type: "square", gain: 0.025 }],
    turn: [{ frequency: 470, duration: 0.05, type: "triangle", gain: 0.035 }, { frequency: 620, duration: 0.05, delay: 0.04, type: "triangle", gain: 0.03 }],
    stop: [{ frequency: 180, duration: 0.08, type: "sine", gain: 0.045 }],
    error: [{ frequency: 150, duration: 0.1, type: "sawtooth", gain: 0.035 }],
    success: [
      { frequency: 523, duration: 0.08, type: "triangle", gain: 0.05 },
      { frequency: 659, duration: 0.08, delay: 0.07, type: "triangle", gain: 0.05 },
      { frequency: 784, duration: 0.12, delay: 0.14, type: "triangle", gain: 0.055 }
    ]
  };

  (patterns[name] || patterns.select).forEach((note) => playNote(context, note));
}

function playNote(context, note) {
  const start = context.currentTime + (note.delay || 0);
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = note.type || "sine";
  oscillator.frequency.setValueAtTime(note.frequency, start);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(note.gain || 0.04, start + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + note.duration);
  oscillator.connect(gain).connect(context.destination);
  oscillator.start(start);
  oscillator.stop(start + note.duration + 0.02);
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

function getMissionKey(index) {
  return missions[index]?.id || `mission-${index}`;
}

function isMissionCompleted(index) {
  const key = getMissionKey(index);
  return state.records.completed.includes(key) || state.records.completed.includes(index);
}

function loadCurrentLevel() {
  const saved = window.localStorage.getItem("moblo-home-level");
  return levelOptions[saved] ? saved : "age4";
}

function loadSfxEnabled() {
  return window.localStorage.getItem("moblo-home-sfx") !== "off";
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
