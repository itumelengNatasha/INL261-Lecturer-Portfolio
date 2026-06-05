/* ============================================================
   LECTURER PORTFOLIO — main.js
   Belgium Campus iTversity · Innovation & Leadership Project
   ============================================================ */

/* ── Custom Cursor ── */
(function initCursor() {
  const cursor     = document.getElementById('cursor');
  const cursorRing = document.getElementById('cursor-ring');
  if (!cursor || !cursorRing) return;

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;
  let raf;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX - 6  + 'px';
    cursor.style.top  = mouseY - 6  + 'px';
  });

  // Smooth-follow the ring
  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    cursorRing.style.left = ringX - 18 + 'px';
    cursorRing.style.top  = ringY - 18 + 'px';
    raf = requestAnimationFrame(animateRing);
  }
  animateRing();

  // Scale up on interactive elements
  const interactives = 'a, button, .module-card, .quote-card, .stat, .fun-fact, .contact-link';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(interactives)) {
      cursor.style.transform     = 'scale(2.5)';
      cursorRing.style.transform = 'translate(-50%,-50%) scale(1.6)';
      cursorRing.style.borderColor = 'var(--accent)';
    }
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(interactives)) {
      cursor.style.transform     = 'scale(1)';
      cursorRing.style.transform = 'translate(-50%,-50%) scale(1)';
      cursorRing.style.borderColor = 'var(--accent)';
    }
  });

  // Hide when leaving window
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity     = '0';
    cursorRing.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity     = '1';
    cursorRing.style.opacity = '1';
  });
})();




/* ── Mobile Hamburger ── */
(function initNav() {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.querySelector('.nav-links');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', open);
    // Animate spans into X
    const spans = hamburger.querySelectorAll('span');
    if (open) {
      spans[0].style.transform = 'translateY(7px) rotate(45deg)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity   = '';
      spans[2].style.transform = '';
    }
  });
  
  // Close menu on link click (mobile)
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', false);
      const spans = hamburger.querySelectorAll('span');
      spans[0].style.transform = '';
      spans[1].style.opacity   = '';
      spans[2].style.transform = '';
    });
  });
})();


/* ── Nav: shrink/highlight on scroll ── */
(function initNavScroll() {
  const nav = document.querySelector('nav');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      nav.style.padding    = '0.75rem 3rem';
      nav.style.boxShadow  = '0 4px 32px rgba(0,0,0,0.4)';
    } else {
      nav.style.padding    = '';
      nav.style.boxShadow  = '';
    }
  }, { passive: true });

  // Highlight active section link
  const sections  = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');

  function onScroll() {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    navAnchors.forEach(a => {
      a.style.color = a.getAttribute('href') === '#' + current
        ? 'var(--accent)'
        : '';
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
})();


/* ── Scroll Reveal ── */
(function initReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  reveals.forEach(el => io.observe(el));
})();


