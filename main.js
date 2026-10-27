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

  /* ---- Theme toggle (dark default, choice remembered) ---- */
  var root = document.documentElement;
  var themeToggle = document.getElementById('themeToggle');
  var themeLabel = themeToggle.querySelector('.theme-toggle__label');
  var syncThemeToggle = function () {
    var isLight = root.getAttribute('data-theme') === 'light';
    themeLabel.textContent = isLight ? 'Dark' : 'Light';
    themeToggle.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
  };
  themeToggle.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
    syncThemeToggle();
  });
  syncThemeToggle();

  /* ---- Intro loader (space theme, once per session) ---- */
  var loader = document.getElementById('loader');
  if (loader && root.classList.contains('has-loader')) {
    var loaderStars = document.getElementById('loaderStars');
    for (var k = 0; k < 40; k++) {
      var ls = document.createElement('span');
      ls.className = 'star' + (Math.random() < 0.15 ? ' star--accent' : '');
      ls.style.setProperty('--x', (Math.random() * 100).toFixed(1) + '%');
      ls.style.setProperty('--y', (Math.random() * 100).toFixed(1) + '%');
      ls.style.setProperty('--s', (Math.random() * 2.5 + 1.5).toFixed(1) + 'px');
      ls.style.setProperty('--o', (Math.random() * 0.4 + 0.35).toFixed(2));
      ls.style.setProperty('--dur', (Math.random() * 5 + 5).toFixed(1) + 's');
      ls.style.setProperty('--delay', (Math.random() * -8).toFixed(1) + 's');
      ls.style.setProperty('--dx', (Math.random() * 14 - 7).toFixed(1) + 'px');
      ls.style.setProperty('--dy', (Math.random() * 10 + 6).toFixed(1) + 'px');
      loaderStars.appendChild(ls);
    }

    var steps = ['Calibrating orbit', 'Charting the star field', 'Loading the backtests', 'Syncing the desk', 'Ready for launch'];
    var fillEl = document.getElementById('loaderFill');
    var pctEl = document.getElementById('loaderPct');
    var statusEl = document.getElementById('loaderStatus');
    var MIN_MS = 2400, MAX_MS = 6000;
    var t0 = performance.now();
    var pageLoaded = document.readyState === 'complete';
    var finished = false;
    window.addEventListener('load', function () { pageLoaded = true; });

    var finish = function () {
      if (finished) return;
      finished = true;
      try { sessionStorage.setItem('introSeen', '1'); } catch (e) {}
      fillEl.style.transform = 'scaleX(1)';
      pctEl.textContent = '100%';
      statusEl.textContent = steps[steps.length - 1];
      setTimeout(function () {
        loader.classList.add('is-done');
        root.classList.add('is-loaded');
        setTimeout(function () {
          root.classList.remove('has-loader');
          loader.remove();
        }, 1000);
      }, 280);
    };

    var tick = function (now) {
      if (finished) return;
      var t = now - t0;
      var eased = 1 - Math.pow(1 - Math.min(t / MIN_MS, 1), 3);
      var p = Math.min(eased, (pageLoaded || t > MAX_MS) ? 1 : 0.9);
      fillEl.style.transform = 'scaleX(' + p.toFixed(3) + ')';
      pctEl.textContent = Math.round(p * 100) + '%';
      statusEl.textContent = steps[Math.min(Math.floor(p * steps.length), steps.length - 1)];
      if (p >= 1) finish();
      else requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);

    loader.addEventListener('click', finish);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' || e.key === 'Enter') finish(); });
  }

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

  /* ---- Tooltip tap support (touch devices don't fire :hover) ---- */
  var tooltips = Array.prototype.slice.call(document.querySelectorAll('.tooltip-trigger'));
  tooltips.forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.stopPropagation();
      var wasOpen = el.classList.contains('is-open');
      tooltips.forEach(function (t) { t.classList.remove('is-open'); });
      el.classList.toggle('is-open', !wasOpen);
    });
  });
  document.addEventListener('click', function () {
    tooltips.forEach(function (t) { t.classList.remove('is-open'); });
  });

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
