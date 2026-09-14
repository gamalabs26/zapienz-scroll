# Zapienz · sitio scrollytelling — concepto y coreografía (14-sep-2026)

## 1. Investigación (fuentes abiertas hoy)
- Base de producción Supabase `zapienz` (14-sep): **303 Zaps publicados** de 311; duración promedio **20 min**, rango **14–24**; **1,818 secciones, todas con audio**; 10 categorías (109/34/33/31/26/17/17/15/11/10).
- App Store MX (`itunes.apple.com/lookup`, 14-sep): v1.3 del 11-jun-2026, gratis con compras, 3 calificaciones 5.0, seller Gustavo Mier, sellerUrl `zapienz-dot.github.io/legal/`. Dos reseñas con texto (citadas literales en el sitio anterior; se reusan tal cual).
- Sitio vivo `zapienz.gamalabs.mx`: datos desactualizados (305 Zaps, 18 valoraciones, botón Google Play roto). NO se toma como fuente de cifras.
- Instagram @zapienz_latam: 3 seguidores, bio con "500+ Zaps" (falso). Solo se enlaza.
- Google Play: 404 (verificado 12-sep en cuatro package IDs). **Sin botón de Android.**
- Marca: ícono = una **Z hecha de barras de ecualizador**, azul noche `#0E2453` + verde `#4AB472` (medido en el ícono). Brand DNA tentativo (7-sep): arquetipo *sabio práctico*; tipos Instrument Serif + Manrope + IBM Plex Mono.
- Regla dura: **prohibida la palabra "resumen"** en cualquier forma.
- Activos reales: clips propios de 12-sep (Seedance hero 16:9 1080p, Kling 9:16, Kling "scroll-zap" 7.75 s 24 fps), 16 portadas ilustradas del catálogo, 2 capturas reales de la app, símbolo SVG.

## 2. Referencias
- **A · Composición y dirección de arte:** brief *Lithos — spotlight reveal* (motionsites, catálogo local, prompt gratuito): jerarquía de hero con serif itálica + sans, bloque de texto abajo-izquierda, CTA píldora. Se toma la estructura de capas y el mecanismo de máscara radial por canvas; se descarta la paleta (naranja) y las fuentes por defecto.
- **B · Scrollytelling y transiciones:** 21st.dev *Scroll media expansion hero* (@arunachalam, MIT) y *Container Scroll Animation* (@manuarora700): el medio que se contrae/expande y el panel que rota en 3D con el scroll. No se pudo leer el código (requiere API key); se reimplementa la mecánica en vanilla JS.
- **C · Interacción:** 21st.dev *Spotlight Card* (@jahed) para el halo que sigue al puntero sobre tarjetas, y el propio sitio ganador `zapienz-latam` (12-sep) para el scrub de video por scroll con gate táctil.
- Vara de calidad: Apple product pages (pinned scrub), Linear (tipografía), páginas de Blinkist/Headway como competidores (dirección contraria: ellos ilustración plana; nosotros libro y luz fotorreales).

## 3. Tres direcciones
| | A · El libro que se vuelve onda | **B · El trayecto de 20 minutos** | C · La Z ecualizador |
|---|---|---|---|
| Idea central | Un libro físico se disuelve en sonido | Un libro entero cabe en un trayecto: la página ES un reproductor de 20:00 | La marca como instrumento: barras que reaccionan |
| Universo | Estudio oscuro, papel, luz volumétrica | Tren al amanecer, azul noche, verde de pantalla | Abstracto, neón, gráfico |
| Protagonista | El libro | **El reproductor del Zap** (línea de tiempo + onda) | El logotipo |
| Transición memorable | Páginas → partículas → onda | **La onda del hero se encoge hasta ser el mini-reproductor que te acompaña toda la página** | Barras que crecen y se vuelven columnas del catálogo |
| Interacción | Linterna sobre el libro | **Scrub del video con el scroll; reveal 300 páginas → ideas clave** | Barras que siguen el cursor |
| Conversión | CTA al final del video | **El reproductor llega a 20:00 justo en el CTA final** | CTA en el logo |

