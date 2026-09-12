/**
 * CURSOR.JS
 * Subtle, Restrained Cinematic Cursor with Magnetic Follower
 * Enhances micro-interactions without distracting from low-level aesthetics.
 */

(function () {
  'use strict';

  // Only initialize on desktop devices with fine pointer
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const cursorDot = document.createElement('div');
  cursorDot.className = 'custom-cursor';
  document.body.appendChild(cursorDot);

  const cursorFollower = document.createElement('div');
  cursorFollower.className = 'custom-cursor-follower';
  document.body.appendChild(cursorFollower);

  let mouseX = -100;
  let mouseY = -100;
  let followerX = -100;
  let followerY = -100;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
  });

  function updateFollower() {
    // Smooth lerp (linear interpolation) for trailing ring
    const ease = 0.18;
    followerX += (mouseX - followerX) * ease;
    followerY += (mouseY - followerY) * ease;

    cursorFollower.style.left = `${followerX}px`;
    cursorFollower.style.top = `${followerY}px`;

    requestAnimationFrame(updateFollower);
  }
  requestAnimationFrame(updateFollower);

  // Attach hover listeners to interactive elements
  function attachHoverListeners() {
    const interactives = document.querySelectorAll('a, button, input, .btn, .project-card, .hud-mode-btn, .algo-tab-btn, .name-edit-badge');

    interactives.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorDot.classList.add('hovering');
        cursorFollower.classList.add('hovering');
      });

      el.addEventListener('mouseleave', () => {
        cursorDot.classList.remove('hovering');
        cursorFollower.classList.remove('hovering');
      });
    });
  }

  document.addEventListener('DOMContentLoaded', attachHoverListeners);
})();
