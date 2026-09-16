/**
 * SLIDES.JS - COMPREHENSIVE PORTFOLIO SLIDES ENGINE
 * 1. Embedded On-Page Portfolio Slides Deck (Section: #portfolio-slides)
 * 2. Fullscreen Cinematic Presentation Deck Modal (Shortcut: P or Button)
 * 3. In-Page Project Cards Carousel / Slider (Section: #projects)
 */

(function () {
  'use strict';

  // =========================================================================
  // 1. DATA: 8 COMPREHENSIVE PORTFOLIO PRESENTATION SLIDES
  // =========================================================================
  const PORTFOLIO_SLIDES = [
    {
      id: "intro",
      tabTitle: "01. Intro",
      tag: "EXECUTIVE SUMMARY // 01",
      title: "Rishabh Panda",
      subtitle: "Game Developer & Systems Programmer",
      headline: "Crafting games, physics engines, and systems from mathematical first principles.",
      bullets: [
        "Specialization: Low-level C (C99/C11), Raylib, WebAssembly, and OpenGL.",
        "Architecture: Data-oriented design, cache locality, and zero runtime heap allocations in the tick loop.",
        "Broadphase Mastery: Dynamic Quadtrees, Spatial Hashing, and BVH trees reducing quadratic collision spikes.",
        "Git Discipline: Strict atomic commits, bisect-ready history, and clean modular branches."
      ],
      badge: "C99 / RAYLIB / DSA",
      metrics: [
        { label: "PRIMARY LANGUAGE", val: "C99 / C11" },
        { label: "FRAME TARGET", val: "144 FPS / 1080p" },
        { label: "TICK ALLOCATION", val: "0 Mallocs" }
      ]
    },
    {
      id: "philosophy",
      tabTitle: "02. Architecture",
      tag: "ENGINEERING STANDARDS // 02",
      title: "Low-Level Systems Architecture",
      subtitle: "Mechanical Sympathy, Cache Coherency & Contiguous Layouts",
      headline: "How systems run an order of magnitude faster without sacrificing code clarity or ergonomics.",
      bullets: [
        "Data-Oriented Design (DOD): Struct-of-Arrays (SoA) layout guarantees hardware prefetcher cache saturation.",
        "Zero Dynamic Allocation: Monotonic linear memory arenas reset each frame in 1 CPU clock cycle (O(1)).",
        "Predictable Frame Budgets: Continuous 144 FPS / sub-0.8ms tick loops with zero garbage collection stutter.",
        "Mechanical Sympathy: Structuring branching logic to minimize CPU instruction pipeline stalls."
      ],
      badge: "SYSTEMS ARCHITECTURE",
      metrics: [
        { label: "CACHE HIT RATE", val: "> 98.2%" },
        { label: "FRAME ARENA RESET", val: "1 CPU Cycle" },
        { label: "DATA LAYOUT", val: "Struct-of-Arrays" }
      ]
    },
    {
      id: "aetheria",
      tabTitle: "03. Aetheria 2.5D",
      tag: "FEATURED PROJECT // 03",
      title: "Aetheria: 2.5D Raycasting Engine",
      subtitle: "Software Rendering Pipeline & Raylib in Pure C99",
      headline: "Zero-heap allocation pseudo-3D engine with dynamic BSP-tree visibility and custom DDA raycaster.",
      bullets: [
        "Consistent sub-0.8ms frame render time at 144 FPS in full 1080p resolution.",
        "Deterministic fixed-point physics with continuous bounding-circle collision resolution.",
        "Custom binary asset packer bundling maps, textures, and sound into a single 1.8MB contiguous blob.",
        "Interactive live demo playable right in the portfolio with WASD/Arrow maze exploration."
      ],
      demoTarget: "raycaster",
      badge: "C99 / RAYLIB / DDA",
      metrics: [
        { label: "FRAME TIME", val: "0.72 ms" },
        { label: "TOTAL MEMORY", val: "1.8 MB Blob" },
        { label: "RESOLUTION", val: "1080p @ 144Hz" }
      ]
    },
    {
      id: "chronos",
      tabTitle: "04. Chronos Physics",
      tag: "FEATURED PROJECT // 04",
      title: "Chronos: Verlet Physics & Spatial Sandbox",
      subtitle: "Mathematical Physics Solver in C & WebAssembly",
      headline: "Impulse-based rigid body solver & spatial hashing handling 2,500+ dynamic bodies at 60 FPS.",
      bullets: [
        "Continuous collision detection (CCD) via GJK + EPA prevents high-velocity particle tunneling.",
        "Broadphase spatial grid hashing reduces pair checks by +94% compared to naive O(N²) brute force.",
        "SIMD-accelerated 2D vector mathematics for batch particle velocity integration.",
        "Interactive cloth mesh & rope constraints solver with real-time drag-and-throw mouse physics."
      ],
      demoTarget: "physics",
      badge: "PHYSICS / GJK-EPA",
      metrics: [
        { label: "COLLIDERS", val: "2,500+ @ 60 FPS" },
        { label: "BROADPHASE", val: "O(N) Hash Grid" },
        { label: "CCD RESOLUTION", val: "GJK + EPA" }
      ]
    },
    {
      id: "voxelcraft",
      tabTitle: "05. VoxelCraft",
      tag: "FEATURED PROJECT // 05",
      title: "VoxelCraft: Chunk-Based Voxel Engine",
      subtitle: "Procedural Volumetric Generation in C / OpenGL 3.3",
      headline: "Octree-partitioned procedural world with greedy meshing and multi-threaded chunk streaming.",
      bullets: [
        "Greedy meshing algorithm yields a 78% reduction in generated vertex geometry and draw calls.",
        "Thread pool job system for non-blocking asynchronous chunk streaming and mesh compilation.",
        "Custom 3D Simplex noise generator with fractional Brownian motion (fBm) for natural biomes.",
        "Strict Git workflow with atomic commits, feature branches, and regression bisecting."
      ],
      demoTarget: "voxel",
      badge: "VOXELS / OPENGL",
      metrics: [
        { label: "VERTEX SAVINGS", val: "-78% Greedy" },
        { label: "CHUNK STREAMING", val: "Thread Pool" },
        { label: "DRAW CALLS", val: "12 / Viewport" }
      ]
    },
    {
      id: "algocraft",
      tabTitle: "06. Algocraft DSA",
      tag: "FEATURED PROJECT // 06",
      title: "Algocraft: DSA & Pathfinding Visualizer",
      subtitle: "Data Structures Profiler & Interactive Workbench",
      headline: "Visual analysis tool for game developers to dissect algorithm complexity and cache lines.",
      bullets: [
        "Side-by-side visual comparison between Dijkstra, A* (Euclidean/Manhattan), and Jump Point Search.",
        "Interactive Quadtree depth inspector displaying spatial node splits and bounding envelopes.",
        "Real-time broadphase telemetry showing pair tests dropping from 1,485 to under 140 (+90% savings).",
        "Integrated memory timeline showing stack vs linear arena utilization per algorithm step."
      ],
      demoTarget: "dsa",
      badge: "ALGORITHMS & DSA",
      metrics: [
        { label: "SAVINGS", val: "+90.4% Checks" },
        { label: "COMPLEXITY", val: "O(N log N)" },
        { label: "ALGORITHMS", val: "8 Implemented" }
      ]
    },
    {
      id: "arsenal",
      tabTitle: "07. Arsenal",
      tag: "TECHNICAL MATRIX // 07",
      title: "Technical Stack & Capabilities",
      subtitle: "From Low-Level Silicon to Real-Time Frame Render",
      headline: "Comprehensive command of low-level languages, graphics pipelines, and production toolchains.",
      bullets: [
        "Languages: C (C99/C11 Primary), Modern C++ (Data-Oriented), GLSL Shaders, WebAssembly.",
        "Engines & Graphics: Raylib, OpenGL 3.3 Core, Software Rasterization, Linear Algebra & Quaternions.",
        "Systems & DSA: Spatial Hashing, Quadtrees, BVH Trees, Memory Arenas, Object Pools, Thread Pools.",
        "Tooling: Git (rebase, bisect, submodules), CMake, Makefiles, Valgrind, RenderDoc, GDB."
      ],
      badge: "TOOLCHAIN",
      metrics: [
        { label: "LANGUAGES", val: "C99, C++, GLSL" },
        { label: "TOOLING", val: "Git, CMake, GDB" },
        { label: "GRAPHICS", val: "Raylib, OpenGL" }
      ]
    },
    {
      id: "contact",
      tabTitle: "08. Contact",
      tag: "CONCLUSION // 08",
      title: "Let's Build Something Remarkable",
      subtitle: "Open for Game Systems & Engine Engineering Roles",
      headline: "Passionate about low-level craft, physics simulation, and performant game code.",
      bullets: [
        "Direct Email: rishabhpanda@gmail.com",
        "GitHub Profile: https://github.com/rishabh-bytecraft",
        "Repository: https://github.com/rishabh-bytecraft/Lab-works",
        "Available for game systems, rendering engines, physics solvers, and technical gameplay programming."
      ],
      badge: "CONTACT & HIRE",
      metrics: [
        { label: "STATUS", val: "Available" },
        { label: "ROLES", val: "Engine / Systems" },
        { label: "LOCATION", val: "Global / Remote" }
      ]
    }
  ];

  let currentSlideIndex = 0;
  let autoplayTimer = null;
  let isAutoplay = false;

  // =========================================================================
  // 2. EMBEDDED ON-PAGE SLIDES PLAYER
  // =========================================================================
  function initEmbeddedSlidesPlayer() {
    const viewport = document.getElementById('embedded-slide-viewport');
    const tabsContainer = document.getElementById('embedded-slide-tabs');
    const dotsContainer = document.getElementById('embedded-slide-dots');
    const counter = document.getElementById('embedded-slide-counter');
    const tagDisplay = document.getElementById('embedded-slide-tag');
    const progressBar = document.getElementById('embedded-slide-progress');
    const prevBtn = document.getElementById('embedded-prev-btn');
    const nextBtn = document.getElementById('embedded-next-btn');
    const autoplayBtn = document.getElementById('embedded-autoplay-btn');

    if (!viewport) return;

    // Render Tabs
    if (tabsContainer) {
      tabsContainer.innerHTML = '';
      PORTFOLIO_SLIDES.forEach((slide, idx) => {
        const tab = document.createElement('button');
        tab.className = `slide-quick-tab ${idx === 0 ? 'active' : ''}`;
        tab.textContent = slide.tabTitle;
        tab.setAttribute('data-tab-index', idx);
        tab.addEventListener('click', () => {
          goToSlide(idx);
          stopAutoplay();
        });
        tabsContainer.appendChild(tab);
      });
    }

    // Render Dots
    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      PORTFOLIO_SLIDES.forEach((_, idx) => {
        const dot = document.createElement('button');
        dot.className = `slide-dot ${idx === 0 ? 'active' : ''}`;
        dot.setAttribute('aria-label', `Go to slide ${idx + 1}`);
        dot.addEventListener('click', () => {
          goToSlide(idx);
          stopAutoplay();
        });
        dotsContainer.appendChild(dot);
      });
    }

    function renderSlideContent(index) {
      const slide = PORTFOLIO_SLIDES[index];

      // Update counter & tag
      if (counter) counter.textContent = `SLIDE 0${index + 1} / 0${PORTFOLIO_SLIDES.length}`;
      if (tagDisplay) tagDisplay.textContent = slide.tag;

      // Update progress
      if (progressBar) {
        const pct = ((index + 1) / PORTFOLIO_SLIDES.length) * 100;
        progressBar.style.width = `${pct}%`;
      }

      // Update active tabs and dots
      if (tabsContainer) {
        tabsContainer.querySelectorAll('.slide-quick-tab').forEach((tab, i) => {
          tab.classList.toggle('active', i === index);
        });
      }
      if (dotsContainer) {
        dotsContainer.querySelectorAll('.slide-dot').forEach((dot, i) => {
          dot.classList.toggle('active', i === index);
        });
      }

      // Build bullets
      const bulletsHtml = slide.bullets.map(b => `
        <li>
          <span class="pres-bullet-symbol">▹</span>
          <span>${b}</span>
        </li>
      `).join('');

      // Build metrics
      const metricsHtml = slide.metrics ? `
        <div class="visual-metrics-bar" style="border-radius: var(--radius-sm); margin-top: 2rem; background-color: var(--surface-elevated); border: 1px solid var(--surface-border);">
          ${slide.metrics.map(m => `
            <div class="metric-item">
              <span class="metric-label">${m.label}</span>
              <span class="metric-value">${m.val}</span>
            </div>
          `).join('')}
        </div>
      ` : '';

      // Demo button if applicable
      let demoAction = '';
      if (slide.demoTarget) {
        demoAction = `
          <div style="margin-top: 1.5rem; display: flex; gap: 1rem; flex-wrap: wrap;">
            <button class="btn btn-primary btn-sm" data-demo-target="${slide.demoTarget}">
              <span>▶</span> Play Live Mini-Engine Demo
            </button>
            <a href="#projects" class="btn btn-secondary btn-sm">
              <span>Explore Code In Projects</span>
            </a>
          </div>
        `;
      } else if (slide.id === 'contact') {
        demoAction = `
          <div style="margin-top: 1.5rem; display: flex; gap: 1rem; flex-wrap: wrap;">
            <button class="btn btn-primary btn-sm copy-email-btn">
              <span>✉</span> Copy Direct Email
            </button>
            <a href="https://github.com/rishabh-bytecraft/Lab-works" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm">
              GitHub Repository
            </a>
          </div>
        `;
      }

      viewport.innerHTML = `
        <div class="pres-slide-header">
          <span class="pres-slide-tag">${slide.tag}</span>
          <span class="pres-slide-badge">${slide.badge}</span>
        </div>
        <h3 class="pres-slide-title">${slide.title}</h3>
        <div class="pres-slide-subtitle">${slide.subtitle}</div>
        <p class="pres-slide-headline">${slide.headline}</p>

        <ul class="pres-slide-bullets">
          ${bulletsHtml}
        </ul>

        ${metricsHtml}
        ${demoAction}
      `;
    }

    function goToSlide(index) {
      if (index < 0) index = PORTFOLIO_SLIDES.length - 1;
      if (index >= PORTFOLIO_SLIDES.length) index = 0;
      currentSlideIndex = index;
      renderSlideContent(index);
    }

    function nextSlide() {
      goToSlide(currentSlideIndex + 1);
    }

    function prevSlide() {
      goToSlide(currentSlideIndex - 1);
    }

    function startAutoplay() {
      isAutoplay = true;
      if (autoplayBtn) {
        autoplayBtn.innerHTML = '<span>⏸</span> Pause';
        autoplayBtn.classList.add('active');
      }
      autoplayTimer = setInterval(() => {
        nextSlide();
      }, 5500);
    }

    function stopAutoplay() {
      isAutoplay = false;
      if (autoplayBtn) {
        autoplayBtn.innerHTML = '<span>▶</span> Auto-Play';
        autoplayBtn.classList.remove('active');
      }
      if (autoplayTimer) {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        prevSlide();
        stopAutoplay();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        nextSlide();
        stopAutoplay();
      });
    }

    if (autoplayBtn) {
      autoplayBtn.addEventListener('click', () => {
        if (isAutoplay) {
          stopAutoplay();
        } else {
          startAutoplay();
        }
      });
    }

    // Keyboard arrow keys when viewport is hovered or in focus
    window.addEventListener('keydown', (e) => {
      const presModal = document.getElementById('presentation-modal');
      if (presModal && presModal.classList.contains('open')) return;
      if (document.activeElement && document.activeElement.tagName === 'INPUT') return;

      const rect = viewport.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;

      if (inView) {
        if (e.key === 'ArrowLeft') {
          prevSlide();
          stopAutoplay();
        } else if (e.key === 'ArrowRight') {
          nextSlide();
          stopAutoplay();
        }
      }
    });

    renderSlideContent(0);
  }

  // =========================================================================
  // 3. FULLSCREEN PRESENTATION DECK MODAL (LAUNCHED VIA 'P' OR BUTTONS)
  // =========================================================================
  function initPresentationModal() {
    const modal = document.getElementById('presentation-modal');
    const launchBtns = document.querySelectorAll('.launch-presentation-btn, #btn-launch-presentation, #hero-slides-btn');
    const closeBtn = document.getElementById('presentation-close-btn');
    const prevBtn = document.getElementById('pres-prev-btn');
    const nextBtn = document.getElementById('pres-next-btn');
    const progressTrack = document.getElementById('pres-progress-bar');
    const counterDisplay = document.getElementById('pres-counter');
    const slideViewport = document.getElementById('pres-slide-content');

    if (!modal) return;

    function renderModalSlide(index) {
      if (index < 0) index = PORTFOLIO_SLIDES.length - 1;
      if (index >= PORTFOLIO_SLIDES.length) index = 0;
      currentSlideIndex = index;

      const slide = PORTFOLIO_SLIDES[index];

      // Progress bar
      const pct = ((index + 1) / PORTFOLIO_SLIDES.length) * 100;
      if (progressTrack) progressTrack.style.width = `${pct}%`;

      // Counter
      if (counterDisplay) counterDisplay.textContent = `SLIDE 0${index + 1} / 0${PORTFOLIO_SLIDES.length}`;

      if (!slideViewport) return;

      const bulletsHtml = slide.bullets.map(b => `
        <li>
          <span class="pres-bullet-symbol">▹</span>
          <span>${b}</span>
        </li>
      `).join('');

      let actionHtml = '';
      if (slide.demoTarget) {
        actionHtml = `
          <div style="margin-top: 2rem;">
            <button class="btn btn-primary" data-demo-target="${slide.demoTarget}">
              <span>▶</span> Launch Interactive Simulation
            </button>
          </div>
        `;
      } else if (slide.id === 'contact') {
        actionHtml = `
          <div style="margin-top: 2rem; display: flex; gap: 1rem; flex-wrap: wrap;">
            <button class="btn btn-primary copy-email-btn">
              <span>✉</span> Copy Direct Email
            </button>
            <a href="https://github.com/rishabh-bytecraft/Lab-works" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">
              View GitHub Source
            </a>
          </div>
        `;
      }

      slideViewport.innerHTML = `
        <div class="pres-slide-header">
          <span class="pres-slide-tag">${slide.tag}</span>
          <span class="pres-slide-badge">${slide.badge}</span>
        </div>
        <h2 class="pres-slide-title">${slide.title}</h2>
        <div class="pres-slide-subtitle">${slide.subtitle}</div>
        <p class="pres-slide-headline">${slide.headline}</p>

        <ul class="pres-slide-bullets">
          ${bulletsHtml}
        </ul>

        ${actionHtml}
      `;
    }

    function openPresentation() {
      modal.classList.add('open');
      renderModalSlide(currentSlideIndex);
      document.body.style.overflow = 'hidden';
    }

    function closePresentation() {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }

    launchBtns.forEach(btn => btn.addEventListener('click', (e) => {
      e.preventDefault();
      openPresentation();
    }));

    if (closeBtn) closeBtn.addEventListener('click', closePresentation);

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        renderModalSlide(currentSlideIndex - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        renderModalSlide(currentSlideIndex + 1);
      });
    }

    // Modal global keyboard handling
    window.addEventListener('keydown', (e) => {
      if (document.activeElement && document.activeElement.tagName === 'INPUT') return;

      if (modal.classList.contains('open')) {
        if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
          e.preventDefault();
          renderModalSlide(currentSlideIndex + 1);
        } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
          e.preventDefault();
          renderModalSlide(currentSlideIndex - 1);
        } else if (e.key === 'Escape') {
          closePresentation();
        }
      } else {
        if (e.key === 'p' || e.key === 'P') {
          const consoleDrawer = document.getElementById('console-drawer');
          if (consoleDrawer && consoleDrawer.classList.contains('open')) return;
          openPresentation();
        }
      }
    });
  }

  // =========================================================================
  // 4. IN-PAGE PROJECT CARDS SLIDER
  // =========================================================================
  let currentProjectSlide = 0;
  let totalProjectSlides = 4;
  let isSlideMode = false; // Grid view default so all 4 project cards are also visible!

  function initProjectSlider() {
    const container = document.getElementById('projects-container');
    const prevBtn = document.getElementById('slide-prev-btn');
    const nextBtn = document.getElementById('slide-next-btn');
    const slideCounter = document.getElementById('slide-counter-display');
    const slideTitleDisplay = document.getElementById('slide-title-display');
    const dotsContainer = document.getElementById('slide-dots-container');
    const btnSlidesMode = document.getElementById('view-mode-slides');
    const btnGridMode = document.getElementById('view-mode-grid');
    const sliderNav = document.getElementById('projects-slider-nav');

    if (!container) return;

    const cards = container.querySelectorAll('.project-card');
    totalProjectSlides = cards.length || 4;

    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      for (let i = 0; i < totalProjectSlides; i++) {
        const dot = document.createElement('button');
        dot.className = `slide-dot ${i === 0 ? 'active' : ''}`;
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        dot.addEventListener('click', () => {
          goToProjectSlide(i);
        });
        dotsContainer.appendChild(dot);
      }
    }

    function updateSlideVisibility() {
      if (!isSlideMode) {
        container.classList.remove('slides-active');
        if (sliderNav) sliderNav.style.display = 'none';
        cards.forEach(card => {
          card.classList.remove('slide-active');
          card.style.display = 'grid';
        });
        return;
      }

      container.classList.add('slides-active');
      if (sliderNav) sliderNav.style.display = 'flex';

      cards.forEach((card, idx) => {
        if (idx === currentProjectSlide) {
          card.classList.add('slide-active');
          card.style.display = 'grid';
        } else {
          card.classList.remove('slide-active');
          card.style.display = 'none';
        }
      });

      if (dotsContainer) {
        dotsContainer.querySelectorAll('.slide-dot').forEach((dot, idx) => {
          dot.classList.toggle('active', idx === currentProjectSlide);
        });
      }

      if (slideCounter) {
        slideCounter.textContent = `0${currentProjectSlide + 1} / 0${totalProjectSlides}`;
      }

      if (slideTitleDisplay && CONFIG.projects[currentProjectSlide]) {
        slideTitleDisplay.textContent = CONFIG.projects[currentProjectSlide].title;
      }
    }

    function goToProjectSlide(index) {
      if (index < 0) index = totalProjectSlides - 1;
      if (index >= totalProjectSlides) index = 0;
      currentProjectSlide = index;
      updateSlideVisibility();
    }

    if (prevBtn) prevBtn.addEventListener('click', () => goToProjectSlide(currentProjectSlide - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goToProjectSlide(currentProjectSlide + 1));

    if (btnSlidesMode) {
      btnSlidesMode.addEventListener('click', () => {
        isSlideMode = true;
        btnSlidesMode.classList.add('active');
        if (btnGridMode) btnGridMode.classList.remove('active');
        updateSlideVisibility();
      });
    }

    if (btnGridMode) {
      btnGridMode.addEventListener('click', () => {
        isSlideMode = false;
        btnGridMode.classList.add('active');
        if (btnSlidesMode) btnSlidesMode.classList.remove('active');
        updateSlideVisibility();
      });
    }

    updateSlideVisibility();
  }

  // Auto initialize on DOMContentLoaded
  document.addEventListener('DOMContentLoaded', () => {
    initEmbeddedSlidesPlayer();
    initPresentationModal();
    setTimeout(initProjectSlider, 80);
  });
})();
