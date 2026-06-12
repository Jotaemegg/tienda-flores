/* ============================================
   FLORÈNTIA · Motor SPA (hash routing)
   ============================================ */


// --- Supabase Cliente ---
let supabaseClient = null;
if (typeof window.supabase !== 'undefined' && IS_SUPABASE_ACTIVE) {
  supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

const app = document.getElementById('app');
const navEl = document.getElementById('nav');
const modal = document.getElementById('modal');
const modalContent = document.getElementById('modalContent');

document.getElementById('year').textContent = new Date().getFullYear();

/* ---------- UTILIDADES ---------- */
const money = v => `S/ ${v.toFixed(2)}`;

const withTimeout = (promise, ms = 3000) => {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout de conexión a la base de datos')), ms))
  ]);
};

const waLink = (text) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

const waProductMsg = (p, opts = {}) => {
  const isPromo = p.badge === 'sale';
  const tipo = isPromo ? 'la promoción' : 'el producto';
  let msg = `Hola, estoy interesado(a) en ${tipo} *${p.name}*`;
  if (opts.size) msg += `\nTamaño: ${opts.size}`;
  if (opts.color) msg += `\nColor: ${opts.color}`;
  return waLink(msg);
};

/* ---------- HEADER ESTADOS ---------- */
window.addEventListener('scroll', () => {
  document.getElementById('header').classList.toggle('is-scrolled', window.scrollY > 20);
});

const navOverlay = document.getElementById('navOverlay');
const closeNav = () => {
  navEl.classList.remove('is-open');
  if (navOverlay) navOverlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
};

document.getElementById('navToggle').addEventListener('click', () => {
  navEl.classList.add('is-open');
  if (navOverlay) navOverlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
});

if (navOverlay) navOverlay.addEventListener('click', closeNav);
document.getElementById('navClose')?.addEventListener('click', closeNav);

navEl.addEventListener('click', e => {
  if (e.target.matches('.nav__link')) closeNav();
});

