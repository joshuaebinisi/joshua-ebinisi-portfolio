/* Joshua Ebinisi. Portfolio interactions. */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Sticky nav state ---- */
  var nav = document.getElementById('nav');
  var onScroll = function () {
    if (window.scrollY > 40) nav.classList.add('is-stuck');
    else nav.classList.remove('is-stuck');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- Mobile menu ---- */
  var toggle = document.getElementById('navToggle');
  var menu = document.getElementById('menu');
  var setMenu = function (open) {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.style.overflow = open ? 'hidden' : '';
  };
  toggle.addEventListener('click', function () {
    setMenu(!nav.classList.contains('is-open'));
  });
  menu.addEventListener('click', function (e) {
    if (e.target.closest('a')) setMenu(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) setMenu(false);
  });

  /* ---- Seamless marquee (duplicate track so -50% loops cleanly) ---- */
  var track = document.getElementById('marquee');
  if (track) track.innerHTML += track.innerHTML;

  /* ---- Floating star field in the hero, Ciridae-style ---- */
  var starField = document.getElementById('heroStars');
  if (starField) {
    var STAR_COUNT = 26;
    for (var i = 0; i < STAR_COUNT; i++) {
      var star = document.createElement('span');
      star.className = 'star' + (Math.random() < 0.15 ? ' star--accent' : '');
      star.style.setProperty('--x', (Math.random() * 100).toFixed(1) + '%');
      star.style.setProperty('--y', (Math.random() * 100).toFixed(1) + '%');
      star.style.setProperty('--s', (Math.random() * 2.5 + 1.5).toFixed(1) + 'px');
      star.style.setProperty('--o', (Math.random() * 0.4 + 0.35).toFixed(2));
      star.style.setProperty('--dur', (Math.random() * 5 + 5).toFixed(1) + 's');
      star.style.setProperty('--delay', (Math.random() * -8).toFixed(1) + 's');
      star.style.setProperty('--dx', (Math.random() * 14 - 7).toFixed(1) + 'px');
      star.style.setProperty('--dy', (Math.random() * 10 + 6).toFixed(1) + 'px');
      starField.appendChild(star);
    }
  }

  /* ---- Active section in nav ---- */
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav__links a'));
  var map = {};
  links.forEach(function (a) {
    var id = a.getAttribute('href').slice(1);
    if (id) map[id] = a;
  });
  var sectionEls = Object.keys(map).map(function (id) { return document.getElementById(id); }).filter(Boolean);

  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          links.forEach(function (l) { l.classList.remove('is-active'); });
          var active = map[entry.target.id];
          if (active) active.classList.add('is-active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sectionEls.forEach(function (s) { spy.observe(s); });
  }
})();
