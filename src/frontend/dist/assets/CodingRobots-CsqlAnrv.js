import { c as createLucideIcon, j as jsxRuntimeExports, r as reactExports, m as motion, G as GlowButton, n as AnimatePresence } from "./index-bdQaMNSA.js";
import { b as buildResult } from "./GameEngine-aM6bVHjI.js";
import { H as Heart } from "./heart-BzPlSO6g.js";
import { P as Play } from "./play-BOp9WMuR.js";
import { R as RotateCcw } from "./rotate-ccw-D8U3V_vs.js";
import { C as CircleCheckBig } from "./circle-check-big-Ctqehkuj.js";
import { C as CircleX } from "./circle-x-HpfU5D7p.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M12 19h8", key: "baeox8" }],
  ["path", { d: "m4 17 6-6-6-6", key: "1yngyt" }]
];
const Terminal = createLucideIcon("terminal", __iconNode);
const BLOCK_COLORS = {
  move: "#00f5ff",
  turnLeft: "#10b981",
  turnRight: "#10b981",
  loop: "#7c3aed",
  endLoop: "#7c3aed",
  ifObstacle: "#f59e0b",
  endIf: "#f59e0b"
};
const AVAILABLE = {
  1: [
    {
      id: "move1",
      type: "move",
      label: "MOVE FORWARD",
      color: BLOCK_COLORS.move,
      indent: 0
    },
    {
      id: "left1",
      type: "turnLeft",
      label: "TURN LEFT",
      color: BLOCK_COLORS.turnLeft,
      indent: 0
    },
    {
      id: "right1",
      type: "turnRight",
      label: "TURN RIGHT",
      color: BLOCK_COLORS.turnRight,
      indent: 0
    }
  ],
  2: [
    {
      id: "move1",
      type: "move",
      label: "MOVE FORWARD",
      color: BLOCK_COLORS.move,
      indent: 0
    },
    {
      id: "left1",
      type: "turnLeft",
      label: "TURN LEFT",
      color: BLOCK_COLORS.turnLeft,
      indent: 0
    },
    {
      id: "right1",
      type: "turnRight",
      label: "TURN RIGHT",
      color: BLOCK_COLORS.turnRight,
      indent: 0
    },
    {
      id: "loop3",
      type: "loop",
      label: "REPEAT 3x",
      param: 3,
      color: BLOCK_COLORS.loop,
      indent: 0
    },
    {
      id: "endLoop",
      type: "endLoop",
      label: "END REPEAT",
      color: BLOCK_COLORS.endLoop,
      indent: 0
    }
  ],
  3: [
    {
      id: "move1",
      type: "move",
      label: "MOVE FORWARD",
      color: BLOCK_COLORS.move,
      indent: 0
    },
    {
      id: "left1",
      type: "turnLeft",
      label: "TURN LEFT",
      color: BLOCK_COLORS.turnLeft,
      indent: 0
    },
    {
      id: "right1",
      type: "turnRight",
      label: "TURN RIGHT",
      color: BLOCK_COLORS.turnRight,
      indent: 0
    },
    {
      id: "loop3",
      type: "loop",
      label: "REPEAT 3x",
      param: 3,
      color: BLOCK_COLORS.loop,
      indent: 0
    },
    {
      id: "loop2",
      type: "loop",
      label: "REPEAT 2x",
      param: 2,
      color: BLOCK_COLORS.loop,
      indent: 0
    },
    {
      id: "endLoop",
      type: "endLoop",
      label: "END REPEAT",
      color: BLOCK_COLORS.endLoop,
      indent: 0
    },
    {
      id: "ifObstacle",
      type: "ifObstacle",
      label: "IF OBSTACLE AHEAD",
      color: BLOCK_COLORS.ifObstacle,
      indent: 0
    },
    {
      id: "endIf",
      type: "endIf",
      label: "END IF",
      color: BLOCK_COLORS.endIf,
      indent: 0
    }
  ]
};
const MAZES = {
  1: {
    title: "Training Course",
    width: 5,
    height: 5,
    grid: [
      ["empty", "empty", "empty", "empty", "empty"],
      ["empty", "wall", "empty", "wall", "empty"],
      ["empty", "wall", "empty", "empty", "empty"],
      ["empty", "empty", "empty", "wall", "empty"],
      ["empty", "empty", "empty", "empty", "empty"]
    ],
    start: [0, 0],
    goal: [4, 4],
    startDir: "E",
    solutionBlocks: [
      "move",
      "move",
      "turnRight",
      "move",
      "move",
      "turnLeft",
      "move",
      "move",
      "move",
      "turnRight",
      "move",
      "move"
    ]
  },
  2: {
    title: "Factory Floor",
    width: 6,
    height: 5,
    grid: [
      ["empty", "empty", "wall", "empty", "empty", "empty"],
      ["empty", "wall", "wall", "empty", "wall", "empty"],
      ["empty", "empty", "empty", "empty", "wall", "empty"],
      ["empty", "wall", "empty", "wall", "empty", "empty"],
      ["empty", "empty", "empty", "empty", "empty", "empty"]
    ],
    start: [0, 0],
    goal: [5, 4],
    startDir: "E",
    solutionBlocks: [
      "move",
      "turnRight",
      "move",
      "move",
      "turnLeft",
      "move",
      "move",
      "move",
      "move"
    ]
  },
  3: {
    title: "Autonomous Warehouse",
    width: 7,
    height: 6,
    grid: [
      ["empty", "wall", "empty", "empty", "empty", "wall", "empty"],
      ["empty", "wall", "empty", "wall", "empty", "empty", "empty"],
      ["empty", "empty", "empty", "wall", "empty", "wall", "empty"],
      ["wall", "empty", "wall", "empty", "empty", "empty", "empty"],
      ["empty", "empty", "empty", "wall", "wall", "empty", "empty"],
      ["empty", "wall", "empty", "empty", "empty", "empty", "empty"]
    ],
    start: [0, 0],
    goal: [6, 5],
    startDir: "E",
    solutionBlocks: [
      "move",
      "turnRight",
      "move",
      "move",
      "turnLeft",
      "loop",
      "move",
      "endLoop",
      "turnRight",
      "move",
      "move",
      "turnLeft",
      "move",
      "move",
      "move"
    ]
  }
};
const TURN_MAP = {
  N: { L: "W", R: "E" },
  E: { L: "N", R: "S" },
  S: { L: "E", R: "W" },
  W: { L: "S", R: "N" }
};
const DELTA = {
  N: [0, -1],
  E: [1, 0],
  S: [0, 1],
  W: [-1, 0]
};
function executeProgram(blocks, maze) {
  const path = [];
  let [x, y] = maze.start;
  let dir = maze.startDir;
  path.push([x, y, dir]);
  let i = 0;
  let steps = 0;
  while (i < blocks.length && steps < 200) {
    steps++;
    const block = blocks[i];
    if (block.type === "move") {
      const [dx, dy] = DELTA[dir];
      const nx = x + dx;
      const ny = y + dy;
      if (nx >= 0 && nx < maze.width && ny >= 0 && ny < maze.height && maze.grid[ny][nx] !== "wall") {
        x = nx;
        y = ny;
      }
      path.push([x, y, dir]);
      i++;
    } else if (block.type === "turnLeft") {
      dir = TURN_MAP[dir].L;
      path.push([x, y, dir]);
      i++;
    } else if (block.type === "turnRight") {
      dir = TURN_MAP[dir].R;
      path.push([x, y, dir]);
      i++;
    } else if (block.type === "loop") {
      const repeats = block.param ?? 2;
      const endIdx = blocks.findIndex((b, j) => j > i && b.type === "endLoop");
      if (endIdx === -1) {
        i++;
        continue;
      }
      const bodyBlocks = blocks.slice(i + 1, endIdx);
      for (let r = 0; r < repeats; r++) {
        const subPath = executeProgram(bodyBlocks, { ...maze, start: [x, y] });
        if (subPath.length > 1) {
          [x, y] = [
            subPath[subPath.length - 1][0],
            subPath[subPath.length - 1][1]
          ];
          dir = subPath[subPath.length - 1][2];
          path.push(...subPath.slice(1));
        }
      }
      i = endIdx + 1;
    } else {
      i++;
    }
  }
  return path;
}
const DIR_ARROW = { N: "^", E: ">", S: "v", W: "<" };
const DBG_COLORS = {
  MOVE_FORWARD: "#00f5ff",
  TURN_LEFT: "#10b981",
  TURN_RIGHT: "#10b981",
  MOVE_BACK: "#f43f5e",
  WAIT: "#94a3b8",
  REPEAT_2: "#7c3aed",
  STOP: "#f59e0b"
};
const DEBUG_CHALLENGES = [
  {
    id: "d1",
    title: "Forward Stuck",
    description: "Robot needs to navigate straight to goal (East). Program turns left at step 3 instead of moving forward.",
    buggyProgram: [
      "MOVE_FORWARD",
      "MOVE_FORWARD",
      "TURN_LEFT",
      "MOVE_FORWARD",
      "MOVE_FORWARD"
    ],
    buggyIndex: 2,
    correctBlock: "MOVE_FORWARD",
    options: ["MOVE_FORWARD", "TURN_RIGHT", "TURN_LEFT", "MOVE_BACK"],
    explanation: "The robot must keep going East. Step 3 was TURN_LEFT — replacing it with MOVE_FORWARD keeps the robot on the correct straight path."
  },
  {
    id: "d2",
    title: "Wrong Turn",
    description: "Robot must turn left then reach goal. It turns right instead — wrong direction entirely.",
    buggyProgram: [
      "MOVE_FORWARD",
      "TURN_RIGHT",
      "MOVE_FORWARD",
      "MOVE_FORWARD"
    ],
    buggyIndex: 1,
    correctBlock: "TURN_LEFT",
    options: ["TURN_LEFT", "MOVE_FORWARD", "TURN_RIGHT", "STOP"],
    explanation: "The goal is to the North (left of East). TURN_RIGHT would face South — replacing with TURN_LEFT correctly faces North."
  },
  {
    id: "d3",
    title: "Extra Step",
    description: "Robot reaches goal in 3 moves then incorrectly moves backward, leaving goal area.",
    buggyProgram: ["MOVE_FORWARD", "MOVE_FORWARD", "MOVE_FORWARD", "MOVE_BACK"],
    buggyIndex: 3,
    correctBlock: "STOP",
    options: ["STOP", "MOVE_FORWARD", "TURN_LEFT", "WAIT"],
    explanation: "After reaching the goal in 3 steps, the robot should stop. MOVE_BACK exits the goal zone. Correct fix: STOP."
  },
  {
    id: "d4",
    title: "Backward Start",
    description: "Robot starts by going backward — first block is wrong direction.",
    buggyProgram: ["MOVE_BACK", "TURN_RIGHT", "MOVE_FORWARD", "MOVE_FORWARD"],
    buggyIndex: 0,
    correctBlock: "MOVE_FORWARD",
    options: ["MOVE_FORWARD", "TURN_LEFT", "WAIT", "STOP"],
    explanation: "Moving backward on the first step pushes the robot away from goal. Replace MOVE_BACK with MOVE_FORWARD to start correctly."
  },
  {
    id: "d5",
    title: "Double Turn",
    description: "Robot double-turns (turns right twice = facing backward) instead of executing one turn then moving.",
    buggyProgram: ["MOVE_FORWARD", "TURN_RIGHT", "TURN_RIGHT", "MOVE_FORWARD"],
    buggyIndex: 2,
    correctBlock: "MOVE_FORWARD",
    options: ["MOVE_FORWARD", "TURN_LEFT", "STOP", "WAIT"],
    explanation: "Two consecutive right turns = 180 degree reversal. The second TURN_RIGHT should be MOVE_FORWARD to advance after turning once."
  },
  {
    id: "d6",
    title: "Missing Approach",
    description: "Robot reaches a turn but then stops instead of moving forward to the final goal.",
    buggyProgram: [
      "MOVE_FORWARD",
      "MOVE_FORWARD",
      "TURN_LEFT",
      "STOP",
      "MOVE_FORWARD"
    ],
    buggyIndex: 3,
    correctBlock: "MOVE_FORWARD",
    options: ["MOVE_FORWARD", "TURN_RIGHT", "WAIT", "STOP"],
    explanation: "After turning left, the robot must advance. The STOP in position 4 prevents reaching the goal. Replace with MOVE_FORWARD."
  },
  {
    id: "d7",
    title: "Loop vs Single",
    description: "One forward move needed but program has a REPEAT_2 — robot overshoots the goal.",
    buggyProgram: ["TURN_RIGHT", "REPEAT_2", "MOVE_FORWARD", "MOVE_FORWARD"],
    buggyIndex: 1,
    correctBlock: "MOVE_FORWARD",
    options: ["MOVE_FORWARD", "TURN_LEFT", "STOP", "WAIT"],
    explanation: "Only one forward step needed after turn. The REPEAT_2 causes two moves — overshooting goal. Replace with single MOVE_FORWARD."
  },
  {
    id: "d8",
    title: "Misplaced Wait",
    description: "Robot navigates correctly except a WAIT command is placed in the middle of movement sequence.",
    buggyProgram: [
      "MOVE_FORWARD",
      "TURN_LEFT",
      "WAIT",
      "MOVE_FORWARD",
      "MOVE_FORWARD"
    ],
    buggyIndex: 2,
    correctBlock: "MOVE_FORWARD",
    options: ["MOVE_FORWARD", "TURN_RIGHT", "STOP", "WAIT"],
    explanation: "WAIT should only be used at end of sequences, not in the middle of navigation. Replace with MOVE_FORWARD to maintain flow."
  }
];
const TILE_COLORS = {
  red: "#f43f5e",
  blue: "#3b82f6",
  green: "#10b981",
  yellow: "#fef08a",
  empty: "#1e293b"
};
const ACTION_LABELS = {
  turn_left: "TURN LEFT",
  move_forward: "MOVE FORWARD",
  turn_right: "TURN RIGHT",
  stop: "STOP"
};
const ACTION_COLORS = {
  turn_left: "#10b981",
  move_forward: "#00f5ff",
  turn_right: "#7c3aed",
  stop: "#f43f5e"
};
const COND_MAZES = [
  {
    id: "cm1",
    title: "Red Detour",
    description: "Navigate to goal. Turn left when on red tile.",
    grid: [
      ["empty", "empty", "empty"],
      ["red", "empty", "empty"],
      ["empty", "empty", "green"]
    ],
    robotStart: [0, 0],
    robotDir: "S",
    goal: [2, 2],
    requiredRules: [{ condition: "red", action: "turn_left" }],
    explanation: "When the robot steps on red, it faces left (East). Otherwise move forward until goal."
  },
  {
    id: "cm2",
    title: "Blue Booster",
    description: "Navigate maze. On blue tiles, robot moves extra forward.",
    grid: [
      ["empty", "blue", "empty"],
      ["empty", "empty", "empty"],
      ["empty", "empty", "green"]
    ],
    robotStart: [0, 0],
    robotDir: "E",
    goal: [2, 2],
    requiredRules: [{ condition: "blue", action: "move_forward" }],
    explanation: "Blue tile acts as a speed pad — adding an extra forward step automatically advances position."
  },
  {
    id: "cm3",
    title: "Green Corridor",
    description: "On green tiles turn right to exit the corridor.",
    grid: [
      ["empty", "green", "empty", "empty"],
      ["empty", "empty", "empty", "empty"],
      ["empty", "empty", "empty", "green"]
    ],
    robotStart: [0, 0],
    robotDir: "E",
    goal: [3, 2],
    requiredRules: [{ condition: "green", action: "turn_right" }],
    explanation: "Green is a turn indicator — standard line-following logic where different colors encode instructions."
  },
  {
    id: "cm4",
    title: "Yellow Brake",
    description: "Yellow means slow zone. Stop on yellow then wait for next command.",
    grid: [
      ["empty", "empty", "yellow"],
      ["empty", "empty", "empty"],
      ["empty", "empty", "green"]
    ],
    robotStart: [0, 0],
    robotDir: "E",
    goal: [2, 2],
    requiredRules: [{ condition: "yellow", action: "stop" }],
    explanation: "Yellow brake zones are common in warehouse robots. Stopping on yellow prevents collision at intersections."
  },
  {
    id: "cm5",
    title: "Multi-Rule Navigation",
    description: "Complex maze with red=left and blue=forward rules.",
    grid: [
      ["empty", "red", "empty"],
      ["blue", "empty", "empty"],
      ["empty", "empty", "green"]
    ],
    robotStart: [0, 0],
    robotDir: "S",
    goal: [2, 2],
    requiredRules: [
      { condition: "red", action: "turn_left" },
      { condition: "blue", action: "move_forward" }
    ],
    explanation: "Two rules active simultaneously. Red triggers left turn, blue triggers extra forward. Robot must handle both conditions."
  },
  {
    id: "cm6",
    title: "Right Turn Signal",
    description: "Yellow means turn right toward the goal.",
    grid: [
      ["empty", "yellow", "empty"],
      ["empty", "empty", "empty"],
      ["empty", "empty", "green"]
    ],
    robotStart: [0, 0],
    robotDir: "E",
    goal: [2, 2],
    requiredRules: [{ condition: "yellow", action: "turn_right" }],
    explanation: "Conditional turns based on surface color are fundamental to line-following and AGV navigation systems."
  },
  {
    id: "cm7",
    title: "Color Maze Advanced",
    description: "Red=left, green=right. Navigate without hitting walls.",
    grid: [
      ["empty", "red", "empty", "empty"],
      ["empty", "empty", "green", "empty"],
      ["empty", "empty", "empty", "empty"],
      ["empty", "empty", "empty", "blue"]
    ],
    robotStart: [0, 0],
    robotDir: "E",
    goal: [3, 3],
    requiredRules: [
      { condition: "red", action: "turn_left" },
      { condition: "green", action: "turn_right" }
    ],
    explanation: "Advanced: Two directional rules. Red turns left, green turns right. Blue ends movement. Complex conditional navigation."
  },
  {
    id: "cm8",
    title: "Full Instruction Set",
    description: "All four colors each encode a different instruction.",
    grid: [
      ["red", "empty", "blue"],
      ["empty", "yellow", "empty"],
      ["empty", "green", "empty"]
    ],
    robotStart: [0, 0],
    robotDir: "E",
    goal: [1, 2],
    requiredRules: [
      { condition: "red", action: "turn_right" },
      { condition: "blue", action: "turn_left" },
      { condition: "yellow", action: "stop" },
      { condition: "green", action: "move_forward" }
    ],
    explanation: "Full color-coded instruction set. Each color maps to one robot action — the basis for all visual navigation systems."
  }
];
function BlockCodeCommanderGame({ config, onGameEnd }) {
  const maze = MAZES[config.difficulty];
  const available = AVAILABLE[config.difficulty];
  const [program, setProgram] = reactExports.useState([]);
  const [dragging, setDragging] = reactExports.useState(null);
  const [robotPos, setRobotPos] = reactExports.useState([
    maze.start[0],
    maze.start[1],
    maze.startDir
  ]);
  const [running, setRunning] = reactExports.useState(false);
  const [score, setScore] = reactExports.useState(0);
  const [lives, setLives] = reactExports.useState(config.livesCount);
  const [gameStarted, setGameStarted] = reactExports.useState(false);
  const [success, setSuccess] = reactExports.useState(false);
  const [failed, setFailed] = reactExports.useState(false);
  const startTimeRef = reactExports.useRef(Date.now());
  const scoreRef = reactExports.useRef(score);
  scoreRef.current = score;
  const endGame = reactExports.useCallback(
    (completed) => {
      const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1e3);
      const acc = completed ? 90 + config.difficulty * 3 : Math.max(10, 100 - lives * 25);
      onGameEnd(
        buildResult(config, scoreRef.current, acc, timeSpent, completed)
      );
    },
    [config, onGameEnd, lives]
  );
  function handleDrop(e) {
    e.preventDefault();
    if (!dragging) return;
    const block = available.find((b) => b.id === dragging);
    if (block)
      setProgram((prev) => [
        ...prev,
        { ...block, id: `${block.id}-${Date.now()}` }
      ]);
    setDragging(null);
  }
  function handleRemove(id) {
    setProgram((prev) => prev.filter((b) => b.id !== id));
  }
  function handleRun() {
    if (running || !gameStarted) return;
    setRunning(true);
    setFailed(false);
    const path = executeProgram(program, maze);
    let step = 0;
    const interval = setInterval(() => {
      if (step >= path.length) {
        clearInterval(interval);
        setRunning(false);
        const [fx, fy] = [path[path.length - 1][0], path[path.length - 1][1]];
        if (fx === maze.goal[0] && fy === maze.goal[1]) {
          const efficiency = Math.max(0, 100 - program.length * 5);
          setScore((s) => s + (300 + efficiency) * config.difficulty);
          setSuccess(true);
          setTimeout(() => endGame(true), 2e3);
        } else {
          setFailed(true);
          setLives((l) => {
            const nl = l - 1;
            if (nl <= 0) setTimeout(() => endGame(false), 800);
            return nl;
          });
          setRobotPos([maze.start[0], maze.start[1], maze.startDir]);
        }
        return;
      }
      setRobotPos(path[step]);
      step++;
    }, 350);
  }
  const cellSize = Math.min(44, Math.floor(240 / maze.width));
  if (!gameStarted)
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "w-full h-full flex items-center justify-center",
        "data-ocid": "coding_robots.page",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            className: "glass-card rounded-2xl p-10 text-center max-w-md w-full",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Terminal, { className: "h-14 w-14 mx-auto mb-4 text-[#00f5ff]" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h2",
                {
                  className: "text-3xl font-black glow-cyan-text mb-3",
                  style: { fontFamily: "'Orbitron', sans-serif" },
                  children: "Block Code Commander"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-6 text-sm", children: "Drag code blocks to program your robot through the maze. Fewer blocks = higher efficiency score." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                GlowButton,
                {
                  variant: "primary",
                  size: "lg",
                  onClick: () => {
                    startTimeRef.current = Date.now();
                    setGameStarted(true);
                  },
                  "data-ocid": "coding_robots.start_button",
                  children: "Start Programming"
                }
              )
            ]
          }
        )
      }
    );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col gap-2",
      "data-ocid": "coding_robots.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-hud flex items-center justify-between gap-4 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-[#00f5ff]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Terminal, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-bold", children: score.toLocaleString() })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "text-xs font-bold",
              style: { fontFamily: "'Orbitron', sans-serif" },
              children: maze.title
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1", children: Array.from({ length: config.livesCount }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            Heart,
            {
              className: `h-4 w-4 ${i < lives ? "text-[#f43f5e] fill-[#f43f5e]" : "text-muted-foreground"}`
            },
            `h-${i}`
          )) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 flex-1 overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-40 shrink-0 flex flex-col gap-1.5 overflow-y-auto", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "text-xs uppercase tracking-widest text-muted-foreground",
                style: { fontFamily: "'Orbitron', sans-serif" },
                children: "Blocks"
              }
            ),
            available.map((block) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                draggable: true,
                onDragStart: () => setDragging(block.id),
                onDragEnd: () => setDragging(null),
                className: "px-2 py-1.5 rounded-lg border cursor-grab active:cursor-grabbing text-xs font-mono select-none hover:scale-105 transition-smooth",
                style: {
                  borderColor: `${block.color}50`,
                  backgroundColor: `${block.color}12`,
                  color: block.color
                },
                "data-ocid": `coding_robots.block.${block.id}`,
                children: block.label
              },
              block.id
            ))
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-2 overflow-hidden", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "relative",
                style: {
                  display: "grid",
                  gridTemplateColumns: `repeat(${maze.width}, ${cellSize}px)`,
                  gridTemplateRows: `repeat(${maze.height}, ${cellSize}px)`,
                  gap: 2
                },
                children: maze.grid.flatMap(
                  (row, ry) => row.map((cell, rx) => {
                    const isRobot = robotPos[0] === rx && robotPos[1] === ry;
                    const isGoal = maze.goal[0] === rx && maze.goal[1] === ry;
                    const isStart = maze.start[0] === rx && maze.start[1] === ry;
                    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        className: `rounded flex items-center justify-center text-xs font-bold transition-all ${cell === "wall" ? "bg-card border border-border/40" : isGoal ? "bg-[#10b981]/20 border border-[#10b981]" : isStart ? "bg-[#00f5ff]/10 border border-[#00f5ff]/30" : "bg-muted/30 border border-border/20"}`,
                        style: { width: cellSize, height: cellSize },
                        children: [
                          cell === "wall" ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full bg-border/60 rounded" }) : null,
                          isGoal && !isRobot ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-3 h-3 rounded-full bg-[#10b981]" }) : null,
                          isRobot ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                            motion.div,
                            {
                              initial: { scale: 0.6 },
                              animate: { scale: 1 },
                              className: "font-black",
                              style: {
                                color: success ? "#10b981" : "#00f5ff",
                                fontSize: cellSize * 0.55,
                                lineHeight: 1
                              },
                              children: DIR_ARROW[robotPos[2]]
                            },
                            `${robotPos[0]}-${robotPos[1]}`
                          ) : null
                        ]
                      },
                      `${rx}-${ry}`
                    );
                  })
                )
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                onDragOver: (e) => e.preventDefault(),
                onDrop: handleDrop,
                className: `min-h-[64px] rounded-xl border-2 border-dashed p-2 flex flex-wrap gap-1.5 transition-smooth ${dragging ? "border-[#00f5ff]/60 bg-[#00f5ff]/5" : "border-border/30"}`,
                "data-ocid": "coding_robots.program_zone",
                children: program.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground self-center mx-auto", children: "Drop code blocks here" }) : program.map((block, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  motion.div,
                  {
                    initial: { scale: 0.8 },
                    animate: { scale: 1 },
                    className: "px-2 py-1 rounded border text-xs font-mono flex items-center gap-1",
                    style: {
                      borderColor: `${block.color}50`,
                      backgroundColor: `${block.color}15`,
                      color: block.color
                    },
                    "data-ocid": `coding_robots.placed.${i + 1}`,
                    children: [
                      block.label,
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          onClick: () => handleRemove(block.id),
                          className: "text-muted-foreground hover:text-[#f43f5e] ml-1",
                          "aria-label": "Remove",
                          children: "x"
                        }
                      )
                    ]
                  },
                  block.id
                ))
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                GlowButton,
                {
                  variant: "primary",
                  size: "sm",
                  onClick: handleRun,
                  disabled: program.length === 0 || running || success,
                  "data-ocid": "coding_robots.run_button",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "h-3 w-3" }),
                    " Run"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                GlowButton,
                {
                  variant: "ghost",
                  size: "sm",
                  onClick: () => {
                    setProgram([]);
                    setFailed(false);
                    setRobotPos([maze.start[0], maze.start[1], maze.startDir]);
                  },
                  "data-ocid": "coding_robots.reset_button",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "h-3 w-3" }),
                    " Reset"
                  ]
                }
              ),
              failed && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-[#f43f5e] self-center", children: "Robot didn't reach goal — adjust program" }),
              success && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-[#10b981] self-center", children: "Goal reached!" })
            ] })
          ] })
        ] })
      ]
    }
  );
}
function SequenceDebuggerGame({ config, onGameEnd }) {
  const count = config.difficulty === 1 ? 3 : config.difficulty === 2 ? 5 : 8;
  const challenges = DEBUG_CHALLENGES.slice(0, count);
  const [idx, setIdx] = reactExports.useState(0);
  const [selected, setSelected] = reactExports.useState(null);
  const [answered, setAnswered] = reactExports.useState(false);
  const [score, setScore] = reactExports.useState(0);
  const [lives, setLives] = reactExports.useState(config.livesCount);
  const [correct, setCorrect] = reactExports.useState(0);
  const [total, setTotal] = reactExports.useState(0);
  const [gameStarted, setGameStarted] = reactExports.useState(false);
  const startTimeRef = reactExports.useRef(Date.now());
  const scoreRef = reactExports.useRef(score);
  scoreRef.current = score;
  const endGame = reactExports.useCallback(
    (completed) => {
      const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1e3);
      const acc = total > 0 ? correct / total * 100 : 0;
      onGameEnd(
        buildResult(config, scoreRef.current, acc, timeSpent, completed)
      );
    },
    [config, onGameEnd, correct, total]
  );
  const ch = challenges[idx];
  function handleAnswer(optIdx) {
    if (answered || !gameStarted) return;
    setSelected(optIdx);
    setAnswered(true);
    setTotal((t) => t + 1);
    if (ch.options[optIdx] === ch.correctBlock) {
      setScore((s) => s + 250 * config.difficulty);
      setCorrect((c) => c + 1);
    } else
      setLives((l) => {
        const nl = l - 1;
        if (nl <= 0) setTimeout(() => endGame(false), 1200);
        return nl;
      });
    setTimeout(() => {
      const n = idx + 1;
      if (n >= challenges.length) {
        endGame(true);
        return;
      }
      setIdx(n);
      setSelected(null);
      setAnswered(false);
    }, 2e3);
  }
  if (!gameStarted)
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "w-full h-full flex items-center justify-center",
        "data-ocid": "sequence_debugger.page",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            className: "glass-card rounded-2xl p-10 text-center max-w-md w-full",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Terminal,
                {
                  className: "h-14 w-14 mx-auto mb-4",
                  style: { color: "#f43f5e" }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h2",
                {
                  className: "text-3xl font-black mb-3",
                  style: { fontFamily: "'Orbitron', sans-serif", color: "#f43f5e" },
                  children: "Sequence Debugger"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-2 text-sm", children: "A buggy robot program is displayed. The robot reached the wrong destination. Find the incorrect block and select the correct replacement." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs mb-6", children: "The faulty block is highlighted. Choose the correct replacement from the options." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                GlowButton,
                {
                  variant: "primary",
                  size: "lg",
                  onClick: () => {
                    startTimeRef.current = Date.now();
                    setGameStarted(true);
                  },
                  "data-ocid": "sequence_debugger.start_button",
                  children: "Start Debugging"
                }
              )
            ]
          }
        )
      }
    );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col gap-3",
      "data-ocid": "sequence_debugger.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-hud flex items-center justify-between gap-4 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", style: { color: "#f43f5e" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Terminal, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-bold", children: score.toLocaleString() })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "span",
            {
              className: "text-xs font-bold",
              style: { fontFamily: "'Orbitron', sans-serif", color: "#f43f5e" },
              children: [
                "Bug ",
                idx + 1,
                "/",
                challenges.length
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1", children: Array.from({ length: config.livesCount }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            Heart,
            {
              className: `h-4 w-4 ${i < lives ? "text-[#f43f5e] fill-[#f43f5e]" : "text-muted-foreground"}`
            },
            `h-${i}`
          )) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, x: 30 },
            animate: { opacity: 1, x: 0 },
            exit: { opacity: 0, x: -30 },
            className: "flex flex-col gap-3 flex-1",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-xl p-3 shrink-0 border border-[#f43f5e]/30", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "text-xs font-bold mb-1",
                    style: { fontFamily: "'Orbitron', sans-serif", color: "#f43f5e" },
                    children: ch.title
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground", children: ch.description })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-xl p-3 shrink-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "text-xs text-muted-foreground mb-2",
                    style: { fontFamily: "'Orbitron', sans-serif" },
                    children: "ROBOT PROGRAM (1 BUG FOUND)"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-1", children: ch.buggyProgram.map((block, i) => {
                  const isBug = i === ch.buggyIndex;
                  const color = DBG_COLORS[block];
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      className: `flex items-center gap-3 rounded-lg px-3 py-2 border transition-all ${isBug ? "border-[#f43f5e] bg-[#f43f5e]/15 animate-pulse" : "border-border/30 bg-card/40"}`,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "span",
                          {
                            className: "text-xs font-bold tabular-nums w-5",
                            style: {
                              color: isBug ? "#f43f5e" : "#6b7280",
                              fontFamily: "'Orbitron', sans-serif"
                            },
                            children: i + 1
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "span",
                          {
                            className: "text-sm font-bold",
                            style: { color: isBug ? "#f43f5e" : color },
                            children: block
                          }
                        ),
                        isBug && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-auto text-xs text-[#f43f5e] font-bold", children: "BUG" })
                      ]
                    },
                    `prog-${i}`
                  );
                }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass-card rounded-xl p-3 shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-bold", children: [
                "Block #",
                ch.buggyIndex + 1,
                " is wrong. What should it be?"
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2 flex-1", children: ch.options.map((opt, i) => {
                const isCorrect = opt === ch.correctBlock;
                let bc = "border-border/30 hover:border-[#f43f5e]/40";
                if (answered) {
                  if (isCorrect) bc = "border-[#10b981] bg-[#10b981]/10";
                  else if (i === selected)
                    bc = "border-[#f43f5e] bg-[#f43f5e]/10";
                }
                return /* @__PURE__ */ jsxRuntimeExports.jsx(
                  motion.button,
                  {
                    type: "button",
                    whileHover: !answered ? { scale: 1.02 } : {},
                    whileTap: !answered ? { scale: 0.98 } : {},
                    onClick: () => handleAnswer(i),
                    disabled: answered,
                    className: `glass-card rounded-xl p-3 border text-sm font-bold cursor-pointer transition-all ${bc}`,
                    style: { color: DBG_COLORS[opt] },
                    "data-ocid": `sequence_debugger.option.${i + 1}`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                      answered && isCorrect && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-4 w-4 text-[#10b981] shrink-0" }),
                      answered && i === selected && !isCorrect && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-4 w-4 text-[#f43f5e] shrink-0" }),
                      opt
                    ] })
                  },
                  `opt-${i}`
                );
              }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: answered && /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.div,
                {
                  initial: { opacity: 0, height: 0 },
                  animate: { opacity: 1, height: "auto" },
                  exit: { opacity: 0 },
                  className: "glass-card rounded-xl p-3 shrink-0 border border-[#00f5ff]/30",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-[#00f5ff]", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold", children: "Fix: " }),
                    ch.explanation
                  ] })
                }
              ) })
            ]
          },
          ch.id
        ) })
      ]
    }
  );
}
function ConditionalCoderGame({ config, onGameEnd }) {
  const count = config.difficulty === 1 ? 3 : config.difficulty === 2 ? 5 : 8;
  const mazes = COND_MAZES.slice(0, count);
  const [mazeIdx, setMazeIdx] = reactExports.useState(0);
  const [selectedActions, setSelectedActions] = reactExports.useState({});
  const [submitted, setSubmitted] = reactExports.useState(false);
  const [result, setResult] = reactExports.useState(null);
  const [score, setScore] = reactExports.useState(0);
  const [correct, setCorrect] = reactExports.useState(0);
  const [gameStarted, setGameStarted] = reactExports.useState(false);
  const startTimeRef = reactExports.useRef(Date.now());
  const scoreRef = reactExports.useRef(score);
  scoreRef.current = score;
  const endGame = reactExports.useCallback(
    (completed) => {
      const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1e3);
      const acc = correct / mazes.length * 100;
      onGameEnd(
        buildResult(config, scoreRef.current, acc, timeSpent, completed)
      );
    },
    [config, onGameEnd, correct, mazes.length]
  );
  const m = mazes[mazeIdx];
  function handleActionSelect(color, action) {
    if (submitted) return;
    setSelectedActions((prev) => ({ ...prev, [color]: action }));
  }
  function handleSubmit() {
    if (submitted) return;
    const ok = m.requiredRules.every(
      (rule) => selectedActions[rule.condition] === rule.action
    );
    setSubmitted(true);
    setResult(ok);
    if (ok) {
      setScore((s) => s + 300 * config.difficulty);
      setCorrect((c) => c + 1);
    }
    setTimeout(() => {
      const n = mazeIdx + 1;
      if (n >= mazes.length) {
        endGame(true);
        return;
      }
      setMazeIdx(n);
      setSelectedActions({});
      setSubmitted(false);
      setResult(null);
    }, 2e3);
  }
  const colorsInMaze = Array.from(
    new Set(m.grid.flat().filter((c) => c !== "empty" && c !== "green"))
  );
  const allMapped = m.requiredRules.every((r) => selectedActions[r.condition]);
  if (!gameStarted)
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "w-full h-full flex items-center justify-center",
        "data-ocid": "conditional_coder.page",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            className: "glass-card rounded-2xl p-10 text-center max-w-md w-full",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Terminal,
                {
                  className: "h-14 w-14 mx-auto mb-4",
                  style: { color: "#7c3aed" }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h2",
                {
                  className: "text-3xl font-black mb-3",
                  style: { fontFamily: "'Orbitron', sans-serif", color: "#7c3aed" },
                  children: "Conditional Coder"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-2 text-sm", children: "A maze is shown with colored tiles. Map each color to a robot action using IF-THEN rules. The robot automatically executes rules when it steps on colored tiles." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs mb-6", children: "Assign correct action to each tile color. Green = goal. Map colors before starting." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                GlowButton,
                {
                  variant: "primary",
                  size: "lg",
                  onClick: () => {
                    startTimeRef.current = Date.now();
                    setGameStarted(true);
                  },
                  "data-ocid": "conditional_coder.start_button",
                  children: "Start Coding"
                }
              )
            ]
          }
        )
      }
    );
  const cellSize = 52;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col gap-3",
      "data-ocid": "conditional_coder.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-hud flex items-center justify-between gap-4 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", style: { color: "#7c3aed" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Terminal, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-bold", children: score.toLocaleString() })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "span",
            {
              className: "text-xs font-bold",
              style: { fontFamily: "'Orbitron', sans-serif", color: "#7c3aed" },
              children: [
                "Maze ",
                mazeIdx + 1,
                "/",
                mazes.length
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
            "Solved: ",
            correct,
            "/",
            mazes.length
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-xl p-3 shrink-0 border border-[#7c3aed]/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-xs font-bold mb-1",
              style: { fontFamily: "'Orbitron', sans-serif", color: "#7c3aed" },
              children: m.title
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground", children: m.description })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            style: {
              display: "grid",
              gridTemplateColumns: `repeat(${m.grid[0].length}, ${cellSize}px)`,
              gap: 3
            },
            children: m.grid.flatMap(
              (row, ry) => row.map((cell, rx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "rounded-lg flex items-center justify-center border-2 text-xs font-bold",
                  style: {
                    width: cellSize,
                    height: cellSize,
                    backgroundColor: TILE_COLORS[cell],
                    borderColor: cell === "green" ? "#10b981" : cell === "empty" ? "#374151" : TILE_COLORS[cell],
                    opacity: cell === "empty" ? 0.4 : 1
                  },
                  children: [
                    cell === "green" && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "text-[#000] font-black",
                        style: {
                          fontFamily: "'Orbitron', sans-serif",
                          fontSize: "8px"
                        },
                        children: "GOAL"
                      }
                    ),
                    rx === m.robotStart[0] && ry === m.robotStart[1] && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "text-foreground font-black",
                        style: {
                          fontFamily: "'Orbitron', sans-serif",
                          fontSize: "10px"
                        },
                        children: "R"
                      }
                    )
                  ]
                },
                `${rx}-${ry}`
              ))
            )
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-xs text-muted-foreground mb-2",
              style: { fontFamily: "'Orbitron', sans-serif" },
              children: "MAP TILE COLORS TO ACTIONS"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-2", children: colorsInMaze.map((tileColor) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "w-8 h-8 rounded-lg border-2 flex-shrink-0",
                style: {
                  backgroundColor: TILE_COLORS[tileColor],
                  borderColor: TILE_COLORS[tileColor]
                }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "text-xs font-bold w-16 capitalize",
                style: { color: TILE_COLORS[tileColor] },
                children: tileColor
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 flex-wrap", children: ["turn_left", "move_forward", "turn_right", "stop"].map((action) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.button,
              {
                type: "button",
                whileHover: { scale: 1.04 },
                whileTap: { scale: 0.96 },
                onClick: () => handleActionSelect(tileColor, action),
                className: "rounded-lg border px-2 py-1 text-xs font-bold transition-all",
                style: {
                  borderColor: selectedActions[tileColor] === action ? ACTION_COLORS[action] : `${ACTION_COLORS[action]}40`,
                  backgroundColor: selectedActions[tileColor] === action ? `${ACTION_COLORS[action]}20` : "transparent",
                  color: ACTION_COLORS[action]
                },
                "data-ocid": `conditional_coder.rule.${tileColor}.${action}`,
                children: ACTION_LABELS[action]
              },
              action
            )) })
          ] }, tileColor)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: submitted && result !== null && /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, y: 8 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0 },
            className: `rounded-xl p-3 border shrink-0 ${result ? "border-[#10b981] bg-[#10b981]/10" : "border-[#f43f5e] bg-[#f43f5e]/10"}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "p",
              {
                className: "text-xs",
                style: { color: result ? "#10b981" : "#f43f5e" },
                children: [
                  result ? "Correct rule mapping! " : "Wrong rule set. Review requirements. ",
                  m.explanation
                ]
              }
            )
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          GlowButton,
          {
            variant: "primary",
            size: "sm",
            onClick: handleSubmit,
            disabled: !allMapped || submitted,
            "data-ocid": "conditional_coder.submit_button",
            children: "Test Rules"
          }
        )
      ]
    }
  );
}
function CodingRobots(props) {
  switch (props.config.gameId) {
    case "sequence-debugger":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(SequenceDebuggerGame, { ...props });
    case "conditional-coder":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(ConditionalCoderGame, { ...props });
    default:
      return /* @__PURE__ */ jsxRuntimeExports.jsx(BlockCodeCommanderGame, { ...props });
  }
}
export {
  CodingRobots as default
};
