// ✏️ CAMBIA TU WHATSAPP (indicativo + número, sin + ni espacios). Ej: 573001234567
const CONFIG = { whatsapp: "573013888453" };
const TRM = 3500; //precio del dolar en pesos colombianos (COP) para mostrar el precio en USD

// 📷 Fotos: guarda cada una en /images con el id del producto. Ej: images/classic.PNG
// c = categoría · p = precio público 2026 en COP · q/u = cantidad y unidad (textos en i18n/*.js)
const P = [
  {id:"3en1",n:"GanoCafé 3en1",c:"cafe",p:147900,q:20,u:"sobres"},
 {id:"classic",n:"GanoCafé Classic",c:"cafe",p:147900,q:30,u:"sobres"},
 {id:"shockolade",n:"GanoShockolade",c:"bebidas",p:166500,q:20,u:"sobres"},
 {id:"shokorico",n:"GanoRico ShokoRico",c:"bebidas",p:166500,q:20,u:"sobres"},
 {id:"latte",n:"GanoRico Latte",c:"cafe",p:156900,q:20,u:"sobres"},
 {id:"mocha",n:"GanoRico Mocha",c:"cafe",p:156900,q:20,u:"sobres"},
 {id:"rooibos",n:"GanoRooibos",c:"bebidas",p:156900,q:20,u:"sobres"},
 {id:"creal",n:"GanoC’real",c:"bebidas",p:156900,q:15,u:"sobres"},
 {id:"ganoderma",n:"Ganoderma",c:"suplementos",p:332500,dq:90,u:"caps"},
 {id:"excellium",n:"Excellium",c:"suplementos",p:332500,dq:90,u:"caps"},
 {id:"cordygold",n:"CordyGold",c:"suplementos",p:424500,dq:60,u:"caps"},
 {id:"reskine",n:"Reskine Collagen",c:"belleza",p:276900,q:10,u:"sach"},
 {id:"fresh",n:"GanoFresh",c:"belleza",p:96900,},
 {id:"soap",n:"GanoSoap",c:"belleza",p:101500,},
 {id:"soapcabra",n:"GanoSoap",c:"belleza",p:96900,},
 {id:"exfoliante",n:"Piel&Brillo",c:"belleza",p:96900,},
 {id:"shampoo",n:"Piel&Brillo",c:"belleza",p:96900,},
 {id:"acondicionador",n:"Piel&Brillo",c:"belleza",p:96900,},
 {id:"luvoco",n:"Luvoco",c:"cafe",p:147900,q:15,u:"pods"},
];
const CATS = ["cafe","bebidas","suplementos","belleza"];
const LOCALE = {es:"es-CO", en:"en-US", pt:"pt-BR"};
const $ = s => document.querySelector(s);
const li = a => a.map(x => `<li>${x}</li>`).join("");

let lang = "es", cat = "todos";
try { lang = localStorage.getItem("lang") || ""; } catch(e) {}
if (!I18N[lang]) lang = (navigator.language || "es").slice(0,2);
if (!I18N[lang]) lang = "es";

function datos(p){
  const U = I18N[lang].ui, t = I18N[lang].p[p.id], nombre = t.n || p.n;
  return {U, t, nombre,
    cant: p.q ? ` · ${p.q} ${U.u[p.u]}` : "",
    precio: `$${p.p.toLocaleString(LOCALE[lang])} COP`,
    dolares: Math.round(p.p / TRM).toLocaleString('en-US', {style: 'currency', currency: 'USD'}) + ' USD',
    wa: `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(U.wamsg + " " + nombre)}`,
    foto: `<span>${nombre}<br>${U.foto}</span><img src="images/${p.id}.png" alt="${nombre}" onerror="this.remove()">`};
}

function pintar(){
  const U = I18N[lang].ui;
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-i18n]").forEach(el => el.textContent = U[el.dataset.i18n]);
  $("#lang").innerHTML = Object.keys(I18N).map(k => `<button data-l="${k}" aria-pressed="${k===lang}">${k.toUpperCase()}</button>`).join("");
  $("#filtros").innerHTML = ["todos",...CATS].map(k => `<button data-k="${k}" aria-pressed="${k===cat}">${U.cat[k]}</button>`).join("");
  $("#grid").innerHTML = P.filter(p => cat==="todos" || p.c===cat).map(p => {
    const d = datos(p);
    return `<article class="card">
      <button class="foto" data-m="${p.id}" aria-label="${U.mas}: ${d.nombre}">${d.foto}</button>
      <div class="info">
        <div><h2>${d.nombre}</h2><p class="desc">${d.t.d}${d.cant}</p></div>
        <p class="precio">${d.precio} <small>· ${d.dolares}</small></p>
        <div><h3>${U.beneficios}</h3><ul>${li(d.t.b)}</ul></div>
        <div class="ideal"><h3>${U.ideal}</h3><ul>${li(d.t.i)}</ul></div>
        <div class="acciones">
          <button class="mas" data-m="${p.id}">${U.mas}</button>
          <a class="btn" target="_blank" rel="noopener" href="${d.wa}">${U.wa}</a>
        </div>
      </div></article>`;
  }).join("");
}

function abrir(id){
  const p = P.find(x => x.id === id), d = datos(p), U = d.U;
  $("#modal").innerHTML = `<button class="cerrar" data-x aria-label="${U.cerrar}">×</button>
    <div class="mgrid">
      <div class="foto grande">${d.foto}</div>
      <div class="minfo">
        <div><h2>${d.nombre}</h2><p class="desc">${d.t.d}${d.cant}</p></div>
        <p class="precio">${d.precio} <small>· ${d.dolares}</small></p>
        <p class="largo">${d.t.m}</p>
        <div><h3>${U.detalles}</h3><ul>${li(d.t.f)}</ul></div>
        <div><h3>${U.beneficios}</h3><ul>${li(d.t.b)}</ul></div>
        <div class="ideal"><h3>${U.ideal}</h3><ul>${li(d.t.i)}</ul></div>
        <a class="btn" target="_blank" rel="noopener" href="${d.wa}">${U.wa}</a>
      </div></div>`;
  $("#modal").showModal();
}

document.addEventListener("click", e => {
  if (e.target === $("#modal")) return $("#modal").close();   // clic en el fondo oscuro
  const b = e.target.closest("button"); if (!b) return;
  if (b.dataset.l) { lang = b.dataset.l; try { localStorage.setItem("lang", lang); } catch(e) {} pintar(); }
  else if (b.dataset.k) { cat = b.dataset.k; pintar(); }
  else if (b.dataset.m) abrir(b.dataset.m);
  else if (b.hasAttribute("data-x")) $("#modal").close();
});
pintar();
