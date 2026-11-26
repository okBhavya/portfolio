"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Flame,
  Layers,
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  SlidersHorizontal,
  Trophy,
  Volume2,
  VolumeX,
} from "lucide-react";

type GameStatus = "start" | "playing" | "paused" | "gameover";

type PieceKind =
  | "I"
  | "O"
  | "T"
  | "S"
  | "Z"
  | "J"
  | "L"
  | "X5"
  | "U5"
  | "P5"
  | "T5";

type CellValue = PieceKind | "GARBAGE" | null;

type PresetId = "classic-hard" | "blind" | "garbage" | "overclock";

interface GameRules {
  presetId: PresetId | "custom";
  startLevel: 3 | 5 | 8 | 10;
  ghostEnabled: boolean;
  holdEnabled: boolean;
  garbageIntervalSec: 0 | 16 | 10;
  initialGarbageRows: number;
  pentominoesEnabled: boolean;
}

interface ActivePiece {
  kind: PieceKind;
  matrix: number[][];
  row: number;
  col: number;
  rotState: number;
}

interface HudSnapshot {
  score: number;
  bestScore: number;
  level: number;
  lines: number;
  combo: number;
  maxCombo: number;
  holdPiece: PieceKind | null;
  canHold: boolean;
  nextQueue: PieceKind[];
  garbageProgress: number;
  lastCallout: string;
  gameOverReason: string;
}

const COLS = 10;
const ROWS = 20;
const CELL = 26;
const BOARD_W = COLS * CELL;
const BOARD_H = ROWS * CELL;
const MAX_LOCK_RESETS = 8;
const LOCK_DELAY_MS = 420;
const BEST_SCORE_KEY = "bhavya-hard-tetris-best-v1";
const BEST_SCORE_EVENT = "bhavya-hard-tetris-best-change";

const STANDARD_KINDS: PieceKind[] = ["I", "O", "T", "S", "Z", "J", "L"];
const PENTOMINO_KINDS: PieceKind[] = ["X5", "U5", "P5", "T5"];

const PIECE_SHAPES: Record<PieceKind, number[][]> = {
  I: [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  O: [
    [1, 1],
    [1, 1],
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
  ],
  J: [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0],
  ],
  X5: [
    [0, 1, 0],
    [1, 1, 1],
    [0, 1, 0],
  ],
  U5: [
    [1, 0, 1],
    [1, 1, 1],
    [0, 0, 0],
  ],
  P5: [
    [1, 1, 0],
    [1, 1, 0],
    [1, 0, 0],
  ],
  T5: [
    [1, 1, 1],
    [0, 1, 0],
    [0, 1, 0],
  ],
};

const PIECE_COLORS: Record<
  PieceKind | "GARBAGE",
  { fill: string; shade: string; glow: string }
> = {
  I: { fill: "#5CA3D6", shade: "#336E99", glow: "#A8D5F2" },
  O: { fill: "#E5B94C", shade: "#B38520", glow: "#FAE29C" },
  T: { fill: "#D96B27", shade: "#9E4612", glow: "#F5AC7A" },
  S: { fill: "#48AD86", shade: "#226F53", glow: "#8CE0BF" },
  Z: { fill: "#D94F4F", shade: "#962B2B", glow: "#F39A9A" },
  J: { fill: "#6D84E3", shade: "#3E52A8", glow: "#AEBDF7" },
  L: { fill: "#EA8F3D", shade: "#A85D1B", glow: "#F7C390" },
  X5: { fill: "#C95DA8", shade: "#8A3370", glow: "#EDA6D7" },
  U5: { fill: "#3EA39D", shade: "#206B66", glow: "#89DCD6" },
  P5: { fill: "#C2A14D", shade: "#866A23", glow: "#EBDA9E" },
  T5: { fill: "#E06A6A", shade: "#9C3737", glow: "#F6AAAA" },
  GARBAGE: { fill: "#5F6B7A", shade: "#3B4450", glow: "#8B98A8" },
};

const PRESETS: Record<
  PresetId,
  { label: string; description: string; rules: GameRules }
> = {
  "classic-hard": {
    label: "Hard Classic",
    description: "Starts Lv 5 with strict 420ms lock delay & fast speed ramp.",
    rules: {
      presetId: "classic-hard",
      startLevel: 5,
      ghostEnabled: true,
      holdEnabled: true,
      garbageIntervalSec: 0,
      initialGarbageRows: 0,
      pentominoesEnabled: false,
    },
  },
  blind: {
    label: "Blind Drop",
    description: "Zero landing shadow — pure column intuition at Lv 5 speed.",
    rules: {
      presetId: "blind",
      startLevel: 5,
      ghostEnabled: false,
      holdEnabled: true,
      garbageIntervalSec: 0,
      initialGarbageRows: 0,
      pentominoesEnabled: false,
    },
  },
  garbage: {
    label: "Garbage Surge",
    description: "3 junk rows at spawn + rising floor attacks every 10s.",
    rules: {
      presetId: "garbage",
      startLevel: 5,
      ghostEnabled: true,
      holdEnabled: true,
      garbageIntervalSec: 10,
      initialGarbageRows: 3,
      pentominoesEnabled: false,
    },
  },
  overclock: {
    label: "Chaos Pentomino",
    description: "Lv 8 speed, No Ghost, Hold disabled & 5-cell pentominoes.",
    rules: {
      presetId: "overclock",
      startLevel: 8,
      ghostEnabled: false,
      holdEnabled: false,
      garbageIntervalSec: 10,
      initialGarbageRows: 2,
      pentominoesEnabled: true,
    },
  },
};

function readBestScore(): number {
  try {
    const saved = window.localStorage.getItem(BEST_SCORE_KEY);
    const parsed = saved ? Number.parseInt(saved, 10) : 0;
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
  } catch {
    return 0;
  }
}

function subscribeBestScore(callback: () => void): () => void {
  window.addEventListener("storage", callback);
  window.addEventListener(BEST_SCORE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(BEST_SCORE_EVENT, callback);
  };
}

function createEmptyBoard(): CellValue[][] {
  return Array.from({ length: ROWS }, () => Array<CellValue>(COLS).fill(null));
}

function createGarbageRow(holeCol?: number): CellValue[] {
  const hole =
    holeCol !== undefined ? holeCol : Math.floor(Math.random() * COLS);
  return Array.from({ length: COLS }, (_, c) =>
    c === hole ? null : "GARBAGE"
  );
}

function cloneMatrix(m: number[][]): number[][] {
  return m.map((row) => [...row]);
}

function rotateMatrix(matrix: number[][], dir: 1 | -1): number[][] {
  const n = matrix.length;
  const out = Array.from({ length: n }, () => Array<number>(n).fill(0));
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (dir === 1) {
        out[c][n - 1 - r] = matrix[r][c];
      } else {
        out[n - 1 - c][r] = matrix[r][c];
      }
    }
  }
  return out;
}

