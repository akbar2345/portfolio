/* ============================================================
   Akbar Ali — Portfolio v2 · JavaScript
   ============================================================ */

/* ── SCROLL FADE-IN ── */
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, { threshold: 0.08 });

document.querySelectorAll('.fade-in').forEach((el, i) => {
  el.style.transitionDelay = (i % 5) * 0.07 + 's';
  observer.observe(el);
});

/* ── NAV SCROLL STYLE ── */
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (window.scrollY > 40) {
    nav.style.borderBottomColor = 'rgba(201,168,76,0.15)';
  } else {
    nav.style.borderBottomColor = 'rgba(255,255,255,0.07)';
  }
});

/* ── MOBILE NAV ── */
document.querySelectorAll('#nav-links a').forEach(a => {
  a.addEventListener('click', () => {
    document.getElementById('nav-links').classList.remove('open');
  });
});

/* ============================================================
   IMAGE UPLOAD SYSTEM
   ============================================================ */

const STORAGE_PREFIX = 'portfolio_img_';

function restoreAllSavedImages() {
  document.querySelectorAll('.img-upload-zone').forEach(zone => {
    const key = zone.dataset.imgKey;
    if (!key) return;
    const saved = localStorage.getItem(STORAGE_PREFIX + key);
    if (saved) applyImageToZone(zone, saved);
  });
}

function applyImageToZone(zone, base64) {
  const img = zone.querySelector('.uploadable-img');
  const fallback = zone.querySelector('.photo-fallback, .logo-fallback');
  if (img) {
    img.src = base64;
    img.style.display = 'block';
    if (fallback) fallback.style.display = 'none';
  }
}

let activeZone = null;
let pendingBase64 = null;

const modal       = document.getElementById('upload-modal');
const previewImg  = document.getElementById('upload-preview-img');
const previewPH   = document.getElementById('upload-preview-placeholder');
const fileInput   = document.getElementById('upload-file-input');
const saveBtn     = document.getElementById('modal-save');
const cancelBtn   = document.getElementById('modal-cancel');
const closeBtn    = document.getElementById('modal-close');

function openModal(zone) {
  activeZone = zone;
  pendingBase64 = null;
  previewImg.style.display = 'none';
  previewImg.src = '';
  previewPH.style.display = 'flex';
  saveBtn.disabled = true;
  fileInput.value = '';

  const key = zone.dataset.imgKey || '';
  const titleEl = document.querySelector('.um-title');
  if (key === 'profile') titleEl.textContent = 'Update Profile Photo';
  else if (key === 'village') titleEl.textContent = 'Update Village Photo';
  else if (key === 'professional') titleEl.textContent = 'Update Professional Photo';
  else if (key.startsWith('logo-')) titleEl.textContent = 'Update Company Logo';
  else titleEl.textContent = 'Update Photo';

  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.style.display = 'none';
  document.body.style.overflow = '';
  activeZone = null;
  pendingBase64 = null;
}

document.querySelectorAll('.img-upload-zone').forEach(zone => {
  zone.addEventListener('click', e => {
    e.stopPropagation();
    openModal(zone);
  });
});

fileInput.addEventListener('change', () => {
  const file = fileInput.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    pendingBase64 = ev.target.result;
    previewImg.src = pendingBase64;
    previewImg.style.display = 'block';
    previewPH.style.display = 'none';
    saveBtn.disabled = false;
  };
  reader.readAsDataURL(file);
});

saveBtn.addEventListener('click', () => {
  if (!activeZone || !pendingBase64) return;
  const key = activeZone.dataset.imgKey;
  localStorage.setItem(STORAGE_PREFIX + key, pendingBase64);
  applyImageToZone(activeZone, pendingBase64);
  closeModal();
});

cancelBtn.addEventListener('click', closeModal);
closeBtn.addEventListener('click', closeModal);
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });

document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

/* ── INIT ── */
restoreAllSavedImages();