**Elegida: B**, absorbiendo la materia visual de A (los clips reales del libro). Es la única que nace de la promesa verbal de la marca ("en lo que dura el camino"), da un hilo conductor medible (00:00 → 20:00 con el scroll), ordena la conversión (el Zap "termina" en el CTA) y es viable con los activos reales. Prueba del logo tapado: un reproductor que dura exactamente lo que dura un Zap y una Z-ecualizador que late con el progreso no le sirven a Blinkist ni a 12min.

## 4. Sistema visual
- Paleta: noche `#0E2453` / noche profunda `#07142E` / verde `#4AB472` (acción y dato vivo) / verde luz `#8FF0B4` (solo brillo) / papel `#F3EEE3` / tinta `#101A33`.
- Tipos: **Instrument Serif** (display, itálica para el énfasis), **Manrope** (cuerpo), **IBM Plex Mono** (tiempos, cifras).
- Motivo: barras de ecualizador con esquinas redondeadas (del ícono) — en el logo, en el reproductor y en el catálogo.
- Luz: volumétrica azul + puntos verdes; grano fino.
- Ritmo: impacto (hero) → lectura (trayecto) → exploración fijada (nace un Zap) → exploración fijada (por dentro) → catálogo → prueba → cierre.

## 5. Coreografía
| Escena | Propósito | Tramo | Estado inicial | Transformación (scroll) | Estado final / enlace | Móvil |
|---|---|---|---|---|---|---|
| 1 Hero | Promesa + CTA | 0–130 vh | Video libro→onda a sangre, titular, CTA, foco que sigue el puntero | El cuadro del video se **contrae por máscara** (inset + radio) hasta una tarjeta; la onda se encoge y aparece el **mini-reproductor** fijo en 00:00 | Tarjeta de video flota sobre fondo noche del cap. 2 (elemento compartido) | Sin foco; contracción más corta (80 vh) |
| 2 Trayecto | Contexto/necesidad | ~120 vh | Tipografía grande "Compraste el libro…", clip ambiente del tren (parallax 3 capas) | Revelado por líneas; cifras que cuentan; el reproductor avanza a 03:00 | Botón "play" central crece (**expansión de máscara**) hasta cubrir la pantalla → cap. 3 | Flujo normal; clip pausado, póster |
| 3 Nace un Zap | Solución/proceso · **fijada** | 400 vh | Video `scroll-zap` pinneado, paso 0 | 4 estados: el scroll manda `currentTime`; texto de cada paso entra/sale; barra de progreso | Se libera; la luz del video cae a papel (**cambio de fondo y luz**) | Pin 260 vh; video salta por paso (gate táctil) |
| 4 Por dentro | Producto · **fijada** | 300 vh | Teléfono con captura real (inicio), inclinado 12° | 3 estados: inicio → ficha/escuchar → lectura; el teléfono se endereza y se acerca (cambio de plano) | Se libera. Al lado: **mouse reveal** "300 páginas → 7 aprendizajes" (toque: arrastrar; teclado: botón) | Pin 200 vh, teléfono centrado; reveal con dedo |
| 5 Catálogo | Explorar oferta | ~150 vh | Muro de portadas reales en 3 profundidades | Parallax; 10 categorías como barras de ecualizador con conteos reales, se levantan bajo el puntero/tap | Reproductor en 15:00 | Grid 2 col, parallax reducido |
| 6 Reseñas | Evidencia | 100 vh | Dos tarjetas | Tarjetas superpuestas entran con profundidad; halo de puntero | CTA después de la prueba | Apiladas |
| 7 Cierre | Conversión | 100 vh | Planes + CTA final | El reproductor llega a **20:00** y la Z-ecualizador se completa | Footer | Igual |

Animaciones **de entrada**: titular hero (blur-rise), revelados por línea. **Continuas**: video hero, barras del reproductor, grano. **Por scroll**: contracción del hero, expansión de máscara, scrub del video, estados del teléfono, parallax, tiempo del reproductor. **Puntero/toque/teclado**: foco del hero, tilt del teléfono, spotlight reveal (drag / botón), barras del catálogo (hover / tap), imán en 2 CTA, halo en tarjetas.

## 6. Momento distintivo
"La página es un Zap de 20 minutos: el reproductor arranca en el hero, avanza con tu scroll y llega a 20:00 justo cuando toca descargar." Dentro de él, la secuencia fijada donde el scroll abre el libro y lo convierte en voz.