/* ── Skill Bars ── */
(function initSkillBars() {
  const fills = document.querySelectorAll('.skill-fill');
  if (!fills.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el    = entry.target;
        const delay = parseFloat(el.dataset.delay || 0);
        setTimeout(() => el.classList.add('animated'), delay * 1000);
        io.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  fills.forEach(el => io.observe(el));
})();


/* ── Animated Stat Numbers ── */
(function initCountUp() {
  const stats = document.querySelectorAll('.stat-num');
  if (!stats.length) return;

  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

  function countUp(el, target, suffix, duration) {
    const start  = performance.now();
    const isFloat = target % 1 !== 0;

    function frame(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value    = easeOut(progress) * target;
      el.textContent = (isFloat ? value.toFixed(1) : Math.floor(value)) + suffix;
      if (progress < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el   = entry.target;
      const raw  = el.textContent.trim();         
      const suffix = raw.replace(/[\d.]/g, '');   
      const num    = parseFloat(raw);
      countUp(el, num, suffix, 1600);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });

  stats.forEach(el => io.observe(el));
})();


/* ── Module Cards: stagger entrance ── */
(function initModuleStagger() {
  const cards = document.querySelectorAll('.module-card');
  if (!cards.length) return;

  // Set initial hidden state
  cards.forEach(c => {
    c.style.opacity   = '0';
    c.style.transform = 'translateY(20px)';
    c.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  });

  const io = new IntersectionObserver((entries) => {
    if (!entries.some(e => e.isIntersecting)) return;
    cards.forEach((card, i) => {
      setTimeout(() => {
        card.style.opacity   = '1';
        card.style.transform = 'translateY(0)';
      }, i * 90);
    });
    io.disconnect();
  }, { threshold: 0.15 });

  // Observe the grid container
  const grid = document.querySelector('.modules-grid');
  if (grid) io.observe(grid);
})();


/* ── Smooth Parallax on Hero Shapes ── */
(function initParallax() {
  const shapes = document.querySelectorAll('.hero .shape');
  if (!shapes.length) return;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    shapes.forEach((s, i) => {
      const factor = (i + 1) * 0.08;
      s.style.transform = `translateY(${y * factor}px)`;
    });
  }, { passive: true });
})();


/* ── Typing effect for hero subtitle ── */
(function initTyping() {
  const el = document.querySelector('.hero-title');
  if (!el) return;

  const texts = [
    '// BSc. Software Engineering · AI & Dev Educator',
    '// Full-Stack Developer turned Educator',
    '// Making code make sense since 2016',
    '// Belgium Campus · Pretoria',
  ];

  let tIdx = 0, cIdx = 0, deleting = false;
  const SPEED_TYPE = 45, SPEED_DEL = 22, PAUSE = 2200;

  function tick() {
    const current = texts[tIdx];
    if (!deleting) {
      el.textContent = current.slice(0, ++cIdx);
      if (cIdx === current.length) {
        deleting = true;
        setTimeout(tick, PAUSE);
        return;
      }
    } else {
      el.textContent = current.slice(0, --cIdx);
      if (cIdx === 0) {
        deleting = false;
        tIdx = (tIdx + 1) % texts.length;
      }
    }
    setTimeout(tick, deleting ? SPEED_DEL : SPEED_TYPE);
  }

  // Start after initial CSS animation settles
  setTimeout(tick, 1200);
})();