function generateBag(pentominoesEnabled: boolean): PieceKind[] {
  const pool: PieceKind[] = [...STANDARD_KINDS];
  if (pentominoesEnabled) {
    const extraCount = 2;
    for (let i = 0; i < extraCount; i++) {
      pool.push(
        PENTOMINO_KINDS[Math.floor(Math.random() * PENTOMINO_KINDS.length)]
      );
    }
  }
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool;
}

function getDropIntervalMs(level: number): number {
  return Math.max(55, Math.round(620 * Math.pow(0.83, level - 1)));
}

function computeRuleMultiplier(rules: GameRules): number {
  let mult = 1.0;
  if (rules.startLevel >= 10) mult += 0.35;
  else if (rules.startLevel >= 8) mult += 0.2;
  else if (rules.startLevel <= 3) mult -= 0.1;

  if (!rules.ghostEnabled) mult += 0.25;
  if (!rules.holdEnabled) mult += 0.2;
  if (rules.garbageIntervalSec === 10) mult += 0.45;
  else if (rules.garbageIntervalSec === 16) mult += 0.2;
  if (rules.pentominoesEnabled) mult += 0.4;

  return Math.max(0.9, Math.round(mult * 100) / 100);
}

function MiniPiecePreview({ kind }: { kind: PieceKind | null }) {
  if (!kind) {
    return (
      <div className="flex h-12 w-full items-center justify-center font-mono-tech text-[10px] text-[#9BA6B8]">
        EMPTY
      </div>
    );
  }

  const shape = PIECE_SHAPES[kind];
  const color = PIECE_COLORS[kind];
  const n = shape.length;

  return (
    <div
      role="img"
      className="mx-auto grid gap-[2px]"
      style={{
        gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))`,
        width: `${n * 11}px`,
      }}
      aria-label={`Piece ${kind}`}
    >
      {shape.flatMap((row, r) =>
        row.map((cell, c) => (
          <span
            key={`${r}-${c}`}
            className="block h-[9px] w-[9px] rounded-[2px]"
            style={
              cell
                ? {
                    backgroundColor: color.fill,
                    borderTop: `1.5px solid ${color.glow}`,
                    borderBottom: `1.5px solid ${color.shade}`,
                  }
                : { backgroundColor: "transparent" }
            }
          />
        ))
      )}
    </div>
  );
}

export function HardTetrisGame() {
  const cabinetRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  const [rules, setRules] = useState<GameRules>(PRESETS["classic-hard"].rules);
  const rulesRef = useRef<GameRules>(PRESETS["classic-hard"].rules);

  const [status, setStatus] = useState<GameStatus>("start");
  const statusRef = useRef<GameStatus>("start");

  const [muted, setMuted] = useState<boolean>(false);
  const mutedRef = useRef<boolean>(false);

  const storedBest = useSyncExternalStore(
    subscribeBestScore,
    readBestScore,
    () => 0
  );

  const boardRef = useRef<CellValue[][]>(createEmptyBoard());
  const bagRef = useRef<PieceKind[]>([]);
  const nextQueueRef = useRef<PieceKind[]>(["T", "I", "L"]);
  const activeRef = useRef<ActivePiece | null>(null);
  const holdRef = useRef<PieceKind | null>(null);
  const canHoldRef = useRef<boolean>(true);

  const scoreRef = useRef<number>(0);
  const levelRef = useRef<number>(5);
  const linesRef = useRef<number>(0);
  const comboRef = useRef<number>(-1);
  const maxComboRef = useRef<number>(0);
  const lockTimerRef = useRef<number>(0);
  const lockResetsRef = useRef<number>(0);
  const dropAccRef = useRef<number>(0);
  const garbageAccRef = useRef<number>(0);
  const flashRowsRef = useRef<{ rows: number[]; ttlMs: number } | null>(null);
  const shakeMsRef = useRef<number>(0);
  const calloutRef = useRef<string>("Ready");
  const gameOverReasonRef = useRef<string>("");

  const [hud, setHud] = useState<HudSnapshot>({
    score: 0,
    bestScore: 0,
    level: rules.startLevel,
    lines: 0,
    combo: 0,
    maxCombo: 0,
    holdPiece: null,
    canHold: true,
    nextQueue: ["T", "I", "L"],
    garbageProgress: 0,
    lastCallout: "Configure rules & press Start",
    gameOverReason: "",
  });

  const ruleMultiplier = useMemo(() => computeRuleMultiplier(rules), [rules]);

  useEffect(() => {
    mutedRef.current = muted;
  }, [muted]);

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  useEffect(() => {
    rulesRef.current = rules;
  }, [rules]);

  const playSfx = useCallback(
    (
      kind:
        | "move"
        | "rotate"
        | "drop"
        | "clear"
        | "tetris"
        | "garbage"
        | "gameover"
    ) => {
      if (mutedRef.current || typeof window === "undefined") return;
      try {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext?: typeof AudioContext })
            .webkitAudioContext;
        if (!AudioCtx) return;
        if (!audioCtxRef.current) {
          audioCtxRef.current = new AudioCtx();
        }
        const ctx = audioCtxRef.current;
        if (ctx.state === "suspended") {
          void ctx.resume();
        }
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        if (kind === "move") {
          osc.type = "triangle";
          osc.frequency.setValueAtTime(240, now);
          gain.gain.setValueAtTime(0.03, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
          osc.start(now);
          osc.stop(now + 0.04);
        } else if (kind === "rotate") {
          osc.type = "sine";
          osc.frequency.setValueAtTime(420, now);
          osc.frequency.exponentialRampToValueAtTime(560, now + 0.06);
          gain.gain.setValueAtTime(0.04, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.065);
          osc.start(now);
          osc.stop(now + 0.065);
        } else if (kind === "drop") {
          osc.type = "square";
          osc.frequency.setValueAtTime(140, now);
          osc.frequency.exponentialRampToValueAtTime(68, now + 0.09);
          gain.gain.setValueAtTime(0.06, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
          osc.start(now);
          osc.stop(now + 0.09);
        } else if (kind === "clear") {
          osc.type = "triangle";
          osc.frequency.setValueAtTime(480, now);
          osc.frequency.exponentialRampToValueAtTime(760, now + 0.14);
          gain.gain.setValueAtTime(0.07, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
          osc.start(now);
          osc.stop(now + 0.15);
        } else if (kind === "tetris") {
          osc.type = "sawtooth";
          osc.frequency.setValueAtTime(523, now);
          osc.frequency.setValueAtTime(659, now + 0.07);
          osc.frequency.setValueAtTime(784, now + 0.14);
          osc.frequency.setValueAtTime(1046, now + 0.21);
          gain.gain.setValueAtTime(0.07, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.34);
          osc.start(now);
          osc.stop(now + 0.34);
        } else if (kind === "garbage") {
          osc.type = "sawtooth";
          osc.frequency.setValueAtTime(115, now);
          osc.frequency.linearRampToValueAtTime(85, now + 0.14);
          gain.gain.setValueAtTime(0.06, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
          osc.start(now);
          osc.stop(now + 0.15);
        } else {
          osc.type = "sawtooth";
          osc.frequency.setValueAtTime(220, now);
          osc.frequency.exponentialRampToValueAtTime(72, now + 0.32);
          gain.gain.setValueAtTime(0.08, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.34);
          osc.start(now);
          osc.stop(now + 0.34);
        }
      } catch {
        // Audio optional when restricted by browser policy.
      }
    },
    []
  );

  const syncHud = useCallback(() => {
    const r = rulesRef.current;
    const gRatio =
      r.garbageIntervalSec > 0
        ? Math.min(1, garbageAccRef.current / (r.garbageIntervalSec * 1000))
        : 0;
    const best = Math.max(scoreRef.current, readBestScore());
    setHud({
      score: scoreRef.current,
      bestScore: best,
      level: levelRef.current,
      lines: linesRef.current,
      combo: Math.max(0, comboRef.current),
      maxCombo: maxComboRef.current,
      holdPiece: holdRef.current,
      canHold: canHoldRef.current,
      nextQueue: [...nextQueueRef.current],
      garbageProgress: gRatio,
      lastCallout: calloutRef.current,
      gameOverReason: gameOverReasonRef.current,
    });
  }, []);

  const canPlace = useCallback(
    (
      matrix: number[][],
      targetRow: number,
      targetCol: number,
      board: CellValue[][] = boardRef.current
    ): boolean => {
      for (let r = 0; r < matrix.length; r++) {
        for (let c = 0; c < matrix[r].length; c++) {
          if (!matrix[r][c]) continue;
          const br = targetRow + r;
          const bc = targetCol + c;
          if (bc < 0 || bc >= COLS || br >= ROWS) return false;
          if (br >= 0 && board[br][bc] !== null) return false;
        }
      }
      return true;
    },
    []
  );

  const refillQueue = useCallback((pentominoesEnabled: boolean) => {
    while (nextQueueRef.current.length < 4) {
      if (bagRef.current.length === 0) {
        bagRef.current = generateBag(pentominoesEnabled);
      }
      const next = bagRef.current.shift();
      if (next) nextQueueRef.current.push(next);
    }
  }, []);

  const triggerGameOver = useCallback(
    (reason: string) => {
      gameOverReasonRef.current = reason;
      calloutRef.current = "Topped Out";
      statusRef.current = "gameover";
      setStatus("gameover");
      playSfx("gameover");

      try {
        const currentBest = readBestScore();
        if (scoreRef.current > currentBest) {
          window.localStorage.setItem(BEST_SCORE_KEY, String(scoreRef.current));
          window.dispatchEvent(new Event(BEST_SCORE_EVENT));
        }
      } catch {
        // Ignore restricted storage.
      }
      syncHud();
    },
    [playSfx, syncHud]
  );

  const spawnPiece = useCallback(
    (specificKind?: PieceKind): boolean => {
      const r = rulesRef.current;
      let kind: PieceKind;
      if (specificKind) {
        kind = specificKind;
      } else {
        refillQueue(r.pentominoesEnabled);
        kind = nextQueueRef.current.shift() ?? "T";
        refillQueue(r.pentominoesEnabled);
      }

      const matrix = cloneMatrix(PIECE_SHAPES[kind]);
      const col = Math.floor((COLS - matrix[0].length) / 2);
      const row = kind === "I" ? -1 : 0;

      if (!canPlace(matrix, row, col)) {
        if (canPlace(matrix, row - 1, col)) {
          activeRef.current = { kind, matrix, row: row - 1, col, rotState: 0 };
        } else {
          activeRef.current = null;
          triggerGameOver("Stack breached the spawn ceiling");
          return false;
        }
      } else {
        activeRef.current = { kind, matrix, row, col, rotState: 0 };
      }

      lockTimerRef.current = 0;
      lockResetsRef.current = 0;
      dropAccRef.current = 0;
      return true;
    },
    [canPlace, refillQueue, triggerGameOver]
  );

  const lockActivePiece = useCallback(() => {
    const piece = activeRef.current;
    if (!piece) return;

    let toppedOut = false;
    for (let r = 0; r < piece.matrix.length; r++) {
      for (let c = 0; c < piece.matrix[r].length; c++) {
        if (!piece.matrix[r][c]) continue;
        const br = piece.row + r;
        const bc = piece.col + c;
        if (br < 0) {
          toppedOut = true;
        } else if (br < ROWS && bc >= 0 && bc < COLS) {
          boardRef.current[br][bc] = piece.kind;
        }
      }
    }

    if (toppedOut) {
      triggerGameOver("Piece locked above the top boundary");
      return;
    }

    const fullRows: number[] = [];
    for (let r = 0; r < ROWS; r++) {
      if (boardRef.current[r].every((cell) => cell !== null)) {
        fullRows.push(r);
      }
    }

    const mult = computeRuleMultiplier(rulesRef.current);

    if (fullRows.length > 0) {
      flashRowsRef.current = { rows: fullRows, ttlMs: 110 };
      const cleared = fullRows.length;
      const basePoints = [0, 100, 300, 500, 800, 1200][Math.min(5, cleared)];
      comboRef.current += 1;
      maxComboRef.current = Math.max(maxComboRef.current, comboRef.current);
      const comboBonus = comboRef.current > 0 ? comboRef.current * 50 : 0;

      const gained = Math.round(
        (basePoints * levelRef.current + comboBonus) * mult
      );
      scoreRef.current += gained;
      linesRef.current += cleared;
      levelRef.current = Math.min(
        18,
        rulesRef.current.startLevel + Math.floor(linesRef.current / 8)
      );

      if (cleared >= 4) {
        calloutRef.current = `TETRIS x${mult} (+${gained})`;
        shakeMsRef.current = 160;
        playSfx("tetris");
      } else {
        calloutRef.current = `${
          cleared === 3 ? "TRIPLE" : cleared === 2 ? "DOUBLE" : "CLEAR"
        }${comboRef.current > 0 ? ` · ${comboRef.current + 1}x COMBO` : ""}`;
        playSfx("clear");
      }

      for (const rowIndex of fullRows.sort((a, b) => a - b)) {
        boardRef.current.splice(rowIndex, 1);
        boardRef.current.unshift(Array<CellValue>(COLS).fill(null));
      }
    } else {
      comboRef.current = -1;
      scoreRef.current += Math.round(4 * mult);
    }

    try {
      const currentBest = readBestScore();
      if (scoreRef.current > currentBest) {
        window.localStorage.setItem(BEST_SCORE_KEY, String(scoreRef.current));
        window.dispatchEvent(new Event(BEST_SCORE_EVENT));
      }
    } catch {
      // Ignore storage error.
    }

    canHoldRef.current = true;
    spawnPiece();
    syncHud();
  }, [playSfx, spawnPiece, syncHud, triggerGameOver]);

  const pushGarbageRow = useCallback(() => {
    const topHasBlocks = boardRef.current[0].some((cell) => cell !== null);
    boardRef.current.shift();
    boardRef.current.push(createGarbageRow());
    if (activeRef.current) {
      activeRef.current.row -= 1;
      if (!canPlace(activeRef.current.matrix, activeRef.current.row, activeRef.current.col)) {
        activeRef.current.row -= 1;
      }
    }
    shakeMsRef.current = 130;
    calloutRef.current = "Garbage Surge +1 Row!";
    playSfx("garbage");

    if (topHasBlocks) {
      triggerGameOver("Rising garbage pushed stack above ceiling");
      return;
    }
    syncHud();
  }, [canPlace, playSfx, syncHud, triggerGameOver]);

  const startGame = useCallback(
    (overrideRules?: GameRules) => {
      const activeRules = overrideRules ?? rulesRef.current;
      rulesRef.current = activeRules;

      const freshBoard = createEmptyBoard();
      let prevHole = Math.floor(Math.random() * COLS);
      for (let i = 0; i < activeRules.initialGarbageRows; i++) {
        freshBoard.shift();
        const nextHole =
          (prevHole + 1 + Math.floor(Math.random() * (COLS - 2))) % COLS;
        prevHole = nextHole;
        freshBoard.push(createGarbageRow(nextHole));
      }

      boardRef.current = freshBoard;
      bagRef.current = generateBag(activeRules.pentominoesEnabled);
      nextQueueRef.current = [];
      refillQueue(activeRules.pentominoesEnabled);
      activeRef.current = null;
      holdRef.current = null;
      canHoldRef.current = true;
      scoreRef.current = 0;
      levelRef.current = activeRules.startLevel;
      linesRef.current = 0;
      comboRef.current = -1;
      maxComboRef.current = 0;
      lockTimerRef.current = 0;
      lockResetsRef.current = 0;
      dropAccRef.current = 0;
      garbageAccRef.current = 0;
      flashRowsRef.current = null;
      shakeMsRef.current = 0;
      calloutRef.current = `${activeRules.pentominoesEnabled ? "Pentomino" : "Hard"} Run Started!`;
      gameOverReasonRef.current = "";

      statusRef.current = "playing";
      setStatus("playing");
      spawnPiece();
      lastTimeRef.current = performance.now();
      syncHud();
    },
    [refillQueue, spawnPiece, syncHud]
  );

  const selectPreset = (presetId: PresetId) => {
    const presetRules = PRESETS[presetId].rules;
    setRules(presetRules);
    rulesRef.current = presetRules;
    if (statusRef.current === "playing" || statusRef.current === "paused") {
      startGame(presetRules);
    } else {
      levelRef.current = presetRules.startLevel;
      calloutRef.current = `${PRESETS[presetId].label} preset armed`;
      syncHud();
    }
  };

  const updateCustomRule = <K extends keyof GameRules>(
    key: K,
    value: GameRules[K]
  ) => {
    const updated: GameRules = {
      ...rulesRef.current,
      presetId: "custom",
      [key]: value,
    };
    setRules(updated);
    rulesRef.current = updated;
    if (statusRef.current === "playing" || statusRef.current === "paused") {
      startGame(updated);
    } else {
      levelRef.current = updated.startLevel;
      calloutRef.current = "Custom rule armed";
      syncHud();
    }
  };

  const togglePause = useCallback(() => {
    if (statusRef.current === "playing") {
      statusRef.current = "paused";
      setStatus("paused");
    } else if (statusRef.current === "paused") {
      lastTimeRef.current = performance.now();
      statusRef.current = "playing";
      setStatus("playing");
    }
  }, []);

  const moveHorizontal = useCallback(
    (dx: -1 | 1) => {
      if (statusRef.current !== "playing" || !activeRef.current) return;
      const p = activeRef.current;
      if (canPlace(p.matrix, p.row, p.col + dx)) {
        p.col += dx;
        if (
          !canPlace(p.matrix, p.row + 1, p.col) &&
          lockResetsRef.current < MAX_LOCK_RESETS
        ) {
          lockTimerRef.current = 0;
          lockResetsRef.current += 1;
        }
        playSfx("move");
      }
    },
    [canPlace, playSfx]
  );

  const softDrop = useCallback(() => {
    if (statusRef.current !== "playing" || !activeRef.current) return;
    const p = activeRef.current;
    if (canPlace(p.matrix, p.row + 1, p.col)) {
      p.row += 1;
      dropAccRef.current = 0;
      scoreRef.current += 1;
      syncHud();
    } else {
      lockActivePiece();
    }
  }, [canPlace, lockActivePiece, syncHud]);

  const hardDrop = useCallback(() => {
    if (statusRef.current !== "playing" || !activeRef.current) return;
    const p = activeRef.current;
    let droppedRows = 0;
    while (canPlace(p.matrix, p.row + 1, p.col)) {
      p.row += 1;
      droppedRows += 1;
    }
    const mult = computeRuleMultiplier(rulesRef.current);
    scoreRef.current += Math.round(droppedRows * 2 * mult);
    shakeMsRef.current = Math.max(shakeMsRef.current, 60);
    playSfx("drop");
    lockActivePiece();
  }, [canPlace, lockActivePiece, playSfx]);

  const rotatePiece = useCallback(
    (dir: 1 | -1) => {
      if (statusRef.current !== "playing" || !activeRef.current) return;
      const p = activeRef.current;
      if (p.kind === "O") return;
      const rotated = rotateMatrix(p.matrix, dir);
      const kicks: [number, number][] = [
        [0, 0],
        [-1, 0],
        [1, 0],
        [0, -1],
        [-1, -1],
        [1, -1],
        [-2, 0],
        [2, 0],
        [0, -2],
      ];

      for (const [kc, kr] of kicks) {
        if (canPlace(rotated, p.row + kr, p.col + kc)) {
          p.matrix = rotated;
          p.col += kc;
          p.row += kr;
          p.rotState = (p.rotState + (dir === 1 ? 1 : 3)) % 4;
          if (
            !canPlace(p.matrix, p.row + 1, p.col) &&
            lockResetsRef.current < MAX_LOCK_RESETS
          ) {
            lockTimerRef.current = 0;
            lockResetsRef.current += 1;
          }
          playSfx("rotate");
          return;
        }
      }
    },
    [canPlace, playSfx]
  );

  const holdCurrentPiece = useCallback(() => {
    if (
      statusRef.current !== "playing" ||
      !rulesRef.current.holdEnabled ||
      !canHoldRef.current ||
      !activeRef.current
    ) {
      return;
    }

    const currentKind = activeRef.current.kind;
    const previousHold = holdRef.current;
    holdRef.current = currentKind;
    canHoldRef.current = false;

    if (previousHold) {
      spawnPiece(previousHold);
    } else {
      spawnPiece();
    }
    playSfx("rotate");
    calloutRef.current = `Held ${currentKind}`;
    syncHud();
  }, [playSfx, spawnPiece, syncHud]);

  // Keyboard bindings
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT")
      ) {
        return;
      }

      if (e.code === "KeyP" && (statusRef.current === "playing" || statusRef.current === "paused")) {
        e.preventDefault();
        togglePause();
        return;
      }

      if (e.code === "KeyR" && statusRef.current !== "start") {
        e.preventDefault();
        startGame();
        return;
      }

      if (statusRef.current !== "playing") return;

      if (
        e.code === "ArrowLeft" ||
        e.code === "ArrowRight" ||
        e.code === "ArrowDown" ||
        e.code === "ArrowUp" ||
        e.code === "Space"
      ) {
        e.preventDefault();
      }

      switch (e.code) {
        case "ArrowLeft":
        case "KeyA":
          moveHorizontal(-1);
          break;
        case "ArrowRight":
        case "KeyD":
          moveHorizontal(1);
          break;
        case "ArrowDown":
        case "KeyS":
          softDrop();
          break;
        case "Space":
          hardDrop();
          break;
        case "ArrowUp":
        case "KeyX":
          rotatePiece(1);
          break;
        case "KeyZ":
          rotatePiece(-1);
          break;
        case "KeyC":
        case "ShiftLeft":
        case "ShiftRight":
          holdCurrentPiece();
          break;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [
    hardDrop,
    holdCurrentPiece,
    moveHorizontal,
    rotatePiece,
    softDrop,
    startGame,
    togglePause,
  ]);

  // Auto-pause active run when tab hides or cabinet scrolls mostly off-screen
  useEffect(() => {
    const pauseIfPlaying = (reason: string) => {
      if (statusRef.current !== "playing") return;
      statusRef.current = "paused";
      setStatus("paused");
      calloutRef.current = reason;
      syncHud();
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        pauseIfPlaying("Paused on tab switch");
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    let observer: IntersectionObserver | undefined;
    const el = cabinetRef.current;
    if (el && typeof IntersectionObserver !== "undefined") {
      observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (entry && !entry.isIntersecting && entry.intersectionRatio < 0.1) {
            pauseIfPlaying("Paused off-screen");
          }
        },
        { threshold: [0, 0.1] }
      );
      observer.observe(el);
    }

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      observer?.disconnect();
    };
  }, [syncHud]);

  // Main animation & gravity loop
  useEffect(() => {
    const drawBlock = (
      ctx: CanvasRenderingContext2D,
      col: number,
      row: number,
      kind: PieceKind | "GARBAGE",
      alpha = 1
    ) => {
      const palette = PIECE_COLORS[kind];
      const x = col * CELL;
      const y = row * CELL;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = palette.fill;
      ctx.fillRect(x + 1, y + 1, CELL - 2, CELL - 2);

      // Top/left crisp bevel
      ctx.fillStyle = palette.glow;
      ctx.fillRect(x + 1, y + 1, CELL - 2, 3);
      ctx.fillRect(x + 1, y + 1, 3, CELL - 2);

      // Bottom/right shadow bevel
      ctx.fillStyle = palette.shade;
      ctx.fillRect(x + 1, y + CELL - 4, CELL - 2, 3);
      ctx.fillRect(x + CELL - 4, y + 1, 3, CELL - 2);

      ctx.strokeStyle = "#10141B";
      ctx.lineWidth = 1;
      ctx.strokeRect(x + 0.5, y + 0.5, CELL - 1, CELL - 1);
      ctx.restore();
    };

    const renderFrame = (now: number) => {
      const canvas = canvasRef.current;
      if (!canvas) {
        rafRef.current = requestAnimationFrame(renderFrame);
        return;
      }

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (canvas.width !== BOARD_W * dpr || canvas.height !== BOARD_H * dpr) {
        canvas.width = BOARD_W * dpr;
        canvas.height = BOARD_H * dpr;
      }

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const dt = Math.min(50, Math.max(0, now - (lastTimeRef.current || now)));
      lastTimeRef.current = now;

      if (statusRef.current === "playing" && activeRef.current) {
        dropAccRef.current += dt;
        const dropInterval = getDropIntervalMs(levelRef.current);
        if (dropAccRef.current >= dropInterval) {
          dropAccRef.current -= dropInterval;
          const p = activeRef.current;
          if (canPlace(p.matrix, p.row + 1, p.col)) {
            p.row += 1;
          }
        }

        // Strict lock delay on floor contact
        const p = activeRef.current;
        if (!canPlace(p.matrix, p.row + 1, p.col)) {
          lockTimerRef.current += dt;
          if (lockTimerRef.current >= LOCK_DELAY_MS) {
            lockActivePiece();
          }
        } else {
          lockTimerRef.current = 0;
        }

        // Rising garbage threat
        const intervalSec = rulesRef.current.garbageIntervalSec;
        if (intervalSec > 0) {
          garbageAccRef.current += dt;
          if (garbageAccRef.current >= intervalSec * 1000) {
            garbageAccRef.current = 0;
            pushGarbageRow();
          } else if (Math.floor((garbageAccRef.current / (intervalSec * 1000)) * 20) !== Math.floor(((garbageAccRef.current - dt) / (intervalSec * 1000)) * 20)) {
            syncHud();
          }
        }
      }

      if (flashRowsRef.current) {
        flashRowsRef.current.ttlMs -= dt;
        if (flashRowsRef.current.ttlMs <= 0) {
          flashRowsRef.current = null;
        }
      }

      if (shakeMsRef.current > 0) {
        shakeMsRef.current = Math.max(0, shakeMsRef.current - dt);
      }

      // Draw well
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (shakeMsRef.current > 0) {
        const shakeX = (Math.random() - 0.5) * 3.5;
        const shakeY = (Math.random() - 0.5) * 3.5;
        ctx.translate?.(shakeX, shakeY);
      }

      ctx.fillStyle = "#151A22";
      ctx.fillRect(0, 0, BOARD_W, BOARD_H);

      // Danger top 4-row tint
      ctx.fillStyle = "rgba(217, 79, 79, 0.08)";
      ctx.fillRect(0, 0, BOARD_W, CELL * 4);

      // Subtle coordinate grid
      ctx.strokeStyle = "rgba(247, 243, 235, 0.06)";
      ctx.lineWidth = 1;
      for (let c = 1; c < COLS; c++) {
        ctx.beginPath();
        ctx.moveTo(c * CELL + 0.5, 0);
        ctx.lineTo(c * CELL + 0.5, BOARD_H);
        ctx.stroke();
      }
      for (let r = 1; r < ROWS; r++) {
        ctx.beginPath();
        ctx.moveTo(0, r * CELL + 0.5);
        ctx.lineTo(BOARD_W, r * CELL + 0.5);
        ctx.stroke();
      }

      // Locked cells
      const board = boardRef.current;
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const cell = board[r][c];
          if (cell) drawBlock(ctx, c, r, cell, 1);
        }
      }

      // Active piece + ghost shadow
      const piece = activeRef.current;
      if (piece) {
        if (rulesRef.current.ghostEnabled) {
          let ghostRow = piece.row;
          while (canPlace(piece.matrix, ghostRow + 1, piece.col)) {
            ghostRow += 1;
          }
          if (ghostRow > piece.row) {
            const pColor = PIECE_COLORS[piece.kind];
            for (let r = 0; r < piece.matrix.length; r++) {
              for (let c = 0; c < piece.matrix[r].length; c++) {
                if (!piece.matrix[r][c]) continue;
                const gr = ghostRow + r;
                const gc = piece.col + c;
                if (gr >= 0 && gr < ROWS) {
                  ctx.save();
                  ctx.strokeStyle = pColor.fill;
                  ctx.lineWidth = 1.6;
                  ctx.setLineDash([4, 3]);
                  ctx.strokeRect(
                    gc * CELL + 2,
                    gr * CELL + 2,
                    CELL - 4,
                    CELL - 4
                  );
                  ctx.restore();
                }
              }
            }
          }
        }

        for (let r = 0; r < piece.matrix.length; r++) {
          for (let c = 0; c < piece.matrix[r].length; c++) {
            if (!piece.matrix[r][c]) continue;
            const pr = piece.row + r;
            const pc = piece.col + c;
            if (pr >= 0) {
              drawBlock(ctx, pc, pr, piece.kind, 1);
            }
          }
        }
      }

      if (flashRowsRef.current) {
        ctx.fillStyle = "rgba(255, 253, 249, 0.35)";
        for (const r of flashRowsRef.current.rows) {
          ctx.fillRect(0, r * CELL, BOARD_W, CELL);
        }
      }

      rafRef.current = requestAnimationFrame(renderFrame);
    };

    lastTimeRef.current = performance.now();
    rafRef.current = requestAnimationFrame(renderFrame);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [canPlace, lockActivePiece, pushGarbageRow, syncHud]);

  const effectiveBest = Math.max(storedBest, hud.bestScore);

  return (
    <div ref={cabinetRef} className="ink-card overflow-hidden rounded-3xl">
      {/* Arcade Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-[var(--border-ink)] bg-[var(--bg-beige)] px-4 py-3 sm:px-6">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-ink)] bg-[var(--accent-orange-fill)] px-2.5 py-0.5 font-mono-tech text-[11px] font-bold text-[#FFFDF9]">
            <Flame className="h-3.5 w-3.5" aria-hidden="true" />
            <span>HARD TETRIS</span>
          </span>
          <span className="rounded-lg border border-[var(--border-soft)] bg-[var(--bg-surface)] px-2.5 py-0.5 font-mono-tech text-[11px] font-bold text-[var(--ink-primary)]">
            {ruleMultiplier.toFixed(2)}x Score Multiplier
          </span>
          <span className="hidden font-mono-tech text-xs text-[var(--ink-secondary)] md:inline">
            ← → Move · ↑/X Rotate · Z CCW · C Hold · Space Hard Drop
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMuted((prev) => !prev)}
            aria-label={muted ? "Unmute sound effects" : "Mute sound effects"}
            aria-pressed={muted}
            className="ink-button inline-flex min-h-[44px] touch-manipulation items-center gap-1.5 rounded-xl bg-[var(--bg-surface)] px-3.5 py-1.5 text-xs font-bold text-[var(--ink-primary)]"
          >
            {muted ? (
              <VolumeX
                className="h-3.5 w-3.5 text-[var(--accent-orange)]"
                aria-hidden="true"
              />
            ) : (
              <Volume2
                className="h-3.5 w-3.5 text-[var(--accent-green)]"
                aria-hidden="true"
              />
            )}
            <span>{muted ? "Muted" : "SFX On"}</span>
          </button>

          {(status === "playing" || status === "paused") && (
            <button
              type="button"
              onClick={togglePause}
              className="ink-button inline-flex min-h-[44px] touch-manipulation items-center gap-1.5 rounded-xl bg-[var(--bg-surface)] px-3.5 py-1.5 text-xs font-bold text-[var(--ink-primary)]"
            >
              {status === "paused" ? (
                <>
                  <Play className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Resume</span>
                </>
              ) : (
                <>
                  <Pause className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Pause</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Main Cabinet Body */}
      <div className="grid gap-6 bg-[var(--bg-paper)] p-4 sm:p-6 lg:grid-cols-12">
        {/* Left/Center: 10x20 Canvas Playfield */}
        <div className="flex flex-col items-center lg:col-span-5">
          <div className="relative flex min-h-[430px] w-full max-w-[290px] items-center justify-center rounded-2xl border-2 border-[var(--border-ink)] bg-[#151A22] p-2 shadow-[0_4px_0_var(--border-ink)]">
            <canvas
              ref={canvasRef}
              aria-label="Hard Tetris playfield"
              className="block h-auto w-full rounded-lg"
              style={{ aspectRatio: `${BOARD_W} / ${BOARD_H}` }}
            />

            {status === "start" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-[#151A22]/88 p-5 text-center backdrop-blur-[2px]">
                <p className="font-mono-tech text-[11px] font-bold tracking-widest text-[#EA8343] uppercase">
                  Custom Difficulty Engine
                </p>
                <h3 className="mt-2 font-serif-display text-2xl font-bold text-[#F7F3EB]">
                  Hard Tetris
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-[#CBD3DF]">
                  Starts fast at Level {rules.startLevel}.{" "}
                  {rules.ghostEnabled ? "Ghost ON." : "Blind Drop (No Ghost)."}{" "}
                  {rules.garbageIntervalSec > 0
                    ? `Garbage every ${rules.garbageIntervalSec}s.`
                    : ""}{" "}
                  {rules.pentominoesEnabled ? "5-cell Pentominoes active." : ""}
                </p>
                <button
                  type="button"
                  onClick={() => startGame()}
                  className="ink-button mt-5 inline-flex min-h-[44px] touch-manipulation items-center gap-2 rounded-xl bg-[var(--accent-orange-fill)] px-5 py-2.5 text-sm font-bold text-[#FFFDF9]"
                >
                  <Play className="h-4 w-4" aria-hidden="true" />
                  <span>Start Hard Tetris</span>
                </button>
              </div>
            )}

            {status === "paused" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-[#151A22]/88 p-5 text-center backdrop-blur-[2px]">
                <h3 className="font-serif-display text-2xl font-bold text-[#F7F3EB]">
                  Paused
                </h3>
                <p className="mt-1 font-mono-tech text-xs text-[#CBD3DF]">
                  Press P or Resume to continue drop
                </p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  <button
                    type="button"
                    onClick={togglePause}
                    className="ink-button inline-flex min-h-[44px] touch-manipulation items-center gap-1.5 rounded-xl bg-[var(--accent-green)] px-4 py-2 text-sm font-bold text-[#FFFDF9]"
                  >
                    <Play className="h-4 w-4" aria-hidden="true" />
                    <span>Resume</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => startGame()}
                    className="ink-button inline-flex min-h-[44px] touch-manipulation items-center gap-1.5 rounded-xl bg-[var(--bg-surface)] px-4 py-2 text-sm font-bold text-[var(--ink-primary)]"
                  >
                    <RotateCcw className="h-4 w-4" aria-hidden="true" />
                    <span>Restart</span>
                  </button>
                </div>
              </div>
            )}

            {status === "gameover" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-[#151A22]/92 p-5 text-center backdrop-blur-[2px]">
                <p className="font-mono-tech text-[11px] font-bold tracking-wider text-[#E06A6A] uppercase">
                  Stack Overflowed
                </p>
                <h3 className="mt-1 font-serif-display text-2xl font-bold text-[#F7F3EB]">
                  Game Over
                </h3>
                <p className="mt-1.5 text-xs text-[#CBD3DF]">
                  {hud.gameOverReason || "Board ceiling reached"}
                </p>
                <div className="mt-4 grid w-full grid-cols-3 gap-2 rounded-xl border border-[#2F3B4D] bg-[#1D2532] p-2.5 text-center">
                  <div>
                    <div className="font-mono-tech text-[10px] text-[#9BA6B8]">
                      SCORE
                    </div>
                    <div className="font-mono-tech text-sm font-bold text-[#F7F3EB]">
                      {hud.score}
                    </div>
                  </div>
                  <div>
                    <div className="font-mono-tech text-[10px] text-[#9BA6B8]">
                      LINES
                    </div>
                    <div className="font-mono-tech text-sm font-bold text-[#5AB896]">
                      {hud.lines}
                    </div>
                  </div>
                  <div>
                    <div className="font-mono-tech text-[10px] text-[#9BA6B8]">
                      BEST
                    </div>
                    <div className="font-mono-tech text-sm font-bold text-[#E6B84E]">
                      {effectiveBest}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => startGame()}
                  className="ink-button mt-4 inline-flex min-h-[44px] touch-manipulation items-center gap-2 rounded-xl bg-[var(--accent-orange-fill)] px-5 py-2.5 text-sm font-bold text-[#FFFDF9]"
                >
                  <RotateCcw className="h-4 w-4" aria-hidden="true" />
                  <span>Play Again</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile & Touch Controls */}
          <div className="mt-4 w-full max-w-[320px] space-y-2">
            <div className="grid grid-cols-5 gap-1.5">
              <button
                type="button"
                onClick={() => moveHorizontal(-1)}
                aria-label="Move piece left"
                className="ink-button flex h-11 touch-manipulation select-none items-center justify-center rounded-xl bg-[var(--bg-surface)] text-[var(--ink-primary)]"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => rotatePiece(-1)}
                aria-label="Rotate counterclockwise"
                className="ink-button flex h-11 touch-manipulation select-none items-center justify-center rounded-xl bg-[var(--bg-surface)] text-[var(--ink-primary)]"
              >
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => softDrop()}
                aria-label="Soft drop"
                className="ink-button flex h-11 touch-manipulation select-none items-center justify-center rounded-xl bg-[var(--bg-surface)] text-[var(--ink-primary)]"
              >
                <ArrowDown className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => rotatePiece(1)}
                aria-label="Rotate clockwise"
                className="ink-button flex h-11 touch-manipulation select-none items-center justify-center rounded-xl bg-[var(--bg-surface)] text-[var(--ink-primary)]"
              >
                <RotateCw className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => moveHorizontal(1)}
                aria-label="Move piece right"
                className="ink-button flex h-11 touch-manipulation select-none items-center justify-center rounded-xl bg-[var(--bg-surface)] text-[var(--ink-primary)]"
              >
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => holdCurrentPiece()}
                disabled={!rules.holdEnabled}
                className="ink-button flex h-11 touch-manipulation select-none items-center justify-center gap-1.5 rounded-xl bg-[var(--bg-beige)] px-3 text-xs font-bold text-[var(--ink-primary)] disabled:opacity-45"
              >
                <Layers className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Hold (C)</span>
              </button>
              <button
                type="button"
                onClick={() => hardDrop()}
                className="ink-button flex h-11 touch-manipulation select-none items-center justify-center gap-1.5 rounded-xl bg-[var(--accent-orange-fill)] px-3 text-xs font-bold text-[#FFFDF9]"
              >
                <span>Hard Drop (Space)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel: Telemetry, Next/Hold Queues, and Rule Customizer */}
        <div className="flex flex-col justify-between gap-5 lg:col-span-7">
          {/* Scoreboard + Hold/Next Queues */}
          <div className="grid gap-4 sm:grid-cols-12">
            <div className="grid grid-cols-2 gap-3 sm:col-span-7">
              <div className="rounded-2xl border-2 border-[var(--border-soft)] bg-[var(--bg-surface)] p-3.5">
                <p className="font-mono-tech text-[10px] font-bold text-[var(--ink-muted)] uppercase">
                  Score
                </p>
                <p className="mt-1 font-mono-tech text-2xl font-extrabold text-[var(--ink-primary)]">
                  {hud.score}
                </p>
                <p className="mt-0.5 break-words font-mono-tech text-[11px] font-semibold leading-snug text-[var(--accent-orange)]">
                  {hud.lastCallout}
                </p>
              </div>

              <div className="rounded-2xl border-2 border-[var(--border-soft)] bg-[var(--bg-surface)] p-3.5">
                <p className="flex items-center gap-1 font-mono-tech text-[10px] font-bold text-[var(--ink-muted)] uppercase">
                  <Trophy
                    className="h-3 w-3 text-[var(--accent-mustard)]"
                    aria-hidden="true"
                  />
                  <span>Best</span>
                </p>
                <p className="mt-1 font-mono-tech text-2xl font-extrabold text-[var(--ink-primary)]">
                  {effectiveBest}
                </p>
                <p className="mt-0.5 font-mono-tech text-[11px] text-[var(--ink-secondary)]">
                  Max Combo: {hud.maxCombo}
                </p>
              </div>

              <div className="rounded-2xl border-2 border-[var(--border-soft)] bg-[var(--bg-surface)] p-3.5">
                <p className="font-mono-tech text-[10px] font-bold text-[var(--ink-muted)] uppercase">
                  Speed Level
                </p>
                <p className="mt-1 font-mono-tech text-xl font-extrabold text-[var(--accent-blue)]">
                  Lv {hud.level}
                </p>
                <p className="font-mono-tech text-[10px] text-[var(--ink-muted)]">
                  {getDropIntervalMs(hud.level)} ms/drop
                </p>
              </div>

              <div className="rounded-2xl border-2 border-[var(--border-soft)] bg-[var(--bg-surface)] p-3.5">
                <p className="font-mono-tech text-[10px] font-bold text-[var(--ink-muted)] uppercase">
                  Lines Cleared
                </p>
                <p className="mt-1 font-mono-tech text-xl font-extrabold text-[var(--accent-green)]">
                  {hud.lines}
                </p>
                <p className="font-mono-tech text-[10px] text-[var(--ink-muted)]">
                  {rules.garbageIntervalSec > 0
                    ? `Garbage ${Math.round(hud.garbageProgress * 100)}%`
                    : "Garbage OFF"}
                </p>
              </div>
            </div>

            {/* Hold & Next 3 Preview */}
            <div className="flex flex-col gap-3 sm:col-span-5">
              <div className="rounded-2xl border-2 border-[var(--border-ink)] bg-[#151A22] p-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono-tech text-[10px] font-bold text-[#9AA5B5] uppercase">
                    Hold Slot
                  </span>
                  <span className="font-mono-tech text-[10px] text-[#EA8343]">
                    {rules.holdEnabled ? "C / Shift" : "DISABLED"}
                  </span>
                </div>
                <div className="mt-2 flex min-h-[48px] items-center justify-center">
                  {rules.holdEnabled ? (
                    <MiniPiecePreview kind={hud.holdPiece} />
                  ) : (
                    <span className="font-mono-tech text-[11px] text-[#9BA6B8]">
                      LOCKED RULE
                    </span>
                  )}
                </div>
              </div>

              <div className="flex-1 rounded-2xl border-2 border-[var(--border-ink)] bg-[#151A22] p-3">
                <span className="font-mono-tech text-[10px] font-bold text-[#9AA5B5] uppercase">
                  Next 3 Pieces
                </span>
                <div className="mt-2.5 grid grid-cols-3 gap-2">
                  {hud.nextQueue.slice(0, 3).map((kind, i) => (
                    <div
                      key={`${kind}-${i}`}
                      className="flex min-h-[46px] items-center justify-center rounded-lg border border-[#283344] bg-[#1B222E] p-1"
                    >
                      <MiniPiecePreview kind={kind} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Hard Mode Presets & Live Rule Customization */}
          <div className="rounded-2xl border-2 border-[var(--border-ink)] bg-[var(--bg-surface)] p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="flex items-center gap-1.5 font-mono-tech text-xs font-bold tracking-wider text-[var(--ink-primary)] uppercase">
                <SlidersHorizontal
                  className="h-3.5 w-3.5 text-[var(--accent-orange)]"
                  aria-hidden="true"
                />
                <span>Customize Hard Mode Rules</span>
              </p>
              <span className="font-hand text-base text-[var(--accent-blue)]">
                Harder rules = bigger score multiplier
              </span>
            </div>

            {/* 4 Presets */}
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {(Object.keys(PRESETS) as PresetId[]).map((id) => {
                const preset = PRESETS[id];
                const isSelected = rules.presetId === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => selectPreset(id)}
                    aria-pressed={isSelected}
                    className={`rounded-xl border-2 p-3 text-left transition-all ${
                      isSelected
                        ? "border-[var(--border-ink)] bg-[var(--accent-orange-soft)] shadow-[0_2px_0_var(--border-ink)]"
                        : "border-[var(--border-soft)] bg-[var(--bg-paper)] hover:border-[var(--border-ink)]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-[var(--ink-primary)]">
                        {preset.label}
                      </span>
                      <span className="rounded-md bg-[var(--bg-surface)] px-1.5 py-0.5 font-mono-tech text-[10px] font-bold text-[var(--accent-orange)]">
                        {computeRuleMultiplier(preset.rules).toFixed(2)}x
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] leading-snug text-[var(--ink-secondary)]">
                      {preset.description}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Granular Custom Rule Knobs */}
            <div className="mt-4 grid gap-2.5 border-t border-[var(--border-soft)] pt-3.5 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="font-mono-tech text-[10px] font-bold text-[var(--ink-muted)] uppercase">
                  Start Gravity
                </p>
                <div className="mt-1 flex gap-1">
                  {([3, 5, 8, 10] as const).map((lv) => (
                    <button
                      key={lv}
                      type="button"
                      onClick={() => updateCustomRule("startLevel", lv)}
                      className={`min-h-[44px] flex-1 touch-manipulation rounded-lg border px-1.5 py-1 font-mono-tech text-[11px] font-bold ${
                        rules.startLevel === lv
                          ? "border-[var(--border-ink)] bg-[var(--ink-primary)] text-[var(--bg-surface)]"
                          : "border-[var(--border-soft)] bg-[var(--bg-paper)] text-[var(--ink-secondary)]"
                      }`}
                    >
                      L{lv}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="font-mono-tech text-[10px] font-bold text-[var(--ink-muted)] uppercase">
                  Garbage Attack
                </p>
                <div className="mt-1 flex gap-1">
                  {(
                    [
                      { val: 0, lbl: "Off" },
                      { val: 16, lbl: "16s" },
                      { val: 10, lbl: "10s" },
                    ] as const
                  ).map((opt) => (
                    <button
                      key={opt.val}
                      type="button"
                      onClick={() =>
                        updateCustomRule("garbageIntervalSec", opt.val)
                      }
                      className={`min-h-[44px] flex-1 touch-manipulation rounded-lg border px-1.5 py-1 font-mono-tech text-[11px] font-bold ${
                        rules.garbageIntervalSec === opt.val
                          ? "border-[var(--border-ink)] bg-[var(--ink-primary)] text-[var(--bg-surface)]"
                          : "border-[var(--border-soft)] bg-[var(--bg-paper)] text-[var(--ink-secondary)]"
                      }`}
                    >
                      {opt.lbl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="font-mono-tech text-[10px] font-bold text-[var(--ink-muted)] uppercase">
                  Ghost / Hold
                </p>
                <div className="mt-1 flex gap-1">
                  <button
                    type="button"
                    onClick={() =>
                      updateCustomRule("ghostEnabled", !rules.ghostEnabled)
                    }
                    className={`min-h-[44px] flex-1 touch-manipulation rounded-lg border px-1.5 py-1 font-mono-tech text-[10px] font-bold ${
                      !rules.ghostEnabled
                        ? "border-[var(--border-ink)] bg-[var(--accent-blue)] text-[#FFFDF9]"
                        : "border-[var(--border-soft)] bg-[var(--bg-paper)] text-[var(--ink-secondary)]"
                    }`}
                  >
                    {rules.ghostEnabled ? "Ghost ON" : "Blind"}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      updateCustomRule("holdEnabled", !rules.holdEnabled)
                    }
                    className={`min-h-[44px] flex-1 touch-manipulation rounded-lg border px-1.5 py-1 font-mono-tech text-[10px] font-bold ${
                      !rules.holdEnabled
                        ? "border-[var(--border-ink)] bg-[var(--accent-blue)] text-[#FFFDF9]"
                        : "border-[var(--border-soft)] bg-[var(--bg-paper)] text-[var(--ink-secondary)]"
                    }`}
                  >
                    {rules.holdEnabled ? "Hold ON" : "No Hold"}
                  </button>
                </div>
              </div>

              <div>
                <p className="font-mono-tech text-[10px] font-bold text-[var(--ink-muted)] uppercase">
                  Piece Bag
                </p>
                <div className="mt-1 flex gap-1">
                  <button
                    type="button"
                    onClick={() =>
                      updateCustomRule(
                        "pentominoesEnabled",
                        !rules.pentominoesEnabled
                      )
                    }
                    className={`min-h-[44px] w-full touch-manipulation rounded-lg border px-2 py-1 font-mono-tech text-[11px] font-bold ${
                      rules.pentominoesEnabled
                        ? "border-[var(--border-ink)] bg-[var(--accent-orange-fill)] text-[#FFFDF9]"
                        : "border-[var(--border-soft)] bg-[var(--bg-paper)] text-[var(--ink-secondary)]"
                    }`}
                  >
                    {rules.pentominoesEnabled
                      ? "+5-Cell Pentominoes"
                      : "Standard 7-Bag"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
