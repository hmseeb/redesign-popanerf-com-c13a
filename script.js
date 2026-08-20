/* ==========================================================================
   Pop-A-Nerf Entertainment — interactions
   Vanilla JS, no dependencies, no external requests.
   ========================================================================== */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------------
     Footer year
     --------------------------------------------------------------- */
  var yr = document.getElementById('yr');
  if (yr) yr.textContent = String(new Date().getFullYear());

  /* ---------------------------------------------------------------
     Mobile navigation
     --------------------------------------------------------------- */
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');

  function setNav(open) {
    if (!burger || !nav) return;
    nav.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.classList.toggle('nav-open', open);
  }

  if (burger && nav) {
    burger.addEventListener('click', function () {
      setNav(burger.getAttribute('aria-expanded') !== 'true');
    });

    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setNav(false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        setNav(false);
        burger.focus();
      }
    });

    document.addEventListener('click', function (e) {
      if (!nav.classList.contains('is-open')) return;
      if (nav.contains(e.target) || burger.contains(e.target)) return;
      setNav(false);
    });

    // Reset when resizing back up to desktop.
    var mq = window.matchMedia('(min-width: 941px)');
    var onMQ = function (ev) { if (ev.matches) setNav(false); };
    if (mq.addEventListener) mq.addEventListener('change', onMQ);
    else if (mq.addListener) mq.addListener(onMQ);
  }

  /* ---------------------------------------------------------------
     Sticky header state
     --------------------------------------------------------------- */
  var hdr = document.getElementById('hdr');
  if (hdr) {
    var ticking = false;
    var onScroll = function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        hdr.classList.toggle('is-stuck', window.scrollY > 24);
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------------------------------------------------------------
     Scroll reveal
     --------------------------------------------------------------- */
  var revealables = document.querySelectorAll('.reveal');

  if (reduceMotion || !('IntersectionObserver' in window)) {
    Array.prototype.forEach.call(revealables, function (el) {
      el.classList.add('is-in');
    });
  } else {
    var revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var siblings = el.parentElement ? el.parentElement.children : [el];
        var index = Array.prototype.indexOf.call(siblings, el);
        el.style.transitionDelay = Math.min(index, 6) * 70 + 'ms';
        el.classList.add('is-in');
        obs.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    Array.prototype.forEach.call(revealables, function (el) {
      revealObserver.observe(el);
    });
  }

  /* ---------------------------------------------------------------
     Animated hero stat counters
     --------------------------------------------------------------- */
  function animateCount(el) {
    var target = parseFloat(el.getAttribute('data-count')) || 0;
    var suffix = el.getAttribute('data-suffix') || '';

    if (reduceMotion) {
      el.textContent = target.toLocaleString('en-US') + suffix;
      return;
    }

    var duration = 1400;
    var start = null;

    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      // easeOutCubic
      var eased = 1 - Math.pow(1 - p, 3);
      var value = Math.round(target * eased);
      el.textContent = value.toLocaleString('en-US') + (p === 1 ? suffix : '');
      if (p < 1) window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
  }

  var statsBox = document.getElementById('stats');
  if (statsBox) {
    var counters = statsBox.querySelectorAll('[data-count]');
    var runCounters = function () {
      Array.prototype.forEach.call(counters, animateCount);
    };

    if (!('IntersectionObserver' in window)) {
      runCounters();
    } else {
      var statObserver = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          runCounters();
          obs.disconnect();
        });
      }, { threshold: 0.35 });
      statObserver.observe(statsBox);
    }
  }

  /* ---------------------------------------------------------------
     Pricing calculator
     Mirrors the published Standard Event Pricing tiers exactly.
     --------------------------------------------------------------- */
  var TIERS = [
    { max: 15, label: '1 to 15 Participants', price: '$595', cents: '.00', note: 'Minimum booking' },
    { max: 20, label: '16 to 20 Participants', price: '$695', cents: '.00', note: 'Standard event package' },
    { max: 25, label: '21 to 25 Participants', price: '$795', cents: '.00', note: 'Standard event package' },
    { max: 30, label: '26 to 30 Participants', price: '$895', cents: '.00', note: 'Standard event package' },
    { max: 35, label: '31 to 35 Participants', price: '$995', cents: '.00', note: 'Standard event package' },
    { max: Infinity, label: '36 or More Participants', price: 'Call us', cents: '', note: 'Requires special pricing — 786-671-6373' }
  ];

  var range = document.getElementById('players');
  var out = document.getElementById('playersOut');
  var tierEl = document.getElementById('calcTier');
  var priceEl = document.getElementById('calcPrice');
  var noteEl = document.getElementById('calcNote');

  function tierFor(n) {
    for (var i = 0; i < TIERS.length; i++) {
      if (n <= TIERS[i].max) return TIERS[i];
    }
    return TIERS[TIERS.length - 1];
  }

  function paintRange(input) {
    var min = parseFloat(input.min) || 0;
    var max = parseFloat(input.max) || 100;
    var val = parseFloat(input.value) || 0;
    var pct = ((val - min) / (max - min)) * 100;
    input.style.background =
      'linear-gradient(90deg, var(--orange) 0%, var(--orange) ' + pct + '%, rgba(255,255,255,.14) ' + pct + '%)';
  }

  function updateCalc() {
    if (!range) return;
    var n = parseInt(range.value, 10);
    var t = tierFor(n);

    if (out) out.textContent = n >= 36 ? '36+' : String(n);
    if (tierEl) tierEl.textContent = t.label;
    if (priceEl) priceEl.innerHTML = t.cents ? t.price + '<sup>' + t.cents + '</sup>' : t.price;
    if (noteEl) noteEl.textContent = t.note;

    paintRange(range);
  }

  if (range) {
    range.addEventListener('input', updateCalc);
    range.addEventListener('change', updateCalc);
    updateCalc();
  }

  /* ---------------------------------------------------------------
     Smooth in-page anchors (respects reduced motion)
     --------------------------------------------------------------- */
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href^="#"]');
    if (!link) return;

    var id = link.getAttribute('href');
    if (!id || id === '#') return;

    var target = document.querySelector(id);
    if (!target) return;

    e.preventDefault();

    var headerH = hdr ? hdr.offsetHeight : 0;
    var top = target.getBoundingClientRect().top + window.pageYOffset - headerH - 12;

    window.scrollTo({ top: top, behavior: reduceMotion ? 'auto' : 'smooth' });

    if (history.replaceState) history.replaceState(null, '', id);
  });

  /* ---------------------------------------------------------------
     Graceful image fallback — hide any frame whose photo fails to load
     so a broken icon never shows on the page.
     --------------------------------------------------------------- */
  Array.prototype.forEach.call(document.images, function (img) {
    img.addEventListener('error', function () {
      var frame = img.closest('.up__media, .venue, .banner, .split__media, .hero__bg');
      if (frame) frame.classList.add('img-failed');
      img.style.display = 'none';
    });
  });
})();
