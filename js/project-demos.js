/**
 * PROJECT-DEMOS.JS
 * Playable Mini-Engines & Card Visualizations
 * 1. 2.5D DDA Raycaster Engine (Wolfenstein / Raylib style)
 * 2. Verlet Physics & Cloth Rope Sandbox
 * 3. Modal management and keyboard controls
 */

const ProjectDemos = (function () {
  'use strict';

  let activeDemoType = null;
  let animFrameId = null;
  let modalCanvas = null;
  let modalCtx = null;

  // --- 1. AETHERIA: 2.5D DDA RAYCASTER ENGINE ---
  const Raycaster = {
    map: [
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],
      [1,0,1,1,0,0,1,0,1,1,1,1,0,1,0,1],
      [1,0,1,0,0,0,0,0,0,0,0,1,0,1,0,1],
      [1,0,1,0,1,1,1,0,1,0,0,1,0,1,0,1],
      [1,0,0,0,1,0,0,0,1,0,0,0,0,1,0,1],
      [1,0,1,0,1,0,1,0,1,1,1,1,0,1,0,1],
      [1,0,1,0,0,0,1,0,0,0,0,1,0,0,0,1],
      [1,0,1,1,1,0,1,1,1,0,0,1,0,1,0,1],
      [1,0,0,0,1,0,0,0,1,0,0,0,0,1,0,1],
      [1,1,1,0,1,1,0,0,1,0,1,1,1,1,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ],
    player: {
      x: 2.5,
      y: 2.5,
      dirX: -1,
      dirY: 0,
      planeX: 0,
      planeY: 0.66,
      rotSpeed: 0.045,
      moveSpeed: 0.065
    },
    keys: {
      w: false,
      s: false,
      a: false,
      d: false,
      ArrowUp: false,
      ArrowDown: false,
      ArrowLeft: false,
      ArrowRight: false
    },

    init: function () {
      this.player.x = 2.5;
      this.player.y = 2.5;
      this.player.dirX = -1;
      this.player.dirY = 0;
      this.player.planeX = 0;
      this.player.planeY = 0.66;
    },

    update: function () {
      const p = this.player;
      const m = this.map;

      // Rotate
      let rot = 0;
      if (this.keys.a || this.keys.ArrowLeft) rot = -p.rotSpeed;
      if (this.keys.d || this.keys.ArrowRight) rot = p.rotSpeed;

      if (rot !== 0) {
        const oldDirX = p.dirX;
        p.dirX = p.dirX * Math.cos(rot) - p.dirY * Math.sin(rot);
        p.dirY = oldDirX * Math.sin(rot) + p.dirY * Math.cos(rot);

        const oldPlaneX = p.planeX;
        p.planeX = p.planeX * Math.cos(rot) - p.planeY * Math.sin(rot);
        p.planeY = oldPlaneX * Math.sin(rot) + p.planeY * Math.cos(rot);
      }

      // Move Forward / Back
      let moveStep = 0;
      if (this.keys.w || this.keys.ArrowUp) moveStep = p.moveSpeed;
      if (this.keys.s || this.keys.ArrowDown) moveStep = -p.moveSpeed;

      if (moveStep !== 0) {
        const newX = p.x + p.dirX * moveStep;
        const newY = p.y + p.dirY * moveStep;

        // Bounding collision with maze walls
        if (m[Math.floor(p.y)][Math.floor(newX)] === 0) p.x = newX;
        if (m[Math.floor(newY)][Math.floor(p.x)] === 0) p.y = newY;
      }
    },

    render: function (ctx, w, h) {
      this.update();

      // Sky & Floor rendering
      ctx.fillStyle = '#080A0C';
      ctx.fillRect(0, 0, w, h / 2);
      ctx.fillStyle = '#0E1216';
      ctx.fillRect(0, h / 2, w, h / 2);

      const p = this.player;
      const m = this.map;
      const numRays = w;

      // DDA Raycasting Loop
      for (let x = 0; x < numRays; x += 2) {
        const cameraX = (2 * x) / w - 1;
        const rayDirX = p.dirX + p.planeX * cameraX;
        const rayDirY = p.dirY + p.planeY * cameraX;

        let mapX = Math.floor(p.x);
        let mapY = Math.floor(p.y);

        let sideDistX, sideDistY;
        const deltaDistX = Math.abs(1 / rayDirX);
        const deltaDistY = Math.abs(1 / rayDirY);
        let perpWallDist;

        let stepX, stepY;
        let hit = 0;
        let side = 0; // 0 for X, 1 for Y

        if (rayDirX < 0) {
          stepX = -1;
          sideDistX = (p.x - mapX) * deltaDistX;
        } else {
          stepX = 1;
          sideDistX = (mapX + 1.0 - p.x) * deltaDistX;
        }

        if (rayDirY < 0) {
          stepY = -1;
          sideDistY = (p.y - mapY) * deltaDistY;
        } else {
          stepY = 1;
          sideDistY = (mapY + 1.0 - p.y) * deltaDistY;
        }

        // Perform DDA
        while (hit === 0) {
          if (sideDistX < sideDistY) {
            sideDistX += deltaDistX;
            mapX += stepX;
            side = 0;
          } else {
            sideDistY += deltaDistY;
            mapY += stepY;
            side = 1;
          }

          if (mapX >= 0 && mapX < m[0].length && mapY >= 0 && mapY < m.length) {
            if (m[mapY][mapX] > 0) hit = 1;
          } else {
            hit = 1;
          }
        }

        if (side === 0) {
          perpWallDist = (mapX - p.x + (1 - stepX) / 2) / rayDirX;
        } else {
          perpWallDist = (mapY - p.y + (1 - stepY) / 2) / rayDirY;
        }

        // Calculate wall slice height
        const lineHeight = Math.floor(h / perpWallDist);
        const drawStart = Math.max(0, -lineHeight / 2 + h / 2);
        const drawEnd = Math.min(h - 1, lineHeight / 2 + h / 2);

        // Distance shading & palette
        let brightness = Math.max(0.12, Math.min(1.0, 1.4 / perpWallDist));
        if (side === 1) brightness *= 0.72; // Shadowing on Y-faces

        const r = Math.floor(124 * brightness);
        const g = Math.floor(156 * brightness);
        const b = Math.floor(255 * brightness);

        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fillRect(x, drawStart, 2, drawEnd - drawStart);

        // Grid wall edge accent
        if (drawEnd - drawStart > 30) {
          ctx.fillStyle = `rgba(168, 139, 255, ${brightness * 0.4})`;
          ctx.fillRect(x, drawStart, 2, 2);
          ctx.fillRect(x, drawEnd - 2, 2, 2);
        }
      }

      // Draw Mini-map in top-left corner
      const mapSize = 90;
      const cellW = mapSize / m[0].length;
      const cellH = mapSize / m.length;

      ctx.fillStyle = 'rgba(11, 13, 15, 0.85)';
      ctx.fillRect(12, 12, mapSize + 4, mapSize + 4);
      ctx.strokeStyle = 'rgba(124, 156, 255, 0.3)';
      ctx.strokeRect(12, 12, mapSize + 4, mapSize + 4);

      for (let r = 0; r < m.length; r++) {
        for (let c = 0; c < m[0].length; c++) {
          if (m[r][c] > 0) {
            ctx.fillStyle = 'rgba(141, 148, 155, 0.6)';
            ctx.fillRect(14 + c * cellW, 14 + r * cellH, cellW - 0.5, cellH - 0.5);
          }
        }
      }

      // Player dot on mini-map
      ctx.fillStyle = '#7C9CFF';
      ctx.beginPath();
      ctx.arc(14 + p.x * cellW, 14 + p.y * cellH, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Heading indicator
      ctx.strokeStyle = '#A88BFF';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(14 + p.x * cellW, 14 + p.y * cellH);
      ctx.lineTo(14 + (p.x + p.dirX * 1.5) * cellW, 14 + (p.y + p.dirY * 1.5) * cellH);
      ctx.stroke();

      // On-screen telemetry
      ctx.fillStyle = '#F2F0EA';
      ctx.font = '11px "JetBrains Mono", monospace';
      ctx.fillText('ENGINE: C99 / RAYLIB DDA PORT', 120, 26);
      ctx.fillStyle = '#7C9CFF';
      ctx.fillText(`POS: (${p.x.toFixed(1)}, ${p.y.toFixed(1)}) | FOV: 66° | DRAWS: 1`, 120, 42);
      ctx.fillStyle = '#8D949B';
      ctx.fillText('CONTROLS: [W/A/S/D] or [Arrow Keys] to move & turn', 120, 58);
    }
  };

  // --- 2. CHRONOS: VERLET PHYSICS SANDBOX ---
  const VerletSandbox = {
    points: [],
    sticks: [],
    mouse: { x: 0, y: 0, down: false, grabbedPoint: null },

    init: function (w, h) {
      this.points = [];
      this.sticks = [];

      const cols = 9;
      const rows = 7;
      const startX = w / 2 - (cols * 22) / 2;
      const startY = 50;
      const spacing = 22;

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const px = startX + x * spacing;
          const py = startY + y * spacing;
          const pinned = (y === 0 && (x === 0 || x === Math.floor(cols / 2) || x === cols - 1));
          this.points.push({
            x: px,
            y: py,
            oldX: px + (Math.random() - 0.5) * 2,
            oldY: py,
            pinned: pinned
          });
        }
      }

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const idx = y * cols + x;
          if (x < cols - 1) {
            this.sticks.push({ p0: idx, p1: idx + 1, length: spacing });
          }
          if (y < rows - 1) {
            this.sticks.push({ p0: idx, p1: idx + cols, length: spacing });
          }
        }
      }
    },

    update: function (w, h) {
      const gravity = 0.28;
      const friction = 0.99;

      // Integrate points
      for (let p of this.points) {
        if (p.pinned) continue;

        if (this.mouse.down && this.mouse.grabbedPoint === p) {
          p.x = this.mouse.x;
          p.y = this.mouse.y;
          p.oldX = p.x;
          p.oldY = p.y;
          continue;
        }

        const vx = (p.x - p.oldX) * friction;
        const vy = (p.y - p.oldY) * friction;

        p.oldX = p.x;
        p.oldY = p.y;

        p.x += vx;
        p.y += vy + gravity;

        if (p.y > h - 15) {
          p.y = h - 15;
          p.oldY = p.y + vy * 0.4;
        }
      }

      // Relax sticks
      for (let iter = 0; iter < 4; iter++) {
        for (let s of this.sticks) {
          const p0 = this.points[s.p0];
          const p1 = this.points[s.p1];
          const dx = p1.x - p0.x;
          const dy = p1.y - p0.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist === 0) continue;

          const diff = (s.length - dist) / dist;
          const offsetX = dx * diff * 0.5;
          const offsetY = dy * diff * 0.5;

          if (!p0.pinned) {
            p0.x -= offsetX;
            p0.y -= offsetY;
          }
          if (!p1.pinned) {
            p1.x += offsetX;
            p1.y += offsetY;
          }
        }
      }
    },

    render: function (ctx, w, h) {
      this.update(w, h);

      ctx.fillStyle = '#090B0D';
      ctx.fillRect(0, 0, w, h);

      // Render sticks
      ctx.strokeStyle = 'rgba(124, 156, 255, 0.45)';
      ctx.lineWidth = 1.2;
      for (let s of this.sticks) {
        const p0 = this.points[s.p0];
        const p1 = this.points[s.p1];
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.stroke();
      }

      // Render points
      for (let p of this.points) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.pinned ? 4 : 2.5, 0, Math.PI * 2);
        ctx.fillStyle = p.pinned ? '#A88BFF' : '#F2F0EA';
        ctx.fill();
      }

      // UI Instructions
      ctx.fillStyle = '#7C9CFF';
      ctx.font = '11px "JetBrains Mono", monospace';
      ctx.fillText('VERLET INTEGRATION: Cloth Mesh & Impulse Constraints', 20, 30);
      ctx.fillStyle = '#8D949B';
      ctx.fillText('Click and drag any node to test dynamic elasticity', 20, 48);
    }
  };

  // --- 3. PROJECT PREVIEW CARD CANVASES ---
  function initCardPreviews() {
    const cardCanvases = document.querySelectorAll('.project-preview-canvas');
    cardCanvases.forEach(cv => {
      const type = cv.getAttribute('data-preview');
      const c = cv.getContext('2d');
      const rect = cv.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      cv.width = rect.width * dpr;
      cv.height = rect.height * dpr;
      c.scale(dpr, dpr);

      let angle = 0;
      function renderCard() {
        angle += 0.015;
        const w = rect.width;
        const h = rect.height;
        c.clearRect(0, 0, w, h);

        if (type === 'raycaster') {
          // Dynamic wireframe hallway perspective
          c.strokeStyle = 'rgba(124, 156, 255, 0.25)';
          c.lineWidth = 1;
          const cx = w / 2;
          const cy = h / 2;
          for (let i = 1; i <= 5; i++) {
            const size = (i * 24 + Math.sin(angle) * 4);
            c.strokeRect(cx - size * 1.5, cy - size, size * 3, size * 2);
            c.beginPath();
            c.moveTo(cx - size * 1.5, cy - size);
            c.lineTo(0, 0);
            c.moveTo(cx + size * 1.5, cy - size);
            c.lineTo(w, 0);
            c.moveTo(cx - size * 1.5, cy + size);
            c.lineTo(0, h);
            c.moveTo(cx + size * 1.5, cy + size);
            c.lineTo(w, h);
            c.stroke();
          }
        } else if (type === 'physics') {
          // Bouncing interconnected nodes
          c.strokeStyle = 'rgba(168, 139, 255, 0.3)';
          c.lineWidth = 1;
          const count = 7;
          const points = [];
          for (let i = 0; i < count; i++) {
            const px = w / 2 + Math.cos(angle + i * 0.9) * (w * 0.32);
            const py = h / 2 + Math.sin(angle * 1.3 + i * 1.1) * (h * 0.28);
            points.push({ x: px, y: py });
          }
          for (let i = 0; i < points.length; i++) {
            for (let j = i + 1; j < points.length; j++) {
              c.beginPath();
              c.moveTo(points[i].x, points[i].y);
              c.lineTo(points[j].x, points[j].y);
              c.stroke();
            }
            c.fillStyle = '#7C9CFF';
            c.beginPath();
            c.arc(points[i].x, points[i].y, 3, 0, Math.PI * 2);
            c.fill();
          }
        } else if (type === 'voxel') {
          // Isometric voxel cube cluster
          c.strokeStyle = 'rgba(124, 156, 255, 0.35)';
          c.lineWidth = 1;
          const cx = w / 2;
          const cy = h / 2;
          const size = 32;

          for (let ix = -1; ix <= 1; ix++) {
            for (let iy = -1; iy <= 1; iy++) {
              const ox = (ix - iy) * size * 0.866;
              const oy = (ix + iy) * size * 0.5 + Math.sin(angle + ix) * 6;

              // Top face
              c.fillStyle = 'rgba(23, 29, 35, 0.8)';
              c.beginPath();
              c.moveTo(cx + ox, cy + oy - size);
              c.lineTo(cx + ox + size * 0.866, cy + oy - size * 0.5);
              c.lineTo(cx + ox, cy + oy);
              c.lineTo(cx + ox - size * 0.866, cy + oy - size * 0.5);
              c.closePath();
              c.fill();
              c.stroke();
            }
          }
        } else {
          // DSA Graph tree nodes
          c.strokeStyle = 'rgba(124, 156, 255, 0.25)';
          c.fillStyle = '#F2F0EA';
          const cx = w / 2;
          const cy = h / 3;
          c.beginPath();
          c.arc(cx, cy, 5, 0, Math.PI * 2);
          c.fill();

          c.beginPath();
          c.moveTo(cx, cy);
          c.lineTo(cx - 50, cy + 50);
          c.moveTo(cx, cy);
          c.lineTo(cx + 50, cy + 50);
          c.stroke();

          c.beginPath();
          c.arc(cx - 50, cy + 50, 4, 0, Math.PI * 2);
          c.arc(cx + 50, cy + 50, 4, 0, Math.PI * 2);
          c.fill();
        }

        requestAnimationFrame(renderCard);
      }
      renderCard();
    });
  }

  // --- 4. MODAL MANAGEMENT & LIVE DEMO LAUNCHER ---
  function openDemoModal(type) {
    const modal = document.getElementById('demo-modal');
    const modalTitle = document.getElementById('modal-demo-title');
    if (!modal) return;

    activeDemoType = type;
    modalCanvas = document.getElementById('modal-demo-canvas');
    modalCtx = modalCanvas.getContext('2d');

    const rect = modalCanvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    modalCanvas.width = rect.width * dpr;
    modalCanvas.height = rect.height * dpr;
    modalCtx.scale(dpr, dpr);

    if (type === 'raycaster') {
      if (modalTitle) modalTitle.textContent = 'Aetheria 2.5D Raycasting Engine (Live C99 Port)';
      Raycaster.init();
    } else if (type === 'physics') {
      if (modalTitle) modalTitle.textContent = 'Chronos Verlet Physics & Impulse Solver (Live Interactive)';
      VerletSandbox.init(rect.width, rect.height);
    } else {
      if (modalTitle) modalTitle.textContent = 'Engine Preview Viewport';
      Raycaster.init();
    }

    modal.classList.add('open');
    startDemoLoop();
  }

  function closeDemoModal() {
    const modal = document.getElementById('demo-modal');
    if (modal) modal.classList.remove('open');
    if (animFrameId) {
      cancelAnimationFrame(animFrameId);
      animFrameId = null;
    }
    activeDemoType = null;
  }

  function startDemoLoop() {
    function loop() {
      if (!modalCanvas || !modalCtx) return;
      const rect = modalCanvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      if (activeDemoType === 'raycaster') {
        Raycaster.render(modalCtx, w, h);
      } else if (activeDemoType === 'physics') {
        VerletSandbox.render(modalCtx, w, h);
      } else {
        Raycaster.render(modalCtx, w, h);
      }

      animFrameId = requestAnimationFrame(loop);
    }
    loop();
  }

  // Bind Keyboard Inputs for Raycaster
  window.addEventListener('keydown', (e) => {
    if (activeDemoType === 'raycaster') {
      if (['w', 'a', 's', 'd', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        Raycaster.keys[e.key] = true;
        e.preventDefault();
      }
    }
    if (e.key === 'Escape') {
      closeDemoModal();
    }
  });

  window.addEventListener('keyup', (e) => {
    if (activeDemoType === 'raycaster') {
      if (['w', 'a', 's', 'd', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        Raycaster.keys[e.key] = false;
        e.preventDefault();
      }
    }
  });

  // Bind Mouse Inputs for Verlet Sandbox
  function setupModalMouse() {
    if (!modalCanvas) return;
    modalCanvas.addEventListener('mousedown', (e) => {
      if (activeDemoType !== 'physics') return;
      const rect = modalCanvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      VerletSandbox.mouse.x = mx;
      VerletSandbox.mouse.y = my;
      VerletSandbox.mouse.down = true;

      // Find closest point
      let closest = null;
      let minD = 30;
      for (let p of VerletSandbox.points) {
        const dx = p.x - mx;
        const dy = p.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < minD) {
          minD = dist;
          closest = p;
        }
      }
      VerletSandbox.mouse.grabbedPoint = closest;
    });

    window.addEventListener('mousemove', (e) => {
      if (!modalCanvas || activeDemoType !== 'physics') return;
      const rect = modalCanvas.getBoundingClientRect();
      VerletSandbox.mouse.x = e.clientX - rect.left;
      VerletSandbox.mouse.y = e.clientY - rect.top;
    });

    window.addEventListener('mouseup', () => {
      if (activeDemoType === 'physics') {
        VerletSandbox.mouse.down = false;
        VerletSandbox.mouse.grabbedPoint = null;
      }
    });
  }

  // Attach modal triggers with event delegation
  document.addEventListener('DOMContentLoaded', () => {
    initCardPreviews();

    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-demo-target]');
      if (btn) {
        e.preventDefault();
        const demoType = btn.getAttribute('data-demo-target') || 'raycaster';
        openDemoModal(demoType);
        setupModalMouse();
      }
    });

    const closeBtn = document.getElementById('modal-close-btn');
    if (closeBtn) closeBtn.addEventListener('click', closeDemoModal);

    const modalOverlay = document.getElementById('demo-modal');
    if (modalOverlay) {
      modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeDemoModal();
      });
    }
  });

  const api = {
    openDemoModal,
    closeDemoModal,
    initCardPreviews
  };

  window.ProjectDemos = api;
  return api;
})();
