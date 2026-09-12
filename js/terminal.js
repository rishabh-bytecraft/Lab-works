/**
 * TERMINAL.JS
 * Quake / Raylib Style Developer Console
 * Toggled via backtick (`) or the header terminal trigger.
 * Provides interactive inspection of skills, projects, resume, and benchmarks.
 */

(function () {
  'use strict';

  const drawer = document.getElementById('console-drawer');
  const input = document.getElementById('console-input');
  const output = document.getElementById('console-output');
  const closeBtn = document.getElementById('console-close-btn');
  const triggerBtns = document.querySelectorAll('.terminal-trigger-btn');

  if (!drawer || !input || !output) return;

  let commandHistory = [];
  let historyIndex = -1;

  const COMMANDS = {
    help: () => [
      { text: 'AVAILABLE COMMANDS:', type: 'system' },
      { text: '  whoami         - Print developer profile and systems philosophy', type: 'output' },
      { text: '  projects       - List featured game engines and projects', type: 'output' },
      { text: '  skills         - Inspect low-level C, Raylib, and DSA toolkit', type: 'output' },
      { text: '  dsa            - Explain spatial partitioning & memory layouts', type: 'output' },
      { text: '  cat resume.txt - Print formatted text resume', type: 'output' },
      { text: '  slides         - Launch fullscreen portfolio presentation deck', type: 'output' },
      { text: '  benchmarks     - View simulated engine frame time benchmarks', type: 'output' },
      { text: '  contact        - Direct contact channels', type: 'output' },
      { text: '  clear          - Clear console output buffer', type: 'output' },
      { text: '  exit           - Close this console drawer', type: 'output' }
    ],

    slides: () => {
      const btn = document.getElementById('btn-launch-presentation');
      if (btn) btn.click();
      return [{ text: 'Launching Fullscreen Portfolio Presentation Slides Deck [P]...', type: 'accent' }];
    },

    whoami: () => [
      { text: `NAME: ${CONFIG.profile.name === '[MY NAME]' ? 'Alex Vance (Game Developer)' : CONFIG.profile.name}`, type: 'accent' },
      { text: `ROLE: ${CONFIG.profile.role}`, type: 'system' },
      { text: `HEADLINE: "${CONFIG.profile.tagline}"`, type: 'output' },
      { text: `CORE ETHOS: Zero-allocation loops, data-oriented design, mechanical sympathy.`, type: 'output' }
    ],

    projects: () => {
      const lines = [{ text: 'FEATURED SYSTEMS & GAME PROJECTS:', type: 'system' }];
      CONFIG.projects.forEach(p => {
        lines.push({ text: `• ${p.title}`, type: 'accent' });
        lines.push({ text: `  Tech: ${p.techStack.join(', ')}`, type: 'output' });
        lines.push({ text: `  Key Spec: ${p.highlights[0]}`, type: 'output' });
      });
      return lines;
    },

    skills: () => [
      { text: 'TECHNICAL ARSENAL (LOW-LEVEL & SYSTEMS):', type: 'system' },
      { text: '• Languages: C99/C11 (Primary), C++ (DOD), GLSL Shaders, WebAssembly', type: 'output' },
      { text: '• Graphics & Engines: Raylib, OpenGL 3.3 Core, Software Rasterizer', type: 'output' },
      { text: '• Systems & DSA: Spatial Hashing, Quadtrees, GJK/EPA Collision, Memory Arenas', type: 'output' },
      { text: '• Tooling & Workflow: Git (rebase, bisect), CMake, Valgrind, RenderDoc, GDB', type: 'output' }
    ],

    dsa: () => [
      { text: 'DATA STRUCTURES & ALGORITHM PHILOSOPHY:', type: 'system' },
      { text: '• Spatial Partitioning: Avoid O(N²) pairwise tests via dynamic Quadtrees & Spatial Grids.', type: 'output' },
      { text: '• Contiguous Memory: Struct-of-Arrays (SoA) layout guarantees L1 cache line prefetching.', type: 'output' },
      { text: '• Frame Allocators: Fixed-size monotonic memory arenas eliminate heap fragmentation and garbage collection pauses entirely.', type: 'accent' }
    ],

    'cat resume.txt': () => [
      { text: '============================================================', type: 'output' },
      { text: `${CONFIG.profile.name.toUpperCase()} - GAME DEVELOPER & SYSTEMS PROGRAMMER`, type: 'system' },
      { text: '============================================================', type: 'output' },
      { text: 'DISCIPLINES: C, Raylib, Physics Engines, Memory Allocators, Git, DSA', type: 'accent' },
      { text: 'EXPERIENCE: 5+ Years Architecting Custom Game Engines & Simulators', type: 'output' },
      { text: 'PROJECTS:', type: 'output' },
      { text: '  - Aetheria: 2.5D DDA Raycaster with BSP-tree spatial indexing in C99', type: 'output' },
      { text: '  - Chronos: Verlet rigid body solver handling 2,500+ colliders at 60 FPS', type: 'output' },
      { text: '  - VoxelCraft: Greedy-meshed chunk voxel engine with 78% geometry reduction', type: 'output' },
      { text: 'CONTACT: ' + CONFIG.profile.email, type: 'system' },
      { text: '============================================================', type: 'output' }
    ],

    resume: function() { return this['cat resume.txt'](); },
    status: function() { return this.whoami(); },

    benchmarks: () => [
      { text: 'SIMULATED ENGINE TELEMETRY PROFILE:', type: 'system' },
      { text: '• Frame Render Time (1080p @ 144Hz):  0.72 ms', type: 'accent' },
      { text: '• Broadphase Spatial Hash Savings:     97.4% pair reduction', type: 'accent' },
      { text: '• Dynamic Heap Mallocs (Game Loop):    0 allocations', type: 'accent' },
      { text: '• L1 Data Cache Miss Rate:             < 1.8%', type: 'accent' }
    ],

    contact: () => [
      { text: 'DIRECT CHANNELS:', type: 'system' },
      { text: `• Email:   ${CONFIG.profile.email}`, type: 'output' },
      { text: `• GitHub:  ${CONFIG.profile.github}`, type: 'output' },
      { text: `• Discord: ${CONFIG.profile.discord}`, type: 'output' }
    ]
  };

  function printLine(text, type = 'output') {
    const p = document.createElement('p');
    p.className = `console-line ${type}`;
    p.textContent = text;
    output.appendChild(p);
    output.scrollTop = output.scrollHeight;
  }

  function handleCommand(cmdRaw) {
    const cmd = cmdRaw.trim();
    if (!cmd) return;

    commandHistory.push(cmd);
    historyIndex = commandHistory.length;

    printLine(`[c99_dev@kernel] > ${cmd}`, 'accent');

    const lowerCmd = cmd.toLowerCase();

    if (lowerCmd === 'clear') {
      output.innerHTML = '';
      return;
    }

    if (lowerCmd === 'exit') {
      closeTerminal();
      return;
    }

    if (COMMANDS[lowerCmd]) {
      const results = COMMANDS[lowerCmd]();
      results.forEach(res => printLine(res.text, res.type));
    } else {
      printLine(`Command not found: "${cmd}". Type "help" for a list of valid commands.`, 'system');
    }
  }

  function openTerminal() {
    drawer.classList.add('open');
    setTimeout(() => input.focus(), 150);
  }

  function closeTerminal() {
    drawer.classList.remove('open');
  }

  function toggleTerminal() {
    if (drawer.classList.contains('open')) {
      closeTerminal();
    } else {
      openTerminal();
    }
  }

  // Backtick (~) global keyboard shortcut
  window.addEventListener('keydown', (e) => {
    if (e.key === '`' || e.key === '~') {
      // Don't intercept if user is typing in a modal or text input
      if (document.activeElement && document.activeElement.tagName === 'INPUT' && document.activeElement !== input) {
        return;
      }
      e.preventDefault();
      toggleTerminal();
    } else if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeTerminal();
    }
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      handleCommand(input.value);
      input.value = '';
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex > 0) {
        historyIndex--;
        input.value = commandHistory[historyIndex];
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        historyIndex++;
        input.value = commandHistory[historyIndex];
      } else {
        historyIndex = commandHistory.length;
        input.value = '';
      }
    }
  });

  triggerBtns.forEach(btn => btn.addEventListener('click', openTerminal));
  if (closeBtn) closeBtn.addEventListener('click', closeTerminal);
})();
