/* Zapienz · scrollytelling. Un solo bucle rAF, transform/opacity, sin librerías. */
(function(){
"use strict";
var $=function(s,c){return (c||document).querySelector(s)},$$=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};
var html=document.documentElement,W=window;
var reduce=W.matchMedia("(prefers-reduced-motion: reduce)").matches;
var fino=W.matchMedia("(hover: hover) and (pointer: fine)").matches;
var tacto=W.matchMedia("(hover: none)").matches;
var clamp=function(v,a,b){return v<a?a:v>b?b:v},lerp=function(a,b,t){return a+(b-a)*t};
var suave=function(t){return t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2};
var vh=W.innerHeight,vw=W.innerWidth;

/* ── referencias ─────────────────────────────────────────── */
var nav=$("#nav"),hero=$("#inicio"),pista=$(".hero__pista"),marco=$("#heroMarco"),heroV=$("#heroVideo"),foco=$("#heroFoco"),cuerpo=$("#heroCuerpo"),pausa=$("#heroPausa"),borde=$(".hero__borde"),pie=$(".hero__pie");
var tray=$("#trayecto"),capas=$$(".capa[data-prof]"),tren=$("#trenVideo"),disco=$(".portal__disco");
var peli=$("#nace"),peliCuadro=$("#peliCuadro"),peliV=$("#peliVideo"),pasos=$$(".peli__paso"),peliBarra=$("#peliBarra");
var dentro=$("#dentro"),dentroPista=$("#dentroPista"),estados=$$(".dentro__estado"),fonoImgs=$$(".fono__img"),fonoCuerpo=$(".fono__cuerpo"),fonoBrillo=$(".fono__brillo");
var lupa=$("#lupa"),ideas=$("#lupaIdeas"),revealBtn=$("#revealBoton");
var muroCapas=$$(".muro__capa[data-prof]"),catalogo=$("#catalogo");
var player=$("#player"),playerCap=$("#playerCap"),playerBarra=$("#playerBarra"),playerT=$("#playerT");
var anio=$("#anio"); if(anio) anio.textContent=new Date().getFullYear();

/* ── hero: fuente según viewport ────────────────────────── */
if(heroV){
  var alto=vh>vw&&vw<768, src=heroV.dataset.altoMp4;
  if(!alto){ src=(heroV.canPlayType("video/webm; codecs=vp9")&&heroV.dataset.anchoWebm)||heroV.dataset.anchoMp4; }
  if(alto) heroV.poster="assets/img/hero-poster-916.jpg";
  if(reduce){ heroV.removeAttribute("autoplay"); }
  else { heroV.src=src; heroV.load(); heroV.play().catch(function(){}); }
}
if(pausa&&heroV){
  pausa.addEventListener("click",function(){
    var on=pausa.getAttribute("aria-pressed")==="true";
    pausa.setAttribute("aria-pressed",on?"false":"true");
    pausa.setAttribute("aria-label",on?"Pausar el video de fondo":"Reanudar el video de fondo");
    if(on) heroV.play().catch(function(){}); else heroV.pause();
  });
}
/* entrada */
$$("[data-anim]").forEach(function(el){ el.style.setProperty("--retraso",(0.04+parseInt(el.dataset.anim,10)*0.09)+"s"); });
requestAnimationFrame(function(){ html.classList.add("cargado"); });

/* ── muro de portadas ───────────────────────────────────── */
var PORTADAS=["arte-pensar","hablame-bonito","quiet","sociedad-cansancio","factfulness","atrevete","cinco-segundos","cerebro-manda","mujeres-poder","aprende-rapido","minimalismo","tiende-cama","pensamiento-lateral","bullshit-jobs","buena-suerte","tercera-ola"];
var FILAS={a:[0,6],b:[6,11],c:[11,16]};
$$(".muro__fila").forEach(function(f){
  var r=FILAS[f.dataset.fila]||[0,16],lista=PORTADAS.slice(r[0],r[1]),h="";
  lista.concat(lista).forEach(function(n){ h+='<img src="assets/portadas/'+n+'.webp" width="150" height="225" alt="" loading="lazy" decoding="async">'; });
  f.innerHTML=h;
});

/* ── ecualizador de categorías ──────────────────────────── */
var cols=$$(".eq__col");
(function(){
  var max=0; cols.forEach(function(c){ max=Math.max(max,+c.dataset.n||0); });
  cols.forEach(function(c,i){
    c.style.setProperty("--h",Math.max(8,Math.round((+c.dataset.n/max)*100))+"%");
    c.style.setProperty("--i",i);
    c.addEventListener("click",function(){
      var ya=c.classList.contains("es-activo");
      cols.forEach(function(o){ o.classList.remove("es-activo"); });
      if(!ya) c.classList.add("es-activo");
    });
  });
})();

/* ── revelados por líneas ───────────────────────────────── */
$$("[data-lineas]").forEach(function(el){
  var spans=$$(":scope > span",el);
  if(!spans.length){ el.innerHTML="<span><i>"+el.innerHTML+"</i></span>"; }
  else spans.forEach(function(s){ s.innerHTML="<i>"+s.innerHTML+"</i>"; });
});

/* ── contadores ─────────────────────────────────────────── */
function contar(el){
  var fin=+el.dataset.contar,t0=performance.now(),dur=1400;
  if(reduce){ el.textContent=fin; return; }
  (function paso(t){
    var p=clamp((t-t0)/dur,0,1),e=1-Math.pow(1-p,3);
    el.textContent=Math.round(fin*e);
    if(p<1) requestAnimationFrame(paso);
  })(t0);
}

/* ── IntersectionObserver: reveals, líneas, videos ─────── */
var io=new IntersectionObserver(function(es){
  es.forEach(function(e){
    var el=e.target;
    if(e.isIntersecting){
      el.classList.add("es-visible");
      $$("[data-contar]",el).concat(el.dataset.contar?[el]:[]).forEach(function(c){ if(!c.dataset.ok){ c.dataset.ok=1; contar(c); } });
      io.unobserve(el);
    }
  });
},{rootMargin:"0px 0px -12% 0px",threshold:.15});
$$(".rev,[data-lineas]").forEach(function(el){
  if(el.dataset.esc) el.style.setProperty("--retraso",((+el.dataset.esc-1)*0.12)+"s");
  io.observe(el);
});
/* videos: solo corren en pantalla */
var ioV=new IntersectionObserver(function(es){
  es.forEach(function(e){
    var v=e.target;
    if(reduce) return;
    if(e.isIntersecting){ if(v!==heroV||pausa.getAttribute("aria-pressed")!=="true") v.play().catch(function(){}); }
    else v.pause();
  });
},{threshold:.05});
if(heroV) ioV.observe(heroV);
/* los videos de los capítulos 1 y 2 se piden cuando el hero empieza a contraerse */
var videosPedidos=false;
function pedirVideos(){
  if(videosPedidos||reduce) return; videosPedidos=true;
  if(tren){ tren.src="assets/video/tren.mp4"; tren.load(); ioV.observe(tren); }
  if(peliV){ peliV.src="assets/video/scroll-zap.mp4"; peliV.load(); peliV.pause(); }
}

/* ── scrub del video (una búsqueda a la vez) ───────────── */
var buscando=false,pendiente=-1,ultimoT=-1;
function buscar(t){
  if(!peliV||!peliV.duration) return;
  if(Math.abs(t-ultimoT)<0.02) return;
  if(buscando){ pendiente=t; return; }
  buscando=true; ultimoT=t; peliV.currentTime=t;
}
if(peliV){
  peliV.addEventListener("seeked",function(){
    buscando=false;
    if(pendiente>=0){ var t=pendiente; pendiente=-1; buscar(t); }
  });
  peliV.addEventListener("loadedmetadata",function(){ sucio=true; });
}

/* ── capítulos del reproductor ──────────────────────────── */
var CAPS=[["inicio","Un libro entero, en lo que dura el camino"],["trayecto","Capítulo 1 · El trayecto"],["nace","Capítulo 2 · Nace un Zap"],["dentro","Capítulo 3 · Por dentro"],["reveal","Capítulo 3 · Trescientas páginas"],["catalogo","Capítulo 4 · Diez categorías"],["resenas","Capítulo 5 · Dos reseñas"],["precios","Capítulo 6 · Empieza gratis"],["contacto","Fin del trayecto"]];
var caps=CAPS.map(function(c){ return {el:document.getElementById(c[0]),t:c[1],id:c[0]}; }).filter(function(c){ return c.el; });
var navLinks=$$(".nav__links a");
var capActual="";

/* ── bucle de pintado ──────────────────────────────────── */
var sucio=true,sy=0,docH=1,playerVivo=false;
function medir(){ vh=W.innerHeight; vw=W.innerWidth; docH=html.scrollHeight-vh; sucio=true; }
W.addEventListener("scroll",function(){ sucio=true; },{passive:true});
W.addEventListener("resize",medir,{passive:true});
W.addEventListener("load",medir);
if(W.ResizeObserver){ new ResizeObserver(medir).observe(document.body); }

function pintar(){
  if(sucio){
    sucio=false; sy=W.pageYOffset;
    pintarHero(); pintarTrayecto(); pintarPeli(); pintarDentro(); pintarMuro(); pintarPlayer();
  }
  pintarPuntero();
  requestAnimationFrame(pintar);
}

function pintarHero(){
  if(!hero||!marco) return;
  if(nav) nav.classList.toggle("es-solido",sy>40);
  if(reduce){ if(!playerVivo){ playerVivo=true; player.classList.add("es-visible"); } return; }
  var h=pista.offsetHeight,rango=hero.offsetHeight-h,p=clamp(sy/rango,0,1),e=suave(p);
  if(p>.15) pedirVideos();
  if(p>=1&&marco.dataset.fin==="1") return;
  marco.dataset.fin=p>=1?"1":"0";
  /* la onda se encoge hasta ser el mini-reproductor */
  var pw=Math.min(560,vw-28),ph=vw<=600?54:64;
  var top=lerp(0,h-ph-14,e),bottom=lerp(0,14,e),lado=lerp(0,(vw-pw)/2,e),r=lerp(0,32,clamp(e*2,0,1));
  marco.style.clipPath="inset("+top.toFixed(1)+"px "+lado.toFixed(1)+"px "+bottom.toFixed(1)+"px "+lado.toFixed(1)+"px round "+r.toFixed(1)+"px)";
  marco.style.opacity=p>.86?String(clamp(1-(p-.86)/.12,0,1)):"1";
  if(borde) borde.style.opacity=clamp(e*2,0,1);
  if(cuerpo){ var cp=clamp((p-.12)/.45,0,1); cuerpo.style.opacity=1-cp; cuerpo.style.transform="translateY("+(-cp*80).toFixed(1)+"px)"; }
  if(pie) pie.style.opacity=clamp(1-p/.2,0,1);
  if(heroV) heroV.style.transform="scale("+lerp(1.06,1,e).toFixed(3)+")";
  var vivo=p>.78;
  if(vivo!==playerVivo){ playerVivo=vivo; player.classList.toggle("es-visible",vivo); player.classList.toggle("es-vivo",vivo); }
}

function pintarTrayecto(){
  if(!tray) return;
  var r=tray.getBoundingClientRect();
  if(r.bottom<-vh*2.5||r.top>vh*1.5) return;
  if(!reduce&&r.bottom>-vh*.5){
    var c=(r.top+r.height/2-vh/2);
    capas.forEach(function(k){ k.style.transform="translate3d(0,"+(-c*+k.dataset.prof).toFixed(1)+"px,0)"; });
  }
  /* portal: el play crece hasta cubrir la pantalla y abre el capítulo 3 */
  if(disco&&peliCuadro){
    var t=clamp(1-r.bottom/(vh*.6),0,1);
    if(reduce) t=1;
    var rad=t*vh*1.6,esc=Math.max(1,rad/60);
    disco.style.transform="scale("+esc.toFixed(2)+")";
    disco.style.opacity=t<.3?"1":String(clamp(1-(t-.3)/.35,0,1));
    disco.style.visibility=t>=.8?"hidden":"visible";
    peliCuadro.style.setProperty("--r",rad.toFixed(0)+"px");
  }
}

var pasoActual=-1;
function pintarPeli(){
  if(!peli) return;
  var r=peli.getBoundingClientRect(),rango=r.height-vh;
  if(r.bottom<0||r.top>vh) return;
  var p=clamp(-r.top/rango,0,1);
  if(!reduce&&peliV&&peliV.duration){
    var d=peliV.duration-.05,t;
    if(tacto){ var k=clamp(Math.floor(p*4),0,3); t=(k+.5)/4*d; }
    else t=p*d;
    buscar(t);
  }
  if(peliBarra) peliBarra.style.transform="scaleX("+p.toFixed(3)+")";
  var k2=Math.min(3,Math.floor(p*4));
  if(k2!==pasoActual){ pasoActual=k2; pasos.forEach(function(el,i){ el.classList.toggle("es-visible",i===k2); }); }
}

var estadoActual=-1,tilt={x:0,y:0,tx:0,ty:0,base:[-14,6,.9]};
function fonoPintar(){
  fonoCuerpo.style.transform="rotateY("+(tilt.base[0]+tilt.x).toFixed(2)+"deg) rotateX("+(tilt.base[1]+tilt.y).toFixed(2)+"deg) scale("+tilt.base[2].toFixed(3)+")";
}
function pintarDentro(){
  if(!dentro) return;
  var r=dentro.getBoundingClientRect(),rango=r.height-vh;
  if(r.bottom<0||r.top>vh) return;
  var p=clamp(-r.top/rango,0,1),k=Math.min(2,Math.floor(p*3));
  if(k!==estadoActual){
    estadoActual=k;
    estados.forEach(function(el,i){ el.classList.toggle("es-visible",i===k); });
    fonoImgs.forEach(function(el,i){ el.classList.toggle("es-visible",i===k); });
  }
  if(fonoCuerpo&&!reduce){
    var e=suave(clamp(p/.45,0,1));
    tilt.base=[lerp(-14,0,e),lerp(6,0,e),lerp(.9,1,e)];
    fonoPintar();
  }
}

function pintarMuro(){
  if(!catalogo||reduce) return;
  var r=catalogo.getBoundingClientRect();
  if(r.bottom<0||r.top>vh) return;
  var c=(r.top+r.height/2-vh/2);
  muroCapas.forEach(function(k){ k.style.transform="translate3d(0,"+(-c*+k.dataset.prof).toFixed(1)+"px,0)"; });
}

function pintarPlayer(){
  if(!player) return;
  var p=clamp(sy/docH,0,1),seg=Math.round(p*1200),m=Math.floor(seg/60),s=seg%60;
  playerT.textContent=(m<10?"0":"")+m+":"+(s<10?"0":"")+s;
  playerBarra.style.transform="scaleX("+p.toFixed(4)+")";
  var cap=caps[0],linea=sy+vh*.45;
  for(var i=0;i<caps.length;i++){ if(caps[i].el.offsetTop<=linea) cap=caps[i]; }
  if(cap&&cap.t!==capActual){
    capActual=cap.t; playerCap.textContent=cap.t;
    navLinks.forEach(function(a){ a.classList.toggle("es-activo",a.getAttribute("href")==="#"+cap.id); });
    if(nav) nav.classList.toggle("es-papel",cap.id==="dentro"||cap.id==="reveal");
  }
}

/* ── puntero: foco del hero, tilt del teléfono, imanes, halos ── */
var pm={x:vw/2,y:vh*.45,tx:vw/2,ty:vh*.45,vivo:false};
if(fino&&!reduce&&pista&&foco){
  pista.addEventListener("pointermove",function(e){ pm.tx=e.clientX; pm.ty=e.clientY; if(!pm.vivo){ pm.vivo=true; foco.classList.add("es-vivo"); } });
  pista.addEventListener("pointerleave",function(){ pm.vivo=false; foco.classList.remove("es-vivo"); });
}
var imanes=$$("[data-iman]"),halos=$$("[data-halo]");
if(fino&&!reduce){
  imanes.forEach(function(b){
    b.addEventListener("pointermove",function(e){
      var r=b.getBoundingClientRect(),dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height/2);
      b.style.transform="translate("+(dx*.22).toFixed(1)+"px,"+(dy*.28).toFixed(1)+"px)";
    });
    b.addEventListener("pointerleave",function(){ b.style.transform=""; });
  });
  halos.forEach(function(c){
    c.addEventListener("pointermove",function(e){
      var r=c.getBoundingClientRect();
      c.style.setProperty("--hx",(e.clientX-r.left)+"px"); c.style.setProperty("--hy",(e.clientY-r.top)+"px");
      c.classList.add("es-halo");
    });
    c.addEventListener("pointerleave",function(){ c.classList.remove("es-halo"); });
  });
  if(dentroPista&&fonoCuerpo){
    dentroPista.addEventListener("pointermove",function(e){
      var r=dentroPista.getBoundingClientRect();
      tilt.tx=((e.clientX-r.left)/r.width-.5)*10; tilt.ty=-((e.clientY-r.top)/r.height-.5)*8;
      if(fonoBrillo){ var f=fonoCuerpo.getBoundingClientRect(); fonoBrillo.style.setProperty("--gx",(e.clientX-f.left)+"px"); fonoBrillo.style.setProperty("--gy",(e.clientY-f.top)+"px"); }
    });
    dentroPista.addEventListener("pointerleave",function(){ tilt.tx=0; tilt.ty=0; });
  }
}
function pintarPuntero(){
  if(reduce) return;
  if(pm.vivo&&foco){
    pm.x=lerp(pm.x,pm.tx,.09); pm.y=lerp(pm.y,pm.ty,.09);
    foco.style.setProperty("--mx",pm.x.toFixed(0)+"px"); foco.style.setProperty("--my",pm.y.toFixed(0)+"px");
  }
  if(fonoCuerpo&&(Math.abs(tilt.x-tilt.tx)>.01||Math.abs(tilt.y-tilt.ty)>.01)){
    tilt.x=lerp(tilt.x,tilt.tx,.08); tilt.y=lerp(tilt.y,tilt.ty,.08);
    fonoPintar();
  }
}

