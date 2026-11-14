const CHUNKS = [
  '/_next/static/immutable/chunks/turbopack-083li2xfeup4_.js',
  '/_next/static/immutable/chunks/41ks-tq7-8ud_.js',
  '/_next/static/immutable/chunks/3kf1nen54kugl.js',
  '/_next/static/immutable/chunks/28qyxkb2da-4g.js',
];
const WORKER_SCRIPT = '/_next/static/immutable/chunks/turbopack-worker-2g80pj3ycf14_.js';

function worldWorkerUrl() {
  const url = new URL(WORKER_SCRIPT, location.origin);
  const params = [CHUNKS, '', '/_next/', 'dpl_9j9HvgA3ufout1PfYCoUYH5RtzST', null];
  url.hash = `params=${encodeURIComponent(JSON.stringify(params))}`;
  return url;
}

function titleBox() {
  const title = document.querySelector('.beat-title');
  if (!title) return { size: 1, left: 0, top: 0 };
  const rect = title.getBoundingClientRect();
  return {
    size: Number.parseFloat(getComputedStyle(title).fontSize) || 1,
    left: rect.left,
    top: rect.top,
  };
}

function fidelity() {
  const handheld = matchMedia('(pointer: coarse)').matches;
  const ratio = Math.min(window.devicePixelRatio || 1, handheld ? 1.5 : 2);
  const memory = navigator.deviceMemory || 8;
  const cores = navigator.hardwareConcurrency || 8;
  const saveData = navigator.connection?.saveData === true
    || /2g|3g/.test(navigator.connection?.effectiveType || '');
  const full = !handheld && memory > 3 && cores > 4 && !saveData;
  return {
    tier: full ? 'good' : 'modest',
    speed: full ? 0.3 : 0.14,
    handheld,
    memory,
    cores,
    ratio,
    frugal: saveData || memory <= 3,
    scenery: full ? 'full' : 'light',
    bloom: full,
    // Keep the lighter scene on a 60 Hz cadence too; a 30 Hz cap makes scroll
    // motion visibly step on machines that need the lower quality tier.
    frameMs: 16.7,
    samples: full ? 2 : 1,
    budget: full ? 1.0 : 0.45,
    softest: Math.min(ratio, full ? 1.125 : 0.75),
    sharpest: ratio,
    stretch: full ? 1.6 : 1.25,
  };
}

export function createFlight(canvas) {
  if (!canvas.transferControlToOffscreen) throw new Error('OffscreenCanvas is unavailable');

  const worker = new Worker(worldWorkerUrl(), { name: 'Launch Nest live world' });
  const offscreen = canvas.transferControlToOffscreen();
  const stats = { progress: 0, marks: null, render: null };
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let active = true;

  worker.addEventListener('message', ({ data }) => {
    if (data.type === 'frame') stats.progress = data.progress;
    else if (data.type === 'stats') stats.render = data.stats;
    else if (data.type === 'marks') stats.marks = data.marks;
    else if (data.type === 'error') {
      console.error('The live world stopped:', data.message);
      window.dispatchEvent(new CustomEvent('flight-error'));
    }
  });
  worker.addEventListener('error', (error) => {
    console.error('The live world worker could not start:', error.message);
    window.dispatchEvent(new CustomEvent('flight-error'));
  });

  const command = (method, ...args) => worker.postMessage({ method, args });
  const size = () => {
    const width = canvas.clientWidth, height = canvas.clientHeight;
    if (width && height) command('setSize', width, height, titleBox());
  };
  const observer = new ResizeObserver(size);
  observer.observe(canvas);

  const pointer = (event) => command(
    'setPointer',
    (event.clientX / window.innerWidth) * 2 - 1,
    (event.clientY / window.innerHeight) * 2 - 1,
  );
  window.addEventListener('pointermove', pointer, { passive: true });
  document.addEventListener('visibilitychange', () => command('setActive', active && !document.hidden));

  worker.postMessage({
    start: {
      canvas: offscreen,
      fidelity: fidelity(),
      size: { width: canvas.clientWidth, height: canvas.clientHeight },
      pixelRatio: Math.min(window.devicePixelRatio || 1, 2),
    },
  }, [offscreen]);

  if (reducedMotion) command('setCalm', true);

  return {
    setProgress(value) { command('setProgress', Math.min(1, Math.max(0, value))); },
    setActive(value) { active = value; command('setActive', active && !document.hidden); },
    resize: size,
    stats: () => ({ ...stats }),
    dispose() {
      observer.disconnect();
      window.removeEventListener('pointermove', pointer);
      worker.terminate();
    },
  };
}
