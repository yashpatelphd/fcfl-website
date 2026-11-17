/* ==========================================================================
   Futuristic Cyber Forensics Lab (FCFL) — scripts
   Plain JavaScript, no libraries. Each feature is its own function;
   delete a call at the bottom of this file to switch a feature off.
   ========================================================================== */

(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------------
     1. Header: shadow on scroll + mobile menu
     ------------------------------------------------------------------------ */
  function initHeader() {
    var header = document.querySelector('.site-header');
    var nav = document.getElementById('main-nav');
    var btn = document.querySelector('.menu-btn');
    if (!header) return;

    function onScroll() { header.classList.toggle('is-scrolled', window.scrollY > 8); }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    if (!nav || !btn) return;
    var label = btn.querySelector('.sr-only');

    function setOpen(open) {
      if (open) nav.style.setProperty('--nav-top', header.getBoundingClientRect().bottom + 'px');
      btn.setAttribute('aria-expanded', String(open));
      if (label) label.textContent = open ? 'Close menu' : 'Open menu';
      nav.classList.toggle('is-open', open);
      document.body.classList.toggle('menu-open', open);
    }

    btn.addEventListener('click', function () {
      setOpen(btn.getAttribute('aria-expanded') !== 'true');
    });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) { setOpen(false); btn.focus(); }
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 1200 && nav.classList.contains('is-open')) setOpen(false);
    });
  }

  /* ------------------------------------------------------------------------
     2. Highlight the menu item of the section on screen
     ------------------------------------------------------------------------ */
  function initActiveNav() {
    if (!('IntersectionObserver' in window)) return;
    var links = Array.prototype.slice.call(document.querySelectorAll('.main-nav ul a[href^="#"]'));
    var byId = {};
    links.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) { a.classList.remove('is-active'); a.removeAttribute('aria-current'); });
        var link = byId[entry.target.id];
        if (link) { link.classList.add('is-active'); link.setAttribute('aria-current', 'true'); }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });

    document.querySelectorAll('main > section[id]').forEach(function (s) { observer.observe(s); });
  }

  /* ------------------------------------------------------------------------
     3. Dot-wave backgrounds (hero, facilities, footer)
     Drawn on <canvas class="dotwave" data-wave="hero|soft|footer">.
     Animates only while visible; static if the visitor prefers less motion.
     ------------------------------------------------------------------------ */
  // from = colour of the far rows, to = colour of the near rows (NFSU navy and gold)
  var WAVE_SETTINGS = {
    hero:   { cols: 120, rows: 34, amp: 0.11, rise: 0.30, speed: 0.30, alpha: 0.70, from: [50, 43, 106],  to: [194, 154, 62] },
    soft:   { cols: 80,  rows: 22, amp: 0.10, rise: 0.30, speed: 0.20, alpha: 0.45, from: [50, 43, 106],  to: [133, 101, 26] },
    footer: { cols: 90,  rows: 26, amp: 0.08, rise: 0.55, speed: 0.22, alpha: 0.90, from: [150, 140, 210], to: [214, 180, 90] }
  };

  function DotWave(canvas) {
    var cfg = WAVE_SETTINGS[canvas.getAttribute('data-wave')] || WAVE_SETTINGS.hero;
    var ctx = canvas.getContext('2d');
    var w = 0, h = 0, visible = true, running = false, start = null;
    if (!ctx) return;

    function resize() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw(lastT);
    }

    var lastT = 0;
    function draw(t) {
      lastT = t;
      ctx.clearRect(0, 0, w, h);
      for (var j = 0; j < cfg.rows; j++) {
        var d = j / (cfg.rows - 1);                       // 0 = far row, 1 = near row
        var spread = 0.8 + 0.55 * d;
        var baseY = h * (0.16 + 0.8 * Math.pow(d, 1.3));
        var size = 0.8 + 1.6 * d;
        var alpha = (0.07 + 0.78 * d) * cfg.alpha;
        // blend from the far-row colour to the near-row colour
        var r = Math.round(cfg.from[0] + (cfg.to[0] - cfg.from[0]) * d);
        var g = Math.round(cfg.from[1] + (cfg.to[1] - cfg.from[1]) * d);
        var b = Math.round(cfg.from[2] + (cfg.to[2] - cfg.from[2]) * d);
        ctx.fillStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + alpha.toFixed(3) + ')';

        for (var i = 0; i < cfg.cols; i++) {
          var u = i / (cfg.cols - 1);
          var x = w * (0.5 + (u - 0.5) * spread);
          if (x < -4 || x > w + 4) continue;
          var wave = Math.sin(u * 9 + t + d * 3) * 0.55 + Math.sin(u * 3.2 - t * 0.6 + d * 5) * 0.45;
          var y = baseY
            + wave * h * cfg.amp * (0.4 + 0.6 * d)
            - cfg.rise * h * Math.pow(u, 2.2) * (0.55 + 0.45 * d);
          ctx.fillRect(x - size / 2, y - size / 2, size, size);
        }
      }
    }

    function frame(now) {
      if (!visible || reduceMotion) { running = false; return; }
      if (start === null) start = now;
      draw(((now - start) / 1000) * cfg.speed * 2);
      requestAnimationFrame(frame);
    }

    function play() {
      if (running || reduceMotion) return;
      running = true;
      requestAnimationFrame(frame);
    }

    resize();
    if ('ResizeObserver' in window) new ResizeObserver(resize).observe(canvas);
    else window.addEventListener('resize', resize);

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        if (visible) play();
      }).observe(canvas);
    } else {
      play();
    }
  }

  function initDotWaves() {
    document.querySelectorAll('canvas.dotwave').forEach(function (c) { DotWave(c); });
  }

  /* ------------------------------------------------------------------------
     4. Research area tabs (click, or arrow keys / Home / End)
     ------------------------------------------------------------------------ */
  function initTabs() {
    var list = document.querySelector('.rx-tabs');
    if (!list) return;
    var tabs = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));

    function select(tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        var panel = document.getElementById(t.getAttribute('aria-controls'));
        if (panel) panel.hidden = !on;
      });
      if (focus) tab.focus({ preventScroll: true });
      // on small screens the tabs scroll sideways: bring the chosen one into view
      if (list.scrollWidth > list.clientWidth) {
        var offset = tab.getBoundingClientRect().left - list.getBoundingClientRect().left + list.scrollLeft - 8;
        list.scrollTo({ left: offset, behavior: reduceMotion ? 'auto' : 'smooth' });
      }
    }

    tabs.forEach(function (t) { t.addEventListener('click', function () { select(t, false); }); });

    list.addEventListener('keydown', function (e) {
      var i = tabs.indexOf(document.activeElement);
      if (i < 0) return;
      var next;
      switch (e.key) {
        case 'ArrowDown': case 'ArrowRight': next = (i + 1) % tabs.length; break;
        case 'ArrowUp': case 'ArrowLeft': next = (i - 1 + tabs.length) % tabs.length; break;
        case 'Home': next = 0; break;
        case 'End': next = tabs.length - 1; break;
        default: return;
      }
      e.preventDefault();
      select(tabs[next], true);
    });
  }

  /* ------------------------------------------------------------------------
     5. Filter chips (Activities)
     <div class="chips" data-filter-target="#list"> + items with data-filter-value.
     If the list has data-limit="3", only the first 3 matching items show
     until the button with data-more-for="#list" is pressed.
     ------------------------------------------------------------------------ */
  function initChipFilters() {
    document.querySelectorAll('.chips[data-filter-target]').forEach(function (group) {
      var selector = group.getAttribute('data-filter-target');
      var target = document.querySelector(selector);
      if (!target) return;
      var items = Array.prototype.slice.call(target.querySelectorAll('[data-filter-value]'));
      var limit = parseInt(target.getAttribute('data-limit'), 10) || 0;
      var more = document.querySelector('[data-more-for="' + selector + '"]');
      var empty = target.nextElementSibling;
      if (empty && !empty.classList.contains('empty')) empty = null;
      var state = { value: 'all', expanded: false };

      function apply() {
        var matched = 0;
        items.forEach(function (item) {
          var match = state.value === 'all' || item.getAttribute('data-filter-value') === state.value;
          var show = match && (!limit || state.expanded || matched < limit);
          if (match) matched++;
          item.hidden = !show;
        });
        if (empty) empty.hidden = matched > 0;
        if (more) {
          more.hidden = !limit || matched <= limit;
          more.setAttribute('aria-expanded', String(state.expanded));
          more.textContent = state.expanded ? 'Show fewer' : 'View all ' + matched + ' activities';
        }
      }

      group.addEventListener('click', function (e) {
        var chip = e.target.closest('.chip');
        if (!chip) return;
        state.value = chip.getAttribute('data-filter');
        state.expanded = false;
        group.querySelectorAll('.chip').forEach(function (c) { c.setAttribute('aria-pressed', String(c === chip)); });
        apply();
      });

      if (more) {
        more.addEventListener('click', function () {
          state.expanded = !state.expanded;
          apply();
          if (!state.expanded) target.scrollIntoView({ block: 'nearest', behavior: reduceMotion ? 'auto' : 'smooth' });
        });
      }

      apply();
    });
  }

  /* ------------------------------------------------------------------------
     6. Publications: search, type filter, BibTeX toggle and copy
     ------------------------------------------------------------------------ */
  function initPublications() {
    var list = document.getElementById('pub-list');
    if (!list) return;
    var search = document.getElementById('pub-search');
    var typeGroup = document.getElementById('pub-types');
    var count = document.getElementById('pub-count');
    var empty = document.getElementById('pub-empty');
    var pubs = Array.prototype.slice.call(list.querySelectorAll('.pub'));
    var years = list.querySelectorAll('.pub-year');
    var state = { type: 'all', q: '' };

    function norm(s) { return s.toLowerCase().replace(/\s+/g, ' ').trim(); }

    function apply() {
      var q = norm(state.q);
      var shown = 0;
      pubs.forEach(function (p) {
        var cite = p.querySelector('.cite');
        var text = norm(cite ? cite.textContent : p.textContent);
        var show = (state.type === 'all' || p.getAttribute('data-type') === state.type) &&
                   (!q || text.indexOf(q) !== -1);
        p.hidden = !show;
        if (show) shown++;
      });
      years.forEach(function (y) { y.hidden = !y.querySelector('.pub:not([hidden])'); });
      if (count) {
        count.textContent = shown === pubs.length
          ? pubs.length + ' publications'
          : 'Showing ' + shown + ' of ' + pubs.length;
      }
      if (empty) empty.hidden = shown > 0;
    }

    if (search) search.addEventListener('input', function () { state.q = search.value; apply(); });

    if (typeGroup) {
      typeGroup.addEventListener('click', function (e) {
        var chip = e.target.closest('.chip');
        if (!chip) return;
        state.type = chip.getAttribute('data-type');
        typeGroup.querySelectorAll('.chip').forEach(function (c) { c.setAttribute('aria-pressed', String(c === chip)); });
        apply();
      });
    }

    list.addEventListener('click', function (e) {
      var toggle = e.target.closest('.bib-toggle');
      if (toggle) {
        var bib = toggle.closest('.pub').querySelector('.bib');
        var open = toggle.getAttribute('aria-expanded') !== 'true';
        toggle.setAttribute('aria-expanded', String(open));
        if (bib) bib.hidden = !open;
        return;
      }
      var copy = e.target.closest('.bib-copy');
      if (copy) {
        var pre = copy.parentNode.querySelector('pre');
        copyText(pre ? pre.textContent : '', function (ok) {
          var label = copy.lastChild;
          var old = label.textContent;
          label.textContent = ok ? 'Copied' : 'Press Ctrl+C';
          setTimeout(function () { label.textContent = old; }, 1600);
        });
      }
    });

    apply();
  }

  function copyText(text, done) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(fallback()); });
    } else {
      done(fallback());
    }
    function fallback() {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (err) { ok = false; }
      document.body.removeChild(ta);
      return ok;
    }
  }

  /* ------------------------------------------------------------------------
     7. Contact form: checks the fields, then opens the visitor's email app.
     To post to a form service instead, add action="..." method="POST"
     to the <form>, remove novalidate, and delete initContactForm() below.
     ------------------------------------------------------------------------ */
  function initContactForm() {
    var form = document.getElementById('contact-form');
    var status = document.getElementById('form-status');
    if (!form || !status) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var firstBad = null;

      ['name', 'email', 'org', 'message'].forEach(function (name) {
        var el = form.elements[name];
        var ok = el.value.trim() !== '' && el.checkValidity();
        el.setAttribute('aria-invalid', ok ? 'false' : 'true');
        if (!ok && !firstBad) firstBad = el;
      });

      if (firstBad) {
        status.textContent = 'Add your full name, a valid email address, your organisation or institution and a message, then send again.';
        status.classList.add('is-error');
        firstBad.focus();
        return;
      }

      var f = form.elements;
      var subject = '[FCFL website] ' + f.topic.value;
      var body = f.message.value + '\n\n' + f.name.value + '\n' + f.org.value + '\n' + f.email.value;

      window.location.href = 'mailto:' + form.getAttribute('data-mailto') +
        '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);

      status.classList.remove('is-error');
      status.textContent = 'Your email app should now open with this enquiry ready to send.';
    });
  }

  /* ------------------------------------------------------------------------
     8. Current year in the footer
     ------------------------------------------------------------------------ */
  function initYear() {
    var el = document.getElementById('year');
    if (el) el.textContent = String(new Date().getFullYear());
  }

  initHeader();
  initActiveNav();
  initDotWaves();
  initTabs();
  initChipFilters();
  initPublications();
  initContactForm();
  initYear();
})();
