/**
 * MAIN.JS
 * Orchestrates portfolio initialization, dynamic config binding,
 * 3D card perspective tilt, scroll observers, Web Audio synthesis, and toast feedback.
 */

(function () {
  'use strict';

  // --- 1. WEB AUDIO SYNTHESIS (SUBTLE SOUND DESIGN) ---
  const AudioSystem = {
    ctx: null,
    enabled: false,

    init() {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioCtx();
      } catch (e) {
        console.warn('Web Audio API not supported in this browser.');
      }
    },

    playClick() {
      if (!this.enabled || !this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(580, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    },

    playHum() {
      if (!this.enabled || !this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.025, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    }
  };

  // --- 2. DYNAMIC CONFIG POPULATION ---
  function populateProfile() {
    const heroName = document.getElementById('hero-name-display');
    const brandName = document.getElementById('brand-name-display');
    const heroRole = document.getElementById('hero-role-display');
    const heroHeadline = document.getElementById('hero-headline-display');
    const heroDescription = document.getElementById('hero-desc-display');
    const contactEmail = document.getElementById('contact-email-display');
    const statusText = document.getElementById('status-text-display');

    if (heroName) heroName.textContent = CONFIG.profile.name;
    if (brandName) brandName.textContent = CONFIG.profile.name === '[MY NAME]' ? 'DEV_PORTFOLIO' : CONFIG.profile.name.replace(/\s+/g, '_').toUpperCase();
    if (heroRole) heroRole.textContent = CONFIG.profile.role;
    if (heroHeadline) heroHeadline.innerHTML = `“I build games, systems, and experiences <em>from the ground up</em>.”`;
    if (heroDescription) heroDescription.textContent = CONFIG.profile.subtext;
    if (contactEmail) contactEmail.textContent = CONFIG.profile.email;
    if (statusText) statusText.textContent = CONFIG.profile.status.text;

    // Social & Contact links
    const emailLinks = document.querySelectorAll('.contact-email-link');
    emailLinks.forEach(link => link.setAttribute('href', `mailto:${CONFIG.profile.email}`));
  }

  // --- 3. RENDER PROJECT CARDS (CENTERPIECE) ---
  function renderProjects() {
    const container = document.getElementById('projects-container');
    if (!container) return;

    container.innerHTML = '';

    CONFIG.projects.forEach((proj, idx) => {
      const card = document.createElement('article');
      card.className = 'project-card reveal-item';
      card.id = `project-${proj.id}`;

      // Build Highlights HTML
      const highlightsHtml = proj.highlights.map(h => `
        <li>
          <span class="highlight-bullet">▹</span>
          <span>${h}</span>
        </li>
      `).join('');

      // Build Tech Stack HTML
      const techHtml = proj.techStack.map(t => `<span class="tech-tag">${t}</span>`).join('');

      // Metrics HTML
      const metricsHtml = Object.entries(proj.metrics).map(([key, val]) => `
        <div class="metric-item">
          <span class="metric-label">${key}</span>
          <span class="metric-value">${val}</span>
        </div>
      `).join('');

      card.innerHTML = `
        <div class="project-info">
          <div>
            <div class="project-meta-top">
              <span class="project-category">${proj.category}</span>
              <span class="project-period">${proj.period}</span>
            </div>
            <h3 class="project-title">${proj.title}</h3>
            <p class="project-headline">${proj.headline}</p>
            <p class="project-description">${proj.description}</p>
          </div>

          <div class="project-highlights-box">
            <div class="highlights-title">
              <span>//</span> Systems Engineering Highlights
            </div>
            <ul class="highlights-list">
              ${highlightsHtml}
            </ul>
          </div>

          <div>
            <div class="project-tech-tags" style="margin-bottom: 1.25rem;">
              ${techHtml}
            </div>

            <div class="project-actions">
              <button class="btn btn-primary" data-demo-target="${proj.demoType}">
                <span>▶</span> Live Interactive Demo
              </button>
              <a href="${proj.githubUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                GitHub Source
              </a>
            </div>
          </div>
        </div>

        <div class="project-visual-container">
          <div class="visual-viewport">
            <canvas class="project-preview-canvas" data-preview="${proj.demoType}"></canvas>
            <div class="visual-overlay-badge">C99 ENGINE BUFFER</div>
          </div>
          <div class="visual-metrics-bar">
            ${metricsHtml}
          </div>
        </div>
      `;

      container.appendChild(card);
    });

    setupCard3DTilt();
  }

  // --- 4. RENDER PHILOSOPHY & ARSENAL ---
  function renderPhilosophy() {
    const grid = document.getElementById('philosophy-grid');
    if (!grid) return;

    grid.innerHTML = '';
    CONFIG.philosophy.forEach(item => {
      const card = document.createElement('div');
      card.className = 'philosophy-card reveal-item';
      card.innerHTML = `
        <div class="philosophy-card-header">
          <div class="philosophy-icon-wrap">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>
          </div>
          <h3 class="philosophy-title">${item.title}</h3>
        </div>
        <div class="philosophy-subtitle">${item.subtitle}</div>
        <p class="philosophy-desc">${item.summary}</p>
      `;
      grid.appendChild(card);
    });
  }

  function renderArsenal() {
    const grid = document.getElementById('arsenal-grid');
    if (!grid) return;

    grid.innerHTML = '';

    const categories = [
      { key: 'languages', title: 'Languages & Core Systems' },
      { key: 'enginesAndGraphics', title: 'Engines & Graphics' },
      { key: 'systemsAndDSA', title: 'Systems & Data Structures' },
      { key: 'tooling', title: 'Tooling & Git Disciplines' }
    ];

    categories.forEach(cat => {
      const list = CONFIG.skills[cat.key];
      if (!list) return;

      const col = document.createElement('div');
      col.className = 'arsenal-category reveal-item';

      const itemsHtml = list.map(s => `
        <div class="skill-row">
          <div class="skill-row-top">
            <span class="skill-name">${s.name}</span>
            <span class="skill-badge">${s.level}</span>
          </div>
          <p class="skill-desc">${s.desc}</p>
        </div>
      `).join('');

      col.innerHTML = `
        <h3 class="category-title">
          <span>//</span> ${cat.title}
        </h3>
        <div class="skill-items">
          ${itemsHtml}
        </div>
      `;

      grid.appendChild(col);
    });
  }

  // --- 5. 3D CARD PERSPECTIVE TILT ---
  function setupCard3DTilt() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const cards = document.querySelectorAll('.project-card');
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -4;
        const rotateY = ((x - centerX) / centerX) * 4;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
      });
    });
  }

  // --- 6. SCROLL PROGRESS & HEADER STATE ---
  function setupScrollTracking() {
    const progressBar = document.getElementById('scroll-progress');
    const header = document.getElementById('site-header');

    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

      if (progressBar) progressBar.style.width = `${progress}%`;

      if (header) {
        if (scrollTop > 40) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      }
    }, { passive: true });
  }

  // --- 7. SCROLL REVEAL OBSERVER ---
  function setupScrollReveals() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, {
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.12
    });

    document.querySelectorAll('.reveal-item').forEach(el => observer.observe(el));
  }

  // --- 8. NAME LIVE EDIT CUSTOMIZER MODAL / POPUP ---
  function setupNameCustomizer() {
    const badge = document.getElementById('name-edit-badge');
    if (!badge) return;

    badge.addEventListener('click', () => {
      AudioSystem.playClick();
      const currentName = CONFIG.profile.name === '[MY NAME]' ? '' : CONFIG.profile.name;
      const newName = prompt('Enter your name to personalize this portfolio:', currentName || CONFIG.profile.defaultPlaceholderName);

      if (newName && newName.trim() !== '') {
        CONFIG.profile.name = newName.trim();
        populateProfile();
        showToast(`Profile name updated to: ${CONFIG.profile.name}`);
      }
    });
  }

  // --- 9. TOAST NOTIFICATIONS ---
  function showToast(message) {
    let toast = document.getElementById('toast-notice');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast-notice';
      toast.className = 'toast-notice';
      document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.classList.add('show');
    AudioSystem.playHum();

    setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  // --- 10. COPY EMAIL BUTTON ---
  function setupCopyEmail() {
    const copyBtns = document.querySelectorAll('.copy-email-btn');
    copyBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        AudioSystem.playClick();
        navigator.clipboard.writeText(CONFIG.profile.email).then(() => {
          showToast(`Email copied to clipboard: ${CONFIG.profile.email}`);
        }).catch(() => {
          showToast(`Direct email: ${CONFIG.profile.email}`);
        });
      });
    });
  }

  // --- 11. SOUND TOGGLE BUTTON ---
  function setupSoundToggle() {
    const soundBtn = document.getElementById('sound-toggle-btn');
    const soundIcon = document.getElementById('sound-icon');
    if (!soundBtn) return;

    soundBtn.addEventListener('click', () => {
      AudioSystem.init();
      AudioSystem.enabled = !AudioSystem.enabled;

      if (AudioSystem.enabled) {
        AudioSystem.playClick();
        if (soundIcon) soundIcon.textContent = '🔊';
        showToast('Acoustic feedback enabled');
      } else {
        if (soundIcon) soundIcon.textContent = '🔇';
        showToast('Acoustic feedback muted');
      }
    });

    // Global click acoustic feedback
    document.addEventListener('click', (e) => {
      if (e.target.closest('button') || e.target.closest('a')) {
        AudioSystem.playClick();
      }
    });
  }

  // --- 12. MOBILE MENU DRAWER ---
  function setupMobileMenu() {
    const toggleBtn = document.getElementById('mobile-toggle-btn');
    const drawer = document.getElementById('mobile-nav-drawer');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    if (!toggleBtn || !drawer) return;

    toggleBtn.addEventListener('click', () => {
      drawer.classList.toggle('open');
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        drawer.classList.remove('open');
      });
    });
  }

  // DOM Content Loaded Handler
  document.addEventListener('DOMContentLoaded', () => {
    populateProfile();
    renderProjects();
    if (window.ProjectDemos && window.ProjectDemos.initCardPreviews) {
      window.ProjectDemos.initCardPreviews();
    }
    renderPhilosophy();
    renderArsenal();
    setupScrollTracking();
    setupScrollReveals();
    setupNameCustomizer();
    setupCopyEmail();
    setupSoundToggle();
    setupMobileMenu();
  });
})();
