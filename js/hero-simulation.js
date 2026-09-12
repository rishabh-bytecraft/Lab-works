/**
 * HERO-SIMULATION.JS
 * Raylib-inspired 2D Physics & Spatial Hash Grid Engine
 * Handcrafted HTML5 Canvas simulation with broadphase spatial partitioning,
 * elastic impulse resolution, dynamic cursor force fields, and Raylib HUD.
 */

(function () {
  'use strict';

  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  // Simulation Parameters
  const SIM_CONFIG = {
    particleCount: 42,
    cellSize: 75,
    restitution: 0.88,
    gravity: 0.04,
    drag: 0.998,
    cursorRadius: 110,
    cursorForce: 0.35,
    colors: {
      particle: '#F2F0EA',
      particleAccent: '#7C9CFF',
      particleSecondary: '#A88BFF',
      grid: 'rgba(124, 156, 255, 0.07)',
      gridActive: 'rgba(124, 156, 255, 0.22)',
      vector: 'rgba(168, 139, 255, 0.4)',
      aabb: 'rgba(242, 240, 234, 0.15)',
      proximity: 'rgba(124, 156, 255, 0.18)'
    }
  };

  let width = 0;
  let height = 0;
  let dpr = 1;
  let particles = [];
  let spatialGrid = new Map();
  let currentMode = 'sandbox'; // 'sandbox' | 'spatial' | 'wireframe'
  let isPaused = false;

  // Performance telemetry
  let lastTime = performance.now();
  let frameCount = 0;
  let fps = 60;
  let frameTimeMs = 0.5;
  let collisionPairsChecked = 0;

  // Cursor state
  const mouse = {
    x: -9999,
    y: -9999,
    active: false,
    repulsion: true
  };

  class Particle {
    constructor(x, y, r, isAnchor = false) {
      this.x = x;
      this.y = y;
      this.vx = (Math.random() - 0.5) * 1.8;
      this.vy = (Math.random() - 0.5) * 1.8;
      this.radius = r || (Math.random() * 5 + 4);
      this.mass = this.radius * 0.8;
      this.isAnchor = isAnchor;
      this.color = Math.random() > 0.85 ? SIM_CONFIG.colors.particleSecondary : (Math.random() > 0.6 ? SIM_CONFIG.colors.particleAccent : SIM_CONFIG.colors.particle);
      this.trail = [];
    }

    update(boundsW, boundsH) {
      if (this.isAnchor) return;

      // Apply drag & gravity
      this.vx *= SIM_CONFIG.drag;
      this.vy *= SIM_CONFIG.drag;
      this.vy += SIM_CONFIG.gravity;

      // Mouse force interaction
      if (mouse.active) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const distSq = dx * dx + dy * dy;
        const radiusSq = SIM_CONFIG.cursorRadius * SIM_CONFIG.cursorRadius;

        if (distSq < radiusSq && distSq > 4) {
          const dist = Math.sqrt(distSq);
          const force = (1 - dist / SIM_CONFIG.cursorRadius) * SIM_CONFIG.cursorForce;
          const nx = dx / dist;
          const ny = dy / dist;

          if (mouse.repulsion) {
            this.vx += nx * force * 2.2;
            this.vy += ny * force * 2.2;
          } else {
            this.vx -= nx * force * 1.5;
            this.vy -= ny * force * 1.5;
          }
        }
      }

      this.x += this.vx;
      this.y += this.vy;

      // Boundary Collisions
      if (this.x - this.radius < 0) {
        this.x = this.radius;
        this.vx = -this.vx * SIM_CONFIG.restitution;
      } else if (this.x + this.radius > boundsW) {
        this.x = boundsW - this.radius;
        this.vx = -this.vx * SIM_CONFIG.restitution;
      }

      if (this.y - this.radius < 0) {
        this.y = this.radius;
        this.vy = -this.vy * SIM_CONFIG.restitution;
      } else if (this.y + this.radius > boundsH) {
        this.y = boundsH - this.radius;
        this.vy = -this.vy * SIM_CONFIG.restitution;
      }

      // Record faint trail for motion aesthetic
      if (currentMode === 'sandbox') {
        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > 5) this.trail.shift();
      }
    }
  }

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    dpr = window.devicePixelRatio || 1;
    width = rect.width;
    height = rect.height;

    canvas.width = width * dpr;
    canvas.height = height * dpr;

    ctx.scale(dpr, dpr);
  }

  function initParticles() {
    particles = [];
    const count = SIM_CONFIG.particleCount;
    for (let i = 0; i < count; i++) {
      const r = Math.random() * 5 + 4.5;
      const x = Math.random() * (width - r * 2) + r;
      const y = Math.random() * (height - r * 2) + r;
      particles.push(new Particle(x, y, r));
    }
  }

  // Hash coordinates into Spatial Grid key
  function getCellKey(cx, cy) {
    return `${cx}:${cy}`;
  }

  // Populate Broadphase Spatial Hash Grid
  function updateSpatialGrid() {
    spatialGrid.clear();
    const cellSize = SIM_CONFIG.cellSize;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      const cx = Math.floor(p.x / cellSize);
      const cy = Math.floor(p.y / cellSize);
      const key = getCellKey(cx, cy);

      if (!spatialGrid.has(key)) {
        spatialGrid.set(key, []);
      }
      spatialGrid.get(key).push(p);
    }
  }

  // Broadphase + Narrowphase Elastic Collisions
  function resolveCollisions() {
    collisionPairsChecked = 0;
    const cellSize = SIM_CONFIG.cellSize;
    const checkedPairs = new Set();

    spatialGrid.forEach((cellParticles, key) => {
      const [cxStr, cyStr] = key.split(':');
      const cx = parseInt(cxStr, 10);
      const cy = parseInt(cyStr, 10);

      // Check current cell and adjacent 8 neighbor cells
      for (let ox = -1; ox <= 1; ox++) {
        for (let oy = -1; oy <= 1; oy++) {
          const neighborKey = getCellKey(cx + ox, cy + oy);
          const neighborParticles = spatialGrid.get(neighborKey);

          if (!neighborParticles) continue;

          for (let i = 0; i < cellParticles.length; i++) {
            const p1 = cellParticles[i];
            for (let j = 0; j < neighborParticles.length; j++) {
              const p2 = neighborParticles[j];
              if (p1 === p2) continue;

              const pairId = p1.x < p2.x ? `${p1.x}-${p2.x}` : `${p2.x}-${p1.x}`;
              if (checkedPairs.has(pairId)) continue;
              checkedPairs.add(pairId);

              collisionPairsChecked++;

              // Narrowphase Sphere-Sphere Collision
              const dx = p2.x - p1.x;
              const dy = p2.y - p1.y;
              const distSq = dx * dx + dy * dy;
              const minDist = p1.radius + p2.radius;

              if (distSq < minDist * minDist && distSq > 0.0001) {
                const dist = Math.sqrt(distSq);
                const overlap = minDist - dist;

                // Normal vector
                const nx = dx / dist;
                const ny = dy / dist;

                // Positional correction to prevent sink
                const separationX = nx * overlap * 0.5;
                const separationY = ny * overlap * 0.5;
                p1.x -= separationX;
                p1.y -= separationY;
                p2.x += separationX;
                p2.y += separationY;

                // Relative velocity
                const kx = p1.vx - p2.vx;
                const ky = p1.vy - p2.vy;
                const p = 2 * (nx * kx + ny * ky) / (p1.mass + p2.mass);

                // Apply impulse
                p1.vx -= p * p2.mass * nx * SIM_CONFIG.restitution;
                p1.vy -= p * p2.mass * ny * SIM_CONFIG.restitution;
                p2.vx += p * p1.mass * nx * SIM_CONFIG.restitution;
                p2.vy += p * p1.mass * ny * SIM_CONFIG.restitution;
              }
            }
          }
        }
      }
    });
  }

  // Draw Spatial Grid Wireframe
  function renderSpatialGrid() {
    const cellSize = SIM_CONFIG.cellSize;
    const cols = Math.ceil(width / cellSize);
    const rows = Math.ceil(height / cellSize);

    ctx.lineWidth = 1;

    for (let c = 0; c <= cols; c++) {
      ctx.strokeStyle = SIM_CONFIG.colors.grid;
      ctx.beginPath();
      ctx.moveTo(c * cellSize, 0);
      ctx.lineTo(c * cellSize, height);
      ctx.stroke();
    }

    for (let r = 0; r <= rows; r++) {
      ctx.strokeStyle = SIM_CONFIG.colors.grid;
      ctx.beginPath();
      ctx.moveTo(0, r * cellSize);
      ctx.lineTo(width, r * cellSize);
      ctx.stroke();
    }

    // Highlight populated cells with entity count
    if (currentMode === 'spatial') {
      spatialGrid.forEach((group, key) => {
        const [cxStr, cyStr] = key.split(':');
        const cx = parseInt(cxStr, 10);
        const cy = parseInt(cyStr, 10);

        ctx.fillStyle = SIM_CONFIG.colors.gridActive;
        ctx.fillRect(cx * cellSize, cy * cellSize, cellSize, cellSize);

        ctx.fillStyle = 'rgba(124, 156, 255, 0.7)';
        ctx.font = '9px "JetBrains Mono", monospace';
        ctx.fillText(`${group.length}`, cx * cellSize + 5, cy * cellSize + 12);
      });
    }
  }

  // Proximity lines between adjacent entities
  function renderProximityWeb() {
    ctx.lineWidth = 0.75;
    for (let i = 0; i < particles.length; i++) {
      const p1 = particles[i];
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const distSq = dx * dx + dy * dy;

        if (distSq < 60 * 60) {
          const alpha = 1 - Math.sqrt(distSq) / 60;
          ctx.strokeStyle = `rgba(124, 156, 255, ${alpha * 0.25})`;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    // Subtle dark grid background
    renderSpatialGrid();

    // Proximity connections
    if (currentMode !== 'wireframe') {
      renderProximityWeb();
    }

    // Render particles
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // Draw faint motion trail
      if (currentMode === 'sandbox' && p.trail.length > 1) {
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(124, 156, 255, 0.15)';
        ctx.lineWidth = 1;
        ctx.moveTo(p.trail[0].x, p.trail[0].y);
        for (let t = 1; t < p.trail.length; t++) {
          ctx.lineTo(p.trail[t].x, p.trail[t].y);
        }
        ctx.stroke();
      }

      if (currentMode === 'wireframe') {
        // Draw AABB Bounding Box
        ctx.strokeStyle = SIM_CONFIG.colors.aabb;
        ctx.lineWidth = 1;
        ctx.strokeRect(p.x - p.radius, p.y - p.radius, p.radius * 2, p.radius * 2);

        // Draw center cross
        ctx.strokeStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.stroke();

        // Velocity vector line
        ctx.strokeStyle = SIM_CONFIG.colors.vector;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + p.vx * 6, p.y + p.vy * 6);
        ctx.stroke();
      } else {
        // Standard high-craft aesthetic circles
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0; // Reset
      }
    }

    // Interactive cursor field ring
    if (mouse.active) {
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, SIM_CONFIG.cursorRadius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(124, 156, 255, 0.12)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 6]);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }

  function updateHUD() {
    const fpsElem = document.getElementById('hud-fps');
    const entitiesElem = document.getElementById('hud-entities');
    const pairsElem = document.getElementById('hud-pairs');
    const frametimeElem = document.getElementById('hud-frametime');

    if (fpsElem) fpsElem.textContent = `${Math.round(fps)} FPS`;
    if (entitiesElem) entitiesElem.textContent = `${particles.length}`;
    if (pairsElem) pairsElem.textContent = `${collisionPairsChecked}`;
    if (frametimeElem) frametimeElem.textContent = `${frameTimeMs.toFixed(2)}ms`;
  }

  function tick(currentTime) {
    const t0 = performance.now();
    const dt = currentTime - lastTime;
    lastTime = currentTime;

    frameCount++;
    if (frameCount % 10 === 0 && dt > 0) {
      fps = 1000 / dt;
    }

    if (!isPaused) {
      for (let i = 0; i < particles.length; i++) {
        particles[i].update(width, height);
      }
      updateSpatialGrid();
      resolveCollisions();
    }

    render();

    const t1 = performance.now();
    frameTimeMs = t1 - t0;

    if (frameCount % 6 === 0) {
      updateHUD();
    }

    requestAnimationFrame(tick);
  }

  // Event Listeners
  window.addEventListener('resize', () => {
    resizeCanvas();
  });

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    mouse.active = true;
  });

  canvas.addEventListener('mouseleave', () => {
    mouse.active = false;
  });

  canvas.addEventListener('mousedown', (e) => {
    // Left click: impulse burst / toggle gravity
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Spawn a fresh particle or push existing
    if (particles.length < 80) {
      const p = new Particle(clickX, clickY, Math.random() * 6 + 4);
      p.vx = (Math.random() - 0.5) * 6;
      p.vy = (Math.random() - 0.5) * 6;
      particles.push(p);
    }

    // Push outward
    particles.forEach(p => {
      const dx = p.x - clickX;
      const dy = p.y - clickY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 150 && dist > 1) {
        p.vx += (dx / dist) * 5;
        p.vy += (dy / dist) * 5;
      }
    });
  });

  // Mode Switchers
  const modeBtns = document.querySelectorAll('.hud-mode-btn');
  modeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      modeBtns.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      currentMode = e.target.getAttribute('data-mode') || 'sandbox';
    });
  });

  // Initialize
  resizeCanvas();
  initParticles();
  requestAnimationFrame(tick);
})();
