"use client";

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Pause,
  Play,
  RotateCcw,
  Shield,
  Trophy,
  Volume2,
  VolumeX,
} from "lucide-react";

type GameStatus = "start" | "playing" | "paused" | "gameover";

interface FallingItem {
  id: number;
  kind: "bug" | "syntax" | "barrier" | "token" | "coffee";
  x: number;
  y: number;
  w: number;
  h: number;
  vx: number;
  vy: number;
  label: string;
}

interface FloatingPopup {
  x: number;
  y: number;
  text: string;
  color: string;
  ttl: number;
}

interface HudStats {
  score: number;
  highScore: number;
  wave: number;
  tokens: number;
  bugsDodged: number;
  hasShield: boolean;
  gameOverReason: string;
}

const LOGICAL_W = 720;
const LOGICAL_H = 320;
const GROUND_Y = 274;
const HIGH_SCORE_KEY = "bhavya-byte-runner-highscore-v1";
const HIGH_SCORE_EVENT = "bhavya-byte-runner-highscore-change";

function readStoredHighScore(): number {
  try {
    const saved = window.localStorage.getItem(HIGH_SCORE_KEY);
    const parsed = saved ? Number.parseInt(saved, 10) : 0;
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
  } catch {
    return 0;
  }
}

function subscribeHighScore(callback: () => void): () => void {
  window.addEventListener("storage", callback);
  window.addEventListener(HIGH_SCORE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(HIGH_SCORE_EVENT, callback);
  };
}

const BUG_LABELS = ["SyntaxError", "NaN", "NullPtr", "RaceCond", "OOM"];
const BARRIER_LABELS = ["500", "CRASH", "SEGFAULT"];
const DEATH_REASONS = [
  "Unhandled Promise Rejection in prod",
  "Deployed to main on a Friday evening",
  "Forgot a base case in recursion",
  "Merge conflict ate your weekend",
  "Out-of-memory error during training",
];

function playRetroBeep(
  ctx: AudioContext | null,
  freq: number,
  duration: number,
  type: OscillatorType = "triangle",
  gainPeak = 0.08
) {
  if (!ctx) return;
  try {
    if (ctx.state === "suspended") {
      void ctx.resume();
    }
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(gainPeak, ctx.currentTime + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration + 0.02);
  } catch {
    // Ignore audio exceptions cleanly
  }
}

