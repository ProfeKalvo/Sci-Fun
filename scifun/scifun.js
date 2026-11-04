/* Sci-fun · script compartido: fondo animado, cabecera, tema, sonido y progreso.
   Uso: cárgalo en el <head>, sin defer. Atributos opcionales en <body>:
   data-title="Texto bajo la marca" · data-back="../index.html" · data-stats="off" */
(function () {
  const st = {
    get: k => { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} }
  };

  // Rangos: [puntos mínimos, nombre]. Los puntos viven en 'sci_fun_score'.
  const LEVELS = [[0, 'Novato Científico'], [25, 'Asistente de Capi'], [50, 'Investigador junior'], [200, 'Investigador Senior'], [300, 'Giga chad de la ciencia']];
  function info() {
    const xp = Math.max(0, parseInt(st.get('sci_fun_score')) || 0);
    const i = LEVELS.filter(l => xp >= l[0]).length - 1, nx = LEVELS[i + 1];
    return {
      xp, lvl: i + 1, rank: LEVELS[i][1],
      next: nx ? nx[0] : null, nextRank: nx ? nx[1] : null,
      pct: nx ? Math.round((xp - LEVELS[i][0]) / (nx[0] - LEVELS[i][0]) * 100) : 100,
      tutorial: st.get('tutorialDone') === 'true'
    };
  }

  let snd = st.get('sf_snd') !== '0', ac;
  function beep(f = 520, d = .09) {
    if (!snd) return;
    try {
      ac = ac || new (window.AudioContext || window.webkitAudioContext)();
      const o = ac.createOscillator(), g = ac.createGain();
      o.type = 'sine'; o.frequency.value = f;
      g.gain.setValueAtTime(.05, ac.currentTime);
      g.gain.exponentialRampToValueAtTime(.0001, ac.currentTime + d);
      o.connect(g); g.connect(ac.destination); o.start(); o.stop(ac.currentTime + d);
    } catch (e) {}
  }
  // Si una imagen falla, la cambia por un emoji
  const fb = img => img.replaceWith(Object.assign(document.createElement('span'), { textContent: '🦫', className: 'fb' }));
  window.SF = { st, info, beep, fb, LEVELS };

  try { document.documentElement.dataset.theme = st.get('sf_theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'); } catch (e) {}

  const BG = `<svg id="bg" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
<defs><pattern id="gr" width="48" height="48" patternUnits="userSpaceOnUse"><path d="M48 0H0V48" fill="none" style="stroke:var(--art)" stroke-width="1"/></pattern></defs>
<rect width="1200" height="800" fill="url(#gr)" opacity=".13"/>
<circle class="star" cx="540" cy="120" r="2.5"/><circle class="star" cx="760" cy="300" r="2" style="animation-delay:.8s"/><circle class="star" cx="420" cy="520" r="3" style="animation-delay:1.6s"/><circle class="star" cx="1120" cy="480" r="2.5" style="animation-delay:2.2s"/><circle class="star" cx="330" cy="260" r="2" style="animation-delay:1.1s"/><circle class="star" cx="680" cy="470" r="2.5" style="animation-delay:.4s"/>
<g transform="translate(170,170)"><g class="sp"><g class="s"><ellipse rx="95" ry="34"/><ellipse rx="95" ry="34" transform="rotate(60)"/><ellipse rx="95" ry="34" transform="rotate(120)"/></g><g class="f"><circle r="12"/><circle cx="95" r="6"/><circle cx="95" r="6" transform="rotate(60)"/><circle cx="95" r="6" transform="rotate(120)"/></g></g></g>
<g transform="translate(900,70)"><g class="sw"><g class="s"><path d="M0 0L55 95L25 190"/></g><g class="f"><circle r="5"/><circle cx="55" cy="95" r="10"/><circle cx="25" cy="190" r="13"/></g></g></g>
<g transform="translate(580,690)"><g class="fl"><g class="s"><path d="M0 0C-34 -86 34 -86 0 0M0 0C-34 86 34 86 0 0"/></g><circle class="f" r="6"/><text x="48" y="8" font-size="24">n, l, m</text></g></g>
<g transform="translate(1060,340)"><g class="fl"><g class="s"><polygon points="50,0 25,43 -25,43 -50,0 -25,-43 25,-43"/><circle r="27"/></g><g class="f"><circle cx="50" r="9"/><circle cx="25" cy="43" r="9"/><circle cx="-25" cy="43" r="9"/><circle cx="-50" r="9"/><circle cx="-25" cy="-43" r="9"/><circle cx="25" cy="-43" r="9"/></g></g></g>
<g transform="translate(1040,650) scale(1.3)"><g class="fl"><g class="s"><path d="M-18 -70H18M-14 -70V-30L-55 40Q-62 56 -46 56H46Q62 56 55 40L14 -30V-70"/></g><path class="f" d="M-38 12H38L55 40Q62 56 46 56H-46Q-62 56 -55 40Z"/><g class="s"><circle class="bub" cx="-12" cy="2" r="5"/><circle class="bub" cx="10" cy="-6" r="3.5" style="animation-delay:1.3s"/><circle class="bub" cx="-2" cy="-10" r="4" style="animation-delay:2.4s"/></g></g></g>
<g transform="translate(200,660)"><g class="fl s"><circle r="44"/><path d="M-32 -18Q0 -32 32 -18M-43 8Q0 -6 43 8"/><ellipse rx="88" ry="20" transform="rotate(-18)"/><circle class="f" cx="92" cy="-44" r="7"/></g></g>
<g transform="translate(62,330) rotate(12)"><g id="dna" class="s fl"></g></g>
<text class="fl" x="430" y="60" font-size="30">F = m·a</text><text class="fl" x="330" y="470" font-size="26" style="animation-delay:1.5s">ψ(r, θ, φ)</text><text class="fl" x="760" y="740" font-size="34" style="animation-delay:2s">E = mc²</text>
</svg>`;

  document.addEventListener('DOMContentLoaded', () => {
    const b = document.body, d = b.dataset, i = info();
    const stats = d.stats === 'off' ? '' : `<div class="stats" id="stats" aria-label="Tu progreso"><div class="lvl">${i.lvl}</div><div class="st-body"><div class="st-top"><b>${i.rank}</b><span>${i.xp} pts</span></div><div class="bar" role="progressbar" aria-label="Progreso al siguiente rango" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${i.pct}"><i id="sf-fill"></i></div></div></div>`;
    b.insertAdjacentHTML('afterbegin', BG + `<header class="sf-head"><div class="wrap"><a class="back" href="${d.back || '../index.html'}">← Volver</a><div class="brand"><h1>Sci-fun</h1><p>${d.title || ''}</p></div>${stats}<div class="tools"><button class="ib" id="sf-snd" aria-label="Activar o silenciar sonidos" title="Sonido"></button><button class="ib" id="sf-theme" aria-label="Cambiar entre modo claro y modo noche" title="Tema"></button></div></div></header>`);

    // ADN del fondo
    let a = '', c = '', r = '';
    for (let y = 0; y <= 280; y += 7) {
      const x = 24 * Math.sin(y / 24);
      a += (y ? 'L' : 'M') + x.toFixed(1) + ' ' + y + ' ';
      c += (y ? 'L' : 'M') + (-x).toFixed(1) + ' ' + y + ' ';
      if (y % 28 === 0) r += 'M' + x.toFixed(1) + ' ' + y + 'L' + (-x).toFixed(1) + ' ' + y;
    }
    document.getElementById('dna').innerHTML = `<path d="${a}"/><path d="${c}"/><path d="${r}"/>`;

    const bs = document.getElementById('sf-snd'), bt = document.getElementById('sf-theme');
    const paint = () => {
      bs.textContent = snd ? '🔊' : '🔇'; bs.setAttribute('aria-pressed', snd);
      bt.textContent = document.documentElement.dataset.theme === 'dark' ? '☀️' : '🌙';
    };
    bs.onclick = () => { snd = !snd; st.set('sf_snd', snd ? '1' : '0'); paint(); beep(700); };
    bt.onclick = () => {
      const t = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      document.documentElement.dataset.theme = t; st.set('sf_theme', t); paint(); beep(440);
    };
    paint();
    const fill = document.getElementById('sf-fill');
    if (fill) setTimeout(() => { fill.style.width = i.pct + '%'; }, 400);
  });
})();
