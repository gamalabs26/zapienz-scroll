/* Verificación headless: consola, red, scrub, parallax, pin, reproductor, reveal, capturas. */
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const CHROME = process.env.HOME + '/.cache/puppeteer/chrome/win64-150.0.7871.24/chrome-win64/chrome.exe';
const URL = process.argv[2] || 'http://localhost:4321/';
const OUT = process.argv[3] || '_tmp/cap';
fs.mkdirSync(OUT, { recursive: true });
const espera = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'shell',
    args: ['--autoplay-policy=no-user-gesture-required', '--no-sandbox'] });
  const res = {};
  const vps = [
    { w: 1440, h: 900, n: 'escritorio' },
    { w: 768, h: 1024, n: 'tableta', mobile: true },
    { w: 390, h: 844, n: 'telefono', mobile: true },
  ];
  for (const vp of vps) {
    const page = await browser.newPage();
    await page.setViewport({ width: vp.w, height: vp.h, isMobile: !!vp.mobile, hasTouch: !!vp.mobile, deviceScaleFactor: 1 });
    const errs = [], fallos = []; let bytes = 0, peticiones = 0;
    page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
    page.on('pageerror', e => errs.push('PAGEERROR: ' + e.message));
    page.on('response', r => { peticiones++; if (r.status() >= 400) fallos.push(r.status() + ' ' + r.url()); const h = r.headers()['content-length']; if (h) bytes += +h; });
    const t0 = Date.now();
    await page.goto(URL, { waitUntil: 'networkidle2', timeout: 90000 });
    const carga = Date.now() - t0;
    await espera(2500);
    await page.screenshot({ path: `${OUT}/${vp.n}-1-hero.png` });

    const info = await page.evaluate(() => {
      const v = document.querySelector('#heroVideo');
      const q = s => document.querySelector(s);
      const top = s => q(s).getBoundingClientRect().top + scrollY;
      return {
        hero: { src: (v.currentSrc || '').split('/').pop(), t: +v.currentTime.toFixed(2), pausado: v.paused, w: v.videoWidth, h: v.videoHeight },
        docH: document.documentElement.scrollHeight,
        pos: { heroFin: q('#inicio').offsetHeight - innerHeight, tray: top('#trayecto'), nace: top('#nace'), naceH: q('#nace').offsetHeight,
               dentro: top('#dentro'), dentroH: q('#dentro').offsetHeight, reveal: top('#reveal'), catalogo: top('#catalogo'), resenas: top('#resenas'), precios: top('#precios'), fin: document.documentElement.scrollHeight - innerHeight },
        lcpCandidato: (() => { const i = q('link[rel=preload][as=image]'); return i ? i.href.split('/').pop() : null; })(),
      };
    });
    const P = info.pos;
    const paradas = [
      ['2-hero-medio', Math.round(P.heroFin * 0.5)],
      ['3-hero-fin', P.heroFin + 10],
      ['4-trayecto', P.tray + vp.h * 0.35],
      ['5-portal', P.nace - vp.h * 0.35],
      ['6-nace-25', P.nace + (P.naceH - vp.h) * 0.3],
      ['7-nace-75', P.nace + (P.naceH - vp.h) * 0.8],
      ['8-dentro-10', P.dentro + (P.dentroH - vp.h) * 0.1],
      ['9-dentro-80', P.dentro + (P.dentroH - vp.h) * 0.8],
      ['10-reveal', P.reveal - 60],
      ['11-catalogo', P.catalogo + vp.h * 0.3],
      ['12-resenas', P.resenas - vp.h * 0.2],
      ['13-cierre', P.precios - vp.h * 0.1],
      ['14-fin', P.fin],
    ];
    const puntos = [];
    await page.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; });
    const sonda = () => page.evaluate(() => {
      const q = s => document.querySelector(s);
      const tr = e => { const m = (e.style.transform || '').match(/,\s*(-?[\d.]+)px/); return m ? +(+m[1]).toFixed(1) : null; };
      return {
        y: scrollY, playerT: q('#playerT').textContent, cap: q('#playerCap').textContent, playerVisible: q('#player').classList.contains('es-visible'),
        clip: q('#heroMarco').style.clipPath.slice(0, 60), scrub: +q('#peliVideo').currentTime.toFixed(2),
        paso: [...document.querySelectorAll('.peli__paso')].findIndex(e => e.classList.contains('es-visible')),
        estado: [...document.querySelectorAll('.dentro__estado')].findIndex(e => e.classList.contains('es-visible')),
        fono: (q('.fono__cuerpo').style.transform || '').slice(0, 50),
        capas: [...document.querySelectorAll('.capa[data-prof]')].map(tr), muro: [...document.querySelectorAll('.muro__capa')].map(tr),
        portalR: q('#peliCuadro').style.getPropertyValue('--r'), disco: (q('.portal__disco').style.transform || ''),
        nav: q('#nav').className, eqVisible: q('#eq').classList.contains('es-visible'),
        peliTop: Math.round(q('#peliPista').getBoundingClientRect().top),
      };
    });
    for (const [n, y] of paradas) {
      await page.evaluate(yy => window.scrollTo(0, yy), y);
      await espera(650);
      const s = await sonda(); s.n = n; puntos.push(s);
      await page.screenshot({ path: `${OUT}/${vp.n}-${n}.png` });
    }
    // scroll hacia arriba: el scrub debe regresar y el hero recuperar su forma
    await page.evaluate(yy => window.scrollTo(0, yy), P.nace + (P.naceH - vp.h) * 0.2); await espera(600);
    const subida1 = await sonda();
    await page.evaluate(() => window.scrollTo(0, 0)); await espera(700);
    const subida2 = await sonda();
    await page.screenshot({ path: `${OUT}/${vp.n}-15-vuelta-arriba.png` });

    // reveal: puntero (escritorio) / botón
    await page.evaluate(yy => window.scrollTo(0, yy), P.reveal + 120); await espera(400);
    const lupaRect = await page.evaluate(() => { const r = document.querySelector('#lupa').getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height }; });
    if (!vp.mobile) { await page.mouse.move(lupaRect.x + lupaRect.w * 0.4, lupaRect.y + lupaRect.h * 0.5); await espera(300); }
    else { await page.touchscreen.touchStart(lupaRect.x + lupaRect.w * 0.4, lupaRect.y + lupaRect.h * 0.5); await page.touchscreen.touchMove(lupaRect.x + lupaRect.w * 0.5, lupaRect.y + lupaRect.h * 0.5); await espera(300); }
    const lupaMask = await page.evaluate(() => document.querySelector('#lupaIdeas').style.getPropertyValue('--rx'));
    await page.screenshot({ path: `${OUT}/${vp.n}-16-reveal-lupa.png` });
    await page.click('#revealBoton'); await espera(400);
    const lupaBoton = await page.evaluate(() => ({ todo: document.querySelector('#lupa').classList.contains('es-todo'), pressed: document.querySelector('#revealBoton').getAttribute('aria-pressed'), txt: document.querySelector('#revealBoton').textContent }));
    await page.screenshot({ path: `${OUT}/${vp.n}-17-reveal-todo.png` });
    await page.click('#revealBoton');

    // pausa hero
    await page.evaluate(() => window.scrollTo(0, 0)); await espera(500);
    await page.click('#heroPausa'); await espera(200);
    const pausaOk = await page.evaluate(() => document.querySelector('#heroVideo').paused && document.querySelector('#heroPausa').getAttribute('aria-pressed') === 'true');
    await page.click('#heroPausa');

    const enlaces = await page.evaluate(() => [...document.querySelectorAll('a[href^="http"],a[href^="mailto"]')].map(a => a.href));
    const tam = await page.evaluate(() => ({ html: document.documentElement.outerHTML.length }));
    res[vp.n] = { carga, peticiones, kb: Math.round(bytes / 1024), docH: info.docH, hero: info.hero, lcpCandidato: info.lcpCandidato, puntos, subida1, subida2, lupaMask, lupaBoton, pausaOk, errores: errs, fallos, enlaces: [...new Set(enlaces)] };
    await page.close();
  }
  // movimiento reducido
  const p3 = await browser.newPage();
  await p3.setViewport({ width: 1440, height: 900 });
  await p3.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  const errsR = []; p3.on('pageerror', e => errsR.push(e.message)); p3.on('console', m => { if (m.type() === 'error') errsR.push(m.text()); });
  await p3.goto(URL, { waitUntil: 'networkidle2' }); await espera(1500);
  await p3.screenshot({ path: `${OUT}/reducido-1-hero.png` });
  const yNace = await p3.evaluate(() => document.querySelector('#nace').getBoundingClientRect().top + scrollY);
  await p3.evaluate(y => window.scrollTo(0, y + 100), yNace); await espera(800);
  await p3.screenshot({ path: `${OUT}/reducido-2-nace.png` });
  res.reducido = await p3.evaluate(() => ({
    heroPausado: document.querySelector('#heroVideo').paused, heroSrc: document.querySelector('#heroVideo').currentSrc,
    pasosVisibles: [...document.querySelectorAll('.peli__paso')].filter(e => getComputedStyle(e).opacity === '1').length,
    estadosVisibles: [...document.querySelectorAll('.dentro__estado')].filter(e => getComputedStyle(e).opacity === '1').length,
    capas: [...document.querySelectorAll('.capa')].map(c => getComputedStyle(c).transform),
    player: document.querySelector('#player').classList.contains('es-visible'), clip: document.querySelector('#heroMarco').style.clipPath || 'sin-clip',
  }));
  res.reducido.errores = errsR;
  await browser.close();
  fs.writeFileSync(`${OUT}/resultado.json`, JSON.stringify(res, null, 1));
  console.log(JSON.stringify(res, null, 1));
})().catch(e => { console.error('FALLO', e); process.exit(1); });
