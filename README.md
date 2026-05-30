# 🌹 VOUDÚ · Tienda de Rosas Infinitas

Tienda online para rosas preservadas / flores infinitas. Estructura base lista para personalizar con tu paleta de colores y logos reales.

## 📂 Estructura

```
TIENDA FLORES/
├── index.html      → Estructura HTML + SPA shell
├── styles.css      → Todo el estilo (variables CSS en :root)
├── data.js         → Productos, categorías, testimonios, número WhatsApp
├── app.js          → Router SPA, render de vistas, lógica dinámica
└── README.md
```

## 🚀 Cómo probarla

Simplemente abre `index.html` en el navegador. O mejor, sirve la carpeta con un servidor local:

```bash
# Opción 1 (Python)
python -m http.server 8000

# Opción 2 (Node)
npx serve .
```

Luego visita `http://localhost:8000`.

## 🎨 Personalización (cuando me pases la paleta y logos)

### 1. Paleta de colores
Edita las variables en `styles.css` → `:root`:

```css
--c-bg: #fbf7f4;        /* fondo base */
--c-bg-alt: #f3ece6;    /* fondo secciones alternas */
--c-blush: #f3dfd7;     /* rosa claro */
--c-rose: #c98a8a;
--c-rose-deep: #8d4545;
--c-burgundy: #5a1f2b;  /* color principal / titulares */
--c-gold: #b9975b;      /* acento */
--c-cream: #faf3ee;
--c-ink: #2b1e1b;       /* texto */
```

### 2. Logo
En `index.html` busca `.logo` (aparece en header y footer) y reemplaza:
```html
<span class="logo__mark">✿</span>
<span class="logo__text">Florèntia</span>
```
Por tu `<img src="logo.svg" alt="...">`.

### 3. Número de WhatsApp
En `data.js`, línea 6:
```js
const WHATSAPP_NUMBER = "000000000"; // 👉 cámbialo
```
Formato: código país + número, sin `+` ni espacios. Ej: España → `34612345678`.

### 4. Productos
En `data.js`, edita el array `PRODUCTS`. Cada producto tiene:
- `id`, `name`, `category`, `price`, `oldPrice` (opcional, activa badge de descuento)
- `badge`: `"sale"` | `"new"` | null
- `sizes`, `colors`: arrays de opciones
- `short`, `description`
- `images`: array de URLs (la primera es la principal)

## 🧩 Secciones incluidas

- **Inicio** (`#/`)
  - Hero con CTA
  - Banners de promoción (uno grande + dos pequeños)
  - Categorías destacadas
  - Productos favoritos
  - Strip de beneficios
  - Sobre nosotros (teaser)
  - Testimonios
  - Newsletter
- **Catálogo** (`#/catalogo`) — con filtros por categoría y orden
- **Detalle de producto** (`#/producto/:id`) — galería, selector tamaño/color/cantidad, CTA WhatsApp
- **Promociones** (`#/promociones`)
- **Sobre nosotros** (`#/sobre-nosotros`)
- **Contacto** (`#/contacto`) — con formulario

## 💬 Flujo de compra WhatsApp

El botón "Comprar por WhatsApp" construye automáticamente un mensaje con:
- Nombre del producto
- Tamaño / color / cantidad seleccionados
- Precio
- Enlace directo a `wa.me/<tu-número>`
