/* ============================================
   FLORÈNTIA · Motor SPA (hash routing)
   ============================================ */


const app = document.getElementById('app');
const navEl = document.getElementById('nav');
const modal = document.getElementById('modal');
const modalContent = document.getElementById('modalContent');

document.getElementById('year').textContent = new Date().getFullYear();

/* ---------- UTILIDADES ---------- */
const money = v => `S/ ${v.toFixed(2)}`;

const waLink = (text) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

const waProductMsg = (p, opts = {}) => {
  const isPromo = p.badge === 'sale';
  const tipo = isPromo ? 'la promoción' : 'el producto';
  let msg = `Hola, estoy interesado(a) en ${tipo} *${p.name}*`;
  if (opts.size)  msg += `\nTamaño: ${opts.size}`;
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
  return `
    <section class="cat-landing pt-header">
      ${CATEGORIES.filter(c => !c.hidden).map((c, i) => `
        <a href="#/catalogo?cat=${c.id}" class="cat-land-block reveal ${c.id === 'hortus' ? 'cat-land-block--full' : ''}" style="transition-delay:${i * 80}ms">
          <div class="cat-land-img" style="background-image:url('${c.img}')"></div>
          <div class="cat-land-label">
            <span class="cat-land-eyebrow">Colección</span>
            <h2 class="cat-land-name">${c.name}</h2>
            <span class="cat-land-cta">Ver colección →</span>
          </div>
        </a>
      `).join('')}
    </section>

    <!-- SECCIÓN PREMIUM -->
    <section class="premium-section">
      <div class="premium-section__header">
        <span class="premium-star">✦</span>
        <h2 class="premium-section__title">PREMIUM</h2>
        <span class="premium-star">✦</span>
      </div>
      <div class="premium-grid">
        ${premiumProducts.map(p => `
          <div class="premium-card reveal">
            <div class="premium-card__img-wrap">
              <div class="premium-card__img" style="background-image:url('${p.images[0]}')"></div>
            </div>
            <div class="premium-card__body">
              <h3 class="premium-card__name">${p.name}</h3>
              <p class="premium-card__desc">Caja exclusiva personalizable</p>

              <div class="premium-options">

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
                    <label class="option-pill"><input type="radio" name="choc-${p.id}" value="Sin chocolates" checked><span>Opción 1 · Sin chocolates</span></label>
                    <label class="option-pill"><input type="radio" name="choc-${p.id}" value="Con fresas al chocolate"><span>Opción 2 · Con fresas al chocolate</span></label>
                  </div>
                </div>

                <div class="option-group">
                  <span class="option-label">Color de rosa</span>
                  <div class="color-swatches">
                    <label class="color-swatch" title="Roja"><input type="radio" name="rose-${p.id}" value="Roja" checked><span class="swatch" style="background:#9b2335"></span></label>
                    <label class="color-swatch" title="Rosa"><input type="radio" name="rose-${p.id}" value="Rosa"><span class="swatch" style="background:#e8829a"></span></label>
                    <label class="color-swatch" title="Blanca"><input type="radio" name="rose-${p.id}" value="Blanca"><span class="swatch" style="background:#f0ece4;border:1px solid rgba(255,255,255,.25)"></span></label>
                    <label class="color-swatch" title="Lila"><input type="radio" name="rose-${p.id}" value="Lila"><span class="swatch" style="background:#9b7ebf"></span></label>
                  </div>
                </div>

              </div>

              <div class="premium-card__cta">
                <span class="premium-card__consult">Consultar precio <span class="premium-card__arrow">↓</span></span>
                <button class="btn btn--wa premium-card__wa" onclick="openPremiumWa('${p.id}', '${p.name}')">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor" style="flex-shrink:0">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
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
  const catImg  = cat !== 'all' ? (CATEGORIES.find(c => c.id === cat)?.img || '') : 'assets/productos sin usar/cupula-roja-1.png';

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

function render() {
  const { path, params } = parseHash();
  let html = '';
  let activeNav = path;

  if (path === '/' || path === '') html = viewHome();
  else if (path === '/catalogo') html = viewCatalog(params);
  else if (path === '/promociones') html = viewPromos();
  else if (path === '/sobre-nosotros') html = viewAbout();
  else if (path.startsWith('/producto/')) {
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
}

/* ============================================
   PREMIUM — WA DINÁMICO
   ============================================ */
function openPremiumWa(id, name) {
  const box  = document.querySelector(`[name="box-${id}"]:checked`)?.value  || '';
  const choc = document.querySelector(`[name="choc-${id}"]:checked`)?.value || '';
  const rose = document.querySelector(`[name="rose-${id}"]:checked`)?.value || '';
  const msg = `Hola, estoy interesado(a) en el producto *${name}*\nColor de caja: ${box}\nChocolates: ${choc}\nColor de rosa: ${rose}`;
  window.open(waLink(msg), '_blank');
}

/* ============================================
   INIT
   ============================================ */
window.addEventListener('hashchange', render);
render();
