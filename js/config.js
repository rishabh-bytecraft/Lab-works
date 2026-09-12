/**
 * PORTFOLIO CONFIGURATION
 * Edit this file to customize your name, bio, projects, skills, and links.
 */

const CONFIG = {
  profile: {
    name: "Rishabh Panda",
    defaultPlaceholderName: "Rishabh Panda",
    role: "Game Developer / Programmer",
    tagline: "I build games, systems, and experiences from the ground up.",
    subtext: "Specializing in C, Raylib, low-level engine architecture, data-oriented design, and real-time physics simulation.",
    status: {
      active: true,
      text: "Available for engine & game systems roles"
    },
    location: "Global / Remote",
    experienceYears: "5+ Years Systems & Games",
    email: "rishabhpanda@gmail.com",
    github: "https://github.com/rishabh-bytecraft",
    twitter: "https://x.com",
    discord: "https://discord.com",
    resumeUrl: "#resume"
  },

  // Project Showcase - The Centerpiece
  projects: [
    {
      id: "aetheria",
      title: "Aetheria: 2.5D Raycasting Engine",
      category: "Rendering Engine & Raylib / C99",
      period: "2024",
      featured: true,
      headline: "Zero-heap allocation pseudo-3D engine with dynamic BSP-tree visibility and custom software rasterization.",
      description: "A custom software rendering pipeline written in pure C99 and Raylib. Features a fast Digital Differential Analysis (DDA) raycaster, dynamic textured walls with distance shading, portal-based visibility determination, and custom spatial partitioning for zero runtime heap allocations during gameplay.",
      techStack: ["C99", "Raylib", "GLSL", "BSP Trees", "DDA Algorithm", "Fixed Memory Arenas"],
      highlights: [
        "Consistent sub-0.8ms frame render time at 144 FPS in 1080p",
        "Deterministic fixed-point physics with continuous bounding-circle collision",
        "Custom binary asset packer packing maps, sprites, and audio into a contiguous 1.8MB blob",
        "Zero dynamic malloc/free calls inside the 60 Hz tick loop via pre-allocated arena pools"
      ],
      githubUrl: "https://github.com",
      demoType: "raycaster",
      metrics: {
        fps: "144 FPS",
        memory: "1.8 MB Total",
        allocations: "0 in Loop"
      }
    },
    {
      id: "chronos",
      title: "Chronos: Verlet Physics & Spatial Collision Sandbox",
      category: "Physics Engine & WebAssembly / C",
      period: "2024",
      featured: true,
      headline: "Impulse-based rigid body solver & spatial hashing supporting 2,500+ dynamic bodies at 60 FPS.",
      description: "A high-performance 2D physics engine built from mathematical first principles. Implements Verlet numerical integration, Gilbert-Johnson-Keerthi (GJK) convex collision detection with Expanding Polytope Algorithm (EPA) for penetration vectors, and spatial grid hashing for O(N) broadphase culling.",
      techStack: ["C", "Raylib", "WebAssembly", "Spatial Hashing", "GJK / EPA", "SIMD Math"],
      highlights: [
        "Spatial grid hashing reduces broadphase collision checks from O(N²) to O(N)",
        "SIMD-accelerated 2D vector mathematics for batch particle velocity integration",
        "Continuous collision detection (CCD) preventing high-velocity tunneling through thin colliders",
        "Compiled to native C and WebAssembly with zero dependency overhead"
      ],
      githubUrl: "https://github.com",
      demoType: "physics",
      metrics: {
        fps: "60 FPS",
        colliders: "2,500+",
        complexity: "O(N) Broadphase"
      }
    },
    {
      id: "voxelcraft",
      title: "VoxelCraft: Chunk-Based Voxel Engine",
      category: "Graphics & Procedural Generation / C++ & OpenGL",
      period: "2023 - 2024",
      featured: true,
      headline: "Octree-partitioned procedural world with greedy meshing and multi-threaded chunk generation.",
      description: "A chunked volumetric voxel renderer engineered with cache-friendly contiguous data layouts. Employs greedy meshing algorithms to compress coplanar voxel faces into optimized quad meshes, reducing GPU draw calls and vertex count by up to 78% compared to naive cube generation.",
      techStack: ["C / C++", "Raylib / OpenGL 3.3", "Greedy Meshing", "Simplex Noise", "Job System", "Git"],
      highlights: [
        "Greedy meshing yields a 78% reduction in generated vertex geometry",
        "Thread pool job system for non-blocking asynchronous chunk streaming and mesh generation",
        "Custom 3D Simplex noise generator with fractional Brownian motion (fBm) for realistic biomes",
        "Strict Git workflow with feature branches, atomic commits, and regression bisecting"
      ],
      githubUrl: "https://github.com",
      demoType: "voxel",
      metrics: {
        vertexSavings: "-78%",
        drawCalls: "12 / View",
        chunkGenTime: "< 3ms"
      }
    },
    {
      id: "algocraft",
      title: "Algocraft: DSA & Pathfinding Visualizer",
      category: "Systems & Algorithms / C & WebAssembly",
      period: "2023",
      featured: true,
      headline: "Interactive algorithm analysis tool for graph traversal, spatial indexing, and tree balancing.",
      description: "An educational and profiling suite for game developers to visually dissect algorithm complexity. Visualizes A* heuristics, Jump Point Search (JPS) grid pruning, Dynamic Quadtrees, and Red-Black tree rebalancing with step-by-step memory frame inspection.",
      techStack: ["C", "Raylib", "A* & JPS", "Quadtrees", "Memory Profiler", "Data Structures"],
      highlights: [
        "Direct visual comparison between Dijkstra, A* (Euclidean/Manhattan), and Jump Point Search",
        "Real-time Quadtree depth inspector displaying spatial node splits and bounding envelopes",
        "Integrated memory timeline showing stack vs arena utilization per algorithm step"
      ],
      githubUrl: "https://github.com",
      demoType: "dsa",
      metrics: {
        algorithms: "8 Implemented",
        inspection: "Frame-by-Frame",
        efficiency: "Zero GC"
      }
    }
  ],

  // Philosophy & Architecture Principles
  philosophy: [
    {
      icon: "cpu",
      title: "Data-Oriented Design",
      subtitle: "Structure of Arrays over Object-Oriented Bloat",
      summary: "Modern CPUs are memory-latency bound. By packing hot data contiguously in memory and separating cold attributes, cache lines stay saturated and hardware prefetchers work with the code rather than against it."
    },
    {
      icon: "layers",
      title: "Zero Runtime Allocation",
      subtitle: "Fixed Arenas & Pre-allocated Pools",
      summary: "Every dynamic malloc during a frame is a potential micro-stutter and cache miss. All game state lives in fixed-size contiguous memory arenas allocated once at startup and cleared with a single pointer reset."
    },
    {
      icon: "zap",
      title: "Mechanical Sympathy",
      subtitle: "Writing Code with Hardware Awareness",
      summary: "Understanding branch prediction, instruction pipelining, and SIMD registers produces systems that run order-of-magnitude faster without sacrificing clarity."
    },
    {
      icon: "git-branch",
      title: "Clean Git Discipline",
      subtitle: "Atomic Commits & Bisect-Ready History",
      summary: "A codebase is only as healthy as its change history. Strict adherence to atomic commits, meaningful commit logs, and disciplined rebasing ensures every bug is effortlessly isolated with git bisect."
    }
  ],

  // Skills & Technical Arsenal
  skills: {
    languages: [
      { name: "C (C99 / C11)", level: "Primary", desc: "Low-level systems, manual memory, pointers, bit manipulation" },
      { name: "C++ (Modern / DOD)", level: "Advanced", desc: "Templates, constexpr, SIMD intrinsics, RAII where appropriate" },
      { name: "GLSL / Shaders", level: "Proficient", desc: "Vertex/Fragment shaders, post-processing, compute shading" },
      { name: "WebAssembly", level: "Proficient", desc: "Compiling native C/Raylib engines for the browser via Emscripten" },
      { name: "Python / Shell", level: "Proficient", desc: "Build tools, asset pipelines, testing harnesses" }
    ],
    enginesAndGraphics: [
      { name: "Raylib", level: "Expert", desc: "Core API, audio, windowing, shapes, 3D math, GUI" },
      { name: "OpenGL 3.3+ Core", level: "Advanced", desc: "VAOs, VBOs, FBOs, uniform buffers, instanced rendering" },
      { name: "Linear Algebra & 3D Math", level: "Advanced", desc: "Matrices, Quaternions, vectors, camera projections, transforms" },
      { name: "Software Rasterization", level: "Advanced", desc: "Line drawing (Bresenham), triangle filling, scanline clipping" }
    ],
    systemsAndDSA: [
      { name: "Spatial Partitioning", level: "Expert", desc: "Quadtrees, Octrees, Spatial Hashing, BVH trees" },
      { name: "Collision Systems", level: "Expert", desc: "AABB, SAT (Separating Axis), GJK + EPA, Verlet integration" },
      { name: "Pathfinding & Graphs", level: "Expert", desc: "A*, Jump Point Search (JPS), Dijkstra, Flow Fields" },
      { name: "Memory Management", level: "Expert", desc: "Linear Arenas, Pool Allocators, Free Lists, Stack Allocators" }
    ],
    tooling: [
      { name: "Git", level: "Expert", desc: "Interactive rebase, bisect, cherry-pick, submodules, clean hooks" },
      { name: "CMake / Makefiles", level: "Advanced", desc: "Cross-platform compilation, custom build targets, zero-bloat setup" },
      { name: "Debuggers & Profiling", level: "Advanced", desc: "GDB, Valgrind, RenderDoc, Tracy Profiler, Perf" }
    ]
  }
};
