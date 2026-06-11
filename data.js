/* ============================================
   VOUDÚ · DATOS DE LA TIENDA
   ============================================ */

let WHATSAPP_NUMBER = "51927599077";

/* ---------- CATEGORÍAS ---------- */
let CATEGORIES = [
  { id: "cupulas",      name: "Colección Cosmos", img: "assets/cosmos/cupula-roja.jpg" },
  { id: "ediciones",    name: "Colección Arcadius", img: "assets/arcadius/arcadius.jpg" },
  { id: "hortus",       name: "Hortus Conclusus",    img: "assets/hortus-conclusus/Hortus-Conclusus-roja.jpg" }
];

/* ---------- PRODUCTOS ---------- */
let PRODUCTS = [


  {
    id: "cupula-roja",
    name: "Cosmos · Roja",
    category: "cupulas",
    price: 75,
    badge: "new",
    short: "La rosa roja preservada bajo cristal. El clásico que nunca falla. El que siempre se recuerda.",
    description: "Rosa natural preservada con tratamiento artesanal que mantiene su frescura y textura durante más de tres años. Presentada sobre base de madera con acabado natural y cúpula de cristal. Incluye flores secas decorativas.",
    images: ["assets/cosmos/cupula-roja.jpg", "assets/cosmos/cupula-roja-2.jpg"]
  },

  {
    id: "cupula-blanca",
    name: "Cosmos · Blanca",
    category: "cupulas",
    price: 75,
    badge: "new",
    short: "Pureza bajo cristal. La rosa blanca que susurra lo que otros gritan.",
    description: "Rosa preservada en blanco puro bajo cúpula de cristal con base de madera clara. Acompañada de flores secas blancas y follaje natural.",
    images: ["assets/cosmos/cupula-blanca.jpg"]
  },
  {
    id: "cupula-lila",
    name: "Cosmos · Lila",
    category: "cupulas",
    price: 75,
    badge: "new",
    short: "Suave, etérea, imposible de ignorar. La rosa lila que perfuma la vista.",
    description: "Rosa preservada en tono lila pastel bajo cúpula esférica de cristal con base de madera. Decorada con flores secas en tonos complementarios. Perfecta para interiores delicados y espíritus que buscan calma.",
    images: ["assets/cosmos/cupula-lila.jpg"]
  },
  {
    id: "cupula-negra",
    name: "Cosmos · Noir",
    category: "cupulas",
    price: 75,
    badge: "new",
    short: "Una rosa negra bajo cristal. Para quien entiende que no todo amor es ligero.",
    description: "Rosa natural teñida y preservada en negro profundo bajo cúpula de cristal con base de madera. Acompañada de flores secas blancas que crean un contraste dramático.",
    images: ["assets/cosmos/cupula-negra.jpg"]
  },
  {
    id: "cupula-rosa",
    name: "Cosmos · Rosa",
    category: "cupulas",
    price: 75,
    badge: "new",
    short: "Ternura bajo cristal. La rosa rosa que celebra la dulzura y el afecto.",
    description: "Rosa preservada en tono rosa delicado bajo cúpula de cristal con base de madera. Acompañada de flores secas en tonos suaves. Un detalle romántico y eterno.",
    images: ["assets/cosmos/cupula-rosa.jpg"]
  },
  {
    id: "cupula-amarilla",
    name: "Cosmos · Amarilla",
    category: "cupulas",
    price: 75,
    badge: "new",
    short: "Luz y energía bajo cristal. La rosa amarilla que ilumina cualquier espacio y celebra la amistad.",
    description: "Rosa preservada en un vibrante color amarillo bajo cúpula de cristal con base de madera. Acompañada de flores secas decorativas y follaje natural que realzan su brillo.",
    images: ["assets/cosmos/cupula-amarilla.jpg"]
  },

  /* ══════════ COLECCIÓN ARCADIUS ══════════ */

  {
    id: "arcadius-rojo",
    name: "Arcadius · Roja",
    category: "ediciones",
    price: 89,
    badge: "new",
    sizes: ["Única"],
    colors: ["Rojo"],
    short: "Para la mujer que lo merece todo. Rosa roja en forma de corazón, preservada para durar años. Lazo de satén y tarjeta personalizada con tu mensaje — incluida sin costo.",
    description: "Cúpula esférica con rosa roja preservada en forma de corazón sobre base de madera. Presentación especial con caja de regalo, lazo de satén y tarjeta personalizada con tu mensaje.",
    images: ["assets/arcadius/arcadius-rojo.jpg"]
  },
  {
    id: "arcadius-rosa",
    name: "Arcadius · Rosa",
    category: "ediciones",
    price: 89,
    badge: "new",
    sizes: ["Única"],
    colors: ["Rosa"],
    short: "Suave, delicada, imposible de olvidar. Rosa rosa en forma de corazón, preservada para durar años. Lazo de satén y tarjeta personalizada con tu mensaje — incluida sin costo.",
    description: "Cúpula esférica con rosa rosa preservada en forma de corazón sobre base de madera. Presentación especial con caja de regalo, lazo de satén y tarjeta personalizada con tu mensaje.",
    images: ["assets/arcadius/arcadius-rosa.jpg"]
  },
  {
    id: "arcadius-blanca",
    name: "Arcadius · Blanca",
    category: "ediciones",
    price: 89,
    badge: "new",
    sizes: ["Única"],
    colors: ["Blanco"],
    short: "Pureza que no se marchita. Rosa blanca en forma de corazón, preservada para durar años. Lazo de satén y tarjeta personalizada con tu mensaje — incluida sin costo.",
    description: "Cúpula esférica con rosa blanca preservada en forma de corazón sobre base de madera. Presentación especial con caja de regalo, lazo de satén y tarjeta personalizada con tu mensaje.",
    images: ["assets/arcadius/arcadius-blanca.jpg"]
  },
  {
    id: "arcadius-lila",
    name: "Arcadius · Lila",
    category: "ediciones",
    price: 89,
    badge: "new",
    sizes: ["Única"],
    colors: ["Lila"],
    short: "Etérea y única, como ella. Rosa lila en forma de corazón, preservada para durar años. Lazo de satén y tarjeta personalizada con tu mensaje — incluida sin costo.",
    description: "Cúpula esférica con rosa lila preservada en forma de corazón sobre base de madera. Presentación especial con caja de regalo, lazo de satén y tarjeta personalizada con tu mensaje.",
    images: ["assets/arcadius/arcadius-lila.jpg"]
  },
  {
    id: "arcadius-negra",
    name: "Arcadius · Negra",
    category: "ediciones",
    price: 89,
    badge: "new",
    sizes: ["Única"],
    colors: ["Negro"],
    short: "Elegancia oscura para un amor profundo. Rosa negra en forma de corazón, preservada para durar años. Lazo de satén y tarjeta personalizada con tu mensaje — incluida sin costo.",
    description: "Cúpula esférica con rosa negra preservada en forma de corazón sobre base de madera. Presentación especial con caja de regalo, lazo de satén y tarjeta personalizada con tu mensaje.",
    images: ["assets/arcadius/arcadius-negra.jpg"]
  },
  {
    id: "arcadius-rosa-pastel",
    name: "Arcadius · Rosa Pastel",
    category: "ediciones",
    price: 89,
    badge: "new",
    sizes: ["Única"],
    colors: ["Rosa Pastel"],
    short: "Ternura en su forma más pura. Rosa pastel en forma de corazón, preservada para durar años. Lazo de satén y tarjeta personalizada con tu mensaje — incluida sin costo.",
    description: "Cúpula esférica con rosa rosa pastel preservada en forma de corazón sobre base de madera. Presentación especial con caja de regalo, lazo de satén y tarjeta personalizada con tu mensaje.",
    images: ["assets/arcadius/arcadius-rosa-pastel.jpg"]
  },

  /* ══════════ PROMOCIONES ══════════ */
  {
    hidden: true,
    id: "promo-arcadius",
    name: "Arcadius · Edición Especial",
    category: "ediciones",
    price: 89,
    oldPrice: 0,
    badge: "sale",
    sizes: ["Única"],
    colors: ["Rojo", "Lavanda", "Blanco"],
    short: "La rosa en forma de corazón, edición especial para Arcadius. Tarjeta personalizada y lazo de satén incluidos.",
    description: "Cúpula esférica con rosa preservada en forma de corazón sobre base de madera. Presentación especial con caja de regalo, lazo de satén y tarjeta personalizada con tu mensaje.",
    images: ["assets/arcadius/arcadius.jpg"]
  },

  /* ══════════ PREMIUM ══════════ */
  {
    id: "premium-caja-noir",
    name: "Caja Noir · Corazón de Rosas",
    category: "premium",
    premium: true,
    price: 0,
    sizes: ["Única"],
    colors: ["Rojo"],
    short: "Caja magnética negra que se despliega en estrella, revelando rosas rojas en corazón. Incluye cajón inferior y lightbox 'FOR BEST MOM'.",
    description: "Caja magnética de lujo en negro mate que abre en ocho pétalos revelando rosas rojas preservadas dispuestas en forma de corazón. Incluye cajón inferior y lightbox luminoso 'FOR BEST MOM'. Todo viene incluido, listo para regalar.",
    images: ["assets/premium/premium-1.jpg"]
  },
  {
    id: "premium-caja-noir-fresas",
    name: "Caja Noir · Rosas & Fresas",
    category: "premium",
    premium: true,
    price: 0,
    sizes: ["Única"],
    colors: ["Rojo"],
    short: "Caja Noir con rosas en corazón, fresas con chocolate artesanal y lightbox 'FOR BEST MOM'. Todo incluido.",
    description: "Edición especial de la Caja Noir: rosas rojas preservadas en forma de corazón en la parte superior, cajón inferior con fresas bañadas en chocolate artesanal, y lightbox luminoso 'FOR BEST MOM'. Todo viene incluido, listo para regalar.",
    images: ["assets/premium/premium-2.jpg"]
  },
  
  /* ══════════ HORTUS CONCLUSUS ══════════ */
  {
    id: "hortus-roja",
    name: "Hortus Conclusus · Roja",
    category: "hortus",
    price: 119,
    badge: "new",
    short: "El jardín cerrado de la pasión eterna. La rosa roja preservada en su máxima plenitud.",
    description: "Rosa natural preservada con tratamiento artesanal que mantiene su frescura y textura durante más de tres años. Dispuesta de forma artesanal en un entorno protegido que evoca el misticismo del clásico 'jardín cerrado' medieval.",
    images: ["assets/hortus-conclusus/Hortus-Conclusus-roja.jpg"]
  },
  {
    id: "hortus-rosa",
    name: "Hortus Conclusus · Rosa",
    category: "hortus",
    price: 119,
    badge: "new",
    short: "Delicadeza y misterio en un espacio íntimo. La rosa rosa que atesora tus secretos.",
    description: "Una exquisita rosa rosa preservada bajo una cuidada atmósfera que preserva su textura y tonalidad natural durante años. Hecha a mano con follaje seleccionado, inspirada en la paz y privacidad del Hortus Conclusus.",
    images: ["assets/hortus-conclusus/Hortus-Conclusus-rosa.jpg"]
  }
];

/* ---------- TESTIMONIOS ---------- */
let TESTIMONIALS = [
  { stars: 5, quote: "No parece real. Cinco meses después y siguen como el primer día. Ahora entiendo el slogan.", author: "Laura M.", role: "Cliente verificada" },
  { stars: 5, quote: "Regalé el Gémin Sempiternum y mi pareja no ha dejado de hablar de él. Se ve increíble en la sala.", author: "Carlos R.", role: "Cliente verificado" },
  { stars: 5, quote: "El trato por WhatsApp fue impecable. Me personalizaron la tarjeta y llegó al día siguiente. Una experiencia.", author: "Andrea V.", role: "Cliente verificada" }
];