/* ── mouse reveal: 300 páginas → ideas (cursor · dedo · teclado) ── */
if(lupa&&ideas){
  var poner=function(x,y){ ideas.style.setProperty("--rx",x+"px"); ideas.style.setProperty("--ry",y+"px"); };
  var quitar=function(){ if(!lupa.classList.contains("es-todo")) poner(-999,-999); };
  var arrastrando=false;
  lupa.addEventListener("pointermove",function(e){
    if(e.pointerType==="touch"&&!arrastrando) return;
    var r=lupa.getBoundingClientRect(); poner(e.clientX-r.left,e.clientY-r.top);
  });
  lupa.addEventListener("pointerdown",function(e){ arrastrando=true; var r=lupa.getBoundingClientRect(); poner(e.clientX-r.left,e.clientY-r.top); });
  lupa.addEventListener("pointerup",function(){ arrastrando=false; });
  lupa.addEventListener("pointercancel",function(){ arrastrando=false; });
  lupa.addEventListener("pointerleave",function(){ arrastrando=false; quitar(); });
  /* teclado: al enfocar aparece la lupa al centro; flechas la mueven */
  var kx=0,ky=0;
  lupa.addEventListener("focus",function(){ kx=lupa.clientWidth/2; ky=lupa.clientHeight/2; poner(kx,ky); });
  lupa.addEventListener("blur",quitar);
  lupa.addEventListener("keydown",function(e){
    var d={ArrowLeft:[-48,0],ArrowRight:[48,0],ArrowUp:[0,-48],ArrowDown:[0,48]}[e.key];
    if(!d) return; e.preventDefault();
    kx=clamp(kx+d[0],0,lupa.clientWidth); ky=clamp(ky+d[1],0,lupa.clientHeight); poner(kx,ky);
  });
  if(revealBtn){
    revealBtn.addEventListener("click",function(){
      var on=!lupa.classList.contains("es-todo");
      lupa.classList.toggle("es-todo",on);
      revealBtn.setAttribute("aria-pressed",on?"true":"false");
      revealBtn.textContent=on?"Volver a la página":"Mostrar todas las ideas";
      ideas.setAttribute("aria-hidden",on?"false":"true");
      if(!on) poner(-999,-999);
    });
  }
}

medir();
requestAnimationFrame(pintar);
})();
