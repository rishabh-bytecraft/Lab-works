/**
 * SLIDES.JS
 * 1. In-Page Project Slides Carousel (Slide Mode vs Grid Mode)
 * 2. Fullscreen Cinematic Presentation Slides Deck (Pitch Deck Mode)
 */

(function () {
  'use strict';

  // =========================================================================
  // 1. IN-PAGE PROJECT SLIDES CAROUSEL
  // =========================================================================
  let currentProjectSlide = 0;
  let totalProjectSlides = 4;
  let isSlideMode = true; // Default to Slides Mode per user preference!

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

    // Create Slide Dots
    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      for (let i = 0; i < totalProjectSlides; i++) {
        const dot = document.createElement('button');
        dot.className = `slide-dot ${i === 0 ? 'active' : ''}`;
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        dot.setAttribute('data-slide-index', i);
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
          card.classList.remove('slide-active', 'slide-inactive-prev', 'slide-inactive-next');
          card.style.display = 'grid';
        });
        return;
      }

      container.classList.add('slides-active');
      if (sliderNav) sliderNav.style.display = 'flex';

      cards.forEach((card, idx) => {
        card.classList.remove('slide-active', 'slide-inactive-prev', 'slide-inactive-next');
        if (idx === currentProjectSlide) {
          card.classList.add('slide-active');
          card.style.display = 'grid';
        } else {
          card.style.display = 'none';
        }
      });

      // Update dots
      if (dotsContainer) {
        const dots = dotsContainer.querySelectorAll('.slide-dot');
        dots.forEach((dot, idx) => {
          dot.classList.toggle('active', idx === currentProjectSlide);
        });
      }

      // Update counter
      if (slideCounter) {
        slideCounter.textContent = `0${currentProjectSlide + 1} / 0${totalProjectSlides}`;
      }

      // Update current project title in HUD
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

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        goToProjectSlide(currentProjectSlide - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        goToProjectSlide(currentProjectSlide + 1);
      });
    }

    // View Mode Toggle (Slides vs Grid)
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

    // Keyboard Arrow navigation when over the projects section
    window.addEventListener('keydown', (e) => {
      // Don't intercept if presentation modal or console is open
      const presModal = document.getElementById('presentation-modal');
      const consoleDrawer = document.getElementById('console-drawer');
      if (presModal && presModal.classList.contains('open')) return;
      if (consoleDrawer && consoleDrawer.classList.contains('open')) return;

      if (!isSlideMode) return;

      const rect = container.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;

      if (inView) {
        if (e.key === 'ArrowLeft') {
          goToProjectSlide(currentProjectSlide - 1);
        } else if (e.key === 'ArrowRight') {
          goToProjectSlide(currentProjectSlide + 1);
        }
      }
    });

    updateSlideVisibility();
  }

  // =========================================================================
  // 2. FULLSCREEN PRESENTATION SLIDES DECK (PITCH DECK)
  // =========================================================================
  const PRESENTATION_SLIDES = [
    {
      id: "intro",
      tag: "OVERVIEW // 01",
      title: "Rishabh Panda",
      subtitle: "Game Developer & Systems Programmer",
      headline: "Crafting games, physics engines, and systems from mathematical first principles.",
      bullets: [
        "Core focus: C (C99/C11), Raylib, WebAssembly, and OpenGL.",
        "Architecture philosophy: Data-oriented design, cache locality, and zero runtime heap allocations.",
        "Engineered custom broadphase spatial partitioning (Quadtrees, Spatial Hashing, BVH).",
        "Disciplined Git workflow: atomic commits, bisect-ready history, and clean modular branches."
      ],
      badge: "C99 / RAYLIB / DSA"
    },
    {
      id: "philosophy",
      tag: "ENGINEERING ETHOS // 02",
      title: "Low-Level Architecture Standards",
      subtitle: "Mechanical Sympathy & Cache Coherency",
      headline: "How systems run an order of magnitude faster without sacrificing code clarity.",
      bullets: [
        "Data-Oriented Design: Struct-of-Arrays (SoA) layout guarantees hardware prefetcher line saturation.",
        "Zero Runtime Allocations: Monotonic linear memory arenas reset each frame in 1 CPU clock cycle.",
        "Predictable Frame Budgets: Continuous 144 FPS / sub-1ms tick loops with zero garbage collection spikes.",
        "Spatial Partitioning: Reducing O(N²) quadratic collision explosion to O(N log N) via dynamic Quadtrees."
      ],
      badge: "SYSTEMS ARCHITECTURE"
    },
    {
      id: "aetheria",
      tag: "PROJECT SHOWCASE // 03",
      title: "Aetheria: 2.5D Raycasting Engine",
      subtitle: "Software Rasterization & Raylib in Pure C99",
      headline: "Zero-heap allocation pseudo-3D engine with dynamic BSP-tree visibility and custom DDA raycaster.",
      bullets: [
        "Consistent sub-0.8ms frame render time at 144 FPS in 1080p resolution.",
        "Deterministic fixed-point physics with continuous bounding-circle collision resolution.",
        "Custom binary asset packer bundling maps, textures, and sound into a single 1.8MB blob.",
        "Features a live playable in-browser port with real-time maze navigation (WASD/Arrows)."
      ],
      demoTarget: "raycaster",
      badge: "C99 / RAYLIB / DDA"
    },
    {
      id: "chronos",
      tag: "PROJECT SHOWCASE // 04",
      title: "Chronos: Verlet Physics & Spatial Sandbox",
      subtitle: "Mathematical Physics Solver in C & WebAssembly",
      headline: "Impulse-based rigid body solver & spatial hashing handling 2,500+ dynamic bodies at 60 FPS.",
      bullets: [
        "Continuous collision detection (CCD) via GJK + EPA prevents high-velocity tunneling.",
        "Broadphase spatial grid hashing reduces pair checks by +94% compared to brute-force.",
        "SIMD-accelerated 2D vector mathematics for batch particle velocity integration.",
        "Interactive cloth mesh & rope constraints solver with real-time drag-and-throw interaction."
      ],
      demoTarget: "physics",
      badge: "PHYSICS / GJK-EPA"
    },
    {
      id: "voxelcraft",
      tag: "PROJECT SHOWCASE // 05",
      title: "VoxelCraft: Chunk-Based Voxel Engine",
      subtitle: "Procedural Volumetric Generation in C / OpenGL 3.3",
      headline: "Octree-partitioned procedural world with greedy meshing and multi-threaded chunk streaming.",
      bullets: [
        "Greedy meshing algorithm yields a 78% reduction in generated vertex geometry.",
        "Thread pool job system for non-blocking asynchronous chunk streaming and meshing.",
        "Custom 3D Simplex noise generator with fractional Brownian motion (fBm) for natural biomes.",
        "Strict Git workflow with feature branches, atomic commits, and regression bisecting."
      ],
      demoTarget: "voxel",
      badge: "VOXELS / OPENGL"
    },
    {
      id: "algocraft",
      tag: "PROJECT SHOWCASE // 06",
      title: "Algocraft: DSA & Pathfinding Visualizer",
      subtitle: "Algorithms Profiler & Interactive Workbench",
      headline: "Profiling suite for game developers to visually dissect algorithm complexity and cache lines.",
      bullets: [
        "Side-by-side visual comparison between Dijkstra, A* (Euclidean/Manhattan), and Jump Point Search.",
        "Interactive Quadtree depth inspector displaying spatial node splits and bounding envelopes.",
        "Real-time broadphase telemetry showing pair tests dropping from 1,485 to under 140 (+90% savings).",
        "Integrated memory timeline showing stack vs linear arena utilization per algorithm step."
      ],
      demoTarget: "dsa",
      badge: "ALGORITHMS & DSA"
    },
    {
      id: "arsenal",
      tag: "TECHNICAL MATRIX // 07",
      title: "Technical Stack & Capabilities",
      subtitle: "From Silicon to Screen",
      headline: "Comprehensive command of low-level languages, graphics pipelines, and production toolchains.",
      bullets: [
        "Languages: C (C99/C11 Primary), Modern C++ (Data-Oriented), GLSL Shaders, WebAssembly.",
        "Engines & Graphics: Raylib, OpenGL 3.3 Core, Software Rasterization, Linear Algebra & Quaternions.",
        "Systems & DSA: Spatial Hashing, Quadtrees, BVH Trees, Memory Arenas, Object Pools, Thread Pools.",
        "Tooling: Git (rebase, bisect, submodules), CMake, Makefiles, Valgrind, RenderDoc, GDB."
      ],
      badge: "TOOLCHAIN"
    },
    {
      id: "contact",
      tag: "CONCLUSION // 08",
      title: "Let's Build Together",
      subtitle: "Open for Game Systems & Engine Engineering Roles",
      headline: "Passionate about low-level craft, physics simulation, and performant game code.",
      bullets: [
        "Email: rishabhpanda@gmail.com",
        "GitHub: https://github.com/rishabh-bytecraft",
        "Repository: https://github.com/rishabh-bytecraft/Lab-works",
        "Available for systems engineering, rendering engine roles, and technical game development."
      ],
      badge: "CONTACT"
    }
  ];

  let currentPresentationIndex = 0;

  function initPresentationModal() {
    const modal = document.getElementById('presentation-modal');
    const launchBtns = document.querySelectorAll('.launch-presentation-btn, #btn-launch-presentation');
    const closeBtn = document.getElementById('presentation-close-btn');
    const prevBtn = document.getElementById('pres-prev-btn');
    const nextBtn = document.getElementById('pres-next-btn');
    const progressTrack = document.getElementById('pres-progress-bar');
    const counterDisplay = document.getElementById('pres-counter');
    const slideViewport = document.getElementById('pres-slide-content');

    if (!modal) return;

    function renderPresentationSlide(index) {
      if (index < 0) index = PRESENTATION_SLIDES.length - 1;
      if (index >= PRESENTATION_SLIDES.length) index = 0;
      currentPresentationIndex = index;

      const slide = PRESENTATION_SLIDES[index];

      // Update progress
      const progressPercent = ((index + 1) / PRESENTATION_SLIDES.length) * 100;
      if (progressTrack) progressTrack.style.width = `${progressPercent}%`;

      // Update counter
      if (counterDisplay) {
        counterDisplay.textContent = `SLIDE 0${index + 1} / 0${PRESENTATION_SLIDES.length}`;
      }

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
              <span>▶</span> Launch Interactive Demo
            </button>
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
      renderPresentationSlide(0);
      document.body.style.overflow = 'hidden';
    }

    function closePresentation() {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }

    launchBtns.forEach(btn => btn.addEventListener('click', openPresentation));
    if (closeBtn) closeBtn.addEventListener('click', closePresentation);

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        renderPresentationSlide(currentPresentationIndex - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        renderPresentationSlide(currentPresentationIndex + 1);
      });
    }

    // Keyboard Shortcuts: 'p' opens presentation, Arrows navigate, ESC closes
    window.addEventListener('keydown', (e) => {
      // Don't intercept if typing in inputs
      if (document.activeElement && document.activeElement.tagName === 'INPUT') return;

      if (modal.classList.contains('open')) {
        if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
          e.preventDefault();
          renderPresentationSlide(currentPresentationIndex + 1);
        } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
          e.preventDefault();
          renderPresentationSlide(currentPresentationIndex - 1);
        } else if (e.key === 'Escape') {
          closePresentation();
        }
      } else {
        if (e.key === 'p' || e.key === 'P') {
          // Don't intercept if console is open
          const consoleDrawer = document.getElementById('console-drawer');
          if (consoleDrawer && consoleDrawer.classList.contains('open')) return;
          openPresentation();
        }
      }
    });
  }

  // Initialize both slide systems on DOM load
  document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure main.js has rendered the project cards first
    setTimeout(() => {
      initProjectSlider();
      initPresentationModal();
    }, 50);
  });
})();
