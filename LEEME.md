# Zapienz · sitio scrollytelling — procedencia (14-sep-2026)

Sitio de una página, vanilla HTML/CSS/JS, sin librerías. Construido como preview en
GitHub Pages (`https://gamalabs26.github.io/zapienz-scroll/`); NO toca `zapienz.gamalabs.mx`.
Concepto, referencias y coreografía: `_brief/CONCEPTO.md`.

## De dónde salió cada cifra
| Cifra en el sitio | Fuente | Fecha |
|---|---|---|
| 303 Zaps publicados | Supabase producción `zapienz`, consulta directa (303 de 311 filas, estado publicado) | 14-sep-2026 |
| 20 min de promedio, rango 14–24 | Supabase, promedio y min/max de duración de los Zaps publicados | 14-sep-2026 |
| 10 categorías con conteos 109/34/33/31/26/17/17/15/11/10 | Supabase, conteo por categoría | 14-sep-2026 |
| 1,818 secciones con audio (solo en el brief, no en el sitio) | Supabase | 14-sep-2026 |
| "seis secciones, saltos de diez segundos, velocidad a tu gusto" | Captura real `assets/app/lectura.webp` (versión 1.3) | 12-sep-2026 |
| Dos reseñas ("Lo recomiendo !", "Me encantó la app") | App Store México, `itunes.apple.com/lookup?id=6762142820`; texto literal, fragmentos | 14-sep-2026 |
| Planes: "Con créditos" y "Premium" (sin precios) | Ficha de App Store (gratis con compras dentro de la app). No se publican precios porque no están confirmados por el cliente | 14-sep-2026 |
| Versión 1.3 · 11-jun-2026 | App Store lookup | 14-sep-2026 |

Lo que se omitió y por qué: botón de Google Play (404 en cuatro package IDs, verificado 12-sep);
"500+ Zaps" de la bio de Instagram (falso); "18 valoraciones" del sitio actual (desactualizado);
una tercera reseña (no existe). La palabra vetada por el equipo legal (la que describe un libro condensado) no aparece en ningún archivo del sitio.

## Activos
| Archivo | Origen | Costo |
|---|---|---|
| `assets/video/hero-169.mp4/.webm`, `hero-916.mp4`, `scroll-zap.mp4` | Clips propios generados el 12-sep-2026 (Seedance / Kling) para `zapienz-latam`, reusados | $0 (ya pagados) |
| `assets/video/tren.mp4` + `assets/img/tren-poster.jpg` | Seedance 2.0, task `cgt-20260915044525-sf9pz`, 14-sep-2026; 1920x1080 → 1280x720 H.264 CRF 27 sin audio (551 KB). Frames revisados en `_tmp/tren-grid.jpg.md` | ≈ 1.26 USD |
| `assets/portadas/*.webp` (16) | Portadas ilustradas reales del catálogo de la app | $0 |
| `assets/app/home.webp`, `lectura.webp` | Capturas reales de la app v1.3 | $0 |
| `assets/img/hero-poster*.jpg`, `scroll-poster.jpg` | Cuadros extraídos de los clips | $0 |
| `assets/img/og.jpg` | Compuesta en HTML (`_tmp/og.html`) y capturada con Chrome headless, 1200x630 | $0 |
| `assets/brand/zapienz-mark.svg`, `favicon.svg`, `icon-180.png` | Símbolo Z-ecualizador derivado del ícono real de la app | $0 |
| Tipografías | Google Fonts: Instrument Serif, Manrope, IBM Plex Mono (tercero) | $0 |

## Peso del código
HTML 26.2 KB · CSS 29.5 KB · JS 17.0 KB (techo de referencia 25/30/15: el HTML y el JS lo pasan por poco;
el JS trae el reproductor, el reveal con tres modos de entrada y el scrub, cada uno con su renta).

## Verificación
`node _servidor.js` (puerto 4321, con Range) + `NODE_PATH=/c/ClaudeCode/node_modules node _verifica.js <url> <carpeta>`:
1440x900, 768x1024 (touch), 390x844 (touch) y `prefers-reduced-motion`. Mide errores de consola,
respuestas ≥400, scrub del video en 4 tramos, pasos/estados fijados, parallax, portal, tiempo del
reproductor, reveal (puntero, dedo, botón), pausa del hero, vuelta arriba, y saca capturas.
Nota: la emulación móvil de Chrome headless infla `innerHeight` al hacer scroll, por eso el reproductor
no llega a 20:00 en esa emulación; en navegador real sí (ver verificación en vivo en la entrega).

## Enlaces publicados (todos abiertos antes de publicar)
App Store `apps.apple.com/mx/app/zapienz/id6762142820` (y `?action=write-review`), Instagram
`@zapienz_latam`, legales en `zapienz-dot.github.io/legal/` (privacy-policy, terms, support),
correo `contactozapienz@gmail.com`.