export function ByteRunnerGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const savedHighScore = useSyncExternalStore(
    subscribeHighScore,
    readStoredHighScore,
    () => 0
  );

  const [status, setStatus] = useState<GameStatus>("start");
  const [muted, setMuted] = useState<boolean>(false);
  const [hud, setHud] = useState<HudStats>({
    score: 0,
    highScore: 0,
    wave: 1,
    tokens: 0,
    bugsDodged: 0,
    hasShield: false,
    gameOverReason: DEATH_REASONS[0],
  });

  // Mutable simulation state inside ref to isolate game loop from React re-renders
  const simRef = useRef({
    status: "start" as GameStatus,
    muted: false,
    px: 140,
    py: GROUND_Y - 44,
    pvx: 0,
    pvy: 0,
    jumpsLeft: 2,
    ducking: false,
    moveLeft: false,
    moveRight: false,
    score: 0,
    highScore: 0,
    tokens: 0,
    bugsDodged: 0,
    hasShield: false,
    invulnTimer: 0,
    elapsed: 0,
    spawnTimer: 0.7,
    nextId: 1,
    items: [] as FallingItem[],
    popups: [] as FloatingPopup[],
    gridOffset: 0,
    runTick: 0,
  });

  useEffect(() => {
    simRef.current.muted = muted;
  }, [muted]);

  useEffect(() => {
    if (savedHighScore > simRef.current.highScore) {
      simRef.current.highScore = savedHighScore;
    }
  }, [savedHighScore]);

  const ensureAudio = useCallback(() => {
    if (simRef.current.muted) return null;
    if (typeof window === "undefined") return null;
    if (!audioCtxRef.current) {
      const AudioCtor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (AudioCtor) {
        try {
          audioCtxRef.current = new AudioCtor();
        } catch {
          return null;
        }
      }
    }
    return audioCtxRef.current;
  }, []);

  const syncHud = useCallback((reason?: string) => {
    const s = simRef.current;
    const wave = Math.max(1, 1 + Math.floor(s.score / 180));
    setHud((prev) => ({
      score: Math.floor(s.score),
      highScore: Math.max(s.highScore, Math.floor(s.score)),
      wave,
      tokens: s.tokens,
      bugsDodged: s.bugsDodged,
      hasShield: s.hasShield,
      gameOverReason: reason ?? prev.gameOverReason,
    }));
  }, []);

  const resetAndStart = useCallback(() => {
    const s = simRef.current;
    s.px = 140;
    s.py = GROUND_Y - 44;
    s.pvx = 0;
    s.pvy = 0;
    s.jumpsLeft = 2;
    s.ducking = false;
    s.moveLeft = false;
    s.moveRight = false;
    s.score = 0;
    s.tokens = 0;
    s.bugsDodged = 0;
    s.hasShield = false;
    s.invulnTimer = 0;
    s.elapsed = 0;
    s.spawnTimer = 0.55;
    s.items = [];
    s.popups = [];
    s.status = "playing";
    setStatus("playing");
    syncHud(DEATH_REASONS[0]);

    const ctx = ensureAudio();
    playRetroBeep(ctx, 520, 0.08, "triangle");
  }, [ensureAudio, syncHud]);

  const togglePause = useCallback(() => {
    const s = simRef.current;
    if (s.status === "playing") {
      s.status = "paused";
      setStatus("paused");
    } else if (s.status === "paused") {
      s.status = "playing";
      setStatus("playing");
    }
  }, []);

  const triggerJump = useCallback(() => {
    const s = simRef.current;
    if (s.status === "start" || s.status === "gameover") {
      resetAndStart();
      return;
    }
    if (s.status !== "playing") return;
    if (s.jumpsLeft > 0) {
      s.pvy = s.jumpsLeft === 2 ? -455 : -390;
      s.jumpsLeft -= 1;
      s.ducking = false;
      const ctx = ensureAudio();
      playRetroBeep(ctx, s.jumpsLeft === 1 ? 460 : 610, 0.09, "triangle");
    }
  }, [ensureAudio, resetAndStart]);

  const setDuck = useCallback((active: boolean) => {
    const s = simRef.current;
    if (s.status !== "playing") return;
    s.ducking = active;
    if (active && s.py < GROUND_Y - 44) {
      s.pvy = Math.max(s.pvy, 380);
    }
  }, []);

  // Keyboard controls
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const s = simRef.current;
      const key = e.key.toLowerCase();

      if (key === "p" && (s.status === "playing" || s.status === "paused")) {
        e.preventDefault();
        togglePause();
        return;
      }
      if (key === "r" && s.status === "gameover") {
        e.preventDefault();
        resetAndStart();
        return;
      }

      if (s.status !== "playing") return;

      if (e.key === "ArrowUp" || key === "w" || e.key === " ") {
        e.preventDefault();
        if (!e.repeat) triggerJump();
      } else if (e.key === "ArrowDown" || key === "s") {
        e.preventDefault();
        setDuck(true);
      } else if (e.key === "ArrowLeft" || key === "a") {
        e.preventDefault();
        s.moveLeft = true;
      } else if (e.key === "ArrowRight" || key === "d") {
        e.preventDefault();
        s.moveRight = true;
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      const s = simRef.current;
      const key = e.key.toLowerCase();
      if (e.key === "ArrowDown" || key === "s") {
        setDuck(false);
      } else if (e.key === "ArrowLeft" || key === "a") {
        s.moveLeft = false;
      } else if (e.key === "ArrowRight" || key === "d") {
        s.moveRight = false;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [resetAndStart, setDuck, togglePause, triggerJump]);

  // Main Canvas Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx2d = canvas.getContext("2d");
    if (!ctx2d) return;

    let rafId = 0;
    let lastTime = performance.now();
    let hudTicker = 0;

    const drawScene = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const targetW = LOGICAL_W * dpr;
      const targetH = LOGICAL_H * dpr;
      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
      }
      ctx2d.setTransform(dpr, 0, 0, dpr, 0, 0);

      const s = simRef.current;
      const isNight =
        document.documentElement.getAttribute("data-theme") === "night";

      // Paper / Desk background inside canvas
      ctx2d.fillStyle = isNight ? "#161D29" : "#FAF6EE";
      ctx2d.fillRect(0, 0, LOGICAL_W, LOGICAL_H);

      // Subtle scrolling notebook grid
      ctx2d.strokeStyle = isNight
        ? "rgba(242,236,224,0.06)"
        : "rgba(31,36,33,0.07)";
      ctx2d.lineWidth = 1;
      const gridStep = 36;
      const gx0 = -(s.gridOffset % gridStep);
      for (let x = gx0; x < LOGICAL_W; x += gridStep) {
        ctx2d.beginPath();
        ctx2d.moveTo(x, 0);
        ctx2d.lineTo(x, GROUND_Y);
        ctx2d.stroke();
      }
      for (let y = 36; y < GROUND_Y; y += gridStep) {
        ctx2d.beginPath();
        ctx2d.moveTo(0, y);
        ctx2d.lineTo(LOGICAL_W, y);
        ctx2d.stroke();
      }

      // Ground Desk Lane
      ctx2d.fillStyle = isNight ? "#222B3C" : "#EFE8DA";
      ctx2d.fillRect(0, GROUND_Y, LOGICAL_W, LOGICAL_H - GROUND_Y);
      ctx2d.strokeStyle = isNight ? "#E5DECB" : "#1F2421";
      ctx2d.lineWidth = 2.5;
      ctx2d.beginPath();
      ctx2d.moveTo(0, GROUND_Y);
      ctx2d.lineTo(LOGICAL_W, GROUND_Y);
      ctx2d.stroke();

      // Ground hash marks
      ctx2d.strokeStyle = isNight
        ? "rgba(229,222,203,0.22)"
        : "rgba(31,36,33,0.22)";
      ctx2d.lineWidth = 2;
      for (let x = -(s.gridOffset % 48); x < LOGICAL_W; x += 48) {
        ctx2d.beginPath();
        ctx2d.moveTo(x, GROUND_Y + 12);
        ctx2d.lineTo(x + 18, GROUND_Y + 12);
        ctx2d.stroke();
      }

      // Draw Falling & Incoming Entities
      for (const item of s.items) {
        ctx2d.save();
        if (item.kind === "token") {
          // AI Spark Token (diamond + sparkle)
          const cx = item.x + item.w / 2;
          const cy = item.y + item.h / 2;
          ctx2d.fillStyle = "#E6B84E";
          ctx2d.strokeStyle = "#1F2421";
          ctx2d.lineWidth = 2;
          ctx2d.beginPath();
          ctx2d.moveTo(cx, item.y);
          ctx2d.lineTo(item.x + item.w, cy);
          ctx2d.lineTo(cx, item.y + item.h);
          ctx2d.lineTo(item.x, cy);
          ctx2d.closePath();
          ctx2d.fill();
          ctx2d.stroke();
          ctx2d.fillStyle = "#1F2421";
          ctx2d.font = "bold 9px monospace";
          ctx2d.textAlign = "center";
          ctx2d.fillText("AI", cx, cy + 3);
        } else if (item.kind === "coffee") {
          // Coffee / Chai Cup
          ctx2d.fillStyle = "#D96B27";
          ctx2d.strokeStyle = "#1F2421";
          ctx2d.lineWidth = 2;
          ctx2d.beginPath();
          ctx2d.roundRect(item.x + 2, item.y + 6, item.w - 6, item.h - 6, 4);
          ctx2d.fill();
          ctx2d.stroke();
          ctx2d.beginPath();
          ctx2d.arc(
            item.x + item.w - 4,
            item.y + item.h / 2 + 2,
            4,
            -Math.PI / 2,
            Math.PI / 2
          );
          ctx2d.stroke();
          ctx2d.fillStyle = isNight ? "#F2ECE0" : "#1F2421";
          ctx2d.font = "bold 9px monospace";
          ctx2d.textAlign = "center";
          ctx2d.fillText("~", item.x + item.w / 2 - 2, item.y + 4);
        } else if (item.kind === "barrier") {
          // Ground Crash Block
          ctx2d.fillStyle = "#C94A38";
          ctx2d.strokeStyle = "#1F2421";
          ctx2d.lineWidth = 2.2;
          ctx2d.beginPath();
          ctx2d.roundRect(item.x, item.y, item.w, item.h, 5);
          ctx2d.fill();
          ctx2d.stroke();
          ctx2d.fillStyle = "#FFFDF9";
          ctx2d.font = "bold 9.5px monospace";
          ctx2d.textAlign = "center";
          ctx2d.fillText(item.label, item.x + item.w / 2, item.y + item.h / 2 + 3);
        } else {
          // Falling Bug / SyntaxError Beetle
          ctx2d.fillStyle = item.kind === "syntax" ? "#7B4B94" : "#2D6A4F";
          ctx2d.strokeStyle = "#1F2421";
          ctx2d.lineWidth = 2;
          ctx2d.beginPath();
          ctx2d.roundRect(item.x, item.y, item.w, item.h, 7);
          ctx2d.fill();
          ctx2d.stroke();
          // Bug antennae
          ctx2d.beginPath();
          ctx2d.moveTo(item.x + 8, item.y);
          ctx2d.lineTo(item.x + 4, item.y - 6);
          ctx2d.moveTo(item.x + item.w - 8, item.y);
          ctx2d.lineTo(item.x + item.w - 4, item.y - 6);
          ctx2d.stroke();
          ctx2d.fillStyle = "#FFFDF9";
          ctx2d.font = "bold 9px monospace";
          ctx2d.textAlign = "center";
          ctx2d.fillText(item.label, item.x + item.w / 2, item.y + item.h / 2 + 3);
        }
        ctx2d.restore();
      }

      // Draw Player Character (Illustrated Dev!)
      const ph = s.ducking ? 28 : 44;
      const pw = 30;
      const py = s.ducking ? GROUND_Y - 28 : s.py;
      const blink = s.invulnTimer > 0 && Math.floor(s.invulnTimer * 18) % 2 === 0;

      if (!blink) {
        ctx2d.save();
        // Shield Aura
        if (s.hasShield) {
          ctx2d.strokeStyle = "#D96B27";
          ctx2d.lineWidth = 2.2;
          ctx2d.setLineDash([4, 3]);
          ctx2d.beginPath();
          ctx2d.arc(s.px + pw / 2, py + ph / 2, 28, 0, Math.PI * 2);
          ctx2d.stroke();
          ctx2d.setLineDash([]);
        }

        // Legs
        ctx2d.strokeStyle = isNight ? "#E5DECB" : "#1F2421";
        ctx2d.lineWidth = 3.2;
        ctx2d.lineCap = "round";
        const stride = Math.sin(s.runTick * 14) * 5;
        ctx2d.beginPath();
        ctx2d.moveTo(s.px + 10, py + ph - 10);
        ctx2d.lineTo(s.px + 8 + stride, py + ph);
        ctx2d.moveTo(s.px + 20, py + ph - 10);
        ctx2d.lineTo(s.px + 22 - stride, py + ph);
        ctx2d.stroke();

        // Torso
        ctx2d.fillStyle = "#1F5E4B";
        ctx2d.strokeStyle = "#1F2421";
        ctx2d.lineWidth = 2.2;
        ctx2d.beginPath();
        ctx2d.roundRect(s.px + 4, py + (s.ducking ? 6 : 16), 22, ph - (s.ducking ? 14 : 24), 6);
        ctx2d.fill();
        ctx2d.stroke();

        // Head
        ctx2d.fillStyle = "#F1C39B";
        ctx2d.beginPath();
        ctx2d.arc(s.px + 15, py + 10, 10.5, 0, Math.PI * 2);
        ctx2d.fill();
        ctx2d.stroke();

        // Hair & Glasses
        ctx2d.fillStyle = "#232528";
        ctx2d.beginPath();
        ctx2d.arc(s.px + 14, py + 6.5, 9.5, Math.PI, Math.PI * 2);
        ctx2d.fill();

        ctx2d.strokeStyle = "#1F2421";
        ctx2d.lineWidth = 1.6;
        ctx2d.strokeRect(s.px + 10, py + 7.5, 6, 5);
        ctx2d.strokeRect(s.px + 17, py + 7.5, 6, 5);
        ctx2d.restore();
      }

      // Popups (+25 AI, SHIELD!)
      for (const pop of s.popups) {
        ctx2d.save();
        ctx2d.globalAlpha = Math.max(0, Math.min(1, pop.ttl * 1.4));
        ctx2d.fillStyle = pop.color;
        ctx2d.font = "bold 12px monospace";
        ctx2d.textAlign = "center";
        ctx2d.fillText(pop.text, pop.x, pop.y);
        ctx2d.restore();
      }
    };

    const tick = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      const s = simRef.current;

      if (s.status === "playing") {
        s.elapsed += dt;
        s.runTick += dt;
        const speedMult = 1 + Math.min(s.elapsed * 0.032, 1.5);
        s.gridOffset += 155 * speedMult * dt;
        s.score += dt * 12;

        if (s.invulnTimer > 0) {
          s.invulnTimer = Math.max(0, s.invulnTimer - dt);
        }

        // Player horizontal motion
        const moveDir = (s.moveRight ? 1 : 0) - (s.moveLeft ? 1 : 0);
        s.pvx = moveDir * 255;
        s.px = Math.max(18, Math.min(LOGICAL_W - 48, s.px + s.pvx * dt));

        // Player vertical motion & gravity
        s.pvy += 1260 * dt;
        s.py += s.pvy * dt;
        if (s.py >= GROUND_Y - 44) {
          s.py = GROUND_Y - 44;
          s.pvy = 0;
          s.jumpsLeft = 2;
        }

        // Spawner
        s.spawnTimer -= dt;
        if (s.spawnTimer <= 0) {
          const interval = Math.max(0.36, 1.05 - s.elapsed * 0.015);
          s.spawnTimer = interval * (0.8 + Math.random() * 0.45);
          const roll = Math.random();

          if (roll < 0.27) {
            // AI Token (either sky drift or jump-height arc)
            const inAir = Math.random() < 0.5;
            s.items.push({
              id: s.nextId++,
              kind: "token",
              x: inAir ? LOGICAL_W + 20 : 60 + Math.random() * (LOGICAL_W - 120),
              y: inAir ? GROUND_Y - 82 - Math.random() * 55 : -24,
              w: 24,
              h: 24,
              vx: inAir ? -190 * speedMult : 0,
              vy: inAir ? 0 : 120 * speedMult,
              label: "AI",
            });
          } else if (roll < 0.4) {
            // Coffee Cup
            s.items.push({
              id: s.nextId++,
              kind: "coffee",
              x: 60 + Math.random() * (LOGICAL_W - 120),
              y: -26,
              w: 24,
              h: 26,
              vx: (Math.random() - 0.5) * 30,
              vy: 130 * speedMult,
              label: "CHAI",
            });
          } else if (roll < 0.68) {
            // Ground Crash Barrier moving right-to-left
            const label =
              BARRIER_LABELS[Math.floor(Math.random() * BARRIER_LABELS.length)];
            s.items.push({
              id: s.nextId++,
              kind: "barrier",
              x: LOGICAL_W + 20,
              y: GROUND_Y - 34,
              w: 44,
              h: 34,
              vx: -(205 + Math.random() * 65) * speedMult,
              vy: 0,
              label,
            });
          } else {
            // Falling Bug / SyntaxError
            const isSyntax = Math.random() < 0.45;
            const label =
              BUG_LABELS[Math.floor(Math.random() * BUG_LABELS.length)];
            s.items.push({
              id: s.nextId++,
              kind: isSyntax ? "syntax" : "bug",
              x: 40 + Math.random() * (LOGICAL_W - 110),
              y: -28,
              w: isSyntax ? 64 : 48,
              h: 24,
              vx: (Math.random() - 0.5) * 45,
              vy: (135 + Math.random() * 60) * speedMult,
              label,
            });
          }
        }

        // Update entities & AABB collision checks
        const playerBox = {
          x: s.px + 5,
          y: (s.ducking ? GROUND_Y - 28 : s.py) + 4,
          w: 20,
          h: (s.ducking ? 28 : 44) - 6,
        };

        const remaining: FallingItem[] = [];
        for (const item of s.items) {
          item.x += item.vx * dt;
          item.y += item.vy * dt;

          const offScreen = item.x + item.w < -40 || item.y > GROUND_Y + 30;
          if (offScreen) {
            if (
              item.kind === "bug" ||
              item.kind === "syntax" ||
              item.kind === "barrier"
            ) {
              s.bugsDodged += 1;
            }
            continue;
          }

          const hit =
            playerBox.x < item.x + item.w &&
            playerBox.x + playerBox.w > item.x &&
            playerBox.y < item.y + item.h &&
            playerBox.y + playerBox.h > item.y;

          if (hit) {
            if (item.kind === "token") {
              s.score += 25;
              s.tokens += 1;
              s.popups.push({
                x: item.x + 12,
                y: item.y,
                text: "+25 AI",
                color: "#1F5E4B",
                ttl: 0.9,
              });
              playRetroBeep(audioCtxRef.current, 740, 0.08, "sine");
              continue;
            }
            if (item.kind === "coffee") {
              s.score += 15;
              s.hasShield = true;
              s.popups.push({
                x: item.x + 12,
                y: item.y,
                text: "+15 SHIELD!",
                color: "#D96B27",
                ttl: 1.0,
              });
              playRetroBeep(audioCtxRef.current, 620, 0.11, "triangle");
              continue;
            }
            // Hazard hit
            if (s.invulnTimer > 0) {
              continue;
            }
            if (s.hasShield) {
              s.hasShield = false;
              s.invulnTimer = 1.2;
              s.popups.push({
                x: s.px + 15,
                y: s.py - 8,
                text: "CAFFEINE SAVE!",
                color: "#D96B27",
                ttl: 1.1,
              });
              playRetroBeep(audioCtxRef.current, 310, 0.14, "sawtooth");
              continue;
            }

            // Game Over
            s.status = "gameover";
            const finalScore = Math.floor(s.score);
            if (finalScore > s.highScore) {
              s.highScore = finalScore;
              try {
                window.localStorage.setItem(
                  HIGH_SCORE_KEY,
                  String(finalScore)
                );
                window.dispatchEvent(new Event(HIGH_SCORE_EVENT));
              } catch {
                // Ignore storage write issues
              }
            }
            const reason =
              DEATH_REASONS[Math.floor(Math.random() * DEATH_REASONS.length)];
            playRetroBeep(audioCtxRef.current, 180, 0.22, "sawtooth", 0.09);
            setStatus("gameover");
            syncHud(reason);
            break;
          }

          remaining.push(item);
        }

        if (s.status === "playing") {
          s.items = remaining;
        }

        s.popups = s.popups
          .map((p) => ({ ...p, y: p.y - 26 * dt, ttl: p.ttl - dt }))
          .filter((p) => p.ttl > 0);

        hudTicker += dt;
        if (hudTicker >= 0.12) {
          hudTicker = 0;
          syncHud();
        }
      }

      drawScene();
      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, [syncHud]);

  return (
    <div className="ink-card overflow-hidden rounded-3xl p-4 sm:p-6">
      {/* Top HUD Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-[var(--border-soft)] pb-4">
        <div>
          <h3 className="font-serif-display text-xl font-bold text-[var(--ink-primary)] sm:text-2xl">
            Byte Runner — Developer Survival
          </h3>
          <p className="text-xs text-[var(--ink-secondary)]">
            Collect AI tokens (+25) &amp; coffee shields (+15). Dodge bugs &amp; crash blocks!
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="rounded-xl border-2 border-[var(--border-ink)] bg-[var(--bg-paper)] px-3 py-1.5 font-mono-tech text-xs font-bold text-[var(--ink-primary)]">
            SCORE: <span className="text-[var(--accent-orange)]">{hud.score}</span>
          </div>
          <div className="inline-flex items-center gap-1 rounded-xl border-2 border-[var(--border-soft)] bg-[var(--bg-paper)] px-3 py-1.5 font-mono-tech text-xs font-bold text-[var(--ink-primary)]">
            <Trophy className="h-3.5 w-3.5 text-[var(--accent-mustard)]" aria-hidden="true" />
            <span>BEST: {Math.max(hud.highScore, savedHighScore)}</span>
          </div>
          <div className="rounded-xl border border-[var(--border-soft)] bg-[var(--bg-beige)] px-2.5 py-1.5 font-mono-tech text-xs font-bold text-[var(--ink-secondary)]">
            WAVE {hud.wave}
          </div>
          {hud.hasShield && (
            <div className="inline-flex items-center gap-1 rounded-xl border border-[var(--border-ink)] bg-[var(--accent-orange-soft)] px-2.5 py-1.5 font-mono-tech text-xs font-bold text-[var(--accent-orange)]">
              <Shield className="h-3.5 w-3.5" aria-hidden="true" />
              <span>SHIELD</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons Row */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <div className="font-mono-tech text-[11px] text-[var(--ink-muted)]">
          Keys: <kbd className="rounded border border-[var(--border-soft)] px-1">←/→</kbd> move ·{" "}
          <kbd className="rounded border border-[var(--border-soft)] px-1">Space/↑</kbd> jump (2x) ·{" "}
          <kbd className="rounded border border-[var(--border-soft)] px-1">↓</kbd> duck ·{" "}
          <kbd className="rounded border border-[var(--border-soft)] px-1">P</kbd> pause
        </div>

        <div className="flex items-center gap-2">
          {(status === "playing" || status === "paused") && (
            <button
              type="button"
              onClick={togglePause}
              className="ink-button inline-flex items-center gap-1 rounded-xl bg-[var(--bg-paper)] px-3 py-1.5 text-xs font-bold text-[var(--ink-primary)]"
            >
              {status === "paused" ? (
                <>
                  <Play className="h-3.5 w-3.5 text-[var(--accent-green)]" aria-hidden="true" />
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
          <button
            type="button"
            onClick={resetAndStart}
            className="ink-button inline-flex items-center gap-1 rounded-xl bg-[var(--bg-paper)] px-3 py-1.5 text-xs font-bold text-[var(--ink-primary)]"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Restart</span>
          </button>
          <button
            type="button"
            onClick={() => setMuted((m) => !m)}
            aria-label={muted ? "Unmute sound effects" : "Mute sound effects"}
            aria-pressed={muted}
            className="ink-button inline-flex items-center gap-1 rounded-xl bg-[var(--bg-paper)] px-3 py-1.5 text-xs font-bold text-[var(--ink-primary)]"
          >
            {muted ? (
              <>
                <VolumeX className="h-3.5 w-3.5 text-[var(--ink-muted)]" aria-hidden="true" />
                <span>Muted</span>
              </>
            ) : (
              <>
                <Volume2 className="h-3.5 w-3.5 text-[var(--accent-green)]" aria-hidden="true" />
                <span>SFX On</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Canvas Container */}
      <div className="relative mt-4 flex min-h-[248px] items-center justify-center overflow-hidden rounded-2xl border-2 border-[var(--border-ink)] bg-[var(--bg-paper)] sm:min-h-0">
        <canvas
          ref={canvasRef}
          onClick={() => {
            if (status === "playing") triggerJump();
          }}
          className="block aspect-[720/320] w-full cursor-pointer touch-none"
          aria-label="Byte Runner playable game canvas"
        />

        {/* Start Screen Overlay */}
        {status === "start" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center overflow-y-auto bg-[var(--bg-paper)]/92 p-3.5 text-center backdrop-blur-xs sm:p-5">
            <span className="rounded-lg border border-[var(--border-ink)] bg-[var(--accent-mustard-soft)] px-2.5 py-0.5 font-mono-tech text-[10px] font-bold text-[var(--ink-primary)] sm:text-[11px]">
              MINI-GAME · ZERO DEPENDENCIES
            </span>
            <h4 className="mt-1.5 font-serif-display text-xl font-bold text-[var(--ink-primary)] sm:mt-2 sm:text-3xl">
              Survive the Sprint
            </h4>
            <p className="mt-1.5 max-w-md text-xs leading-relaxed text-[var(--ink-secondary)] sm:mt-2 sm:text-sm">
              Dodge falling <code className="font-mono-tech font-bold">SyntaxError</code> bugs and{" "}
              <code className="font-mono-tech font-bold">500</code> barriers. Grab{" "}
              <strong className="text-[var(--accent-green)]">AI tokens</strong> for points and{" "}
              <strong className="text-[var(--accent-orange)]">Chai mugs</strong> for an emergency shield.
            </p>
            <button
              type="button"
              onClick={resetAndStart}
              className="ink-button mt-3 inline-flex items-center gap-2 rounded-xl bg-[var(--accent-orange)] px-4 py-2 text-xs font-bold text-[#FFFDF9] sm:mt-4 sm:px-5 sm:py-2.5 sm:text-sm"
            >
              <Play className="h-4 w-4" aria-hidden="true" />
              <span>Start Run</span>
            </button>
          </div>
        )}

        {/* Pause Overlay */}
        {status === "paused" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center overflow-y-auto bg-[var(--bg-paper)]/88 p-4 text-center backdrop-blur-xs sm:p-5">
            <h4 className="font-serif-display text-xl font-bold text-[var(--ink-primary)] sm:text-2xl">
              Coffee Break (Paused)
            </h4>
            <button
              type="button"
              onClick={togglePause}
              className="ink-button mt-3 inline-flex items-center gap-2 rounded-xl bg-[var(--accent-green)] px-5 py-2 text-xs font-bold text-[#FFFDF9] sm:mt-4 sm:py-2.5 sm:text-sm"
            >
              <Play className="h-4 w-4" aria-hidden="true" />
              <span>Resume Run</span>
            </button>
          </div>
        )}

        {/* Game Over Overlay */}
        {status === "gameover" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center overflow-y-auto bg-[var(--bg-paper)]/94 p-3.5 text-center backdrop-blur-xs sm:p-5">
            <span className="rounded-lg border border-[var(--border-ink)] bg-[var(--accent-orange-soft)] px-2.5 py-0.5 font-mono-tech text-[10px] font-bold text-[var(--accent-orange)] sm:text-[11px]">
              BUILD FAILED · WAVE {hud.wave}
            </span>
            <h4 className="mt-1.5 font-serif-display text-lg font-bold text-[var(--ink-primary)] sm:mt-2 sm:text-2xl">
              {hud.gameOverReason}
            </h4>
            <div className="mt-2 flex flex-wrap justify-center gap-1.5 font-mono-tech text-[11px] text-[var(--ink-primary)] sm:mt-3 sm:gap-3 sm:text-xs">
              <span className="rounded-lg border border-[var(--border-soft)] bg-[var(--bg-surface)] px-2.5 py-1 sm:px-3">
                Score: <strong>{hud.score}</strong>
              </span>
              <span className="rounded-lg border border-[var(--border-soft)] bg-[var(--bg-surface)] px-2.5 py-1 sm:px-3">
                Best: <strong>{Math.max(hud.highScore, savedHighScore)}</strong>
              </span>
              <span className="rounded-lg border border-[var(--border-soft)] bg-[var(--bg-surface)] px-2.5 py-1 sm:px-3">
                AI Tokens: <strong>{hud.tokens}</strong>
              </span>
              <span className="rounded-lg border border-[var(--border-soft)] bg-[var(--bg-surface)] px-2.5 py-1 sm:px-3">
                Dodged: <strong>{hud.bugsDodged}</strong>
              </span>
            </div>
            <button
              type="button"
              onClick={resetAndStart}
              className="ink-button mt-3 inline-flex items-center gap-2 rounded-xl bg-[var(--accent-orange)] px-4 py-2 text-xs font-bold text-[#FFFDF9] sm:mt-4 sm:px-5 sm:py-2.5 sm:text-sm"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              <span>Play Again</span>
            </button>
          </div>
        )}
      </div>

      {/* Responsive Touch Controls (Desktop & Mobile friendly) */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Move left"
            onPointerDown={() => {
              simRef.current.moveLeft = true;
            }}
            onPointerUp={() => {
              simRef.current.moveLeft = false;
            }}
            onPointerLeave={() => {
              simRef.current.moveLeft = false;
            }}
            onPointerCancel={() => {
              simRef.current.moveLeft = false;
            }}
            className="ink-button flex h-12 w-14 items-center justify-center rounded-xl bg-[var(--bg-paper)] text-[var(--ink-primary)] select-none active:bg-[var(--bg-beige)]"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Move right"
            onPointerDown={() => {
              simRef.current.moveRight = true;
            }}
            onPointerUp={() => {
              simRef.current.moveRight = false;
            }}
            onPointerLeave={() => {
              simRef.current.moveRight = false;
            }}
            onPointerCancel={() => {
              simRef.current.moveRight = false;
            }}
            className="ink-button flex h-12 w-14 items-center justify-center rounded-xl bg-[var(--bg-paper)] text-[var(--ink-primary)] select-none active:bg-[var(--bg-beige)]"
          >
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Duck or fast drop"
            onPointerDown={() => setDuck(true)}
            onPointerUp={() => setDuck(false)}
            onPointerLeave={() => setDuck(false)}
            onPointerCancel={() => setDuck(false)}
            className="ink-button inline-flex h-12 items-center gap-1.5 rounded-xl bg-[var(--bg-paper)] px-4 text-xs font-bold text-[var(--ink-primary)] select-none"
          >
            <ArrowDown className="h-4 w-4" aria-hidden="true" />
            <span>Duck</span>
          </button>
          <button
            type="button"
            aria-label="Jump"
            onPointerDown={triggerJump}
            className="ink-button inline-flex h-12 items-center gap-1.5 rounded-xl bg-[var(--accent-green)] px-5 text-xs font-bold text-[#FFFDF9] select-none"
          >
            <ArrowUp className="h-4 w-4" aria-hidden="true" />
            <span>Jump</span>
          </button>
        </div>
      </div>
    </div>
  );
}
