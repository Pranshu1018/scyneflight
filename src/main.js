import Lenis from 'lenis';

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (a, b, v) => { const t = clamp((v - a) / (b - a)); return t * t * (3 - 2 * t); };
const mix = (a, b, t) => a + (b - a) * t;
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Text splitting ---------- */
$$('[data-split]').forEach((el) => {
  const text = el.textContent.trim();
  el.setAttribute('aria-label', text);
  el.innerHTML = text.split(/\s+/).map((w, i) => `<span class="w" aria-hidden="true"><span style="--i:${i}">${w}</span></span>`).join(' ');
});
$$('[data-roll]').forEach((el) => {
  const text = el.textContent.trim();
  el.parentElement.setAttribute('aria-label', text);
  el.innerHTML = [...text].map((c, i) => `<span class="ch" style="--i:${i}">${c === ' ' ? '&nbsp;' : c}</span>`).join('');
});

/* ---------- Marquee + drifting columns (content duplicated for a seamless loop) ---------- */
const WORDS = ['Web design', 'Web development', 'Search', 'Branding', 'Graphic design', 'Digital marketing'];
$$('.marquee-set').forEach((set) => { set.innerHTML = WORDS.map((w) => `<span>${w}</span><svg><use href="#i-star"/></svg>`).join(''); });
$$('.vcol').forEach((col) => { col.innerHTML += col.innerHTML; });

/* ---------- Reveal on enter ---------- */
const io = new IntersectionObserver((entries) => {
  for (const e of entries) if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
$$('[data-reveal], [data-split]').forEach((el) => io.observe(el));

/* ---------- Smooth scroll ---------- */
let lenis = null;
if (!reduced) {
  lenis = new Lenis({ lerp: 0.11 });
  const loop = (t) => { lenis.raf(t); requestAnimationFrame(loop); };
  requestAnimationFrame(loop);
}
const scrollToTarget = (hash) => {
  const target = hash === '#top' ? 0 : $(hash);
  if (target === null) return;
  if (lenis) lenis.scrollTo(target, { offset: hash === '#top' ? 0 : -70, duration: 1.4 });
  else if (target === 0) scrollTo({ top: 0 });
  else target.scrollIntoView();
};
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
  e.preventDefault();
  if (a.getAttribute('href').length < 2) return;
  closeMenu();
  scrollToTarget(a.getAttribute('href'));
});

/* ---------- Menu ---------- */
const menu = $('#menu'), menuOpen = $('#menu-open'), menuClose = $('#menu-close');
function openMenu() {
  menu.hidden = false;
  requestAnimationFrame(() => menu.classList.add('open'));
  menuOpen.setAttribute('aria-expanded', 'true');
  lenis?.stop();
  menuClose.focus();
}
function closeMenu() {
  if (!menu.classList.contains('open')) return;
  menu.classList.remove('open');
  menuOpen.setAttribute('aria-expanded', 'false');
  lenis?.start();
  setTimeout(() => { if (!menu.classList.contains('open')) menu.hidden = true; }, 500);
  menuOpen.focus({ preventScroll: true });
}
menuOpen.addEventListener('click', openMenu);
menuClose.addEventListener('click', closeMenu);
addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });

/* ---------- Hero flight ---------- */
const flightEl = $('.flight'), view = $('#flight-view'), scrim = $('#flight-scrim'), hint = $('#flight-hint');
const landing = $('#landing'), tileLive = $('#tile-live figure'), tiles = $$('.tile');
const beats = $$('[data-beat]');
// [fade in from, to, fade out from, to] in hero scroll progress
const windows = [[-1, -0.5, 0.07, 0.12], [0.15, 0.19, 0.27, 0.31], [0.4, 0.46, 0.53, 0.58], [0.61, 0.67, 0.74, 0.79]];
const FLY_END = 0.7;
let flight = null;
import('./flight.js')
  .then(({ createFlight }) => { flight = createFlight($('#flight-canvas')); update(); })
  .catch((err) => { console.warn('3D scene unavailable.', err); flightEl.classList.add('no-webgl'); })
  .finally(() => setTimeout(() => $('#loader').classList.add('done'), 300));
addEventListener('flight-error', () => flightEl.classList.add('no-webgl'));

/* ---------- Scroll-linked updates ---------- */
const header = $('#header');
const darkZones = $$('[data-theme="dark"]');
const processEl = $('#process'), track = $('#ptrack'), stepNum = $('#step-num'), pview = $('.process-view');
const pars = $$('[data-par]'), floats = $$('[data-float]');
const desktop = matchMedia('(min-width: 993px)');
let lastY = scrollY, activeStep = 0, ticking = false, heroDark = false;

