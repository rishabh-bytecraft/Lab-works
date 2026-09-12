# Handcrafted Game Developer & Systems Programmer Portfolio

> A bespoke, cinematic dark-editorial developer portfolio engineered for specialists in **C, Raylib, Game Engines, Git, and Data Structures & Algorithms (DSA)**.

Designed with an aesthetic palette of near-black charcoal (`#0B0D0F`), refined surface layers (`#12161A`), warm off-white typography (`#F2F0EA`), muted gray (`#8D949B`), and sparing accents of electric blue (`#7C9CFF`) and subtle violet (`#A88BFF`). Free of generic AI templates, gamer clichés, and heavy web bloat.

---

## ⚡ Key Highlights & Systems Architecture

1. **Raylib-Inspired 2D Physics Canvas (`#hero-canvas`)**
   - Pure HTML5 Canvas 2D simulation running Verlet integration, elastic collision response, and a Broadphase Spatial Partitioning Hash Grid.
   - Real-time Raylib debug telemetry HUD: FPS counter, active entity count, tested collision pairs, and frame execution time in milliseconds.
   - Interactive cursor force field with gravity pulse on click.
   - Switchable simulation modes: *Physics Sandbox*, *Spatial Grid ($O(N)$)*, and *Wireframe AABB*.

2. **Centerpiece Project Showcase (`#projects`)**
   - Immersive project cards featuring **3D perspective tilt** tracking cursor movement.
   - Low-level Systems Engineering Highlights (e.g. sub-0.8ms frame times, zero runtime heap allocations, greedy meshing, GJK/EPA continuous collision detection).
   - Embedded preview buffers with ambient wireframe animations.
   - **Playable Live Demos Modal**:
     - **Aetheria**: Fully playable 2.5D DDA raycaster engine (Wolfenstein 3D / Raylib style) with real-time maze traversal (WASD / Arrows) and corner mini-map.
     - **Chronos**: Interactive Verlet physics & cloth/rope constraint solver with drag-and-throw mouse interaction.

3. **Interactive DSA & Systems Architecture Playground (`#dsa-systems`)**
   - **Spatial Partitioning Workbench**: Live interactive comparison between $O(N^2)$ brute-force collision testing and $O(N \log N)$ dynamic Quadtree subdivision, with real-time pair reduction metrics (typically +90% savings).
   - **Linear Memory Arena Allocator**: Interactive visualization of a 64KB contiguous memory arena with bump pointer allocation and instantaneous $O(1)$ teardown (zero garbage collection).

4. **Quake / Raylib Developer Console (`~`)**
   - Toggleable drop-down developer console via backtick (`` ` `` / `~`) or header button.
   - Interactive commands: `help`, `whoami`, `projects`, `skills`, `dsa`, `cat resume.txt`, `benchmarks`, `contact`, `clear`, `exit`.

5. **Acoustic Feedback & Subtle Micro-Interactions**
   - Synthesized subtle clicks and hums using the native Web Audio API (unobtrusive, muted by default with one-click toggle).
   - Fluid lerped custom cursor with contextual morphing on interactive elements.

---

## 🚀 How to Run Locally

Because this project is built with standard, high-performance HTML5, CSS3, and modern Vanilla JavaScript, **no build tools, Node.js, or bundlers are required**.

### Option 1: Direct Browser Launch
Simply double-click `index.html` or open it with your favorite browser:
```powershell
Start-Process ".\index.html"
```

### Option 2: Local HTTP Server (Optional)
If you have any local web server available:
```powershell
# Python (if installed):
python -m http.server 8000

# Node / npx (if installed):
npx serve .
```

---

## ⚙️ Customization Guide

### Personal Information & Projects
Open `js/config.js` to configure:
- **`profile.name`**: Your display name (e.g., `"Alex Vance"`).
- **`profile.role`**: Your title (default: `"Game Developer / Programmer"`).
- **`profile.email`**: Your primary contact address.
- **`profile.github` / `discord` / `twitter`**: Your social links.
- **`projects` array**: Add, remove, or modify project titles, descriptions, tech stacks, GitHub links, and metrics.
- **`skills` object**: Update your languages, graphics libraries, and DSA proficiencies.

> **Tip**: You can also click the **"✎ Customize Name"** button directly in the hero section to test how your name looks in real time!

---

## 📦 Deployment

### GitHub Pages (Free)
1. Initialize a git repository:
   ```bash
   git init
   git add .
   git commit -m "feat: initial portfolio release"
   ```
2. Push to your GitHub repository:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git branch -M main
   git push -u origin main
   ```
3. In GitHub repo settings, navigate to **Pages** > Select `main` branch > `/ (root)` > Save. Your portfolio will be live instantly!

### Vercel / Netlify
Drag and drop the `portfolio-game-dev` folder directly onto the Vercel or Netlify dashboard. Zero configuration needed.

---

## 🛠️ Tech Stack & Philosophy

- **Core**: Vanilla HTML5, Modern CSS3 (CSS Variables, Flexbox, Grid, Backdrop Filters), Vanilla ES6+ JavaScript.
- **Graphics & Audio**: HTML5 2D Canvas Context, Web Audio API Oscillator synthesis.
- **Design Tokens**: `#0B0D0F` (Charcoal), `#12161A` (Surface), `#F2F0EA` (Warm White), `#8D949B` (Muted Gray), `#7C9CFF` (Electric Blue), `#A88BFF` (Subtle Violet).
- **Typography**: Space Grotesk (Headings), JetBrains Mono (Technical / Code), Inter (Body).
