import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Shield, Award, Layers, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Zap } from 'lucide-react';

export default function GameCanvas({ gameConfig, onClose }) {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('READY'); // READY, PLAYING, PAUSED, GAMEOVER
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [muted, setMuted] = useState(false);

  const title = gameConfig?.title || "Galactic Strike AI";
  const gameType = gameConfig?.game_type || "space_shooter";
  const theme = gameConfig?.theme || {};
  const playerColor = theme.player_color || "#00f0ff";
  const enemyColor = theme.enemy_color || "#ff0055";
  const accentColor = theme.accent_color || "#a855f7";

  // Ref to hold dynamic game loop variables without causing React re-renders every frame
  const engineRef = useRef({
    keys: {},
    player: { x: 400, y: 400, w: 40, h: 30, vx: 0, vy: 0, lives: 3, radius: 15 },
    bullets: [],
    enemies: [],
    particles: [],
    obstacles: [],
    snake: [{ x: 10, y: 10 }],
    snakeDir: { x: 1, y: 0 },
    food: { x: 5, y: 5 },
    pongBall: { x: 400, y: 250, vx: 5, vy: 4, radius: 8 },
    paddlePlayer: { y: 200, h: 90, w: 15 },
    paddleAi: { y: 200, h: 90, w: 15 },
    bricks: [],
    flappyY: 250,
    flappyVy: 0,
    flappyPipes: [],
    memoryCards: [],
    memoryFlipped: [],
    memoryMatched: 0,
    lastSpawn: 0,
    score: 0,
    level: 1,
    lives: 3
  });

  // Web Audio Synthesizer
  const playAudio = (type) => {
    if (muted) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'shoot') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
      } else if (type === 'hit' || type === 'explosion') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.25);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.25);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      } else if (type === 'point') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523, ctx.currentTime);
        osc.frequency.setValueAtTime(659, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      }
    } catch (e) {
      // Audio context ignored if blocked by browser policy
    }
  };

  // Memory Game Initialization helper
  const initMemoryGame = () => {
    const symbols = ["🚀", "⚡", "🔮", "👾", "💎", "🛡️"];
    const deck = [...symbols, ...symbols].sort(() => Math.random() - 0.5);
    engineRef.current.memoryCards = deck.map((sym, i) => ({
      id: i,
      symbol: sym,
      flipped: false,
      matched: false
    }));
    engineRef.current.memoryFlipped = [];
    engineRef.current.memoryMatched = 0;
  };

  // Reset Game Engine State
  const resetEngine = () => {
    const eng = engineRef.current;
    eng.score = 0;
    eng.level = 1;
    eng.lives = 3;
    eng.player = { x: 380, y: 420, w: 40, h: 30, vx: 0, vy: 0, lives: 3, radius: 18 };
    eng.bullets = [];
    eng.enemies = [];
    eng.particles = [];
    eng.obstacles = [];
    eng.snake = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
    eng.snakeDir = { x: 1, y: 0 };
    eng.food = { x: Math.floor(Math.random() * 35) + 2, y: Math.floor(Math.random() * 20) + 2 };
    eng.pongBall = { x: 400, y: 250, vx: 5, vy: 4, radius: 8 };
    eng.paddlePlayer = { y: 200, h: 90, w: 15 };
    eng.paddleAi = { y: 200, h: 90, w: 15 };
    eng.flappyY = 250;
    eng.flappyVy = 0;
    eng.flappyPipes = [];

    // Init Bricks for Breakout
    const bricks = [];
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 9; c++) {
        bricks.push({
          x: 40 + c * 80,
          y: 40 + r * 25,
          w: 70,
          h: 18,
          active: true,
          color: r % 2 === 0 ? playerColor : enemyColor
        });
      }
    }
    eng.bricks = bricks;

    if (gameType === "memory_puzzle") {
      initMemoryGame();
    }

    setScore(0);
    setLives(3);
    setLevel(1);
  };

  // Controls Event Listeners
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }
      engineRef.current.keys[e.key] = TrueKey(e.key);

      // Space action / Shoot trigger
      if (e.key === ' ' && gameState === 'PLAYING') {
        triggerAction();
      }
    };

    const handleKeyUp = (e) => {
      delete engineRef.current.keys[e.key];
      delete engineRef.current.keys[TrueKey(e.key)];
    };

    const TrueKey = (k) => {
      if (k === 'ArrowUp' || k === 'w' || k === 'W') return 'UP';
      if (k === 'ArrowDown' || k === 's' || k === 'S') return 'DOWN';
      if (k === 'ArrowLeft' || k === 'a' || k === 'A') return 'LEFT';
      if (k === 'ArrowRight' || k === 'd' || k === 'D') return 'RIGHT';
      if (k === ' ') return 'SPACE';
      return k;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState, gameType]);

  // Action Button Trigger (Shoot/Jump/Flap)
  const triggerAction = () => {
    const eng = engineRef.current;
    if (gameType === 'space_shooter' || gameType === 'topdown_shooter') {
      eng.bullets.push({
        x: eng.player.x + (gameType === 'space_shooter' ? eng.player.w / 2 : 0),
        y: eng.player.y,
        vx: 0,
        vy: -10,
        radius: 4
      });
      playAudio('shoot');
    } else if (gameType === 'endless_runner') {
      if (eng.player.y >= 370) {
        eng.player.vy = -13;
        playAudio('shoot');
      }
    } else if (gameType === 'flappy') {
      eng.flappyVy = -7.5;
      playAudio('shoot');
    }
  };

  // Main Canvas Render Loop
  useEffect(() => {
    let animId;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const render = () => {
      const eng = engineRef.current;
      const width = canvas.width;
      const height = canvas.height;

      // 1. Clear background
      ctx.fillStyle = '#070913';
      ctx.fillRect(0, 0, width, height);

      // Grid Pattern Overlay
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      if (gameState === 'PLAYING') {
        // --- GAME TYPE LOGIC UPDATE ---
        if (gameType === 'space_shooter') {
          // Player movement
          if (eng.keys['LEFT'] && eng.player.x > 10) eng.player.x -= 6;
          if (eng.keys['RIGHT'] && eng.player.x < width - 50) eng.player.x += 6;
          if (eng.keys['UP'] && eng.player.y > 10) eng.player.y -= 5;
          if (eng.keys['DOWN'] && eng.player.y < height - 40) eng.player.y += 5;

          // Spawn enemies
          if (Date.now() - eng.lastSpawn > Math.max(400, 1400 - eng.level * 100)) {
            eng.enemies.push({
              x: Math.random() * (width - 40) + 20,
              y: -30,
              w: 32,
              h: 30,
              vy: 2 + eng.level * 0.5
            });
            eng.lastSpawn = Date.now();
          }

          // Update Bullets
          eng.bullets.forEach((b, i) => {
            b.y += b.vy;
            if (b.y < -10) eng.bullets.splice(i, 1);
          });

          // Update Enemies & Collision
          eng.enemies.forEach((en, ei) => {
            en.y += en.vy;

            // Check hit with player
            if (
              en.x < eng.player.x + eng.player.w &&
              en.x + en.w > eng.player.x &&
              en.y < eng.player.y + eng.player.h &&
              en.y + en.h > eng.player.y
            ) {
              eng.enemies.splice(ei, 1);
              eng.lives -= 1;
              playAudio('hit');
              setLives(eng.lives);
              if (eng.lives <= 0) {
                setGameState('GAMEOVER');
              }
            }

            // Check hit with bullets
            eng.bullets.forEach((b, bi) => {
              if (
                b.x > en.x &&
                b.x < en.x + en.w &&
                b.y > en.y &&
                b.y < en.y + en.h
              ) {
                // Spawn particle burst
                for (let p = 0; p < 8; p++) {
                  eng.particles.push({
                    x: en.x + 16,
                    y: en.y + 15,
                    vx: (Math.random() - 0.5) * 6,
                    vy: (Math.random() - 0.5) * 6,
                    life: 20,
                    color: enemyColor
                  });
                }

                eng.enemies.splice(ei, 1);
                eng.bullets.splice(bi, 1);
                eng.score += 100;
                playAudio('point');
                setScore(eng.score);
                if (eng.score > highScore) setHighScore(eng.score);

                // Level Up Check
                if (eng.score >= eng.level * 800) {
                  eng.level += 1;
                  setLevel(eng.level);
                }
              }
            });

            if (en.y > height + 20) eng.enemies.splice(ei, 1);
          });

          // Draw Player Ship
          ctx.shadowBlur = 15;
          ctx.shadowColor = playerColor;
          ctx.fillStyle = playerColor;
          ctx.beginPath();
          ctx.moveTo(eng.player.x + 20, eng.player.y);
          ctx.lineTo(eng.player.x + 40, eng.player.y + 30);
          ctx.lineTo(eng.player.x, eng.player.y + 30);
          ctx.closePath();
          ctx.fill();

          // Draw Bullets
          ctx.fillStyle = '#00f0ff';
          eng.bullets.forEach((b) => {
            ctx.fillRect(b.x - 2, b.y, 4, 12);
          });

          // Draw Enemies
          ctx.shadowColor = enemyColor;
          ctx.fillStyle = enemyColor;
          eng.enemies.forEach((en) => {
            ctx.fillRect(en.x, en.y, en.w, en.h);
          });
        }
        else if (gameType === 'endless_runner') {
          // Runner Gravity update
          eng.player.vy += 0.6;
          eng.player.y += eng.player.vy;

          if (eng.player.y >= 380) {
            eng.player.y = 380;
            eng.player.vy = 0;
          }

          // Spawn runner obstacles
          if (Date.now() - eng.lastSpawn > 1600) {
            eng.obstacles.push({
              x: width + 20,
              y: 380,
              w: 25,
              h: 40,
              speed: 6 + eng.level * 0.5
            });
            eng.lastSpawn = Date.now();
          }

          // Update Obstacles
          eng.obstacles.forEach((ob, oi) => {
            ob.x -= ob.speed;

            // Collision check
            if (
              100 < ob.x + ob.w &&
              100 + 30 > ob.x &&
              eng.player.y < ob.y + ob.h &&
              eng.player.y + 40 > ob.y
            ) {
              setGameState('GAMEOVER');
              playAudio('hit');
            }

            if (ob.x < -40) {
              eng.obstacles.splice(oi, 1);
              eng.score += 50;
              setScore(eng.score);
              if (eng.score > highScore) setHighScore(eng.score);
            }
          });

          // Draw Ground Line
          ctx.strokeStyle = accentColor;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(0, 420);
          ctx.lineTo(width, 420);
          ctx.stroke();

          // Draw Runner
          ctx.shadowBlur = 12;
          ctx.shadowColor = playerColor;
          ctx.fillStyle = playerColor;
          ctx.fillRect(100, eng.player.y, 30, 40);

          // Draw Obstacles
          ctx.shadowColor = enemyColor;
          ctx.fillStyle = enemyColor;
          eng.obstacles.forEach((ob) => {
            ctx.fillRect(ob.x, ob.y, ob.w, ob.h);
          });
        }
        else if (gameType === 'snake') {
          // Snake tick timer
          if (Date.now() - eng.lastSpawn > 110) {
            if (eng.keys['LEFT'] && eng.snakeDir.x !== 1) eng.snakeDir = { x: -1, y: 0 };
            if (eng.keys['RIGHT'] && eng.snakeDir.x !== -1) eng.snakeDir = { x: 1, y: 0 };
            if (eng.keys['UP'] && eng.snakeDir.y !== 1) eng.snakeDir = { x: 0, y: -1 };
            if (eng.keys['DOWN'] && eng.snakeDir.y !== -1) eng.snakeDir = { x: 0, y: 1 };

            const head = {
              x: eng.snake[0].x + eng.snakeDir.x,
              y: eng.snake[0].y + eng.snakeDir.y
            };

            // Wall Collision
            if (head.x < 0 || head.x >= 40 || head.y < 0 || head.y >= 25) {
              setGameState('GAMEOVER');
              playAudio('hit');
            } else {
              eng.snake.unshift(head);

              // Check Food Collision
              if (head.x === eng.food.x && head.y === eng.food.y) {
                eng.score += 100;
                playAudio('point');
                setScore(eng.score);
                if (eng.score > highScore) setHighScore(eng.score);
                eng.food = {
                  x: Math.floor(Math.random() * 38) + 1,
                  y: Math.floor(Math.random() * 23) + 1
                };
              } else {
                eng.snake.pop();
              }
            }

            eng.lastSpawn = Date.now();
          }

          // Draw Food
          ctx.shadowBlur = 15;
          ctx.shadowColor = enemyColor;
          ctx.fillStyle = enemyColor;
          ctx.fillRect(eng.food.x * 20, eng.food.y * 20, 18, 18);

          // Draw Snake Body
          ctx.shadowColor = playerColor;
          ctx.fillStyle = playerColor;
          eng.snake.forEach((seg, i) => {
            ctx.fillRect(seg.x * 20, seg.y * 20, 18, 18);
          });
        }
        else if (gameType === 'pong') {
          // Pong Paddle AI Movement
          if (eng.keys['UP'] && eng.paddlePlayer.y > 10) eng.paddlePlayer.y -= 7;
          if (eng.keys['DOWN'] && eng.paddlePlayer.y < height - 100) eng.paddlePlayer.y += 7;

          // AI Paddle follows ball
          if (eng.pongBall.y > eng.paddleAi.y + 45) eng.paddleAi.y += 4.5;
          else if (eng.pongBall.y < eng.paddleAi.y + 45) eng.paddleAi.y -= 4.5;

          // Ball Movement
          eng.pongBall.x += eng.pongBall.vx;
          eng.pongBall.y += eng.pongBall.vy;

          if (eng.pongBall.y <= 10 || eng.pongBall.y >= height - 10) {
            eng.pongBall.vy *= -1;
            playAudio('hit');
          }

          // Player Paddle Collision
          if (
            eng.pongBall.x <= 35 &&
            eng.pongBall.y >= eng.paddlePlayer.y &&
            eng.pongBall.y <= eng.paddlePlayer.y + 90
          ) {
            eng.pongBall.vx = Math.abs(eng.pongBall.vx) + 0.3;
            playAudio('shoot');
            eng.score += 50;
            setScore(eng.score);
          }

          // AI Paddle Collision
          if (
            eng.pongBall.x >= width - 35 &&
            eng.pongBall.y >= eng.paddleAi.y &&
            eng.pongBall.y <= eng.paddleAi.y + 90
          ) {
            eng.pongBall.vx = -Math.abs(eng.pongBall.vx) - 0.3;
            playAudio('shoot');
          }

          // Out of bounds
          if (eng.pongBall.x < 0) {
            setGameState('GAMEOVER');
            playAudio('hit');
          } else if (eng.pongBall.x > width) {
            eng.score += 200;
            setScore(eng.score);
            eng.pongBall = { x: 400, y: 250, vx: 5, vy: 4, radius: 8 };
          }

          // Draw Paddles & Ball
          ctx.fillStyle = playerColor;
          ctx.fillRect(20, eng.paddlePlayer.y, 15, 90);
          ctx.fillStyle = enemyColor;
          ctx.fillRect(width - 35, eng.paddleAi.y, 15, 90);

          ctx.shadowBlur = 10;
          ctx.shadowColor = '#00f0ff';
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(eng.pongBall.x, eng.pongBall.y, 8, 0, Math.PI * 2);
          ctx.fill();
        }
        else if (gameType === 'breakout') {
          // Breakout Paddle Movement
          if (eng.keys['LEFT'] && eng.player.x > 10) eng.player.x -= 7;
          if (eng.keys['RIGHT'] && eng.player.x < width - 110) eng.player.x += 7;

          // Ball Movement
          eng.pongBall.x += eng.pongBall.vx;
          eng.pongBall.y += eng.pongBall.vy;

          if (eng.pongBall.x <= 10 || eng.pongBall.x >= width - 10) eng.pongBall.vx *= -1;
          if (eng.pongBall.y <= 10) eng.pongBall.vy *= -1;

          // Paddle Collision
          if (
            eng.pongBall.y >= height - 40 &&
            eng.pongBall.x >= eng.player.x &&
            eng.pongBall.x <= eng.player.x + 100
          ) {
            eng.pongBall.vy = -Math.abs(eng.pongBall.vy);
            playAudio('shoot');
          }

          // Brick Collision
          eng.bricks.forEach((b) => {
            if (b.active) {
              if (
                eng.pongBall.x > b.x &&
                eng.pongBall.x < b.x + b.w &&
                eng.pongBall.y > b.y &&
                eng.pongBall.y < b.y + b.h
              ) {
                b.active = false;
                eng.pongBall.vy *= -1;
                eng.score += 100;
                playAudio('point');
                setScore(eng.score);
              }
            }
          });

          if (eng.pongBall.y > height + 20) {
            setGameState('GAMEOVER');
            playAudio('hit');
          }

          // Draw Bricks
          eng.bricks.forEach((b) => {
            if (b.active) {
              ctx.fillStyle = b.color;
              ctx.fillRect(b.x, b.y, b.w, b.h);
            }
          });

          // Draw Paddle & Ball
          ctx.fillStyle = playerColor;
          ctx.fillRect(eng.player.x, height - 30, 100, 15);
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(eng.pongBall.x, eng.pongBall.y, 7, 0, Math.PI * 2);
          ctx.fill();
        }
        else {
          // Default Fallback Space Shooter rendering
          ctx.fillStyle = playerColor;
          ctx.fillRect(eng.player.x, eng.player.y, 30, 30);
        }

        // Draw Particles
        eng.particles.forEach((pt, pi) => {
          pt.x += pt.vx;
          pt.y += pt.vy;
          pt.life -= 1;
          ctx.fillStyle = pt.color || playerColor;
          ctx.fillRect(pt.x, pt.y, 3, 3);
          if (pt.life <= 0) eng.particles.splice(pi, 1);
        });

      } else {
        // Overlay for READY / GAMEOVER / PAUSED
        ctx.fillStyle = 'rgba(7, 9, 19, 0.85)';
        ctx.fillRect(0, 0, width, height);

        ctx.textAlign = 'center';

        if (gameState === 'READY') {
          ctx.fillStyle = '#00f0ff';
          ctx.font = 'bold 28px Outfit, sans-serif';
          ctx.fillText(title.toUpperCase(), width / 2, height / 2 - 40);

          ctx.fillStyle = '#ffffff';
          ctx.font = '14px Outfit, sans-serif';
          ctx.fillText('Press START or Spacebar to Play', width / 2, height / 2 + 10);
          ctx.fillText('Controls: WASD / Arrow Keys to Move, Spacebar to Shoot/Action', width / 2, height / 2 + 40);
        } else if (gameState === 'PAUSED') {
          ctx.fillStyle = '#a855f7';
          ctx.font = 'bold 36px Outfit, sans-serif';
          ctx.fillText('GAME PAUSED', width / 2, height / 2);
        } else if (gameState === 'GAMEOVER') {
          ctx.fillStyle = '#ff0055';
          ctx.font = 'bold 36px Outfit, sans-serif';
          ctx.fillText('GAME OVER', width / 2, height / 2 - 30);

          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 20px Outfit, sans-serif';
          ctx.fillText(`Final Score: ${eng.score}`, width / 2, height / 2 + 10);

          ctx.fillStyle = '#94a3b8';
          ctx.font = '14px Outfit, sans-serif';
          ctx.fillText('Click Restart to Try Again', width / 2, height / 2 + 50);
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [gameState, gameType, playerColor, enemyColor, accentColor, title]);

  const handleStart = () => {
    resetEngine();
    setGameState('PLAYING');
  };

  const handlePause = () => {
    setGameState(prev => prev === 'PLAYING' ? 'PAUSED' : 'PLAYING');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-4xl glass-panel rounded-3xl border border-cyan-500/30 shadow-2xl p-6 bg-[#070913] flex flex-col items-center gap-4">
        
        {/* Top Header Bar */}
        <div className="w-full flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <h2 className="text-xl font-black text-white flex items-center gap-2 gradient-text-cyan">
              <Zap className="w-5 h-5 text-cyan-400" /> {title}
            </h2>
            <span className="text-xs text-gray-400 uppercase tracking-wider">
              Template: <span className="text-cyan-300 font-semibold">{gameType}</span>
            </span>
          </div>

          {/* HUD Metrics */}
          <div className="flex items-center gap-4 bg-slate-900/80 px-4 py-2 rounded-2xl border border-white/10 text-sm font-bold text-white">
            <div className="flex items-center gap-1.5 text-amber-300">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Score: {score}</span>
            </div>
            <div className="flex items-center gap-1.5 text-rose-400">
              <Shield className="w-4 h-4 text-rose-400" />
              <span>Lives: {lives}</span>
            </div>
            <div className="flex items-center gap-1.5 text-purple-300">
              <Layers className="w-4 h-4 text-purple-400" />
              <span>Level: {level}</span>
            </div>
          </div>

          {/* Close & Sound Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMuted(!muted)}
              className="p-2 rounded-xl bg-slate-800 text-gray-300 hover:text-white border border-white/10"
              title={muted ? "Unmute Sound" : "Mute Sound"}
            >
              {muted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-bold"
            >
              Exit Engine
            </button>
          </div>
        </div>

        {/* HTML5 Canvas Viewport */}
        <div className="relative w-full overflow-hidden rounded-2xl border border-cyan-500/40 shadow-neon-cyan scanlines bg-black flex items-center justify-center">
          <canvas
            ref={canvasRef}
            width={800}
            height={500}
            className="w-full max-h-[60vh] object-contain cursor-crosshair"
          />
        </div>

        {/* Game Engine Control Bar */}
        <div className="w-full flex flex-wrap items-center justify-between gap-4 pt-2">
          {/* Controls Overlay */}
          <div className="flex items-center gap-3">
            {gameState !== 'PLAYING' ? (
              <button
                onClick={handleStart}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-sm transition-all shadow-lg shadow-cyan-500/30"
              >
                <Play className="w-4 h-4 fill-black" /> {gameState === 'GAMEOVER' ? 'Play Again' : 'Start Game'}
              </button>
            ) : (
              <button
                onClick={handlePause}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm transition-all shadow-lg shadow-purple-500/30"
              >
                <Pause className="w-4 h-4" /> Pause
              </button>
            )}

            <button
              onClick={resetEngine}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-gray-300 text-xs font-semibold border border-white/10"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Restart
            </button>
          </div>

          {/* Virtual Mobile Controls */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 font-medium hidden sm:inline">On-screen Mobile Controls:</span>
            <button
              onClick={() => {
                engineRef.current.keys['LEFT'] = true;
                setTimeout(() => delete engineRef.current.keys['LEFT'], 150);
              }}
              className="p-2.5 rounded-lg bg-slate-800 border border-white/10 text-cyan-300 active:bg-cyan-500 active:text-black"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                engineRef.current.keys['UP'] = true;
                setTimeout(() => delete engineRef.current.keys['UP'], 150);
              }}
              className="p-2.5 rounded-lg bg-slate-800 border border-white/10 text-cyan-300 active:bg-cyan-500 active:text-black"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                engineRef.current.keys['DOWN'] = true;
                setTimeout(() => delete engineRef.current.keys['DOWN'], 150);
              }}
              className="p-2.5 rounded-lg bg-slate-800 border border-white/10 text-cyan-300 active:bg-cyan-500 active:text-black"
            >
              <ArrowDown className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                engineRef.current.keys['RIGHT'] = true;
                setTimeout(() => delete engineRef.current.keys['RIGHT'], 150);
              }}
              className="p-2.5 rounded-lg bg-slate-800 border border-white/10 text-cyan-300 active:bg-cyan-500 active:text-black"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={triggerAction}
              className="px-4 py-2 rounded-lg bg-rose-500 hover:bg-rose-400 text-white text-xs font-black shadow-md shadow-rose-500/30"
            >
              SHOOT / JUMP
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