function update() {
  ticking = false;
  const vh = innerHeight, vw = innerWidth, y = scrollY;

  // Hero
  const fr = flightEl.getBoundingClientRect();
  const inHero = fr.bottom > 0;
  flight?.setActive(inHero);
  if (inHero) {
    const p = clamp(-fr.top / (fr.height - vh));
    flight?.setProgress(clamp(p / FLY_END));
    hint.style.opacity = 1 - smooth(0.004, 0.03, p);
    scrim.style.opacity = 1 - smooth(0.06, 0.14, p);
    beats.forEach((b, i) => {
      const [a0, a1, o0, o1] = windows[i];
      const fin = smooth(a0, a1, p), fout = 1 - smooth(o0, o1, p), a = fin * fout;
      b.style.opacity = a;
      b.style.transform = `translate3d(0, ${((1 - fin) * 50 - (1 - fout) * 50).toFixed(1)}px, 0)`;
      b.classList.toggle('is-on', a > 0.02);
      b.style.pointerEvents = a > 0.5 ? 'auto' : 'none';
    });

    // The view shrinks to a rounded card, then settles into its tile in the grid.
    const k1 = smooth(0.8, 0.875, p), k2 = smooth(0.885, 0.965, p);
    landing.style.opacity = k2;
    landing.classList.toggle('is-on', k2 > 0.01);
    tiles.forEach((t, i) => {
      if (t.id === 'tile-live') { t.style.opacity = k2; t.style.transform = 'none'; return; }
      const k = smooth(0.1 + i * 0.07, 0.6 + i * 0.07, k2);
      t.style.opacity = k;
      t.style.transform = `translate3d(0, ${((1 - k) * 44).toFixed(1)}px, 0) scale(${(0.96 + k * 0.04).toFixed(3)})`;
    });
    if (k1 <= 0.001) { view.style.transform = ''; view.style.clipPath = ''; }
    else {
      const sr = fr.top > 0 ? fr.top : 0; // sticky box sits at the viewport top while pinned
      const card = { l: vw * 0.09, t: vh * 0.1, w: vw * 0.82, h: vh * 0.8 };
      const tr = tileLive.getBoundingClientRect();
      const tile = { l: tr.left, t: tr.top - sr, w: tr.width, h: tr.height };
      const full = { l: 0, t: 0, w: vw, h: vh };
      const R = {};
      for (const key of ['l', 't', 'w', 'h']) R[key] = mix(mix(full[key], card[key], k1), tile[key], k2);
      const s = Math.max(R.w / vw, R.h / vh);
      const ix = (vw * s - R.w) / 2 / s, iy = (vh * s - R.h) / 2 / s;
      view.style.transform = `translate3d(${(R.l + R.w / 2 - vw / 2).toFixed(1)}px, ${(R.t + R.h / 2 - vh / 2).toFixed(1)}px, 0) scale(${s.toFixed(4)})`;
      view.style.clipPath = `inset(${iy.toFixed(1)}px ${ix.toFixed(1)}px round ${(mix(40, 20, k2) * k1 / s).toFixed(1)}px)`;
    }
    heroDark = p > 0.45;
  }

  // Header: hide on the way down, theme by what sits under it
  header.classList.toggle('is-hidden', y > lastY && y > 300 && !menu.classList.contains('open'));
  lastY = y;
  header.classList.toggle('on-dark', (inHero && fr.bottom > 46 && heroDark) || darkZones.some((z) => { const r = z.getBoundingClientRect(); return r.top <= 46 && r.bottom > 46; }));

  // Process: vertical scroll drives the steps sideways
  if (desktop.matches) {
    const pr = processEl.getBoundingClientRect();
    if (pr.top < vh && pr.bottom > 0) {
      const t = clamp(-pr.top / (pr.height - vh));
      const max = Math.max(0, track.scrollWidth - pview.clientWidth * 0.55);
      track.style.transform = `translate3d(${(-t * max).toFixed(1)}px, 0, 0)`;
      const idx = Math.min(2, Math.floor(t * 3));
      if (idx !== activeStep) {
        activeStep = idx;
        stepNum.textContent = `0${idx + 1}`;
        stepNum.classList.remove('tick'); void stepNum.offsetWidth; stepNum.classList.add('tick');
      }
    }
  }

  // Big type drift + floating cards
  if (!reduced) {
    for (const el of pars) {
      const r = el.parentElement.getBoundingClientRect();
      if (r.top < vh && r.bottom > 0) el.style.transform = `translate3d(${(((r.top + r.height / 2 - vh / 2) / vh) * 8 * +el.dataset.par).toFixed(2)}vw, 0, 0)`;
    }
    for (const el of floats) {
      const r = el.parentElement.getBoundingClientRect();
      if (r.top < vh && r.bottom > 0) el.style.transform = `translate3d(0, ${((r.top - vh / 2) * +el.dataset.float).toFixed(1)}px, 0)`;
    }
  }
}
const requestUpdate = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
addEventListener('scroll', requestUpdate, { passive: true });
addEventListener('resize', requestUpdate);
update();

