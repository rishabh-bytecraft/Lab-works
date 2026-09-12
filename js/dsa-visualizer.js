/**
 * DSA-VISUALIZER.JS
 * Real-time Data Structures & Algorithms Workbench
 * 1. Quadtree vs Brute Force Spatial Partitioning Benchmark
 * 2. Fixed-Size Linear Memory Arena Allocator Simulation
 */

(function () {
  'use strict';

  const canvas = document.getElementById('dsa-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  let width = 0;
  let height = 0;
  let dpr = 1;
  let currentAlgo = 'quadtree'; // 'quadtree' | 'brute'
  let nodeCount = 55;
  let entities = [];

  // Telemetry metrics
  let checksCount = 0;
  let theoreticalChecks = 0;
  let savingsPercent = 0;
  let simTimeMicroseconds = 0;

  // Quadtree Node Definition
  class Quadtree {
    constructor(boundary, capacity = 4, depth = 0, maxDepth = 5) {
      this.boundary = boundary; // { x, y, w, h }
      this.capacity = capacity;
      this.depth = depth;
      this.maxDepth = maxDepth;
      this.points = [];
      this.divided = false;
      this.children = [];
    }

    subdivide() {
      const { x, y, w, h } = this.boundary;
      const hw = w / 2;
      const hh = h / 2;

      this.children = [
        new Quadtree({ x: x, y: y, w: hw, h: hh }, this.capacity, this.depth + 1, this.maxDepth), // NW
        new Quadtree({ x: x + hw, y: y, w: hw, h: hh }, this.capacity, this.depth + 1, this.maxDepth), // NE
        new Quadtree({ x: x, y: y + hh, w: hw, h: hh }, this.capacity, this.depth + 1, this.maxDepth), // SW
        new Quadtree({ x: x + hw, y: y + hh, w: hw, h: hh }, this.capacity, this.depth + 1, this.maxDepth) // SE
      ];
      this.divided = true;
    }

    insert(point) {
      if (!this.contains(point)) return false;

      if (this.points.length < this.capacity || this.depth >= this.maxDepth) {
        this.points.push(point);
        return true;
      }

      if (!this.divided) {
        this.subdivide();
      }

      for (let child of this.children) {
        if (child.insert(point)) return true;
      }

      return false;
    }

    contains(point) {
      return (
        point.x >= this.boundary.x &&
        point.x < this.boundary.x + this.boundary.w &&
        point.y >= this.boundary.y &&
        point.y < this.boundary.y + this.boundary.h
      );
    }

    // Query points within a range
    query(range, found = []) {
      if (!this.intersects(range)) return found;

      for (let p of this.points) {
        checksCount++;
        const dx = p.x - range.x;
        const dy = p.y - range.y;
        if (dx * dx + dy * dy <= range.r * range.r) {
          found.push(p);
        }
      }

      if (this.divided) {
        for (let child of this.children) {
          child.query(range, found);
        }
      }

      return found;
    }

    intersects(range) {
      const b = this.boundary;
      const closestX = Math.max(b.x, Math.min(range.x, b.x + b.w));
      const closestY = Math.max(b.y, Math.min(range.y, b.y + b.h));
      const dx = range.x - closestX;
      const dy = range.y - closestY;
      return (dx * dx + dy * dy) <= (range.r * range.r);
    }

    draw(ctx) {
      ctx.strokeStyle = 'rgba(124, 156, 255, 0.12)';
      ctx.lineWidth = 1;
      ctx.strokeRect(this.boundary.x, this.boundary.y, this.boundary.w, this.boundary.h);

      if (this.divided) {
        for (let child of this.children) {
          child.draw(ctx);
        }
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

  function initEntities() {
    entities = [];
    for (let i = 0; i < nodeCount; i++) {
      entities.push({
        x: Math.random() * (width - 40) + 20,
        y: Math.random() * (height - 40) + 20,
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 1.2,
        r: 3.5,
        queryRadius: 36,
        neighbors: []
      });
    }
  }

  function runSimulation() {
    const t0 = performance.now();
    checksCount = 0;
    theoreticalChecks = Math.floor((entities.length * (entities.length - 1)) / 2);

    // Update positions
    for (let e of entities) {
      e.x += e.vx;
      e.y += e.vy;

      if (e.x < e.r) { e.x = e.r; e.vx *= -1; }
      if (e.x > width - e.r) { e.x = width - e.r; e.vx *= -1; }
      if (e.y < e.r) { e.y = e.r; e.vy *= -1; }
      if (e.y > height - e.r) { e.y = height - e.r; e.vy *= -1; }

      e.neighbors = [];
    }

    let qtree = null;

    if (currentAlgo === 'quadtree') {
      qtree = new Quadtree({ x: 0, y: 0, w: width, h: height }, 4);
      for (let e of entities) {
        qtree.insert(e);
      }

      // Query only spatial neighbors
      for (let e of entities) {
        const queryRange = { x: e.x, y: e.y, r: e.queryRadius };
        const found = qtree.query(queryRange);
        e.neighbors = found.filter(item => item !== e);
      }
    } else {
      // Brute Force O(N^2)
      for (let i = 0; i < entities.length; i++) {
        for (let j = i + 1; j < entities.length; j++) {
          checksCount++;
          const e1 = entities[i];
          const e2 = entities[j];
          const dx = e1.x - e2.x;
          const dy = e1.y - e2.y;
          if (dx * dx + dy * dy < e1.queryRadius * e1.queryRadius) {
            e1.neighbors.push(e2);
            e2.neighbors.push(e1);
          }
        }
      }
    }

    const t1 = performance.now();
    simTimeMicroseconds = Math.round((t1 - t0) * 1000);

    if (theoreticalChecks > 0) {
      savingsPercent = Math.max(0, Math.round(((theoreticalChecks - checksCount) / theoreticalChecks) * 100));
      if (currentAlgo === 'brute') savingsPercent = 0;
    }

    return qtree;
  }

  function render(qtree) {
    ctx.clearRect(0, 0, width, height);

    // Draw Quadtree boundaries if active
    if (currentAlgo === 'quadtree' && qtree) {
      qtree.draw(ctx);
    }

    // Draw collision check lines / neighbors
    for (let e of entities) {
      if (currentAlgo === 'brute') {
        // In brute force, highlight sample test paths
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.08)';
        ctx.lineWidth = 0.5;
        for (let other of entities) {
          if (other !== e) {
            ctx.beginPath();
            ctx.moveTo(e.x, e.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        }
      }

      // Draw active connections
      ctx.strokeStyle = 'rgba(124, 156, 255, 0.35)';
      ctx.lineWidth = 1;
      for (let n of e.neighbors) {
        ctx.beginPath();
        ctx.moveTo(e.x, e.y);
        ctx.lineTo(n.x, n.y);
        ctx.stroke();
      }

      // Query radius ring for first 2 entities
      if (entities.indexOf(e) < 2) {
        ctx.strokeStyle = 'rgba(168, 139, 255, 0.25)';
        ctx.setLineDash([3, 4]);
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.queryRadius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Entity Dot
      ctx.beginPath();
      ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
      ctx.fillStyle = e.neighbors.length > 0 ? '#7C9CFF' : '#F2F0EA';
      ctx.fill();
    }
  }

  function updateTelemetryUI() {
    const checksElem = document.getElementById('dsa-checks');
    const theoreticalElem = document.getElementById('dsa-theoretical');
    const savingsElem = document.getElementById('dsa-savings');
    const complexityElem = document.getElementById('dsa-complexity');

    if (checksElem) checksElem.textContent = checksCount.toLocaleString();
    if (theoreticalElem) theoreticalElem.textContent = theoreticalChecks.toLocaleString();
    if (savingsElem) savingsElem.textContent = currentAlgo === 'brute' ? '0%' : `+${savingsPercent}%`;
    if (complexityElem) complexityElem.textContent = currentAlgo === 'brute' ? 'O(N²)' : 'O(N log N)';
  }

  function loop() {
    const qtree = runSimulation();
    render(qtree);
    updateTelemetryUI();
    requestAnimationFrame(loop);
  }

  // --- MEMORY ARENA ALLOCATOR INTERACTION ---
  const MEMORY_TOTAL_BYTES = 65536; // 64 KB
  let allocatedBytes = 28672; // Start with some allocations

  function updateMemoryBar() {
    const fillPercent = Math.min(100, (allocatedBytes / MEMORY_TOTAL_BYTES) * 100);
    const barEntities = document.querySelector('.mem-block-entities');
    const barTransforms = document.querySelector('.mem-block-transforms');
    const barScratch = document.querySelector('.mem-block-scratch');
    const usedText = document.getElementById('mem-used-text');
    const freeText = document.getElementById('mem-free-text');

    if (usedText) usedText.textContent = `${(allocatedBytes / 1024).toFixed(1)} KB / ${(MEMORY_TOTAL_BYTES / 1024)} KB`;
    if (freeText) freeText.textContent = `${((MEMORY_TOTAL_BYTES - allocatedBytes) / 1024).toFixed(1)} KB Available`;
  }

  const btnAllocTransform = document.getElementById('btn-alloc-transform');
  const btnAllocMesh = document.getElementById('btn-alloc-mesh');
  const btnResetArena = document.getElementById('btn-reset-arena');

  if (btnAllocTransform) {
    btnAllocTransform.addEventListener('click', () => {
      if (allocatedBytes + 2048 <= MEMORY_TOTAL_BYTES) {
        allocatedBytes += 2048;
        updateMemoryBar();
      }
    });
  }

  if (btnAllocMesh) {
    btnAllocMesh.addEventListener('click', () => {
      if (allocatedBytes + 8192 <= MEMORY_TOTAL_BYTES) {
        allocatedBytes += 8192;
        updateMemoryBar();
      }
    });
  }

  if (btnResetArena) {
    btnResetArena.addEventListener('click', () => {
      // Linear pointer reset: arena->offset = 0 (1 CPU clock cycle!)
      allocatedBytes = 4096; // keep minimal static header
      updateMemoryBar();
    });
  }

  // Setup Event Listeners for Algorithm Switching
  const algoTabs = document.querySelectorAll('.algo-tab-btn');
  algoTabs.forEach(btn => {
    btn.addEventListener('click', (e) => {
      algoTabs.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      currentAlgo = e.target.getAttribute('data-algo') || 'quadtree';
    });
  });

  const nodeSlider = document.getElementById('node-count-slider');
  const nodeCountLabel = document.getElementById('node-count-label');
  if (nodeSlider) {
    nodeSlider.addEventListener('input', (e) => {
      nodeCount = parseInt(e.target.value, 10);
      if (nodeCountLabel) nodeCountLabel.textContent = `${nodeCount} Entities`;
      initEntities();
    });
  }

  window.addEventListener('resize', () => {
    resizeCanvas();
    initEntities();
  });

  // Init
  resizeCanvas();
  initEntities();
  updateMemoryBar();
  requestAnimationFrame(loop);
})();