/* ============================================================
   HERO CANVAS — disabled (real bg image active)
   ============================================================ */
(function() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  canvas.style.display = 'none';
  return;
  const ctx = canvas.getContext('2d');

  // All the techy strings that float around
  const CODE_STRINGS = [
    'xquery version "1.0-ml"',
    'fn:doc("/data/node.xml")',
    'cts:search(doc(),',
    'xdmp:document-insert(',
    'let $doc := fn:doc(',
    'return $doc/node/text()',
    'fn:collection("gene")',
    'cts:word-query("BSI")',
    'xdmp:log($msg, "info")',
    'fn:count($results)',
    'map:get($map, "key")',
    'json:object()',
    'xdmp:eval($query)',
    'ml:transform($doc)',
    'corb:process()',
    'fn:exists($node)',
    'xdmp:commit()',

    // XML tags
    '<document>',
    '</document>',
    '<standard id="ISO">',
    '<content type="XML">',
    '<entity name="Gene">',
    '</metadata>',
    '<schema version="2.0">',
    '<transform xslt="">',
    '<node uri="/doc.xml">',
    '<index field="id">',

    // Data / tech terms
    'MarkLogic 12',
    'XQuery 3.1',
    'CORB 2.4',
    'TDE Template',
    'Optic API',
    'CTS Query',
    '62M+ docs',
    'ODH Pipeline',
    'REST /v1/search',
    'Forest: data01',
    'Database: gene',
    'JSON | XML',
    'NoSQL Hub',
    'BSI Standards',
    'XPath 2.0',
    'MLCP ingest',
    'fn:doc()',
    'xdmp:*',
  ];

  let particles = [];
  let W, H;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function randomBetween(a, b) { return a + Math.random() * (b - a); }

  function spawnParticle(fromBottom) {
    const isCode    = Math.random() > 0.35;           // 65% code, 35% dots
    const str       = CODE_STRINGS[Math.floor(Math.random() * CODE_STRINGS.length)];
    const size      = randomBetween(10, 15);
    const opacity   = randomBetween(0.12, 0.45);
    const speed     = randomBetween(0.18, 0.55);
    const drift     = randomBetween(-0.15, 0.15);     // horizontal drift
    const x         = randomBetween(0.05 * W, 0.98 * W);
    const y         = fromBottom ? H + 20 : randomBetween(-20, H);

    // Colour: navy + teal + gold on light background
    const rnd = Math.random();
    const color = rnd < 0.50
      ? `rgba(13,30,48,${opacity})`          // deep navy
      : rnd < 0.75
      ? `rgba(11,80,120,${opacity})`          // MarkLogic blue
      : rnd < 0.90
      ? `rgba(8,100,80,${opacity})`           // deep teal
      : `rgba(140,100,20,${opacity})`;        // gold accent

    return { str, size, x, y, speed, drift, color, isCode,
             isDot: !isCode,
             dotR: randomBetween(1.5, 4),
             life: 1, decay: randomBetween(0.0008, 0.002) };
  }

  function init() {
    particles = [];
    const count = Math.floor(W / 22);               // density by width
    for (let i = 0; i < count; i++) particles.push(spawnParticle(false));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    ctx.font = `400 13px "Courier New", monospace`;

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.y   -= p.speed;
      p.x   += p.drift;
      p.life -= p.decay;

      if (p.y < -30 || p.life <= 0) {
        particles[i] = spawnParticle(true);
        continue;
      }

      ctx.globalAlpha = Math.min(p.life, 1);
      ctx.fillStyle   = p.color;

      if (p.isDot) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.dotR, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.font = `400 ${p.size}px "Courier New", monospace`;
        ctx.fillText(p.str, p.x, p.y);
      }
    }

    ctx.globalAlpha = 1;

    // Occasional connector lines between nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 90) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(13,30,48,${0.08 * (1 - dist/90)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); init(); });
  resize();
  init();
  draw();
})();
