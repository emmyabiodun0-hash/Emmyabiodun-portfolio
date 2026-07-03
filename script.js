/* =========================================================
   EMMY ABIODUN — PORTFOLIO SCRIPT (single page)
   Nav scrolls to sections, scrollspy highlights the active
   link, projects filter in place, skills are always shown.
   ========================================================= */
(function(){
  "use strict";

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hoverCapable = matchMedia('(hover:hover)').matches;

  /* ---------- Mobile nav ---------- */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if(navToggle && navLinks){
    navToggle.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      navToggle.classList.toggle('open', open);
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }));
  }

  /* ---------- Smooth anchor scrolling for every internal link ---------- */
  document.querySelectorAll('a[data-link]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if(!href || href.charAt(0) !== '#') return;
      const target = document.querySelector(href);
      if(!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
      history.pushState(null, '', href);
    });
  });

  /* ---------- Scroll progress bar + navbar scrollspy ---------- */
  const scrollProgress = document.getElementById('scrollProgress');
  const sections = document.querySelectorAll('section[id], header[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  function onScroll(){
    const y = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if(scrollProgress) scrollProgress.style.width = docHeight > 0 ? `${(y/docHeight)*100}%` : '0%';

    let current = 'home';
    sections.forEach(sec => {
      const rect = sec.getBoundingClientRect();
      if(rect.top <= 140 && rect.bottom >= 140) current = sec.id;
    });
    navAnchors.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Particle canvas ---------- */
  const canvas = document.getElementById('particle-canvas');
  if(canvas && !reducedMotion){
    const ctx = canvas.getContext('2d');
    let w, h, particles;
    function resize(){ w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; }
    function makeParticles(){
      const count = Math.min(70, Math.floor(w / 22));
      particles = Array.from({length: count}, () => ({
        x: Math.random()*w, y: Math.random()*h,
        r: Math.random()*1.6 + 0.4,
        vx: (Math.random()-0.5)*0.25, vy: (Math.random()-0.5)*0.25,
        a: Math.random()*0.5 + 0.15
      }));
    }
    resize(); makeParticles();
    window.addEventListener('resize', () => { resize(); makeParticles(); });
    function tick(){
      ctx.clearRect(0,0,w,h);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if(p.x < 0) p.x = w; if(p.x > w) p.x = 0;
        if(p.y < 0) p.y = h; if(p.y > h) p.y = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
        ctx.fillStyle = `rgba(124,111,255,${p.a})`; ctx.fill();
      });
      for(let i=0;i<particles.length;i++){
        for(let j=i+1;j<particles.length;j++){
          const a = particles[i], b = particles[j];
          const dx = a.x-b.x, dy = a.y-b.y;
          const dist = Math.sqrt(dx*dx+dy*dy);
          if(dist < 110){
            ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y);
            ctx.strokeStyle = `rgba(55,224,214,${0.08*(1-dist/110)})`; ctx.lineWidth = 1; ctx.stroke();
          }
        }
      }
      requestAnimationFrame(tick);
    }
    tick();
  }

  /* ---------- Floating geometric shapes ---------- */
  (function shapes(){
    if(reducedMotion) return;
    const wrap = document.createElement('div');
    wrap.setAttribute('aria-hidden','true');
    const defs = [
      {w:120,h:120,top:'8%',left:'6%',bg:'var(--violet)', rot:'12deg'},
      {w:70,h:70,top:'70%',left:'88%',bg:'var(--cyan)', rot:'-8deg'},
      {w:160,h:160,top:'40%',left:'92%',bg:'var(--amber)', rot:'30deg'},
      {w:90,h:90,top:'85%',left:'12%',bg:'var(--violet)', rot:'-20deg'}
    ];
    defs.forEach((d,i) => {
      const s = document.createElement('div');
      s.className = 'shape';
      Object.assign(s.style, {
        width:d.w+'px', height:d.h+'px', top:d.top, left:d.left,
        background:d.bg, transform:`rotate(${d.rot})`,
        animation:`float ${7+i}s ease-in-out infinite`, animationDelay:(i*0.6)+'s'
      });
      wrap.appendChild(s);
    });
    document.body.appendChild(wrap);
  })();

  /* ---------- Magnetic buttons ---------- */
  if(!reducedMotion && hoverCapable){
    document.querySelectorAll('.btn, .mini-btn').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width/2;
        const y = e.clientY - r.top - r.height/2;
        btn.style.transform = `translate(${x*0.18}px, ${y*0.35}px)`;
      });
      btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    });
  }

  /* ---------- 3D tilt on avatar / project cards ---------- */
  if(!reducedMotion && hoverCapable){
    document.querySelectorAll('[data-tilt]').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `rotateY(${px*14}deg) rotateX(${-py*14}deg)`;
      });
      card.addEventListener('mouseleave', () => { card.style.transform = 'rotateY(0) rotateX(0)'; });
    });
  }

  /* ---------- Typing effect (hero role) ---------- */
  const typeEl = document.querySelector('[data-typing]');
  if(typeEl){
    const words = JSON.parse(typeEl.getAttribute('data-typing'));
    let wi = 0, ci = 0, deleting = false;
    const speed = 55, deleteSpeed = 30, pause = 1400;
    typeEl.innerHTML = '<span></span><span class="type-cursor"></span>';
    function step(){
      const word = words[wi];
      if(!deleting){
        ci++;
        typeEl.childNodes[0].textContent = word.slice(0,ci);
        if(ci === word.length){ deleting = true; setTimeout(step, pause); return; }
      } else {
        ci--;
        typeEl.childNodes[0].textContent = word.slice(0,ci);
        if(ci === 0){ deleting = false; wi = (wi+1) % words.length; }
      }
      setTimeout(step, deleting ? deleteSpeed : speed);
    }
    step();
  }

  /* ---------- Terminal type-out ---------- */
  const termBody = document.querySelector('[data-term-lines]');
  if(termBody){
    const lines = JSON.parse(termBody.getAttribute('data-term-lines'));
    let li = 0;
    function typeLine(){
      if(li >= lines.length) return;
      const el = document.createElement('div');
      termBody.appendChild(el);
      let ci = 0;
      const raw = lines[li];
      function typeChar(){
        ci++;
        el.innerHTML = raw.slice(0,ci);
        if(ci < raw.length){ setTimeout(typeChar, 14); }
        else { li++; setTimeout(typeLine, 260); }
      }
      typeChar();
    }
    typeLine();
  }

  /* ---------- Animated counters ---------- */
  const counters = document.querySelectorAll('[data-count]');
  if(counters.length){
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-count'), 10);
          const dur = 1400;
          const start = performance.now();
          function frame(now){
            const p = Math.min((now-start)/dur, 1);
            const eased = 1 - Math.pow(1-p, 3);
            el.textContent = Math.round(eased * target);
            if(p < 1) requestAnimationFrame(frame);
            else el.textContent = target;
          }
          requestAnimationFrame(frame);
          obs.unobserve(el);
        }
      });
    }, {threshold:0.5});
    counters.forEach(c => obs.observe(c));
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if(revealEls.length){
    const obs2 = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          entry.target.classList.add('in');
          obs2.unobserve(entry.target);
        }
      });
    }, {threshold:0.15});
    revealEls.forEach((el,i) => { if(!el.style.getPropertyValue('--i')) el.style.setProperty('--i', i%8); obs2.observe(el); });
  }

  /* ---------- Skill bars fill when visible ---------- */
  const bars = document.querySelectorAll('.bar-fill');
  if(bars.length){
    const obs3 = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          const el = entry.target;
          el.style.width = el.getAttribute('data-pct') + '%';
          obs3.unobserve(el);
        }
      });
    }, {threshold:0.4});
    bars.forEach(b => obs3.observe(b));
  }

  /* ---------- Project filters (in-page, no navigation) ---------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  if(filterBtns.length){
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const f = btn.getAttribute('data-filter');
        document.querySelectorAll('.project-card').forEach(card => {
          const show = f === 'all' || card.getAttribute('data-cat') === f;
          card.classList.toggle('is-hidden', !show);
        });
      });
    });
  }

  /* ---------- Copy to clipboard ---------- */
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const text = btn.getAttribute('data-copy');
      navigator.clipboard.writeText(text).then(() => {
        btn.classList.add('copied');
        showToast('Copied: ' + text);
        setTimeout(() => btn.classList.remove('copied'), 1500);
      }).catch(() => showToast('Could not copy — long-press to copy manually'));
    });
  });

  /* ---------- Toast ---------- */
  let toastEl;
  function showToast(msg){
    if(!toastEl){
      toastEl = document.createElement('div');
      toastEl.className = 'toast';
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastEl._t);
    toastEl._t = setTimeout(() => toastEl.classList.remove('show'), 2800);
  }

  /* ---------- CV download: check the file exists before promising a download ---------- */
  const cvBtn = document.getElementById('cvBtn');
  if(cvBtn){
    cvBtn.addEventListener('click', function(e){
      // Let the browser attempt the download; if it 404s we can't intercept
      // that natively, so we proactively HEAD-check first and warn instead.
    });
    fetch(cvBtn.getAttribute('href'), { method: 'HEAD' }).then(res => {
      if(!res.ok){
        cvBtn.addEventListener('click', function(e){
          e.preventDefault();
          showToast('Add Emmy_Abiodun_CV.pdf to /assets to enable this download');
        });
      }
    }).catch(() => {
      cvBtn.addEventListener('click', function(e){
        e.preventDefault();
        showToast('Add Emmy_Abiodun_CV.pdf to /assets to enable this download');
      });
    });
  }

  /* ---------- Contact form — Formspree AJAX (endpoint: xjgqpqvw) ---------- */
  const form = document.getElementById('contact-form');
  if(form){
    const submitBtn = document.getElementById('cf-submit');
    const submitLabel = document.getElementById('cf-submit-label');
    const successBox = document.getElementById('formSuccess');
    const generalError = document.getElementById('formGeneralError');

    function clearFieldErrors(){
      form.querySelectorAll('.field-error').forEach(el => el.textContent = '');
      form.querySelectorAll('input, textarea').forEach(el => el.classList.remove('has-error'));
      generalError.hidden = true;
      generalError.textContent = '';
      generalError.classList.remove('is-error');
    }

    form.addEventListener('submit', function(e){
      e.preventDefault();
      clearFieldErrors();
      successBox.hidden = true;

      submitLabel.textContent = 'Sending...';
      submitBtn.disabled = true;

      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      })
      .then(async (res) => {
        if(res.ok){
          form.reset();
          successBox.hidden = false;
          showToast('Message sent — thank you! Emmy will reply soon.');
          return;
        }
        // Formspree returns { errors: [{ field, message, code }] } on 4xx
        const data = await res.json().catch(() => null);
        if(data && Array.isArray(data.errors) && data.errors.length){
          data.errors.forEach(err => {
            if(err.field){
              const target = form.querySelector(`[data-error-for="${err.field}"]`);
              const input = form.querySelector(`[name="${err.field}"]`);
              if(target) target.textContent = err.message;
              if(input) input.classList.add('has-error');
            } else {
              generalError.textContent = err.message || 'Something went wrong. Please try again or use WhatsApp.';
              generalError.hidden = false;
              generalError.classList.add('is-error');
            }
          });
          showToast('Please fix the highlighted fields');
        } else {
          generalError.textContent = 'Something went wrong. Please try again or reach out via WhatsApp.';
          generalError.hidden = false;
          generalError.classList.add('is-error');
          showToast('Something went wrong sending your message');
        }
      })
      .catch(() => {
        generalError.textContent = 'Network error — please try WhatsApp instead.';
        generalError.hidden = false;
        generalError.classList.add('is-error');
        showToast('Network error — please try WhatsApp instead.');
      })
      .finally(() => {
        submitLabel.textContent = 'Send Message';
        submitBtn.disabled = false;
      });
    });
  }

  /* ---------- GitHub live stats ---------- */
  const ghUser = 'emmyabiodun0-hash';
  const ghReposEl = document.getElementById('gh-repo-count');
  const ghFollowersEl = document.getElementById('gh-followers');
  const ghGistsEl = document.getElementById('gh-public-gists');
  const ghListEl = document.getElementById('gh-repo-list');

  fetch(`https://api.github.com/users/${ghUser}`)
    .then(r => r.ok ? r.json() : Promise.reject())
    .then(data => {
      if(ghReposEl) ghReposEl.textContent = data.public_repos ?? '—';
      if(ghFollowersEl) ghFollowersEl.textContent = data.followers ?? '—';
      if(ghGistsEl) ghGistsEl.textContent = data.public_gists ?? '—';
    })
    .catch(() => {
      if(ghReposEl) ghReposEl.textContent = '—';
      if(ghFollowersEl) ghFollowersEl.textContent = '—';
      if(ghGistsEl) ghGistsEl.textContent = '—';
    });

  if(ghListEl){
    fetch(`https://api.github.com/users/${ghUser}/repos?sort=updated&per_page=5`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(repos => {
        ghListEl.innerHTML = '';
        if(!Array.isArray(repos) || !repos.length){
          ghListEl.innerHTML = '<div class="gh-repo">No public repositories yet</div>';
          return;
        }
        repos.forEach(repo => {
          const row = document.createElement('div');
          row.className = 'gh-repo';
          row.innerHTML = `<a href="${repo.html_url}" target="_blank" rel="noopener"><span class="lang-dot"></span>${repo.name}</a><span>${repo.language || '—'}</span>`;
          ghListEl.appendChild(row);
        });
      })
      .catch(() => { ghListEl.innerHTML = '<div class="gh-repo">Could not load repositories right now — check the GitHub profile link above</div>'; });
  }

  /* ---------- Smooth page fade-in ---------- */
  document.documentElement.style.opacity = '0';
  document.documentElement.style.transition = 'opacity .5s ease';
  window.addEventListener('load', () => {
    requestAnimationFrame(() => { document.documentElement.style.opacity = '1'; });
  });
  setTimeout(() => { document.documentElement.style.opacity = '1'; }, 1200);

})();