/* ---------- FAQ ---------- */
const FAQ = {
  ask: [
    ['What services do you offer?', 'A full-service digital studio: web design and development, search optimisation, branding and identity, and graphic design. Everything you need to launch and grow online, from one team.'],
    ['Where are you based?', 'Replace this with your location. We work with clients remotely as well as locally.'],
    ['How long does a website project take?', 'It depends on scope. A focused brochure site is quicker than a large catalogue. You get a timeline with milestones before work starts.'],
    ['Do you work with businesses outside your city?', 'Yes. Most of the process runs online, with a weekly update so nothing goes quiet.'],
    ['Can you redesign my existing website?', 'Yes. We look at what the current site does and does not do for you, keep what works and rebuild the rest.'],
    ['Will my website be mobile-friendly?', 'Always. Every layout is designed and tested on phones first.'],
    ['Do you provide ongoing support after launch?', 'Yes. We stay on for fixes and tuning, and offer retainers for continued improvement.'],
    ['How do I get started?', 'Use the form below or send an email. A short call is usually enough to scope the work.'],
  ],
  career: [
    ['Are you hiring?', 'Replace this with your current openings, or say that you keep applications on file.'],
    ['Do you work with freelancers?', 'Replace this with how you engage freelance designers, developers and writers.'],
    ['How do I apply?', 'Send a short note and a link to your work to the email address in the footer.'],
  ],
  pricing: [
    ['How do you price projects?', 'By scope, not by the hour. After a short call you get a fixed quote listing exactly what is included.'],
    ['Do you offer retainers?', 'Yes, for search work, site improvements and ongoing design support.'],
    ['Is there a deposit?', 'Replace this with your payment terms.'],
  ],
};
const acc = $('#acc');
function renderFaq(key) {
  acc.innerHTML = FAQ[key].map(([q, a], i) => `
    <div class="acc-item${i === 0 ? ' open' : ''}" style="--i:${i}">
      <button class="acc-q" aria-expanded="${i === 0}">${q}<span aria-hidden="true"><svg><use href="#i-plus"/></svg></span></button>
      <div class="acc-a"><div><p>${a}</p></div></div>
    </div>`).join('');
}
acc.addEventListener('click', (e) => {
  const q = e.target.closest('.acc-q');
  if (!q) return;
  const item = q.parentElement, open = !item.classList.contains('open');
  $$('.acc-item', acc).forEach((it) => { it.classList.remove('open'); $('.acc-q', it).setAttribute('aria-expanded', 'false'); });
  item.classList.toggle('open', open);
  q.setAttribute('aria-expanded', String(open));
});
$$('.tabs button').forEach((b) => b.addEventListener('click', () => {
  $$('.tabs button').forEach((o) => o.setAttribute('aria-selected', String(o === b)));
  renderFaq(b.dataset.tab);
}));
renderFaq('ask');

/* ---------- Contact form: floating labels, then a pre-filled email draft ---------- */
const form = $('#form'), status = $('#form-status');
const syncFilled = (f) => f.closest('label')?.classList.toggle('filled', !!f.value);
$$('input:not([type=checkbox]), select, textarea', form).forEach((f) => { f.addEventListener('input', () => syncFilled(f)); f.addEventListener('change', () => syncFilled(f)); });
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form));
  const bad = $$('[required]', form).filter((f) => !f.value.trim() || (f.type === 'email' && !/^\S+@\S+\.\S+$/.test(f.value)));
  $$('.invalid', form).forEach((f) => f.classList.remove('invalid'));
  if (bad.length) {
    bad.forEach((f) => f.classList.add('invalid'));
    bad[0].focus();
    status.textContent = 'Please fill in your name, a valid email and a budget.';
    status.classList.add('err');
    return;
  }
  const body = `Name: ${data.name}\nEmail: ${data.email}\nBudget: ${data.budget}\nInterested in: ${data.interest || 'Not specified'}\nNewsletter: ${data.newsletter ? 'Yes' : 'No'}\n\n${data.message || ''}`;
  location.href = `mailto:hello@example.com?subject=${encodeURIComponent('New project: ' + data.name)}&body=${encodeURIComponent(body)}`;
  status.classList.remove('err');
  status.textContent = 'Your email app should open with the brief filled in. Press send there.';
});
