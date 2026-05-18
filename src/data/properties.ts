export type Review = {
  id: number
  author: string
  authorId?: string
  rating: number
  text: string
}

export type Property = {
  id: number
  title: string
  style: string
  area: number
  imageLabel: string
  type?: string
  colors?: string[] | string
  finishes?: string[] | string
  distribution?: string
  imageUrls?: string[]
  reviews?: Review[]
}

// Categorías predefinidas
export const STYLE_CATEGORIES = [
  "Minimalista",
  "Rústico",
  "Moderno",
  "Industrial",
  "Clásico",
  "Contemporáneo",
  "Mediterráneo",
  "Nórdico",
  "Bohemio",
  "Victoriano",
  "Gótico",
  "Art Deco",
  "Bauhaus",
  "Brutalista",
  "Orgánico",
  "Biomórfico",
  "Neoclásico",
  "Barroco",
  "Rococo",
  "Renacentista",
  "Gótico Revival",
  "Art Nouveau",
  "Futurista",
  "High-Tech",
  "Postmoderno",
  "Deconstructivista",
  "Paramétrico",
  "Sostenible",
  "Bioplástico",
  "Nanotecnológico",
]

export const TYPE_CATEGORIES = [
  "Residencial unifamiliar",
  "Residencial multifamiliar",
  "Apartamento",
  "Casa adosada",
  "Casa pareada",
  "Chalet",
  "Villa",
  "Mansión",
  "Loft",
  "Penthouse",
  "Dúplex",
  "Tríplex",
  "Comercial",
  "Oficina",
  "Local comercial",
  "Centro comercial",
  "Restaurante",
  "Hotel",
  "Hostal",
  "Resort",
  "Industrial",
  "Nave industrial",
  "Almacén",
  "Fábrica",
  "Institucional",
  "Escuela",
  "Hospital",
  "Biblioteca",
  "Museo",
  "Teatro",
  "Estadio",
  "Centro deportivo",
  "Parque temático",
  "Centro de convenciones",
  "Aeropuerto",
  "Estación de tren",
  "Puerto",
  "Edificio gubernamental",
  "Embajada",
  "Consulado",
  "Especial",
  "Casa flotante",
  "Casa en árbol",
  "Casa subterránea",
  "Casa modular",
  "Casa prefabricada",
  "Casa ecológica",
  "Casa inteligente",
  "Casa histórica",
  "Casa museo",
]

export const COLOR_SWATCHES = [
  "#ffffff", // Blanco
  "#f5f0e1", // Crema
  "#d9d9d9", // Gris claro
  "#bfb3a1", // Beige arena
  "#8b6c42", // Ladrillo/madera
  "#4f5d3a", // Verde oliva
  "#1e293b", // Azul oscuro hospital
  "#3b3b3b", // Gris oscuro
  "#d45d31", // Terracota
  "#e2c16b", // Oro envejecido
  "#9c8a6a", // Piedra natural
  "#82c0cc", // Azul claro
]

export const FINISH_CATEGORIES = [
  "Porcelanato",
  "Madera natural",
  "Microcemento",
  "Hormigón pulido",
  "Ladrillo visto",
  "Vidrio templado",
  "Acero inoxidable",
  "Piedra natural",
  "Mármol",
  "Azulejos artesanales",
  "Ventanales oscuros",
  "Carpintería minimalista",
  "Barniz mate",
  "Laca brillante",
  "Paneles de yeso",
  "Iluminación LED",
  "Textiles suaves",
  "Cocina abierta",
  "Terraza verde",
  "Detalles en cobre",
]

export const initialProperties: Property[] = []