/* ── Quote cards: subtle tilt on mouse-move ── */
(function initTilt() {
  const cards = document.querySelectorAll('.quote-card, .module-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) / (rect.width  / 2);
      const dy     = (e.clientY - cy) / (rect.height / 2);
      card.style.transform = `perspective(600px) rotateY(${dx * 5}deg) rotateX(${-dy * 5}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();


/* ── Fun facts: reveal on scroll with slide-in ── */
(function initFunFacts() {
  const facts = document.querySelectorAll('.fun-fact');
  if (!facts.length) return;

  facts.forEach((f, i) => {
    f.style.opacity   = '0';
    f.style.transform = 'translateX(-20px)';
    f.style.transition = `opacity 0.45s ${i * 0.08}s ease, transform 0.45s ${i * 0.08}s ease`;
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        facts.forEach(f => {
          f.style.opacity   = '1';
          f.style.transform = 'translateX(0)';
        });
        io.disconnect();
      }
    });
  }, { threshold: 0.2 });

  const container = document.querySelector('.fun-facts');
  if (container) io.observe(container);
})();


/* ── Timeline: fade-in items sequentially ── */
(function initTimeline() {
  const items = document.querySelectorAll('.tl-item');
  if (!items.length) return;

  items.forEach((el, i) => {
    el.style.opacity   = '0';
    el.style.transform = 'translateX(-16px)';
    el.style.transition = `opacity 0.5s ${i * 0.15}s ease, transform 0.5s ${i * 0.15}s ease`;
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        items.forEach(el => {
          el.style.opacity   = '1';
          el.style.transform = 'translateX(0)';
        });
        io.disconnect();
      }
    });
  }, { threshold: 0.15 });

  const tl = document.querySelector('.timeline');
  if (tl) io.observe(tl);
})();


/* ── Easter egg: Konami code ── */
(function initKonami() {
  const seq = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let idx = 0;

  document.addEventListener('keydown', (e) => {
    if (e.key === seq[idx]) {
      idx++;
      if (idx === seq.length) {
        idx = 0;
        showEasterEgg();
      }
    } else {
      idx = 0;
    }
  });

  function showEasterEgg() {
    const toast = document.createElement('div');
    toast.textContent = '🎉 Achievement Unlocked: You know the Konami Code. Neo approves.';
    Object.assign(toast.style, {
      position:     'fixed',
      bottom:       '2rem',
      left:         '50%',
      transform:    'translateX(-50%) translateY(20px)',
      background:   'var(--accent)',
      color:        '#0a0a12',
      padding:      '1rem 2rem',
      borderRadius: '4px',
      fontFamily:   "'DM Mono', -apple-system",
      fontSize:     '0.8rem',
      fontWeight:   '700',
      zIndex:       '9999',
      opacity:      '0',
      transition:   'opacity 0.4s, transform 0.4s',
      maxWidth:     '90vw',
      textAlign:    'center',
    });
    document.body.appendChild(toast);
    requestAnimationFrame(() => {
      toast.style.opacity   = '1';
      toast.style.transform = 'translateX(-50%) translateY(0)';
    });
    setTimeout(() => {
      toast.style.opacity   = '0';
      toast.style.transform = 'translateX(-50%) translateY(20px)';
      setTimeout(() => toast.remove(), 500);
    }, 4000);
  }
  // Happy bubble effect on module cards
document.querySelectorAll('.module-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r  = card.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width  / 2)) / (r.width  / 2);
    const dy = (e.clientY - (r.top  + r.height / 2)) / (r.height / 2);
    card.style.transition = 'transform 0.15s cubic-bezier(.34,1.8,.64,1)';
    card.style.transform  = `perspective(600px) rotateX(${-dy*10}deg) rotateY(${dx*10}deg) scale(1.07)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg) scale(1)';
  });

  card.addEventListener('mousedown', () => {
    card.style.transition = 'transform 0.08s ease';
    card.style.transform  = 'perspective(600px) scale(0.95)';
  });

  card.addEventListener('mouseup', () => {
    card.style.transition = 'transform 0.4s cubic-bezier(.34,1.9,.64,1)';
    card.style.transform  = 'perspective(600px) scale(1.07)';
  });
});
// Timeline dots light up one by one on scroll
(function initTimelineDots() {
  const items = document.querySelectorAll('.tl-item');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // find this item's index among all tl-items
        const index = Array.from(items).indexOf(entry.target);

        setTimeout(() => {
          entry.target.classList.add('dot-lit');
        }, index * 300); // each dot lights up 300ms after the previous

        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  items.forEach(item => observer.observe(item));
})();

// Typewriter effect for philosophy quote cards
(function initTypewriter() {
  const quotes = document.querySelectorAll('.q-text');

  // Save original text and clear it
  quotes.forEach(q => {
    q.dataset.full = q.textContent.trim();
    q.textContent  = '';
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el      = entry.target;
        const text    = el.dataset.full;
        let   i       = 0;

        const type = setInterval(() => {
          el.textContent = text.slice(0, i);
          i++;
          if (i > text.length) clearInterval(type);
        }, 28); // speed — lower = faster

        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  quotes.forEach(q => observer.observe(q));
})();

  document.getElementById('say-hello-btn').addEventListener('click', function() {
  var arm = document.getElementById('right-arm');
  arm.classList.remove('waving');
  void arm.offsetWidth;
  arm.classList.add('waving');
  setTimeout(function() { arm.classList.remove('waving'); }, 1150);
});
})();
;