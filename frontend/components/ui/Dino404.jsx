"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Fullscreen Interactive Pixel-Perfect Dino 404
 * Rendered with sharp HTML5 Canvas — 100% full-width horizon, zero blur on zoom!
 * Framerate-independent Delta Time Physics (identical speed on 144Hz Desktop & Mobile phones).
 */
export default function Dino404({
  title = "404 - Lạc đường rồi!",
  message = "Trang này không tồn tại hoặc đã được di chuyển. Chú khủng long VinaTap đang cố tìm lại lối đi giúp bạn!",
  backBtnText = "Quay Lại Trang Trước",
  onBack,
}) {
  const router = useRouter();
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  const handleBackNavigation = () => {
    if (onBack) {
      onBack();
      return;
    }
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let animId;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = 200);

    const resize = () => {
      if (!canvas || !canvas.parentElement) return;
      const dpr = window.devicePixelRatio || 1;
      width = canvas.parentElement.clientWidth || window.innerWidth;
      height = 200;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    // Ground position
    const groundY = 160;

    // Game state
    let gameOver = false;
    let autoPlay = true;
    let internalScore = 0;
    let baseSpeed = 5.0; // Standard speed normalized to 60fps
    let spawnTimer = 0;
    let birdWingTimer = 0;
    let birdWingFrame = 0;
    let lastTime = null;

    const dino = {
      x: Math.max(35, Math.min(width * 0.15, 120)),
      y: groundY - 44,
      w: 40,
      h: 44,
      vy: 0,
      gravity: 0.72,
      jumpForce: -13.2,
      isGrounded: true,
      legFrame: 0,
      legTimer: 0,
    };

    let obstacles = [];
    let clouds = [
      { x: width * 0.2, y: 35, speed: 0.6, w: 46 },
      { x: width * 0.6, y: 55, speed: 0.4, w: 46 },
      { x: width * 0.85, y: 25, speed: 0.5, w: 46 },
    ];
    let groundBumps = [];
    for (let i = 0; i < width; i += 20) {
      if (Math.random() < 0.35) {
        groundBumps.push({ x: i, len: 4 + Math.random() * 8 });
      }
    }

    const jump = () => {
      if (dino.isGrounded && !gameOver) {
        dino.vy = dino.jumpForce;
        dino.isGrounded = false;
      }
    };

    const handleAction = () => {
      if (gameOver) {
        // Restart game from scratch
        obstacles = [];
        internalScore = 0;
        spawnTimer = 0;
        gameOver = false;
        setIsGameOver(false);
        setScore(0);
        autoPlay = false;
        setIsPlaying(true);
        dino.y = groundY - dino.h;
        dino.vy = dino.jumpForce;
        dino.isGrounded = false;
        return;
      }

      if (autoPlay) {
        autoPlay = false;
        setIsPlaying(true);
      }
      jump();
    };

    const handleKeyDown = (e) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        handleAction();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    canvas.addEventListener("touchstart", (e) => {
      e.preventDefault();
      handleAction();
    }, { passive: false });
    canvas.addEventListener("mousedown", handleAction);

    // ─── DRAWING UTILITIES ──────────────────────────────────────────
    // 1. Draw Dino
    const drawDino = (x, y, frame, dead) => {
      ctx.fillStyle = "#22252a";

      // Head & Body
      ctx.fillRect(x + 18, y, 22, 14);
      ctx.fillRect(x + 18, y + 14, 22, 4);
      ctx.fillRect(x + 14, y + 10, 8, 20);
      ctx.fillRect(x + 6, y + 18, 20, 16);
      ctx.fillRect(x, y + 18, 6, 10);
      ctx.fillRect(x - 4, y + 14, 4, 6);
      ctx.fillRect(x + 24, y + 22, 8, 4);

      // Eye
      if (dead) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(x + 21, y + 3, 5, 5);
        ctx.fillStyle = "#ef4444";
        ctx.fillRect(x + 22, y + 4, 3, 3);
        ctx.fillStyle = "#22252a";
      } else {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(x + 22, y + 4, 3, 3);
        ctx.fillStyle = "#22252a";
      }

      // Legs
      if (dead) {
        ctx.fillRect(x + 10, y + 34, 4, 10);
        ctx.fillRect(x + 10, y + 42, 6, 2);
        ctx.fillRect(x + 20, y + 34, 4, 10);
        ctx.fillRect(x + 20, y + 42, 6, 2);
      } else if (!dino.isGrounded) {
        ctx.fillRect(x + 10, y + 34, 4, 8);
        ctx.fillRect(x + 18, y + 34, 4, 8);
      } else if (frame === 0) {
        ctx.fillRect(x + 10, y + 34, 4, 10);
        ctx.fillRect(x + 10, y + 42, 6, 2);
        ctx.fillRect(x + 20, y + 34, 4, 6);
      } else {
        ctx.fillRect(x + 10, y + 34, 4, 6);
        ctx.fillRect(x + 20, y + 34, 4, 10);
        ctx.fillRect(x + 20, y + 42, 6, 2);
      }
    };

    // 2. Draw Obstacle Variants
    const drawObstacle = (obs) => {
      ctx.fillStyle = "#334155";
      const { x, y, type, h } = obs;

      if (type === "small_single") {
        ctx.fillRect(x + 4, y - 26, 6, 26);
        ctx.fillRect(x, y - 18, 4, 4);
        ctx.fillRect(x, y - 22, 4, 6);
        ctx.fillRect(x + 10, y - 14, 4, 4);
        ctx.fillRect(x + 10, y - 20, 4, 8);
      } else if (type === "small_double") {
        ctx.fillRect(x + 4, y - 26, 5, 26);
        ctx.fillRect(x, y - 18, 4, 4);
        ctx.fillRect(x, y - 22, 4, 6);
        ctx.fillRect(x + 9, y - 14, 4, 4);
        ctx.fillRect(x + 9, y - 20, 4, 8);

        ctx.fillRect(x + 18, y - 28, 5, 28);
        ctx.fillRect(x + 14, y - 20, 4, 4);
        ctx.fillRect(x + 14, y - 24, 4, 6);
        ctx.fillRect(x + 23, y - 16, 4, 4);
        ctx.fillRect(x + 23, y - 22, 4, 8);
      } else if (type === "small_triple") {
        for (let i = 0; i < 3; i++) {
          const cx = x + i * 13;
          const ch = 24 + (i % 2) * 4;
          ctx.fillRect(cx + 3, y - ch, 5, ch);
          ctx.fillRect(cx, y - ch + 8, 3, 3);
          ctx.fillRect(cx, y - ch + 4, 3, 6);
          ctx.fillRect(cx + 8, y - ch + 10, 3, 3);
          ctx.fillRect(cx + 8, y - ch + 6, 3, 6);
        }
      } else if (type === "large_single") {
        ctx.fillRect(x + 6, y - h, 7, h);
        ctx.fillRect(x, y - h * 0.72, 6, 5);
        ctx.fillRect(x, y - h * 0.72 - 10, 5, 12);
        ctx.fillRect(x + 13, y - h * 0.52, 6, 5);
        ctx.fillRect(x + 15, y - h * 0.52 - 12, 5, 14);
      } else if (type === "large_double") {
        ctx.fillRect(x + 5, y - 42, 6, 42);
        ctx.fillRect(x, y - 30, 5, 4);
        ctx.fillRect(x, y - 38, 4, 10);
        ctx.fillRect(x + 11, y - 24, 5, 4);
        ctx.fillRect(x + 12, y - 32, 4, 10);

        ctx.fillRect(x + 22, y - 46, 7, 46);
        ctx.fillRect(x + 17, y - 32, 5, 4);
        ctx.fillRect(x + 17, y - 40, 4, 10);
        ctx.fillRect(x + 29, y - 26, 5, 4);
        ctx.fillRect(x + 30, y - 36, 4, 12);
      } else if (type === "bird") {
        ctx.fillStyle = "#1e293b";
        ctx.fillRect(x + 8, y - 10, 16, 6);
        ctx.fillRect(x + 24, y - 12, 8, 4);
        ctx.fillRect(x + 2, y - 8, 6, 3);
        ctx.fillRect(x + 20, y - 12, 2, 2);
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(x + 22, y - 11, 2, 2);
        ctx.fillStyle = "#1e293b";

        if (birdWingFrame === 0) {
          ctx.fillRect(x + 10, y - 20, 6, 10);
          ctx.fillRect(x + 6, y - 24, 6, 6);
        } else {
          ctx.fillRect(x + 10, y - 4, 6, 10);
          ctx.fillRect(x + 6, y + 4, 6, 6);
        }
      }
    };

    // 3. Draw Cloud
    const drawCloud = (x, y) => {
      ctx.fillStyle = "#94a3b8";
      ctx.fillRect(x + 12, y, 24, 4);
      ctx.fillRect(x + 4, y + 4, 38, 4);
      ctx.fillRect(x, y + 8, 46, 6);
    };

    // ─── MAIN ANIMATION LOOP WITH DELTA TIME ─────────────────────────
    const loop = (timestamp) => {
      if (!lastTime) lastTime = timestamp;
      const elapsed = (timestamp - lastTime) / 1000;
      lastTime = timestamp;

      // Normalize to 60fps (max dt capped at 0.05s to prevent huge jumps)
      const dt = Math.min(elapsed, 0.05);
      const timeFactor = dt * 60;

      ctx.clearRect(0, 0, width, height);

      // 1. Clouds
      clouds.forEach((c) => {
        if (!gameOver) {
          c.x -= c.speed * timeFactor;
          if (c.x < -60) c.x = width + 20;
        }
        drawCloud(c.x, c.y);
      });

      // 2. Horizon Ground Line
      ctx.strokeStyle = "#475569";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      ctx.lineTo(width, groundY);
      ctx.stroke();

      // Ground bumps
      ctx.fillStyle = "#64748b";
      groundBumps.forEach((b) => {
        if (!gameOver) {
          b.x -= baseSpeed * timeFactor;
          if (b.x < -20) b.x = width + Math.random() * 20;
        }
        ctx.fillRect(b.x, groundY + 4, b.len, 2);
      });

      if (!gameOver) {
        // 3. Dino Physics
        dino.y += dino.vy * timeFactor;
        if (dino.y + dino.h < groundY) {
          dino.vy += dino.gravity * timeFactor;
          dino.isGrounded = false;
        } else {
          dino.y = groundY - dino.h;
          dino.vy = 0;
          dino.isGrounded = true;
        }

        dino.legTimer += timeFactor;
        if (dino.legTimer > 5) {
          dino.legFrame = dino.legFrame === 0 ? 1 : 0;
          dino.legTimer = 0;
        }

        birdWingTimer += timeFactor;
        if (birdWingTimer > 8) {
          birdWingFrame = birdWingFrame === 0 ? 1 : 0;
          birdWingTimer = 0;
        }

        // 4. Random Obstacle Spawner (Time-normalized)
        spawnTimer += timeFactor;
        const spawnInterval = Math.max(65, 80 - Math.floor(internalScore / 150)) + Math.random() * 55;

        if (spawnTimer > spawnInterval) {
          const rand = Math.random();
          let newObs;

          if (internalScore > 120 && rand < 0.25) {
            const birdAltitude = Math.random() < 0.5 ? groundY - 32 : groundY - 48;
            newObs = {
              x: width + 30,
              y: birdAltitude,
              w: 32,
              h: 22,
              type: "bird",
            };
          } else if (rand < 0.3) {
            newObs = { x: width + 20, y: groundY, w: 16, h: 26, type: "small_single" };
          } else if (rand < 0.55) {
            newObs = { x: width + 20, y: groundY, w: 30, h: 28, type: "small_double" };
          } else if (rand < 0.72) {
            newObs = { x: width + 20, y: groundY, w: 42, h: 28, type: "small_triple" };
          } else if (rand < 0.88) {
            newObs = { x: width + 20, y: groundY, w: 20, h: 42, type: "large_single" };
          } else {
            newObs = { x: width + 20, y: groundY, w: 38, h: 46, type: "large_double" };
          }

          obstacles.push(newObs);
          spawnTimer = 0;
        }

        // 5. Obstacles Movement & Collision
        for (let i = obstacles.length - 1; i >= 0; i--) {
          const obs = obstacles[i];
          obs.x -= baseSpeed * timeFactor;

          // Auto-play AI Jump / Dodge
          if (autoPlay && obs.x - dino.x < 85 && obs.x - dino.x > 20) {
            jump();
          }

          // Check Collision
          if (!autoPlay) {
            const dinoBox = {
              left: dino.x + 8,
              right: dino.x + dino.w - 8,
              top: dino.y + 4,
              bottom: dino.y + dino.h,
            };

            const obsTop = obs.type === "bird" ? obs.y - obs.h : obs.y - obs.h;
            const obsBottom = obs.type === "bird" ? obs.y : obs.y;
            const obsBox = {
              left: obs.x + 3,
              right: obs.x + obs.w - 3,
              top: obsTop + 2,
              bottom: obsBottom,
            };

            const isColliding =
              dinoBox.right > obsBox.left &&
              dinoBox.left < obsBox.right &&
              dinoBox.bottom > obsBox.top &&
              dinoBox.top < obsBox.bottom;

            if (isColliding) {
              gameOver = true;
              setIsGameOver(true);
            }
          }

          // Score update
          if (obs.x < -45) {
            obstacles.splice(i, 1);
            if (!autoPlay && !gameOver) {
              internalScore += 10;
              setScore(internalScore);
            }
          }
        }
      }

      // 6. Draw Obstacles
      obstacles.forEach(drawObstacle);

      // 7. Draw Dino
      drawDino(dino.x, dino.y, dino.legFrame, gameOver);

      // 8. Game Over Overlay
      if (gameOver) {
        ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
        ctx.font = "bold 16px 'Courier New', monospace";
        ctx.textAlign = "center";
        ctx.fillText("💥 GAME OVER", width / 2, 70);
        ctx.font = "13px 'Courier New', monospace";
        ctx.fillStyle = "#64748b";
        ctx.fillText("Nhấn SPACE hoặc Chạm để chơi lại từ đầu", width / 2, 95);
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        background: "radial-gradient(circle at 50% 30%, #ffffff 0%, #f8fafc 100%)",
        overflowX: "hidden",
        position: "relative",
        boxSizing: "border-box",
        padding: "2rem 1rem",
      }}
    >
      {/* Interactive Full-Width Horizon Canvas */}
      <div
        style={{
          width: "100%",
          maxWidth: "100vw",
          position: "relative",
          cursor: "pointer",
        }}
        title="Nhấn phím Space hoặc chạm vào màn hình để chơi nhảy vượt rào!"
      >
        <canvas
          ref={canvasRef}
          style={{
            width: "100%",
            height: "200px",
            display: "block",
          }}
        />

        {/* Small Game Score Badge */}
        {isPlaying && (
          <div
            style={{
              position: "absolute",
              top: "10px",
              right: "24px",
              background: isGameOver ? "rgba(220, 38, 38, 0.85)" : "rgba(15, 23, 42, 0.75)",
              color: "#ffffff",
              padding: "4px 14px",
              borderRadius: "999px",
              fontSize: "0.85rem",
              fontFamily: "monospace",
              fontWeight: 800,
              letterSpacing: "1px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              transition: "background-color 0.2s ease",
            }}
          >
            {isGameOver ? `💥 GAME OVER — ĐIỂM: ${score}` : `🏃 ĐIỂM: ${score}`}
          </div>
        )}
      </div>

      {/* 404 Headline & Details */}
      <div
        style={{
          maxWidth: "600px",
          margin: "1.5rem auto 0",
          padding: "0 1rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h1
          style={{
            fontSize: "clamp(2.4rem, 6vw, 3.8rem)",
            fontWeight: 900,
            color: "#0f172a",
            letterSpacing: "-0.035em",
            lineHeight: 1.1,
            margin: 0,
          }}
        >
          {title}
        </h1>

        <p
          style={{
            marginTop: "0.75rem",
            color: "#64748b",
            fontSize: "clamp(0.95rem, 2.5vw, 1.15rem)",
            lineHeight: 1.6,
            maxWidth: "520px",
          }}
        >
          {message}
        </p>

        {/* Action CTA: Nút Quay Lại */}
        <div
          style={{
            display: "flex",
            marginTop: "1.75rem",
            justifyContent: "center",
          }}
        >
          <button
            onClick={handleBackNavigation}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "0.9rem 2.4rem",
              borderRadius: "999px",
              background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
              color: "#ffffff",
              fontWeight: 800,
              fontSize: "1.05rem",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 12px 28px rgba(5, 150, 105, 0.35)",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 16px 32px rgba(5, 150, 105, 0.45)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 12px 28px rgba(5, 150, 105, 0.35)";
            }}
          >
            ← {backBtnText}
          </button>
        </div>

        <p
          style={{
            marginTop: "1.75rem",
            fontSize: "0.82rem",
            color: "#94a3b8",
            letterSpacing: "0.3px",
          }}
        >
          💡 Mẹo: Nhấn <b>Phím Space</b> hoặc <b>Chạm màn hình</b> để chơi nhảy rào cùng khủng long!
        </p>
      </div>
    </div>
  );
}
