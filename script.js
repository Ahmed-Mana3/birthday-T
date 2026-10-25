/* ==========================================================
   Ebtehal · Twenty — a curious little universe
   ========================================================== */
(() => {
  'use strict';

  /* ---------------- CONFIG — personalise freely ---------------- */
  const CONFIG = {
    firstName: 'Ebtehal',
    birth: new Date(2006, 9, 25, 0, 0, 0), // months are 0-based → 9 = October
    birthNight: new Date(2006, 9, 25, 21, 0, 0), // used for the moon phase

    acrostic: [
      ['E', 'Enchanting'],
      ['b', 'Brilliant'],
      ['t', 'Thoughtful'],
      ['e', 'Effortless'],
      ['h', 'Heartfelt'],
      ['a', 'Adventurous'],
      ['l', 'Luminous'],
    ],

    curiosities: [
      'You make ordinary days feel like plot twists.',
      'May your coffee always be the perfect temperature.',
      'Your laugh is a public service. Never stop.',
      'Twenty isn’t old — it’s vintage with brand-new firmware.',
      'May every door you knock on open twice.',
      'Somewhere, a star is quietly jealous of you.',
      'Proof that kindness is a superpower.',
      'May you find magic in the margins of every day.',
      'Your curiosity is a compass. Follow it everywhere.',
      'Courage for the big leaps, patience for the small steps.',
      'May your playlists always know exactly how you feel.',
      'You are someone’s favourite notification.',
      'May this year surprise you — only in the good ways.',
      'Your dreams aren’t too big. The world is catching up.',
      'Be as proud of yourself as we are of you.',
      'Scorpio energy: mysterious, loyal, unstoppable.',
      'Here’s to late-night talks and early-morning wins.',
      'Collect moments, not things.',
      'Never dim your light to fit a room. Find a bigger room.',
      'The best chapters are still unwritten. Go write them.',
    ],

    letter:
`Dear Ebtehal,

Twenty years ago, on a quiet Wednesday in late October, the world got a little brighter — and it hasn't been the same since.

Your name means a heartfelt prayer. I think whoever chose it knew something: you'd grow into the kind of person people feel grateful for.

So here's to twenty — to the girl you were, the woman you're becoming, and every curious adventure still waiting for you.

Stay brave. Stay kind. Stay curious.
Happy birthday. ✦`,
  };

  /* ---------------- utilities ---------------- */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const rand = (a, b) => a + Math.random() * (b - a);
  const pick = (arr) => arr[(Math.random() * arr.length) | 0];
  const pad = (n, l = 2) => String(n).padStart(l, '0');
  const fmt = (n) => Math.floor(n).toLocaleString('en-US');
  const debounce = (fn, ms) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(pointer: fine)').matches;
  const PALETTE = ['#f5c56b', '#ffdf9e', '#ff7aa2', '#b9a6ff', '#f6efe4', '#7fe0d0'];

  function fitCanvas(canvas, w, h) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return ctx;
  }

  function drawSparkle(ctx, x, y, r, rot) {
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const a = rot + (i * Math.PI) / 4;
      const rr = i % 2 === 0 ? r : r * 0.32;
      ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
    }
    ctx.closePath();
    ctx.fill();
  }

  /* ==========================================================
     TOAST
     ========================================================== */
  const Toast = (() => {
    const el = $('#toast');
    const queue = [];
    let busy = false;
    function next() {
      const item = queue.shift();
      if (!item) { busy = false; return; }
      busy = true;
      el.innerHTML = item.msg;
      el.classList.add('show');
      setTimeout(() => {
        el.classList.remove('show');
        setTimeout(next, 550);
      }, item.ms);
    }
    return {
      show(msg, ms = 4400) {
        queue.push({ msg, ms });
        if (!busy) next();
      },
    };
  })();

  /* ==========================================================
     STARRY SKY (background)
     ========================================================== */
  const Sky = (() => {
    const canvas = $('#sky');
    let ctx, w = 0, h = 0, stars = [];
    const meteors = [];

    function resize() {
      const widthChanged = innerWidth !== w;
      w = innerWidth;
      h = innerHeight;
      ctx = fitCanvas(canvas, w, h);
      if (widthChanged || !stars.length) {
        const n = Math.min(420, Math.round((w * h) / 4800));
        stars = Array.from({ length: n }, () => ({
          x: Math.random() * w,
          y: Math.random() * h,
          r: rand(0.2, 1.4),
          p: rand(0, Math.PI * 2),
          s: rand(0.004, 0.02),
          z: rand(0.04, 0.3),
          gold: Math.random() < 0.12,
        }));
      }
    }

    function meteor() {
      const dir = Math.random() < 0.5 ? 1 : -1;
      meteors.push({
        x: rand(w * 0.1, w * 0.9),
        y: rand(-20, h * 0.35),
        vx: dir * rand(7, 11),
        vy: rand(3, 5),
        life: 1,
        len: rand(90, 170),
      });
    }

    function frame() {
      ctx.clearRect(0, 0, w, h);
      const sy = window.scrollY;
      for (const s of stars) {
        if (!reduceMotion) s.p += s.s;
        let y = (s.y - sy * s.z) % h;
        if (y < 0) y += h;
        ctx.globalAlpha = 0.25 + 0.75 * Math.abs(Math.sin(s.p));
        ctx.fillStyle = s.gold ? '#ffd98a' : '#ffffff';
        ctx.beginPath();
        ctx.arc(s.x, y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!reduceMotion && Math.random() < 0.003) meteor();

      ctx.globalAlpha = 1;
      ctx.lineWidth = 1.6;
      ctx.lineCap = 'round';
      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        m.x += m.vx;
        m.y += m.vy;
        m.life -= 0.011;
        const sp = Math.hypot(m.vx, m.vy);
        const tx = m.x - (m.vx / sp) * m.len;
        const ty = m.y - (m.vy / sp) * m.len;
        const g = ctx.createLinearGradient(m.x, m.y, tx, ty);
        g.addColorStop(0, `rgba(255,240,210,${Math.max(0, m.life)})`);
        g.addColorStop(1, 'rgba(255,240,210,0)');
        ctx.strokeStyle = g;
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(tx, ty);
        ctx.stroke();
        if (m.life <= 0 || m.y > h + 200) meteors.splice(i, 1);
      }
      requestAnimationFrame(frame);
    }

    resize();
    addEventListener('resize', debounce(resize, 150));
    requestAnimationFrame(frame);

    return {
      shower(n = 26) {
        for (let i = 0; i < n; i++) setTimeout(meteor, i * rand(70, 150));
      },
    };
  })();

  /* ==========================================================
     FX LAYER — confetti, fireworks, sparkles
     ========================================================== */
  const FX = (() => {
    const canvas = $('#fx');
    let ctx, w, h, running = false;
    const parts = [];

    function resize() { w = innerWidth; h = innerHeight; ctx = fitCanvas(canvas, w, h); }
    resize();
    addEventListener('resize', debounce(resize, 150));

    function start() {
      if (!running) { running = true; requestAnimationFrame(loop); }
    }

    function burst(x, y) {
      const color = pick(PALETTE);
      const n = reduceMotion ? 24 : 80;
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2 + rand(-0.05, 0.05);
        const sp = rand(1.5, 6.5);
        parts.push({
          type: 'dot', x, y,
          vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
          g: 0.06, drag: 0.975, life: 1, decay: rand(0.009, 0.017),
          size: rand(1.2, 2.5), color: Math.random() < 0.2 ? '#ffffff' : color, rot: 0, vr: 0,
        });
      }
      start();
    }

    function loop() {
      ctx.clearRect(0, 0, w, h);
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];
        p.vx *= p.drag;
        p.vy = p.vy * p.drag + p.g;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        p.life -= p.decay;

        if (p.type === 'rocket') {
          if (p.vy > -1.2) { burst(p.x, p.y); parts.splice(i, 1); continue; }
          if (Math.random() < 0.6) {
            parts.push({ type: 'dot', x: p.x, y: p.y, vx: rand(-0.4, 0.4), vy: rand(0, 1), g: 0.02, drag: 0.95, life: 0.7, decay: 0.03, size: 1.3, color: '#ffdf9e', rot: 0, vr: 0 });
          }
        }
        if (p.life <= 0 || p.y > h + 40) { parts.splice(i, 1); continue; }

        ctx.globalAlpha = Math.min(1, p.life * 1.6);
        ctx.fillStyle = p.color;
        if (p.type === 'confetti') {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          ctx.scale(1, Math.cos(p.rot * 2.3));
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
          ctx.restore();
        } else if (p.type === 'star') {
          drawSparkle(ctx, p.x, p.y, p.size * p.life, p.rot);
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
      if (parts.length) requestAnimationFrame(loop);
      else { running = false; ctx.clearRect(0, 0, w, h); }
    }

    return {
      confetti(n = 160, x = w / 2, y = h * 0.4) {
        if (reduceMotion) n = Math.min(n, 30);
        for (let i = 0; i < n; i++) {
          parts.push({
            type: 'confetti', x, y,
            vx: rand(-10, 10), vy: rand(-15, -4),
            g: 0.28, drag: 0.982, life: 1, decay: rand(0.004, 0.008),
            size: rand(7, 13), rot: rand(0, 6.28), vr: rand(-0.25, 0.25), color: pick(PALETTE),
          });
        }
        start();
      },
      rain(n = 140) {
        if (reduceMotion) n = Math.min(n, 30);
        for (let i = 0; i < n; i++) {
          parts.push({
            type: 'confetti', x: rand(0, w), y: rand(-h * 0.4, -10),
            vx: rand(-1.5, 1.5), vy: rand(1, 4),
            g: 0.05, drag: 0.995, life: 1, decay: rand(0.003, 0.006),
            size: rand(7, 12), rot: rand(0, 6.28), vr: rand(-0.2, 0.2), color: pick(PALETTE),
          });
        }
        start();
      },
      fireworks(count = 6) {
        for (let i = 0; i < count; i++) {
          setTimeout(() => {
            parts.push({
              type: 'rocket', x: rand(w * 0.15, w * 0.85), y: h + 10,
              vx: rand(-1, 1), vy: -rand(h / 70, h / 55), g: 0.16, drag: 0.995,
              life: 2, decay: 0, size: 2, color: '#fff3d6', rot: 0, vr: 0,
            });
            start();
          }, i * rand(220, 420));
        }
      },
      sparkle(x, y) {
        parts.push({
          type: 'star', x, y,
          vx: rand(-0.6, 0.6), vy: rand(-0.6, 0.4),
          g: 0.02, drag: 0.98, life: 1, decay: rand(0.025, 0.04),
          size: rand(3, 6), rot: rand(0, 6.28), vr: rand(-0.1, 0.1), color: pick(PALETTE),
        });
        start();
      },
    };
  })();

  /* ==========================================================
     SECRETS
     ========================================================== */
  const Secrets = (() => {
    const found = new Set();
    const TOTAL = 3;
    const btn = $('#secretsBtn');
    const count = $('#secretCount');

    btn.addEventListener('click', () => {
      Toast.show(
        '<b>Hints, for the curious:</b><br>① Her name has 7 letters — type it (or tap it 7 times)<br>② The moon likes attention<br>③ Leave no drawer unopened',
        7000,
      );
    });

    return {
      find(id, msg) {
        if (found.has(id)) return;
        found.add(id);
        count.textContent = found.size;
        btn.classList.remove('pulse');
        void btn.offsetWidth;
        btn.classList.add('pulse');
        Toast.show(`<b>Secret ${found.size}/${TOTAL} found.</b><br>${msg}`);
        if (found.size === TOTAL) {
          setTimeout(() => {
            Toast.show('<b>All 3 secrets found.</b><br>Curiosity looks good on you, Ebtehal. ✦', 6000);
            FX.fireworks(9);
          }, 4800);
        }
      },
    };
  })();

  /* ==========================================================
     MUSIC — a tiny music-box "Happy Birthday" (Web Audio)
     ========================================================== */
  const Music = (() => {
    const btn = $('#musicBtn');
    const F = { G4: 392, A4: 440, B4: 493.88, C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99 };
    const SONG = ('G4 .75,G4 .25,A4 1,G4 1,C5 1,B4 2,' +
                  'G4 .75,G4 .25,A4 1,G4 1,D5 1,C5 2,' +
                  'G4 .75,G4 .25,G5 1,E5 1,C5 1,B4 1,A4 2,' +
                  'F5 .75,F5 .25,E5 1,C5 1,D5 1,C5 2')
      .split(',').map((s) => { const [n, b] = s.split(' '); return [F[n], +b]; });
    const BEAT = 0.46;
    let ac = null, master = null, playing = false, timer = null;

    function ensure() {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return false;
      if (!ac) {
        ac = new AC();
        master = ac.createGain();
        master.gain.value = 0.0001;
        master.connect(ac.destination);
      }
      if (ac.state === 'suspended') ac.resume();
      return true;
    }

    function bell(freq, t, dur) {
      [[1, 'triangle', 0.16], [2, 'sine', 0.05], [3, 'sine', 0.018]].forEach(([mult, type, vol]) => {
        const o = ac.createOscillator();
        const g = ac.createGain();
        o.type = type;
        o.frequency.value = freq * mult;
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(vol, t + 0.015);
        g.gain.exponentialRampToValueAtTime(0.0001, t + dur + 0.9);
        o.connect(g);
        g.connect(master);
        o.start(t);
        o.stop(t + dur + 1);
      });
    }

    function schedule() {
      let t = ac.currentTime + 0.15;
      for (const [f, b] of SONG) { bell(f, t, b * BEAT); t += b * BEAT; }
      timer = setTimeout(() => { if (playing) schedule(); }, (t - ac.currentTime + 2.4) * 1000);
    }

    function render() {
      btn.classList.toggle('on', playing);
      btn.setAttribute('aria-pressed', String(playing));
      $('.txt', btn).textContent = playing ? 'Music on' : 'Music off';
    }

    function play() {
      if (playing || !ensure()) return;
      playing = true;
      master.gain.cancelScheduledValues(ac.currentTime);
      master.gain.setTargetAtTime(0.9, ac.currentTime, 0.3);
      schedule();
      render();
    }

    function stop() {
      if (!playing) return;
      playing = false;
      clearTimeout(timer);
      const old = ac;
      master.gain.setTargetAtTime(0.0001, old.currentTime, 0.12);
      ac = null;
      master = null;
      setTimeout(() => old.close(), 600);
      render();
    }

    btn.addEventListener('click', () => (playing ? stop() : play()));
    return { prime: ensure, play };
  })();

  /* ==========================================================
     CURSOR GLOW + SPARKLE TRAIL
     ========================================================== */
  if (finePointer && !reduceMotion) {
    const ring = $('.cursor');
    let tx = -100, ty = -100, x = -100, y = -100, last = 0;
    document.body.classList.add('has-cursor');
    addEventListener('pointermove', (e) => {
      tx = e.clientX;
      ty = e.clientY;
      const now = performance.now();
      if (now - last > 45) { last = now; FX.sparkle(tx, ty); }
    });
    document.addEventListener('pointerover', (e) => {
      ring.classList.toggle('hover', !!e.target.closest('button, a, .drawer, #twenty'));
    });
    (function follow() {
      x += (tx - x) * 0.2;
      y += (ty - y) * 0.2;
      ring.style.transform = `translate(${x}px, ${y}px)`;
      requestAnimationFrame(follow);
    })();
  }

  /* ==========================================================
     HERO — the "20" made of stars
     ========================================================== */
  const Twenty = (() => {
    const canvas = $('#twenty');
    const COLORS = ['#f5c56b', '#f5c56b', '#ffdf9e', '#ffffff', '#ff7aa2', '#b9a6ff'];
    let ctx, w = 0, h = 0, parts = [], visible = true;
    const mouse = { x: -1e4, y: -1e4 };

    function build() {
      const r = canvas.getBoundingClientRect();
      if (!r.width || !r.height) return;
      w = r.width;
      h = r.height;
      ctx = fitCanvas(canvas, w, h);

      const off = document.createElement('canvas');
      off.width = Math.ceil(w);
      off.height = Math.ceil(h);
      const o = off.getContext('2d');
      const fs = Math.min(h * 1.05, w * 0.6);
      o.font = `600 ${fs}px Fraunces, Georgia, serif`;
      o.textAlign = 'center';
      o.textBaseline = 'alphabetic';
      const m = o.measureText('20');
      const asc = m.actualBoundingBoxAscent || fs * 0.7;
      const desc = m.actualBoundingBoxDescent || 0;
      o.fillStyle = '#fff';
      o.fillText('20', w / 2, h / 2 + (asc - desc) / 2);

      const data = o.getImageData(0, 0, off.width, off.height).data;
      const gap = w < 560 ? 4 : 6;
      const pts = [];
      for (let y = 0; y < off.height; y += gap) {
        for (let x = 0; x < off.width; x += gap) {
          if (data[(y * off.width + x) * 4 + 3] > 140) pts.push([x, y]);
        }
      }
      const old = parts;
      parts = pts.map(([x, y], i) => ({
        hx: x + rand(-0.8, 0.8),
        hy: y + rand(-0.8, 0.8),
        x: old[i] ? old[i].x : rand(0, w),
        y: old[i] ? old[i].y : rand(0, h),
        vx: 0,
        vy: 0,
        r: rand(0.7, 1.9) * (gap / 6 + 0.25),
        c: pick(COLORS),
        tw: rand(0, 6.28),
      }));
    }

    function frame() {
      if (visible && ctx) {
        ctx.clearRect(0, 0, w, h);
        const R = 90;
        for (const p of parts) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < R * R) {
            const d = Math.sqrt(d2) || 1;
            const f = ((R - d) / R) * 6;
            p.vx += (dx / d) * f;
            p.vy += (dy / d) * f;
          }
          p.vx = (p.vx + (p.hx - p.x) * 0.045) * 0.86;
          p.vy = (p.vy + (p.hy - p.y) * 0.045) * 0.86;
          p.x += p.vx;
          p.y += p.vy;
          if (!reduceMotion) p.tw += 0.05;
          ctx.globalAlpha = 0.55 + 0.45 * Math.sin(p.tw);
          ctx.fillStyle = p.c;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      requestAnimationFrame(frame);
    }

    function explode(cx, cy, power = 22) {
      for (const p of parts) {
        const dx = p.x - cx;
        const dy = p.y - cy;
        const d = Math.hypot(dx, dy) || 1;
        const f = power * rand(0.4, 1.2);
        p.vx += (dx / d) * f;
        p.vy += (dy / d) * f;
      }
    }

    addEventListener('pointermove', (e) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    });
    addEventListener('pointerup', (e) => { if (e.pointerType !== 'mouse') mouse.x = mouse.y = -1e4; });
    document.addEventListener('pointerleave', () => { mouse.x = mouse.y = -1e4; });
    canvas.addEventListener('click', (e) => {
      const r = canvas.getBoundingClientRect();
      explode(e.clientX - r.left, e.clientY - r.top);
    });

    new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }).observe(canvas);
    addEventListener('resize', debounce(() => {
      if (Math.abs(canvas.getBoundingClientRect().width - w) > 1) build();
    }, 200));

    const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
    fontsReady.then(build);
    requestAnimationFrame(frame);

    return {
      scatter() {
        if (!parts.length) build();
        for (const p of parts) {
          p.x = w / 2 + rand(-w, w) * 0.7;
          p.y = h / 2 + rand(-h, h) * 1.2;
        }
      },
      explode: () => explode(w / 2, h / 2, 30),
    };
  })();

  /* ==========================================================
     GATE — press & hold the wax seal
     ========================================================== */
  (() => {
    const gate = $('#gate');
    const seal = $('#seal');
    const ring = $('#sealRing');
    const C = 2 * Math.PI * 54;
    const HOLD_MS = 1400;
    let p = 0, holding = false, raf = null, last = null, done = false;

    ring.style.strokeDasharray = C;
    ring.style.strokeDashoffset = C;

    function loop(now) {
      const dt = last == null ? 0 : now - last;
      last = now;
      p += holding ? dt / HOLD_MS : -dt / (HOLD_MS * 0.5);
      p = Math.max(0, Math.min(1, p));
      ring.style.strokeDashoffset = C * (1 - p);
      seal.style.setProperty('--p', p);
      if (holding && Math.random() < p * 0.5) {
        const r = seal.getBoundingClientRect();
        FX.sparkle(r.left + r.width / 2 + rand(-50, 50), r.top + r.height / 2 + rand(-50, 50));
      }
      if (p >= 1) { open(); return; }
      if (holding || p > 0) raf = requestAnimationFrame(loop);
      else { raf = null; last = null; }
    }

    function down(e) {
      if (done) return;
      e.preventDefault();
      holding = true;
      Music.prime();
      if (!raf) { last = null; raf = requestAnimationFrame(loop); }
    }
    function up() { holding = false; }

    function open() {
      done = true;
      raf = null;
      gate.classList.add('opening');
      if (navigator.vibrate) navigator.vibrate(40);
      Twenty.scatter();
      setTimeout(() => {
        document.body.classList.remove('locked');
        document.body.classList.add('opened');
        $('#site').removeAttribute('aria-hidden');
        FX.confetti(200, innerWidth / 2, innerHeight * 0.45);
        Music.play();
      }, 650);
      setTimeout(() => gate.remove(), 2000);
    }

    seal.addEventListener('pointerdown', down);
    addEventListener('pointerup', up);
    addEventListener('pointercancel', up);
    seal.addEventListener('contextmenu', (e) => e.preventDefault());
    seal.addEventListener('keydown', (e) => {
      if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) down(e);
    });
    seal.addEventListener('keyup', (e) => {
      if (e.key === ' ' || e.key === 'Enter') up();
    });
  })();

  /* ==========================================================
     SPLIT TEXT (hero name) + name secret
     ========================================================== */
  $$('.split').forEach((el) => {
    const offset = +el.dataset.offset || 0;
    const text = el.textContent.trim();
    el.textContent = '';
    [...text].forEach((ch, i) => {
      const s = document.createElement('span');
      s.className = 'ch';
      s.setAttribute('aria-hidden', 'true');
      s.style.setProperty('--i', offset + i);
      s.textContent = ch;
      el.appendChild(s);
    });
  });

  function nameSecret() {
    Sky.shower(30);
    FX.rain(150);
    Secrets.find('name', 'You spoke the magic word — a meteor shower, just for you.');
  }

  (() => {
    let buffer = '';
    const target = CONFIG.firstName.toLowerCase();
    addEventListener('keydown', (e) => {
      if (e.key.length !== 1 || e.ctrlKey || e.metaKey || e.altKey) return;
      buffer = (buffer + e.key.toLowerCase()).slice(-target.length);
      if (buffer === target) { buffer = ''; nameSecret(); }
    });

    let taps = 0, tapTimer;
    $('#heroName').addEventListener('click', (e) => {
      taps++;
      FX.sparkle(e.clientX, e.clientY);
      clearTimeout(tapTimer);
      tapTimer = setTimeout(() => { taps = 0; }, 2500);
      if (taps >= target.length) { taps = 0; nameSecret(); }
    });
  })();

  /* ==========================================================
     I · ACROSTIC
     ========================================================== */
  (() => {
    const wrap = $('#acrostic');
    CONFIG.acrostic.forEach(([letter, word], i) => {
      const b = document.createElement('button');
      b.className = 'ac';
      b.type = 'button';
      b.style.setProperty('--i', i);
      b.setAttribute('aria-label', `${letter.toUpperCase()} is for ${word}`);
      b.innerHTML = `<span class="ac-l">${letter}</span><span class="ac-w">${word}</span>`;
      b.addEventListener('click', () => b.classList.toggle('on'));
      wrap.appendChild(b);
    });
  })();

  /* ==========================================================
     II · ODOMETER
     ========================================================== */
  (() => {
    const birth = CONFIG.birth;
    const SYNODIC = 29.530588853;

    function birthdayIn(year) {
      const d = new Date(birth);
      d.setFullYear(year);
      return d;
    }
    function laps(now) {
      let years = now.getFullYear() - birth.getFullYear();
      let last = birthdayIn(birth.getFullYear() + years);
      if (last > now) { years--; last = birthdayIn(birth.getFullYear() + years); }
      const next = birthdayIn(birth.getFullYear() + years + 1);
      return { years, last, next, exact: years + (now - last) / (next - last) };
    }

    const STATS = [
      { big: true, label: 'seconds of being wonderful', f: (s) => fmt(s) },
      { label: 'laps around the Sun', f: (s, L) => L.exact.toFixed(8) },
      { label: 'sunrises witnessed', f: (s) => fmt(s / 86400) },
      { label: 'hours on planet Earth', f: (s) => fmt(s / 3600) },
      { label: 'heartbeats (≈ 80 a minute)', f: (s) => fmt((s / 60) * 80) },
      { label: 'breaths taken (≈ 16 a minute)', f: (s) => fmt((s / 60) * 16) },
      { label: 'km travelled around the Sun', f: (s) => fmt(s * 29.78) },
      { label: 'km travelled through the galaxy', f: (s) => fmt(s * 230) },
      { label: 'full moons that rose for you', f: (s) => fmt(s / 86400 / SYNODIC) },
      { label: 'blinks (≈ 15 a minute, awake)', f: (s) => fmt((s / 60) * 15 * (16 / 24)) },
    ];

    const grid = $('#stats');
    const vals = STATS.map((st, i) => {
      const card = document.createElement('div');
      card.className = 'stat reveal' + (st.big ? ' big' : '');
      card.innerHTML = `<span class="idx">${pad(i + 1)}</span><div class="val">—</div><div class="lbl">${st.label}</div>`;
      grid.appendChild(card);
      return $('.val', card);
    });
    const note = $('#lapNote');

    function tick() {
      const now = new Date();
      const s = (now - birth) / 1000;
      const L = laps(now);
      STATS.forEach((st, i) => { vals[i].textContent = st.f(s, L); });

      const left = (L.next - now) / 1000;
      const d = Math.floor(left / 86400);
      const hh = Math.floor((left % 86400) / 3600);
      const mm = Math.floor((left % 3600) / 60);
      const ss = Math.floor(left % 60);
      const isToday = now - L.last < 86400000;
      note.innerHTML =
        (isToday ? `<b>✦ It's today — lap ${L.years} complete!</b>` : '') +
        `<span>Lap ${L.years + 1} completes in ${d}d ${pad(hh)}h ${pad(mm)}m ${pad(ss)}s</span>`;
    }
    tick();
    setInterval(tick, 100);
  })();

  /* ==========================================================
     III · THE MOON THAT NIGHT
     ========================================================== */
  (() => {
    const canvas = $('#moon');
    const SIZE = 170;
    const ctx = fitCanvas(canvas, SIZE, SIZE);
    const SYNODIC = 29.530588853;
    const REF_NEW_MOON = Date.UTC(2000, 0, 6, 18, 14);

    const age = ((((CONFIG.birthNight - REF_NEW_MOON) / 86400000) % SYNODIC) + SYNODIC) % SYNODIC;
    const birthFrac = age / SYNODIC;
    const illum = Math.round(((1 - Math.cos(2 * Math.PI * birthFrac)) / 2) * 100);

    const NAMES = [
      [1.84, 'New Moon'], [5.53, 'Waxing Crescent'], [9.22, 'First Quarter'], [12.91, 'Waxing Gibbous'],
      [16.61, 'Full Moon'], [20.3, 'Waning Gibbous'], [23.99, 'Last Quarter'], [27.68, 'Waning Crescent'], [99, 'New Moon'],
    ];
    const phaseName = NAMES.find(([lim]) => age < lim)[1];
    $('#moonName').textContent = phaseName;
    $('#moonCap').textContent = `the moon that night: ${phaseName.toLowerCase()}, ${illum}% lit`;

    const craters = Array.from({ length: 9 }, () => ({ x: rand(-0.6, 0.6), y: rand(-0.6, 0.6), r: rand(0.05, 0.14) }));

    function draw(frac) {
      const cx = SIZE / 2, cy = SIZE / 2, r = SIZE * 0.36;
      ctx.clearRect(0, 0, SIZE, SIZE);

      const glow = ctx.createRadialGradient(cx, cy, r * 0.8, cx, cy, r * 1.4);
      glow.addColorStop(0, 'rgba(255,230,180,.18)');
      glow.addColorStop(1, 'rgba(255,230,180,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, SIZE, SIZE);

      ctx.save();
      ctx.translate(cx, cy);

      ctx.fillStyle = '#2a2648';
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();

      // lit region
      const k = Math.cos(frac * 2 * Math.PI);
      ctx.beginPath();
      if (frac <= 0.5) {
        ctx.arc(0, 0, r, -Math.PI / 2, Math.PI / 2, false);
        ctx.ellipse(0, 0, Math.abs(k) * r, r, 0, Math.PI / 2, -Math.PI / 2, k > 0);
      } else {
        ctx.arc(0, 0, r, Math.PI / 2, (3 * Math.PI) / 2, false);
        ctx.ellipse(0, 0, Math.abs(k) * r, r, 0, -Math.PI / 2, Math.PI / 2, k > 0);
      }
      ctx.closePath();
      const lit = ctx.createRadialGradient(-r * 0.3, -r * 0.3, r * 0.1, 0, 0, r);
      lit.addColorStop(0, '#fffaf0');
      lit.addColorStop(1, '#f1dcae');
      ctx.fillStyle = lit;
      ctx.shadowColor = 'rgba(255,220,150,.8)';
      ctx.shadowBlur = 18;
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.clip();
      ctx.fillStyle = 'rgba(160,130,90,.18)';
      for (const c of craters) {
        ctx.beginPath();
        ctx.arc(c.x * r, c.y * r, c.r * r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
    draw(birthFrac);

    let clicks = 0, transformed = false;
    $('#moonBtn').addEventListener('click', (e) => {
      FX.sparkle(e.clientX, e.clientY);
      if (transformed || ++clicks < 3) return;
      transformed = true;
      const start = performance.now();
      const from = birthFrac;
      const to = 0.5;
      (function anim(now) {
        const t = Math.min(1, (now - start) / 2200);
        const ease = 1 - Math.pow(1 - t, 3);
        draw(from + (to - from) * ease);
        if (t < 1) requestAnimationFrame(anim);
      })(start);
      $('#moonCap').textContent = 'that night it was saving its light — tonight it’s full, for you.';
      Secrets.find('moon', 'You woke the moon. It was saving the rest of its light for tonight.');
    });
  })();

  /* ==========================================================
     IV · CABINET OF CURIOSITIES
     ========================================================== */
  (() => {
    const GLYPHS = ['✦', '☾', '✿', '♡', '✧', '❀', '☼', '✶', '♢', '❋'];
    const wrap = $('#drawers');
    const opened = new Set();
    const countEl = $('#openedCount');
    const bar = $('#openedBar');

    CONFIG.curiosities.forEach((msg, i) => {
      const b = document.createElement('button');
      b.className = 'drawer';
      b.type = 'button';
      b.style.setProperty('--i', i);
      b.setAttribute('aria-label', `Open drawer ${i + 1}`);
      b.innerHTML = `
        <span class="drawer-inner">
          <span class="face front"><span class="num">No. ${pad(i + 1)}</span><span class="glyph">${GLYPHS[i % GLYPHS.length]}</span><span class="knob"></span></span>
          <span class="face back"><span class="yr">Curiosity ${pad(i + 1)}/20</span><span class="msg">${msg}</span></span>
        </span>`;
      b.addEventListener('click', (e) => {
        const isOpen = b.classList.toggle('open');
        b.setAttribute('aria-label', isOpen ? msg : `Open drawer ${i + 1}`);
        if (!isOpen || opened.has(i)) return;
        opened.add(i);
        for (let k = 0; k < 6; k++) FX.sparkle(e.clientX + rand(-30, 30), e.clientY + rand(-30, 30));
        countEl.textContent = opened.size;
        bar.style.width = (opened.size / 20) * 100 + '%';
        if (opened.size === 20) {
          FX.confetti(220);
          Secrets.find('cabinet', 'Every drawer opened. Twenty years, twenty reasons — and countless more.');
        }
      });
      wrap.appendChild(b);
    });
  })();

  /* ==========================================================
     V · THE CAKE
     ========================================================== */
  const Letter = (() => {
    const el = $('#letter');
    const body = $('#letterBody');
    let unlocked = false, typed = false, inView = false;
    body.textContent = CONFIG.letter;

    function type() {
      if (typed) return;
      typed = true;
      const text = CONFIG.letter;
      if (reduceMotion) { body.textContent = text; el.classList.add('done'); return; }
      el.classList.add('typing');
      body.textContent = '';
      let i = 0;
      (function step() {
        i++;
        body.textContent = text.slice(0, i);
        if (i < text.length) {
          const ch = text[i - 1];
          setTimeout(step, ch === '\n' ? 240 : /[.,—!]/.test(ch) ? 130 : rand(14, 30));
        } else {
          el.classList.remove('typing');
          el.classList.add('done');
        }
      })();
    }

    new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView && unlocked) setTimeout(type, 500);
    }, { threshold: 0.35 }).observe(el);

    return {
      unlock() {
        if (unlocked) return;
        unlocked = true;
        el.classList.remove('locked');
        if (inView) setTimeout(type, 500);
      },
    };
  })();

  (() => {
    const top = $('#cakeTop');
    const cake = $('#cake');
    const status = $('#wishStatus');
    const micBtn = $('#micBtn');
    const blowBtn = $('#blowBtn');
    const meter = $('#meter');
    const CANDLE_COLORS = ['#f5c56b', '#ff7aa2', '#b9a6ff', '#7fe0d0'];
    const candles = [];
    let lit = 0, celebrated = false, micStream = null, micCtx = null;

    // organic frosting drips
    const drips = $('.drips');
    for (let x = 0; x < 100; x += rand(5, 9)) {
      const d = document.createElement('i');
      d.style.setProperty('--x', x + '%');
      d.style.setProperty('--w', rand(10, 18).toFixed(1) + 'px');
      d.style.setProperty('--h', rand(45, 100).toFixed(0) + '%');
      drips.appendChild(d);
    }

    // 20 candles in two rows on the elliptical top
    for (let i = 0; i < 20; i++) {
      const back = i < 9;
      const n = back ? 9 : 11;
      const idx = back ? i : i - 9;
      const t = (idx + 0.5) / n;
      const x = 50 + (t - 0.5) * (back ? 70 : 84);
      const y = back ? 28 : 70;
      const c = document.createElement('button');
      c.className = 'candle';
      c.type = 'button';
      c.setAttribute('aria-label', `Candle ${i + 1}`);
      c.style.left = x + '%';
      c.style.top = y + '%';
      c.style.zIndex = back ? 1 : 2;
      c.style.setProperty('--c', CANDLE_COLORS[i % CANDLE_COLORS.length]);
      c.style.setProperty('--f', rand(0.1, 0.18).toFixed(2) + 's');
      c.innerHTML = '<span class="wick"></span><span class="flame"></span><span class="smoke"></span>';
      c.addEventListener('click', () => blowOut(c));
      top.appendChild(c);
      candles.push(c);
    }
    lit = candles.length;

    function updateStatus() {
      if (lit > 0 && lit < 20) status.textContent = `${lit} candle${lit === 1 ? '' : 's'} still glowing…`;
    }

    function blowOut(c) {
      if (c.classList.contains('out')) return;
      c.classList.add('out');
      c.setAttribute('aria-label', 'Candle blown out');
      lit--;
      updateStatus();
      if (lit === 0) celebrate();
    }

    function celebrate() {
      if (celebrated) return;
      celebrated = true;
      stopMic();
      cake.classList.add('dark');
      status.textContent = 'Wish received. The universe is already working on it. ✦';
      blowBtn.textContent = 'Light them again';
      micBtn.disabled = true;
      FX.confetti(240, innerWidth / 2, innerHeight * 0.5);
      FX.fireworks(8);
      Letter.unlock();
      setTimeout(() => {
        Toast.show('<b>Your letter is unsealed.</b><br>Scroll down — it’s waiting for you.');
      }, 1800);
    }

    function relight() {
      candles.forEach((c) => {
        c.classList.remove('out');
        c.setAttribute('aria-label', 'Candle');
      });
      lit = candles.length;
      celebrated = false;
      cake.classList.remove('dark');
      micBtn.disabled = false;
      blowBtn.textContent = 'Or tap here to blow';
      status.textContent = 'Relit. Make another wish — they’re free on birthdays.';
    }

    blowBtn.addEventListener('click', () => {
      if (lit === 0) { relight(); return; }
      const remaining = candles.filter((c) => !c.classList.contains('out'));
      remaining.sort(() => Math.random() - 0.5).forEach((c, i) => setTimeout(() => blowOut(c), i * 70));
    });

    function stopMic() {
      if (micStream) micStream.getTracks().forEach((t) => t.stop());
      if (micCtx) micCtx.close();
      micStream = micCtx = null;
      meter.hidden = true;
    }

    micBtn.addEventListener('click', async () => {
      if (micStream) return;
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        status.textContent = 'No microphone here — tap the candles or use the button instead.';
        return;
      }
      try {
        micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const AC = window.AudioContext || window.webkitAudioContext;
        micCtx = new AC();
        const analyser = micCtx.createAnalyser();
        analyser.fftSize = 512;
        micCtx.createMediaStreamSource(micStream).connect(analyser);
        const buf = new Uint8Array(analyser.fftSize);
        const fill = $('i', meter);
        meter.hidden = false;
        status.textContent = 'Listening… now blow gently toward your microphone.';

        (function listen() {
          if (!micStream) return;
          analyser.getByteTimeDomainData(buf);
          let sum = 0;
          for (const v of buf) { const x = (v - 128) / 128; sum += x * x; }
          const rms = Math.sqrt(sum / buf.length);
          fill.style.width = Math.min(100, rms * 400) + '%';
          if (rms > 0.16 && Math.random() < Math.min(0.6, rms * 1.5)) {
            const remaining = candles.filter((c) => !c.classList.contains('out'));
            if (remaining.length) blowOut(pick(remaining));
          }
          requestAnimationFrame(listen);
        })();
      } catch (err) {
        stopMic();
        status.textContent = 'Couldn’t reach the microphone — tap the candles or use the button instead.';
      }
    });
  })();

  /* ==========================================================
     FINALE
     ========================================================== */
  $('#moreFireworks').addEventListener('click', () => {
    FX.fireworks(10);
    setTimeout(() => FX.confetti(160), 900);
  });

  let finaleShown = false;
  new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && !finaleShown) {
      finaleShown = true;
      FX.fireworks(5);
    }
  }, { threshold: 0.6 }).observe($('#finale'));

  /* ==========================================================
     REVEAL ON SCROLL + PROGRESS BAR
     ========================================================== */
  const revealer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        revealer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  $$('.reveal, .drawers').forEach((el) => revealer.observe(el));

  const progress = $('.progress');
  function onScroll() {
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
  }
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // a little hello for anyone who opens the console
  console.log('%c✦ Happy 20th, Ebtehal ✦', 'font: italic 24px Georgia; color: #f5c56b;');
  console.log('Curious, huh? Try typing her name on the page.');
})();