/* ---------- MODAL ---------- */
function openModal(html) {
  modalContent.innerHTML = html;
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
}
function closeModal() {
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
}
modal.addEventListener('click', e => {
  if (e.target.hasAttribute('data-close')) closeModal();
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

/* ---------- REVEAL ON SCROLL ---------- */
function observeReveal() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add('is-visible');
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
}

/* ============================================
   PLANTILLAS
   ============================================ */

/* -------- Tarjeta de producto -------- */
function productCard(p) {
  const hasDiscount = p.badge === 'sale' && p.price > 0 && p.oldPrice > 0;
  const badge = p.badge === 'sale'
    ? hasDiscount
      ? `<span class="product__badge product__badge--sale">-${Math.round((1 - p.price / p.oldPrice) * 100)}%</span>`
      : `<span class="product__badge product__badge--sale">Oferta</span>`
    : p.badge === 'new'
      ? `<span class="product__badge product__badge--new">Nuevo</span>`
      : p.badge === 'popular'
        ? `<span class="product__badge product__badge--new">Popular</span>`
        : '';
  return `
    <article class="product" data-id="${p.id}">
      <div class="product__media">
        ${badge}
        <div class="product__img" style="background-image:url('${p.images[0]}')"></div>
        <div class="product__quick">
          <button data-action="view" data-id="${p.id}">Ver detalle</button>
          <button data-action="wa" data-id="${p.id}">Comprar</button>
        </div>
      </div>
      <div class="product__info">
        <div class="product__cat">${(CATEGORIES.find(c => c.id === p.category) || {}).name || ''}</div>
        <h3 class="product__name">${p.name}</h3>
        <div class="product__price">
          <span class="product__price-now">${money(p.price)}</span>
          ${p.oldPrice != null && p.oldPrice > 0 ? `<span class="product__price-old">${money(p.oldPrice)}</span>` : ''}
        </div>
      </div>
    </article>
  `;
}

/* ============================================
   VIEWS
   ============================================ */

/* -------- HOME -------- */
function viewHome() {
  return `

    <!-- ① ÚNICO PLANO — Campaña Hortus Conclusus, imagen completa (Estilo Sfera) -->
    <section class="promo-main">
      <div class="promo-main__img-col">
        <img src="assets/hortus-conclusus/Hortus-Conclusus-roja.jpg"
             alt="Hortus Conclusus · VOUDÚ"
             class="promo-main__img" />
      </div>
      <div class="promo-main__overlay"></div>
      <div class="promo-main__body">
        <span class="promo-main__eyebrow">❦ LANZAMIENTO HORTUS CONCLUSUS 2026</span>
        <h2 class="promo-main__title">El jardín cerrado<br>de la pasión eterna.</h2>
        <p class="promo-main__desc">La rosa roja preservada en su máxima plenitud. Diseñada para durar años.</p>
        <a href="#/catalogo?cat=hortus" class="btn btn--ghost-hero">Ver colección →</a>
      </div>
    </section>

  `;
}

/* -------- CATÁLOGO LANDING (sin categoría seleccionada) -------- */
function viewCatalogLanding() {
  const premiumProducts = PRODUCTS.filter(p => p.premium);
  const visibleCats = CATEGORIES.filter(c => !c.hidden);

  // Bloques que NO son --full ocupan 1 columna; --full ocupa 2.
  // Para determinar si el último bloque queda solo, contamos cuántos bloques
  // normales (no --full) hay y si su cantidad es impar, el último queda suelto.
  const normalCats = visibleCats.filter(c => c.id !== 'hortus');
  const lastIsAlone = normalCats.length % 2 !== 0;

  return `
    <section class="cat-landing pt-header">
      ${visibleCats.map((c, i) => {
        const isFull = c.id === 'hortus';
        // El índice dentro de los bloques normales (no-full)
        const normalIdx = normalCats.indexOf(c);
        const isSolo = !isFull && lastIsAlone && normalIdx === normalCats.length - 1;
        const extraClass = isFull ? 'cat-land-block--full' : isSolo ? 'cat-land-block--solo' : '';
        return `
        <a href="#/catalogo?cat=${c.id}" class="cat-land-block reveal ${extraClass}" style="transition-delay:${i * 80}ms">
          <div class="cat-land-img" style="background-image:url('${c.img}')"></div>
          <div class="cat-land-label">
            <span class="cat-land-eyebrow">Colección</span>
            <h2 class="cat-land-name">${c.name}</h2>
            <span class="cat-land-cta">Ver colección →</span>
          </div>
        </a>`;
      }).join('')}
    </section>

    <!-- TARJETA PREMIUM — banner editorial que lleva a la página dedicada -->
    <a href="#/premium" class="premium-landing-card reveal">
      <div class="premium-landing-card__img" style="background-image:url('${premiumProducts[0]?.images[0] || 'assets/premium/premium-1.jpg'}')" aria-hidden="true"></div>
      <div class="premium-landing-card__overlay"></div>
      <div class="premium-landing-card__body">
        <span class="premium-landing-card__eyebrow">✦ &nbsp; Edición Exclusiva &nbsp; ✦</span>
        <h2 class="premium-landing-card__title">Premium</h2>
        <p class="premium-landing-card__desc">Cajas de lujo personalizables. Diseñadas para quienes buscan lo extraordinario.</p>
        <span class="premium-landing-card__cta">Descubrir →</span>
      </div>
    </a>
  `;
}

/* -------- PÁGINA PREMIUM -------- */
function viewPremium() {
  const premiumProducts = PRODUCTS.filter(p => p.premium);
  return `
    <!-- Cabecera de la página premium -->
    <section class="premium-head">
      <div class="premium-head__bg" style="background-image:url('${premiumProducts[0]?.images[0] || ''}')"></div>
      <div class="premium-head__overlay"></div>
      <div class="container premium-head__content">
        <a href="#/catalogo" class="catalog-back">← Colecciones</a>
        <span class="premium-head__eyebrow">✦ &nbsp; Edición Exclusiva &nbsp; ✦</span>
        <h1 class="premium-head__title">Premium</h1>
        <p class="premium-head__sub">Cajas de lujo personalizables, diseñadas pieza a pieza para quienes no se conforman con lo ordinario.</p>
      </div>
    </section>

    <!-- Grid de productos premium -->
    <section class="premium-page">
      <div class="premium-page__grid">
        ${premiumProducts.map(p => `
          <div class="prem-card reveal">
            <div class="prem-card__img-wrap">
              <div class="prem-card__img" style="background-image:url('${p.images[0]}')"></div>
            </div>
            <div class="prem-card__body">
              <h3 class="prem-card__name">${p.name}</h3>
              <p class="prem-card__desc">${p.short}</p>

              <div class="prem-card__options">

                <div class="option-group">
                  <span class="option-label">Color de caja</span>
                  <div class="option-pills">
                    <label class="option-pill"><input type="radio" name="box-${p.id}" value="Roja" checked><span>Roja</span></label>
                    <label class="option-pill"><input type="radio" name="box-${p.id}" value="Negra"><span>Negra</span></label>
                  </div>
                </div>

                <div class="option-group">
                  <span class="option-label">Chocolates</span>
                  <div class="option-pills">
                    <label class="option-pill"><input type="radio" name="choc-${p.id}" value="Sin chocolates" checked><span>Sin chocolates</span></label>
                    <label class="option-pill"><input type="radio" name="choc-${p.id}" value="Con fresas al chocolate"><span>Con fresas al chocolate</span></label>
                  </div>
                </div>

                <div class="option-group">
                  <span class="option-label">Color de rosa</span>
                  <div class="color-swatches">
                    <label class="color-swatch" title="Roja"><input type="radio" name="rose-${p.id}" value="Roja" checked><span class="swatch" style="background:#9b2335"></span></label>
                    <label class="color-swatch" title="Rosa"><input type="radio" name="rose-${p.id}" value="Rosa"><span class="swatch" style="background:#e8829a"></span></label>
                    <label class="color-swatch" title="Blanca"><input type="radio" name="rose-${p.id}" value="Blanca"><span class="swatch" style="background:#f0ece4;border:1px solid rgba(110,48,52,.3)"></span></label>
                    <label class="color-swatch" title="Lila"><input type="radio" name="rose-${p.id}" value="Lila"><span class="swatch" style="background:#9b7ebf"></span></label>
                  </div>
                </div>

              </div>

              <div class="prem-card__footer">
                <span class="prem-card__price-label">Precio a consultar</span>
                <button class="btn btn--wa" onclick="openPremiumWa('${p.id}', '${p.name}')">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor" style="flex-shrink:0"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  Comprar por WhatsApp
                </button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </section>
  `;
}

/* -------- CATÁLOGO -------- */
function viewCatalog(params) {
  const cat = params.get('cat');
  const sort = params.get('sort') || 'featured';

  // Sin categoría seleccionada → mostrar landing visual
  if (!cat) return viewCatalogLanding();

  let list = PRODUCTS.filter(p => !p.hidden && !p.premium);
  if (cat !== 'all') list = list.filter(p => p.category === cat);
  if (sort === 'price-asc') list.sort((a, b) => a.price - b.price);
  if (sort === 'price-desc') list.sort((a, b) => b.price - a.price);
  if (sort === 'sale') list.sort((a, b) => (b.badge === 'sale' ? 1 : 0) - (a.badge === 'sale' ? 1 : 0));

  const catName = cat === 'all' ? 'Todas las colecciones' : (CATEGORIES.find(c => c.id === cat)?.name || 'Catálogo');
  const catImg = cat !== 'all' ? (CATEGORIES.find(c => c.id === cat)?.img || '') : 'assets/productos sin usar/cupula-roja-1.png';

  return `
    <!-- cabecera con imagen de la categoría -->
    <section class="catalog-head catalog-head--img" style="background-image:url('${catImg}')">
      <div class="catalog-head__overlay"></div>
      <div class="container" style="position:relative;z-index:2">
        <a href="#/catalogo" class="catalog-back">← Colecciones</a>
        <h1>${catName}</h1>
      </div>
    </section>

    <section class="catalog-body">
      <div class="container">

        <!-- TOOLBAR con botón filtros -->
        <div class="catalog-toolbar">
          <span class="catalog-count">${list.length} producto${list.length !== 1 ? 's' : ''}</span>
          <div class="toolbar-right">
            <button class="btn-filters" id="filtersToggle" aria-expanded="false" aria-controls="filtersPanel">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M2 4h12M4 8h8M6 12h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
              Filtros
              <span class="btn-filters__arrow">▾</span>
            </button>
            <select data-sort class="sort-select">
              <option value="featured" ${sort === 'featured' ? 'selected' : ''}>Destacados</option>
              <option value="price-asc" ${sort === 'price-asc' ? 'selected' : ''}>Precio: menor a mayor</option>
              <option value="price-desc" ${sort === 'price-desc' ? 'selected' : ''}>Precio: mayor a menor</option>
              <option value="sale" ${sort === 'sale' ? 'selected' : ''}>Ofertas primero</option>
            </select>
          </div>
        </div>

        <!-- PANEL FILTROS desplegable -->
        <div class="filters-panel" id="filtersPanel" aria-hidden="true">
          <div class="filters-panel__inner">
            <div class="filter-col">
              <h5 class="filter-col__title">Categorías</h5>
              <div class="filter-group">
                <label><input type="radio" name="cat" value="all" ${cat === 'all' ? 'checked' : ''} data-filter> Todas</label>
                ${CATEGORIES.filter(c => !c.hidden).map(c => `
                  <label><input type="radio" name="cat" value="${c.id}" ${cat === c.id ? 'checked' : ''} data-filter> ${c.name}</label>
                `).join('')}
              </div>
            </div>
            <div class="filter-col">
              <h5 class="filter-col__title">Precio</h5>
              <div class="filter-group">
                <label><input type="checkbox"> Menos de S/ 240</label>
                <label><input type="checkbox"> S/ 240 – S/ 480</label>
                <label><input type="checkbox"> Más de S/ 480</label>
              </div>
            </div>
            <div class="filter-col">
              <h5 class="filter-col__title">Ocasión</h5>
              <div class="filter-group">
                <label><input type="checkbox"> Aniversario</label>
                <label><input type="checkbox"> San Valentín</label>
                <label><input type="checkbox"> Cumpleaños</label>
                <label><input type="checkbox"> Porque sí</label>
              </div>
            </div>
          </div>
        </div>

        <!-- GRID de productos -->
        <div class="products">
          ${list.map(productCard).join('') || `<p style="color:var(--c-muted); padding:40px 0;">No hay productos en esta categoría.</p>`}
        </div>

      </div>
    </section>
  `;
}

/* -------- DETALLE PRODUCTO -------- */
function viewProduct(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return `<section class="section"><div class="container"><h2>Producto no encontrado</h2><a href="#/catalogo" class="btn btn--ghost">Volver al catálogo</a></div></section>`;

  const related = PRODUCTS.filter(x => x.category === p.category && x.id !== p.id && !x.hidden && !x.premium).slice(0, 4);

  return `
    <section class="detail" style="padding-top: 200px; padding-bottom: 80px;">
      <div class="container">
        <div class="detail-grid">
          <div class="detail-gallery">
            <div class="detail-main" id="detailMain" style="background-image:url('${p.images[0]}')"></div>
            <div class="detail-thumbs">
              ${p.images.map((img, i) => `
                <div class="detail-thumb ${i === 0 ? 'is-active' : ''}" data-img="${img}" style="background-image:url('${img}')"></div>
              `).join('')}
            </div>
          </div>

          <div class="detail-info">
            <div class="detail-cat">${(CATEGORIES.find(c => c.id === p.category) || {}).name || ''}</div>
            <h1>${p.name}</h1>
            <p class="detail-desc">${p.short}</p>

            <div class="detail-price">
              <span class="detail-price-now">${money(p.price)}</span>
              ${p.oldPrice > 0 ? `<span class="detail-price-old">${money(p.oldPrice)}</span><span class="detail-price-save">Ahorras ${money(p.oldPrice - p.price)}</span>` : ''}
            </div>



            <div class="detail-options">
              <h4>Cantidad</h4>
              <div class="quantity">
                <button data-qty="-1">−</button>
                <span id="qty">1</span>
                <button data-qty="1">+</button>
              </div>
            </div>

            <div class="detail-cta">
              <a class="btn btn--wa" id="waBuy" href="#">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor" style="flex-shrink:0">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Comprar por WhatsApp
              </a>
              <button class="btn btn--ghost" onclick="navigator.share ? navigator.share({title:'${p.name}',url:location.href}) : navigator.clipboard.writeText(location.href).then(()=>alert('Enlace copiado'))">Compartir</button>
            </div>

            <p style="color:var(--c-muted); font-size:.88rem; margin-bottom:20px;">
              ${p.description}
            </p>

            <div class="detail-features">
              <div class="detail-feature"><span>✿</span><div><strong>+3 años de duración</strong><span>Sin agua ni mantenimiento</span></div></div>
              <div class="detail-feature"><span>✈</span><div><strong>Envío 24/48h</strong><span>Gratis desde S/ 100</span></div></div>
              <div class="detail-feature"><span>♥</span><div><strong>Hecho a mano</strong><span>Por artesanos florales</span></div></div>
              <div class="detail-feature"><span>✎</span><div><strong>Tarjeta personalizada</strong><span>${p.id.startsWith('arcadius-') ? 'Se incluye gratis' : '+S/ 5.00'}</span></div></div>
            </div>
          </div>
        </div>

        ${related.length ? `
          <div style="margin-top:110px;">
            <div class="section__head">
              <span class="section__eyebrow">También te puede gustar</span>
              <h2 class="section__title">Piezas relacionadas</h2>
            </div>
            <div class="products">
              ${related.map(productCard).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    </section>
  `;
}

/* -------- PROMOCIONES -------- */
function promoBanner(p) {
  const hasDiscount = p.price > 0 && p.oldPrice > 0;
  const colorLabel = p.colors?.length > 1
    ? p.colors.join(' · ')
    : (p.colors?.[0] || '');
  return `
    <a class="promo-banner" href="#/producto/${p.id}">
      <div class="promo-banner__img" style="background-image:url('${p.images[0]}')"></div>
      <div class="promo-banner__body">
        <span class="promo-banner__tag">
          ${hasDiscount ? `-${Math.round((1 - p.price / p.oldPrice) * 100)}% · ` : ''}Oferta
        </span>
        <h2 class="promo-banner__title">${p.name}</h2>
        <p class="promo-banner__desc">${p.short}</p>
        <div class="promo-banner__footer">
          <div class="promo-banner__price">
            ${p.price > 0 ? `<span class="promo-price-now">${money(p.price)}</span>` : ''}
            ${hasDiscount ? `<span class="promo-price-old">${money(p.oldPrice)}</span>` : ''}
          </div>
          <span class="btn btn--primary">Ver oferta →</span>
        </div>
      </div>
    </a>
  `;
}

function viewPromos() {
  return `
    <!-- Se eliminó catalog-head a petición del usuario para evitar doble header -->
    <section class="promos-page">
      <div class="container">
        <!-- Colección Hortus Conclusus -->
        <div class="latest-collection">
          <a class="promo-banner" href="#/catalogo?cat=hortus">
            <div class="promo-banner__img" style="background-image:url('assets/hortus-conclusus/Hortus-Conclusus-roja.jpg')"></div>
            <div class="promo-banner__body">
              <span class="promo-banner__tag">NUEVO</span>
              <h2 class="promo-banner__title">Hortus Conclusus</h2>
              <p class="promo-banner__desc">El jardín cerrado de la pasión eterna. La rosa preservada en su máxima plenitud, dispuesta artesanalmente en un entorno protegido que evoca el misticismo del 'jardín cerrado' medieval.</p>
              <div class="promo-banner__footer">
                <div class="promo-banner__price">
                  <span class="promo-price-now">Desde S/ 119.00</span>
                </div>
                <span class="btn btn--primary">Ver colección →</span>
              </div>
            </div>
          </a>
        </div>
      </div>
    </section>
  `;
}

/* -------- SOBRE NOSOTROS -------- */
function viewAbout() {
  return `
    <!-- MANIFIESTO — bloque de identidad de marca -->
    <section class="manifesto">
      <div class="container">
        <div class="manifesto__inner reveal">
          <span class="section__eyebrow">Manifiesto</span>
          <p class="manifesto__text">
            VOUDÚ ha llegado.<br>
            No vendemos flores; <em>diseñamos obsesiones.</em><br>
            Lo convencional se marchita. Lo nuestro es <em>eterno.</em><br>
            Nuestras rosas preservadas son el testimonio físico<br>
            de una promesa que no conoce el olvido.<br>
            Porque si vas a entrar en su mente,<br>
            <strong>asegúrate de no salir jamás.</strong>
          </p>
        </div>
      </div>
    </section>

    <!-- HISTORIA Y VALORES -->
    <section class="section">
      <div class="container about">
        <div class="about__img reveal"></div>
        <div class="reveal">
          <span class="section__eyebrow">Quiénes somos</span>
          <h2>Hecho para quien no se conforma</h2>
          <p>VOUDÚ nace de una idea incómoda: los gestos importantes merecen durar. No una semana, no un mes. <em>Años.</em> A través de un riguroso proceso de preservación natural, nuestras rosas mantienen su color, textura y carácter durante más de tres años.</p>
          <p>Trabajamos con cultivadores seleccionados, eligiendo cada rosa en su momento de máxima intensidad. Después, en nuestro taller, un equipo pequeño compone cada pieza a mano. Sin atajos. Sin prisa. Sin concesiones.</p>
          <p>Creemos en los regalos que permanecen. En las piezas que cuentan algo. En la elegancia que no necesita levantar la voz.</p>
          <p style="font-family:var(--font-display); letter-spacing:3px; color:var(--c-burgundy); text-transform:uppercase; font-size:.95rem; margin-top:28px;">Porque si vas a entrar en su mente,<br>asegúrate de no salir jamás.</p>
        </div>
      </div>
    </section>

    <!-- CIFRAS -->
    <section class="strip">
      <div class="container strip-grid">
        <div class="strip-item"><span class="ico">❦</span><strong>+- años</strong><span>De belleza intacta</span></div>
        <div class="strip-item"><span class="ico">✈</span><strong>Envío rápido</strong><span>A todo el país</span></div>
        <div class="strip-item"><span class="ico">✦</span><strong>100% artesanal</strong><span>Pieza por pieza</span></div>
        <div class="strip-item"><span class="ico">✎</span><strong>Personalizado</strong><span>Tu mensaje incluido</span></div>
      </div>
    </section>

    <!-- CONTÁCTANOS -->
    <section class="section" id="contactanos">
      <div class="container">
        <div class="about-contact reveal">
          <span class="section__eyebrow">Escríbenos</span>
          <h2 class="about-contact__title">Contáctanos</h2>
          <div class="about-contact__card">
            <p><strong>📞 Teléfono</strong><br>+51 927 599 077</p>
            <p><strong>✉ Email</strong><br>hola@voudu.com</p>
            <p><strong>⏰ Horario de atención</strong><br>Lun - Dom · 8:00 a 23:00</p>
            <a class="btn btn--wa" style="margin-top:20px;" target="_blank" rel="noopener"
               href="${waLink('Hola, me gustaría más información sobre VOUDÚ 🌹')}">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor" style="flex-shrink:0">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp directo
            </a>
          </div>
        </div>
      </div>
    </section>
  `;
}

/* ============================================
   ROUTER
   ============================================ */
function parseHash() {
  const raw = location.hash.slice(1) || '/';
  const [path, query = ''] = raw.split('?');
  return { path, params: new URLSearchParams(query) };
}

async function render() {
  const { path, params } = parseHash();
  let html = '';
  let activeNav = path;

  if (path === '/' || path === '') html = viewHome();
  else if (path === '/catalogo') html = viewCatalog(params);
  else if (path === '/premium') html = viewPremium();
  else if (path === '/promociones') html = viewPromos();
  else if (path === '/sobre-nosotros') html = viewAbout();
  else if (path === '/admin') {
    html = await viewAdmin();
    activeNav = '/admin';
  } else if (path.startsWith('/producto/')) {
    html = viewProduct(path.split('/producto/')[1]);
    activeNav = '/catalogo';
  } else {
    html = `<section class="section"><div class="container" style="text-align:center"><h2>Página no encontrada</h2><a href="#/" class="btn btn--primary">Volver al inicio</a></div></section>`;
  }

  app.innerHTML = html;
  window.scrollTo({ top: 0, behavior: 'instant' });

  // header transparente solo en home (via body.is-home)
  document.body.classList.toggle('is-home', path === '/' || path === '');

  // nav active
  document.querySelectorAll('.nav__link').forEach(a => {
    const href = a.getAttribute('href').replace('#', '');
    a.classList.toggle('is-active', href === activeNav);
  });

  bindDynamic();
  observeReveal();
}

/* ============================================
   BINDINGS DINÁMICOS
   ============================================ */
function bindDynamic() {
  // click en tarjetas de producto
  app.querySelectorAll('.product').forEach(card => {
    card.addEventListener('click', e => {
      const action = e.target.closest('[data-action]')?.dataset.action;
      const id = card.dataset.id;
      if (action === 'wa') {
        const p = PRODUCTS.find(x => x.id === id);
        window.open(waProductMsg(p), '_blank');
        return;
      }
      location.hash = `/producto/${id}`;
    });
  });

  // toggle panel filtros
  const filtersToggle = app.querySelector('#filtersToggle');
  const filtersPanel = app.querySelector('#filtersPanel');
  if (filtersToggle && filtersPanel) {
    filtersToggle.addEventListener('click', () => {
      const open = filtersPanel.classList.toggle('is-open');
      filtersToggle.setAttribute('aria-expanded', open);
      filtersPanel.setAttribute('aria-hidden', !open);
      filtersToggle.querySelector('.btn-filters__arrow').textContent = open ? '▴' : '▾';
    });
  }

  // filtros catálogo
  app.querySelectorAll('[data-filter]').forEach(input => {
    input.addEventListener('change', () => {
      const params = new URLSearchParams(location.hash.split('?')[1] || '');
      if (input.value === 'all' || !input.value) {
        location.hash = `/catalogo`;
      } else {
        params.set('cat', input.value);
        location.hash = `/catalogo?${params.toString()}`;
      }
    });
  });
  const sortSel = app.querySelector('[data-sort]');
  if (sortSel) sortSel.addEventListener('change', () => {
    const params = new URLSearchParams(location.hash.split('?')[1] || '');
    params.set('sort', sortSel.value);
    location.hash = `/catalogo?${params.toString()}`;
  });

  // detalle producto: galería + chips + qty + WA
  const main = app.querySelector('#detailMain');
  if (main) {
    app.querySelectorAll('.detail-thumb').forEach(t => {
      t.addEventListener('click', () => {
        app.querySelectorAll('.detail-thumb').forEach(x => x.classList.remove('is-active'));
        t.classList.add('is-active');
        main.style.backgroundImage = `url('${t.dataset.img}')`;
      });
    });

    app.querySelectorAll('.chip-row').forEach(row => {
      row.addEventListener('click', e => {
        const chip = e.target.closest('.chip');
        if (!chip) return;
        row.querySelectorAll('.chip').forEach(c => c.classList.remove('is-active'));
        chip.classList.add('is-active');
        updateWaLink();
      });
    });

    const qtyEl = app.querySelector('#qty');
    app.querySelectorAll('[data-qty]').forEach(b => {
      b.addEventListener('click', () => {
        let n = parseInt(qtyEl.textContent) + parseInt(b.dataset.qty);
        qtyEl.textContent = Math.max(1, Math.min(20, n));
        updateWaLink();
      });
    });

    function updateWaLink() {
      const id = location.hash.split('/producto/')[1];
      const p = PRODUCTS.find(x => x.id === id);
      if (!p) return;
      const size = app.querySelector('[data-group="size"] .chip.is-active')?.dataset.val;
      const color = app.querySelector('[data-group="color"] .chip.is-active')?.dataset.val;
      const qty = qtyEl?.textContent || 1;
      const wa = app.querySelector('#waBuy');
      if (wa) {
        wa.href = waProductMsg(p, { size, color, qty });
        wa.target = '_blank';
        wa.rel = 'noopener';
      }
    }
    updateWaLink();
  }

  if (parseHash().path === '/admin') {
    bindAdminEvents();
  }
}

/* ============================================
   PREMIUM — WA DINÁMICO
   ============================================ */
function openPremiumWa(id, name) {
  const box = document.querySelector(`[name="box-${id}"]:checked`)?.value || '';
  const choc = document.querySelector(`[name="choc-${id}"]:checked`)?.value || '';
  const rose = document.querySelector(`[name="rose-${id}"]:checked`)?.value || '';
  const msg = `Hola, estoy interesado(a) en el producto *${name}*\nColor de caja: ${box}\nChocolates: ${choc}\nColor de rosa: ${rose}`;
  window.open(waLink(msg), '_blank');
}

/* ============================================
   ADMINISTRACIÓN & GESTIÓN SUPABASE
   ============================================ */

let currentAdminTab = 'products'; // 'products' o 'categories'

async function loadDataFromSupabase() {
  if (!supabaseClient) return;
  try {
    const { data: catData, error: catError } = await withTimeout(supabaseClient
      .from('categories')
      .select('*')
      .order('name'), 3000);
    
    if (catError) throw catError;
    
    const { data: prodData, error: prodError } = await withTimeout(supabaseClient
      .from('products')
      .select('*')
      .order('name'), 3000);
      
    if (prodError) throw prodError;
    
    if (catData) {
      CATEGORIES = catData;
    }
    if (prodData) {
      PRODUCTS = prodData.map(p => ({
        ...p,
        oldPrice: p.old_price
      }));
    }
    console.log('Datos cargados exitosamente de Supabase.');
  } catch (e) {
    console.error('Error cargando datos de Supabase, usando fallback local:', e);
  }
}

async function refreshDataAndRender() {
  await loadDataFromSupabase();
  render();
}

async function viewAdmin() {
  if (!supabaseClient) {
    return `
      <section class="admin-view pt-header">
        <div class="container">
          <div class="admin-fallback-warning">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-top:2px;">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01"/>
            </svg>
            <div>
              <strong>Base de datos no configurada.</strong> El panel administrativo requiere configurar las credenciales de Supabase en <code>config.js</code>. Actualmente ejecutándose con datos estáticos de prueba.
            </div>
          </div>
          <div class="admin-login">
            <h2>VOUDÚ</h2>
            <p class="admin-login__subtitle">Panel de Control</p>
            <p style="color: var(--c-muted); font-size: 0.9rem; margin-bottom: 20px;">Por favor, edita el archivo <code>config.js</code> con la URL y la Anon Key válidas de tu proyecto en Supabase para poder operar en tiempo real.</p>
            <a href="#/" class="btn btn--primary">Volver al Inicio</a>
          </div>
        </div>
      </section>
    `;
  }

  let session = null;
  try {
    const sessionRes = await withTimeout(supabaseClient.auth.getSession(), 3000);
    session = sessionRes?.data?.session;
  } catch (e) {
    console.error('Error de autenticación o timeout:', e);
  }
  
  if (!session) {
    return `
      <section class="admin-view pt-header">
        <div class="container">
          <div class="admin-login">
            <img src="assets/full-logo-no.png" alt="VOUDÚ" class="admin-login__logo" />
            <h2>VOUDÚ Admin</h2>
            <p class="admin-login__subtitle">Iniciar sesión en el panel</p>
            <form id="adminLoginForm">
              <div class="admin-login__group">
                <label class="admin-login__label">Email</label>
                <input type="email" id="adminEmail" class="admin-login__input" placeholder="admin@voudu.com" required autocomplete="username" />
              </div>
              <div class="admin-login__group">
                <label class="admin-login__label">Contraseña</label>
                <input type="password" id="adminPassword" class="admin-login__input" placeholder="••••••••" required autocomplete="current-password" />
              </div>
              <div class="admin-login__error" id="adminLoginError">Credenciales inválidas</div>
              <button type="submit" class="btn btn--primary admin-login__btn">Entrar al Sistema</button>
            </form>
          </div>
        </div>
      </section>
    `;
  }

  const totalProducts = PRODUCTS.length;
  const totalCategories = CATEGORIES.length;
  const hiddenProducts = PRODUCTS.filter(p => p.hidden).length;
  const activeProducts = totalProducts - hiddenProducts;

  return `
    <section class="admin-view pt-header">
      <div class="container">
        
        <div class="admin-header">
          <div class="admin-header__title">
            <h2>Panel Administrativo</h2>
            <p>Conectado a Supabase: ${session.user.email}</p>
          </div>
          <div class="admin-header__actions">
            <a href="#/" class="btn btn--ghost">Ver Tienda</a>
            <button class="btn btn--primary" id="adminLogoutBtn">Cerrar Sesión</button>
          </div>
        </div>

        <div class="admin-stats">
          <div class="admin-stat-card">
            <span class="admin-stat-card__title">Colecciones</span>
            <span class="admin-stat-card__value">${totalCategories}</span>
          </div>
          <div class="admin-stat-card">
            <span class="admin-stat-card__title">Total Productos</span>
            <span class="admin-stat-card__value">${totalProducts}</span>
          </div>
          <div class="admin-stat-card">
            <span class="admin-stat-card__title">Productos Visibles</span>
            <span class="admin-stat-card__value">${activeProducts}</span>
          </div>
          <div class="admin-stat-card">
            <span class="admin-stat-card__title">Productos Ocultos</span>
            <span class="admin-stat-card__value">${hiddenProducts}</span>
          </div>
        </div>

        <div class="admin-tabs">
          <button class="admin-tab ${currentAdminTab === 'products' ? 'is-active' : ''}" data-tab="products">Productos</button>
          <button class="admin-tab ${currentAdminTab === 'categories' ? 'is-active' : ''}" data-tab="categories">Colecciones</button>
        </div>

        <!-- Pestaña de Productos -->
        <div class="admin-section ${currentAdminTab === 'products' ? 'is-active' : ''}" id="adminSectionProducts">
          <div class="admin-section-header">
            <h3>Productos en Catálogo</h3>
            <button class="btn btn--primary" id="adminAddProductBtn">+ Nuevo Producto</button>
          </div>
          <div class="admin-table-container">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Imagen</th>
                  <th>ID / Código</th>
                  <th>Nombre</th>
                  <th>Categoría</th>
                  <th>Precio</th>
                  <th>Precio Ant.</th>
                  <th>Etiqueta</th>
                  <th>Visible</th>
                  <th>Premium</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                ${PRODUCTS.map(p => {
                  const catObj = CATEGORIES.find(c => c.id === p.category) || {};
                  const badgeClass = p.badge ? `admin-badge admin-badge--${p.badge}` : '';
                  return `
                    <tr data-product-id="${p.id}">
                      <td>
                        <img src="${p.images?.[0] || 'assets/full-logo-no.png'}" class="admin-table__thumb" alt="${p.name}" onerror="this.src='assets/full-logo-no.png'" />
                      </td>
                      <td><span class="admin-table__id">${p.id}</span></td>
                      <td><strong>${p.name}</strong></td>
                      <td>${catObj.name || `<span style="color:var(--c-muted); font-style:italic;">Sin colección</span>`}</td>
                      <td><span class="admin-table__price">${money(p.price)}</span></td>
                      <td>${p.oldPrice != null && p.oldPrice > 0 ? money(p.oldPrice) : '<span style="color:var(--c-muted);">-</span>'}</td>
                      <td>${p.badge ? `<span class="${badgeClass}">${p.badge === 'sale' ? 'Oferta' : p.badge === 'new' ? 'Nuevo' : 'Popular'}</span>` : '<span style="color:var(--c-muted);">-</span>'}</td>
                      <td>
                        <label class="admin-switch">
                          <input type="checkbox" class="js-toggle-prod-visibility" data-id="${p.id}" ${!p.hidden ? 'checked' : ''} />
                          <span class="admin-switch__slider"></span>
                        </label>
                      </td>
                      <td>
                        <label class="admin-switch">
                          <input type="checkbox" class="js-toggle-prod-premium" data-id="${p.id}" ${p.premium ? 'checked' : ''} />
                          <span class="admin-switch__slider"></span>
                        </label>
                      </td>
                      <td>
                        <div class="admin-table__actions">
                          <button class="btn-admin-icon js-edit-product" data-id="${p.id}" title="Editar">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4Z"/>
                            </svg>
                          </button>
                          <button class="btn-admin-icon btn-admin-icon--danger js-delete-product" data-id="${p.id}" title="Eliminar">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                              <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"/>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  `;
                }).join('') || `<tr><td colspan="10" style="text-align:center; padding: 40px; color:var(--c-muted);">No hay productos registrados.</td></tr>`}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Pestaña de Colecciones -->
        <div class="admin-section ${currentAdminTab === 'categories' ? 'is-active' : ''}" id="adminSectionCategories">
          <div class="admin-section-header">
            <h3>Colecciones (Categorías)</h3>
            <button class="btn btn--primary" id="adminAddCategoryBtn">+ Nueva Colección</button>
          </div>
          <div class="admin-table-container">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Imagen</th>
                  <th>ID / Código</th>
                  <th>Nombre</th>
                  <th>Visible</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                ${CATEGORIES.map(c => {
                  return `
                    <tr data-category-id="${c.id}">
                      <td>
                        <img src="${c.img || 'assets/full-logo-no.png'}" class="admin-table__thumb" alt="${c.name}" onerror="this.src='assets/full-logo-no.png'" />
                      </td>
                      <td><span class="admin-table__id">${c.id}</span></td>
                      <td><strong>${c.name}</strong></td>
                      <td>
                        <label class="admin-switch">
                          <input type="checkbox" class="js-toggle-cat-visibility" data-id="${c.id}" ${!c.hidden ? 'checked' : ''} />
                          <span class="admin-switch__slider"></span>
                        </label>
                      </td>
                      <td>
                        <div class="admin-table__actions">
                          <button class="btn-admin-icon js-edit-category" data-id="${c.id}" title="Editar">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4Z"/>
                            </svg>
                          </button>
                          <button class="btn-admin-icon btn-admin-icon--danger js-delete-category" data-id="${c.id}" title="Eliminar">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                              <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"/>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  `;
                }).join('') || `<tr><td colspan="5" style="text-align:center; padding: 40px; color:var(--c-muted);">No hay colecciones registradas.</td></tr>`}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </section>
  `;
}

function bindAdminEvents() {
  // Login Form
  const loginForm = document.getElementById('adminLoginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('adminEmail').value;
      const password = document.getElementById('adminPassword').value;
      const errorEl = document.getElementById('adminLoginError');
      try {
        const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
        if (error) throw error;
        render();
      } catch (err) {
        errorEl.textContent = err.message || 'Error de inicio de sesión';
        errorEl.style.display = 'block';
      }
    });
  }

  // Logout Button
  const logoutBtn = document.getElementById('adminLogoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      await supabaseClient.auth.signOut();
      render();
    });
  }

  // Tabs switching
  document.querySelectorAll('.admin-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      currentAdminTab = btn.dataset.tab;
      render();
    });
  });

  // Product visibility toggle
  document.querySelectorAll('.js-toggle-prod-visibility').forEach(input => {
    input.addEventListener('change', async () => {
      const id = input.dataset.id;
      const isVisible = input.checked;
      const { error } = await supabaseClient.from('products').update({ hidden: !isVisible }).eq('id', id);
      if (error) {
        alert('Error al actualizar visibilidad: ' + error.message);
        input.checked = !isVisible;
      } else {
        const prod = PRODUCTS.find(x => x.id === id);
        if (prod) prod.hidden = !isVisible;
      }
    });
  });

  // Product premium toggle
  document.querySelectorAll('.js-toggle-prod-premium').forEach(input => {
    input.addEventListener('change', async () => {
      const id = input.dataset.id;
      const isPremium = input.checked;
      const { error } = await supabaseClient.from('products').update({ premium: isPremium }).eq('id', id);
      if (error) {
        alert('Error al actualizar premium: ' + error.message);
        input.checked = !isPremium;
      } else {
        const prod = PRODUCTS.find(x => x.id === id);
        if (prod) prod.premium = isPremium;
      }
    });
  });

  // Category visibility toggle
  document.querySelectorAll('.js-toggle-cat-visibility').forEach(input => {
    input.addEventListener('change', async () => {
      const id = input.dataset.id;
      const isVisible = input.checked;
      const { error } = await supabaseClient.from('categories').update({ hidden: !isVisible }).eq('id', id);
      if (error) {
        alert('Error al actualizar visibilidad: ' + error.message);
        input.checked = !isVisible;
      } else {
        const cat = CATEGORIES.find(x => x.id === id);
        if (cat) cat.hidden = !isVisible;
      }
    });
  });

  // Delete product
  document.querySelectorAll('.js-delete-product').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.id;
      const prod = PRODUCTS.find(p => p.id === id);
      if (confirm(`¿Estás seguro de que deseas eliminar el producto "${prod.name}"?`)) {
        const { error } = await supabaseClient.from('products').delete().eq('id', id);
        if (error) {
          alert('Error al eliminar producto: ' + error.message);
        } else {
          refreshDataAndRender();
        }
      }
    });
  });

  // Delete category
  document.querySelectorAll('.js-delete-category').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.id;
      const cat = CATEGORIES.find(c => c.id === id);
      if (confirm(`¿Estás seguro de que deseas eliminar la colección "${cat.name}"?`)) {
        const { error } = await supabaseClient.from('categories').delete().eq('id', id);
        if (error) {
          alert('Error al eliminar colección: ' + error.message);
        } else {
          refreshDataAndRender();
        }
      }
    });
  });

  // Add category click
  const addCategoryBtn = document.getElementById('adminAddCategoryBtn');
  if (addCategoryBtn) {
    addCategoryBtn.addEventListener('click', () => {
      openCategoryFormModal();
    });
  }

  // Edit category click
  document.querySelectorAll('.js-edit-category').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const cat = CATEGORIES.find(c => c.id === id);
      openCategoryFormModal(cat);
    });
  });

  // Add product click
  const addProductBtn = document.getElementById('adminAddProductBtn');
  if (addProductBtn) {
    addProductBtn.addEventListener('click', () => {
      openProductFormModal();
    });
  }

  // Edit product click
  document.querySelectorAll('.js-edit-product').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const prod = PRODUCTS.find(p => p.id === id);
      openProductFormModal(prod);
    });
  });
}

function openCategoryFormModal(cat = null) {
  const isEdit = !!cat;
  const title = isEdit ? 'Editar Colección' : 'Nueva Colección';
  const html = `
    <div class="modal-admin-header">
      <h4>${title}</h4>
      <button class="icon-btn nav-close" data-close aria-label="Cerrar">✕</button>
    </div>
    <form id="adminCategoryForm">
      <div class="admin-field" style="margin-bottom: 15px;">
        <label>ID de Colección — código único, solo letras minúsculas y guiones</label>
        <input type="text" id="catFormId" value="${cat?.id || ''}" ${isEdit ? 'readonly style="background:var(--c-bg-alt);"' : 'required placeholder="ej. san-valentin"'} />
        ${!isEdit ? '<small style="color:var(--c-muted);font-size:0.8rem;">Ejemplos: primavera, rosas-xl, especial-navidad</small>' : ''}
      </div>
      <div class="admin-field" style="margin-bottom: 15px;">
        <label>Nombre de la Colección — el que ven los clientes</label>
        <input type="text" id="catFormName" value="${cat?.name || ''}" required placeholder="ej. Colección San Valentín" />
      </div>
      <div class="admin-field" style="margin-bottom: 15px;">
        <label>📁 Subir Imagen de Portada desde tu PC</label>
        <input type="file" id="catFormFile" accept="image/*" />
        <span id="catUploadStatus" style="font-size: 0.85rem; color: var(--c-muted); display: block; margin-top: 5px;">La imagen se subirá automáticamente a su carpeta en Supabase.</span>
      </div>
      <div class="admin-field" style="margin-bottom: 15px;">
        <label>🔗 URL de Imagen (se rellena sola al subir archivo)</label>
        <input type="text" id="catFormImg" value="${cat?.img || ''}" placeholder="Aparecerá aquí al subir archivo" />
      </div>
      <div class="modal-admin-footer">
        <button type="button" class="btn btn--ghost" data-close>Cancelar</button>
        <button type="submit" class="btn btn--primary">${isEdit ? 'Guardar Cambios' : 'Crear Colección'}</button>
      </div>
    </form>
  `;
  openModal(html);

  // Auto-upload al seleccionar archivo y mostrar URL en el campo
  document.getElementById('catFormFile')?.addEventListener('change', async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const collectionId = document.getElementById('catFormId').value || 'sin-id';
    const uploadStatus = document.getElementById('catUploadStatus');
    const imgInput = document.getElementById('catFormImg');
    if (uploadStatus) uploadStatus.textContent = 'Subiendo imagen...';
    const fileExt = file.name.split('.').pop();
    const fileName = `portada_${Date.now()}.${fileExt}`;
    const filePath = `${collectionId}/${fileName}`;
    const { error } = await supabaseClient.storage.from('flowers').upload(filePath, file);
    if (error) {
      if (uploadStatus) uploadStatus.textContent = `❌ Error: ${error.message}`;
      return;
    }
    const { data: { publicUrl } } = supabaseClient.storage.from('flowers').getPublicUrl(filePath);
    imgInput.value = publicUrl;
    if (uploadStatus) uploadStatus.textContent = `✅ Subida correcta. URL lista.`;
  });
  
  document.getElementById('adminCategoryForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('catFormId').value.trim();
    const name = document.getElementById('catFormName').value.trim();
    const img = document.getElementById('catFormImg').value.trim();
    
    if (!img) {
      alert('Debe subir una imagen de portada o ingresar una URL.');
      return;
    }
    
    const payload = { id, name, img };
    let res;
    if (isEdit) {
      res = await supabaseClient.from('categories').update(payload).eq('id', id);
    } else {
      payload.hidden = false;
      res = await supabaseClient.from('categories').insert([payload]);
    }
    
    if (res.error) {
      alert('Error al guardar colección: ' + res.error.message);
    } else {
      closeModal();
      refreshDataAndRender();
    }
  });
}

function openProductFormModal(prod = null) {
  const isEdit = !!prod;
  const title = isEdit ? 'Editar Producto' : 'Nuevo Producto';
  
  const categoryOptions = CATEGORIES.map(c => `
    <option value="${c.id}" ${prod?.category === c.id ? 'selected' : ''}>${c.name}</option>
  `).join('');
  
  const html = `
    <div class="modal-admin-header">
      <h4>${title}</h4>
      <button class="icon-btn nav-close" data-close aria-label="Cerrar">✕</button>
    </div>
    <form id="adminProductForm" style="max-height: 70vh; overflow-y: auto; padding-right: 10px;">
      <div class="admin-form-grid">
        
        <div class="admin-field">
          <label>ID / Código único del producto</label>
          <input type="text" id="prodFormId" value="${prod?.id || ''}" ${isEdit ? 'readonly style="background:var(--c-bg-alt);"' : 'required placeholder="ej. cosmos-roja-grande"'} />
          ${!isEdit ? '<small style="color:var(--c-muted);font-size:0.8rem;">Solo letras minúsculas y guiones. Ej: hortus-rosa, arcadius-xl, cupula-negra</small>' : ''}
        </div>
        
        <div class="admin-field">
          <label>Nombre del Producto — el que ven los clientes</label>
          <input type="text" id="prodFormName" value="${prod?.name || ''}" required placeholder="ej. Cosmos · Rosa Eterna" />
        </div>
        
        <div class="admin-field">
          <label>Colección — selecciona a qué grupo pertenece</label>
          <select id="prodFormCategory">
            <option value="">Sin colección</option>
            ${categoryOptions}
          </select>
        </div>
        
        <div class="admin-field">
          <label>Precio actual (S/) — lo que paga el cliente</label>
          <input type="number" step="0.01" id="prodFormPrice" value="${prod?.price || 0}" required placeholder="ej. 89.00" />
        </div>
        
        <div class="admin-field">
          <label>Precio anterior (S/) — solo si está en oferta</label>
          <input type="number" step="0.01" id="prodFormOldPrice" value="${prod?.oldPrice || ''}" placeholder="ej. 110.00 (dejar vacío si no hay oferta)" />
        </div>
        
        <div class="admin-field">
          <label>Etiqueta — destaca el producto en el catálogo</label>
          <select id="prodFormBadge">
            <option value="" ${!prod?.badge ? 'selected' : ''}>Sin etiqueta</option>
            <option value="new" ${prod?.badge === 'new' ? 'selected' : ''}>Nuevo — producto recién añadido</option>
            <option value="sale" ${prod?.badge === 'sale' ? 'selected' : ''}>Oferta — mostrar % de descuento</option>
            <option value="popular" ${prod?.badge === 'popular' ? 'selected' : ''}>Popular — más vendido</option>
          </select>
        </div>
        
        <div class="admin-field admin-form-grid__full">
          <label>Descripción Corta — frase de impacto que aparece en la tarjeta</label>
          <textarea id="prodFormShort" rows="2" required placeholder="ej. La rosa roja preservada bajo cristal. El clásico que nunca falla.">${prod?.short || ''}</textarea>
        </div>
        
        <div class="admin-field admin-form-grid__full">
          <label>Descripción Larga — detalles del producto en la página de detalle</label>
          <textarea id="prodFormDesc" rows="4" required placeholder="ej. Rosa natural preservada con tratamiento artesanal que mantiene su frescura durante más de 3 años. Presentada en cúpula de cristal con base de madera.">${prod?.description || ''}</textarea>
        </div>
        
        <div class="admin-field admin-form-grid__full">
          <label>📁 Subir Imágenes desde tu PC — se guardan en la carpeta de la colección</label>
          <input type="file" id="prodFormFiles" accept="image/*" multiple />
          <span id="prodUploadStatus" style="font-size: 0.85rem; color: var(--c-muted); display: block; margin-top: 5px;">Selecciona primero la colección, luego elige las fotos. Puedes subir varias a la vez.</span>
        </div>

        <div class="admin-field admin-form-grid__full">
          <label>🔗 URLs de Imágenes — se rellenan solas al subir archivo</label>
          <textarea id="prodFormImages" rows="3" placeholder="Se llenarán automáticamente al subir fotos. O escribe rutas manuales separadas por coma.">${prod?.images ? prod.images.join(',\n') : ''}</textarea>
        </div>
        <div class="admin-field admin-form-grid__full">
          <label>Colores disponibles (Opcional) — separados por comas</label>
          <input type="text" id="prodFormColors" value="${prod?.colors ? prod.colors.join(', ') : ''}" placeholder="ej. Rojo, Rosa, Blanco, Lila, Negro" />
        </div>

        <div class="admin-field admin-form-grid__full">
          <label>Tamaños disponibles (Opcional) — separados por comas</label>
          <input type="text" id="prodFormSizes" value="${prod?.sizes ? prod.sizes.join(', ') : 'Única'}" placeholder="ej. Única (si solo hay un tamaño) o Pequeño, Mediano, Grande" />
        </div>

      </div>

      <div class="modal-admin-footer">
        <button type="button" class="btn btn--ghost" data-close>Cancelar</button>
        <button type="submit" class="btn btn--primary">${isEdit ? 'Guardar Cambios' : 'Crear Producto'}</button>
      </div>
    </form>
  `;
  openModal(html);

  // Auto-upload al seleccionar archivos y mostrar URLs en textarea
  document.getElementById('prodFormFiles')?.addEventListener('change', async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const uploadStatus = document.getElementById('prodUploadStatus');
    const textarea = document.getElementById('prodFormImages');
    // Usar la categoría seleccionada como carpeta (igual que la colección)
    const categoryId = document.getElementById('prodFormCategory').value || 'sin-categoria';
    if (uploadStatus) uploadStatus.textContent = `Subiendo ${files.length} imagen(es) a la carpeta "${categoryId}"...`;
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
      const filePath = `${categoryId}/${fileName}`;
      const { error } = await supabaseClient.storage.from('flowers').upload(filePath, file);
      if (error) {
        if (uploadStatus) uploadStatus.textContent = `❌ Error subiendo ${file.name}: ${error.message}`;
        return;
      }
      const { data: { publicUrl } } = supabaseClient.storage.from('flowers').getPublicUrl(filePath);
      textarea.value = (textarea.value ? textarea.value + ',\n' : '') + publicUrl;
    }
    if (uploadStatus) uploadStatus.textContent = `✅ ${files.length} imagen(es) subida(s) a "${categoryId}". URLs listas abajo.`;
    // Reset file input para evitar re-subir al guardar
    e.target.value = '';
  });

  
  document.getElementById('adminProductForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('prodFormId').value;
    const name = document.getElementById('prodFormName').value;
    const category = document.getElementById('prodFormCategory').value || null;
    const price = parseFloat(document.getElementById('prodFormPrice').value);
    const oldPriceRaw = document.getElementById('prodFormOldPrice').value;
    const old_price = oldPriceRaw ? parseFloat(oldPriceRaw) : null;
    const badge = document.getElementById('prodFormBadge').value || null;
    const short = document.getElementById('prodFormShort').value;
    const description = document.getElementById('prodFormDesc').value;
    
    let images = document.getElementById('prodFormImages').value
      .split(/[\n,]/)
      .map(x => x.trim())
      .filter(x => x !== '');
      
    const fileInput = document.getElementById('prodFormFiles');
    const uploadStatus = document.getElementById('prodUploadStatus');

    if (fileInput && fileInput.files && fileInput.files.length > 0) {
      if (uploadStatus) uploadStatus.textContent = `Subiendo ${fileInput.files.length} imagen(es)...`;
      for (let i = 0; i < fileInput.files.length; i++) {
        const file = fileInput.files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
        const filePath = `products/${fileName}`;
        
        const { data, error } = await supabaseClient.storage
          .from('flowers')
          .upload(filePath, file);

        if (error) {
          alert(`Error al subir imagen (${file.name}): ` + error.message);
          if (uploadStatus) uploadStatus.textContent = 'Error durante la subida.';
          return;
        }

        const { data: { publicUrl } } = supabaseClient.storage
          .from('flowers')
          .getPublicUrl(filePath);

        images.push(publicUrl);
      }
      if (uploadStatus) uploadStatus.textContent = 'Subida completada.';
    }

    if (images.length === 0) {
      alert('Debe ingresar al menos una imagen (escribiendo la URL o subiendo un archivo).');
      return;
    }
      
    const colors = document.getElementById('prodFormColors').value
      .split(',')
      .map(x => x.trim())
      .filter(x => x !== '');
      
    const sizes = document.getElementById('prodFormSizes').value
      .split(',')
      .map(x => x.trim())
      .filter(x => x !== '');
      
    const payload = {
      id,
      name,
      category,
      price,
      old_price,
      badge,
      short,
      description,
      images,
      colors,
      sizes
    };
    
    let res;
    if (isEdit) {
      res = await supabaseClient.from('products').update(payload).eq('id', id);
    } else {
      payload.hidden = false;
      payload.premium = false;
      res = await supabaseClient.from('products').insert([payload]);
    }
    
    if (res.error) {
      alert('Error al guardar producto: ' + res.error.message);
    } else {
      closeModal();
      refreshDataAndRender();
    }
  });
}

/* ============================================
   INIT (SUPABASE AWARE)
   ============================================ */
// Renderizar inmediatamente con los datos locales de fallback
render();

// Cargar datos de Supabase en segundo plano
if (supabaseClient) {
  loadDataFromSupabase().then(() => {
    // Volver a renderizar cuando el fetch complete exitosamente
    render();
  });
}
window.addEventListener('hashchange', render);


