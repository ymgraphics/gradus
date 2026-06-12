export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.gradus.ma";

export type Project = {
  // --- BASE IDENTITY (Root for compatibility) ---
  id: string;
  client: string;
  industry?: string;
  year: string;
  category: string;
  tags: string[];
  description: string;
  
  // --- MODULAR CASE STUDY (New Structure) ---
  content?: {
    description: string;
    challenge?: string;
    solution?: string;
    results?: string;
    industry?: string;
  };

  // --- ENHANCED MEDIA SYSTEM ---
  media?: {
    cover: string;
    logo?: string;
    logo_light?: string;
    brand_color?: string;
    // Categorized assets for intelligent rendering
    assets: {
      id: string;
      url: string;
      type: "video" | "image";
      format: "reel" | "post" | "story" | "landscape" | "photography" | "bts";
      aspect: "portrait" | "landscape" | "square";
      featured?: boolean;
      title?: string;
    }[];
  };

  // --- SEO & SETTINGS ---
  seo?: {
    title: string;
    description: string;
    keywords?: string[];
    og_image?: string;
  };

  settings?: {
    published: boolean;
    featured: boolean;
    sort_order: number;
    layout_format: "full" | "half" | "third";
  };

  // --- LEGACY FALLBACKS (Maintain for compatibility) ---
  challenge?: string;
  solution?: string;
  results?: string;
  coverImage?: string;
  logo?: string;
  galleryImages?: string[];
  videos?: string[];
  format?: "full" | "half" | "third";
  published?: boolean;
  featured?: boolean;
  seo_title?: string;
  seo_description?: string;
  sort_order?: number;
};

export const defaultProjects: Project[] = [
  // ROW 1: Full
  {
    id: "tito",
    client: "Tito",
    year: "2022",
    category: "Branding · Print",
    tags: ["Branding", "Identité Visuelle"],
    description: "Création complète de l'identité visuelle pour Tito — logo, packaging, uniformes, carte de visite et mobilier de marque.",
    coverImage: "https://gradus.ma/wp-content/uploads/2022/08/SIMULATION-4.png",
    galleryImages: [
      "https://gradus.ma/wp-content/uploads/2022/08/MOCKUP-826x900.png",
      "https://gradus.ma/wp-content/uploads/2022/08/CARTE-VISITE-TITO-900x652.png",
      "https://gradus.ma/wp-content/uploads/2022/08/STICKERS-TITO-900x506.png",
      "https://gradus.ma/wp-content/uploads/2022/08/SAC-EMPORTER-749x900.png",
      "https://gradus.ma/wp-content/uploads/2022/08/SAC-SAN-POIGNET-772x900.png",
      "https://gradus.ma/wp-content/uploads/2022/08/tablier-1-900x847.png",
      "https://gradus.ma/wp-content/uploads/2022/08/SET-DE-TABLE-TITO-900x719.png",
      "https://gradus.ma/wp-content/uploads/2022/08/BOX-2-900x490.png",
      "https://gradus.ma/wp-content/uploads/2022/08/SIMULATION-2-748x900.png",
      "https://gradus.ma/wp-content/uploads/2022/08/CASQUE-854x900.png",
      "https://gradus.ma/wp-content/uploads/2022/08/mockup-1-900x760.png",
      "https://gradus.ma/wp-content/uploads/2022/08/French_Fry_09-624x900.png",
      "https://gradus.ma/wp-content/uploads/2022/08/serv.png",
      "https://gradus.ma/wp-content/uploads/2022/08/sandwich-900x600.png"
    ],
    videos: [],
    format: "full"
  },
  // ROW 2: 2 columns
  {
    id: "orqid-spa",
    client: "Orqid Spa",
    year: "2022",
    category: "Branding · 3D",
    tags: ["Branding", "Identité Visuelle"],
    description: "Création du support visuel et de l'identité de marque pour Orqid Spa — logo, brochure, signalétique murale.",
    coverImage: "https://gradus.ma/wp-content/uploads/2022/08/LOGO-ORQID-SPA-2.png",
    galleryImages: [
      "https://gradus.ma/wp-content/uploads/2022/08/Orqid-spa-mur-874x900.png",
      "https://gradus.ma/wp-content/uploads/2022/08/LOGO-ORQID-SPA-2-900x700.png",
      "https://gradus.ma/wp-content/uploads/2022/08/Brochure-ORQID-SPA-900x782.png"
    ],
    videos: [],
    format: "half"
  },
  {
    id: "dar-dada",
    client: "Dar Dada",
    year: "2022",
    category: "Branding · Social Media",
    tags: ["Branding", "Social Media", "Print"],
    description: "Accompagnement graphique et stratégique complet pour Dar Dada — création graphique et déploiement de la stratégie marketing digital.",
    coverImage: "https://gradus.ma/wp-content/uploads/2022/08/INSTAGRAM-DAR-DADA.png",
    galleryImages: [
      "https://gradus.ma/wp-content/uploads/2022/08/CARTE-BOISSONS-DARDADA-900x665.png",
      "https://gradus.ma/wp-content/uploads/2022/08/CARTE-VISITE-dardada-900x600.png",
      "https://gradus.ma/wp-content/uploads/2022/08/BROCHURE-DAR-DADA-900x600.png",
      "https://gradus.ma/wp-content/uploads/2022/08/STORY-INSTAGRAM-DARDADA-900x600.png",
      "https://gradus.ma/wp-content/uploads/2022/08/STORY-INSTAGRAM-DARDADA-2-900x600.png",
      "https://gradus.ma/wp-content/uploads/2022/08/PANNEAU-RAMADAN-DARDADA-723x900.png"
    ],
    videos: [],
    format: "half"
  },
  // ROW 3: Full
  {
    id: "pocknroll",
    client: "Pock'n'roll Baker",
    year: "2023",
    category: "Photo & Vidéo · Social Media",
    tags: ["Photo", "Vidéo", "Social Media"],
    description: "Création de contenu digital pour les réseaux sociaux — photo shooting, production vidéo et montage pour Pock'n'roll Baker.",
    coverImage: "https://gradus.ma/wp-content/uploads/2022/09/1V9A6704vv-721x900.jpg",
    galleryImages: [
      "https://gradus.ma/wp-content/uploads/2022/09/1V9A6877-600x900.jpg",
      "https://gradus.ma/wp-content/uploads/2022/09/1V9A6681-720x900.png"
    ],
    videos: [
      "https://gradus.ma/wp-content/uploads/2022/09/pocknroll-First-G_1.mp4",
      "https://gradus.ma/wp-content/uploads/2023/02/2.MAIN-COMP-VERTICAL_1-1.mp4",
      "https://gradus.ma/wp-content/uploads/2022/09/blue-mojito.mp4",
      "https://gradus.ma/wp-content/uploads/2023/02/pnr-sponsor-Levallois-4.mp4"
    ],
    format: "full"
  },
  // ROW 4: 2 columns
  {
    id: "birds-rooftop",
    client: "Birds Rooftop",
    year: "2022",
    category: "Branding · Print",
    tags: ["Branding", "Print", "3D"],
    description: "Création de la marque Birds Rooftop — enseigne, sous-verres, menu et supports de communication print et digital.",
    coverImage: "https://gradus.ma/wp-content/uploads/2023/01/ENSEIGNE-BIRDS.png",
    galleryImages: [
      "https://gradus.ma/wp-content/uploads/2023/01/ENSEIGNE-BIRDS-900x820.png",
      "https://gradus.ma/wp-content/uploads/2023/01/SOUS-VERRE-BIRDS-600x900.png",
      "https://gradus.ma/wp-content/uploads/2022/08/MENU-BIRDS-900x729.png"
    ],
    videos: [],
    format: "half"
  },
  {
    id: "the-cloud-identity",
    client: "The Cloud",
    year: "2022",
    category: "Branding · Social Media",
    tags: ["Branding", "Social Media", "Print"],
    description: "Création des supports de communication print et digital pour The Cloud — menu, sous-verre, check de caisse et contenu vidéo réseaux sociaux.",
    coverImage: "https://gradus.ma/wp-content/uploads/2023/01/MENU-THE-CLOUD-841x900.png",
    galleryImages: [
      "https://gradus.ma/wp-content/uploads/2022/08/SOUS-VERRE-CLOUD-1-883x900.png",
      "https://gradus.ma/wp-content/uploads/2022/08/restaurant-check-CLOUD-900x741.png"
    ],
    videos: [
      "https://gradus.ma/wp-content/uploads/2022/08/312613019_537771174462737_4973006465430190346_n.mp4"
    ],
    format: "half"
  },
  // ROW 5: Full
  {
    id: "manaos",
    client: "Manaos",
    year: "2023",
    category: "Photo & Vidéo",
    tags: ["Production Vidéo"],
    description: "Production vidéo et montage pour le restaurant Manaos — déclinaisons Afro-Latin, 80s et clip général.",
    coverImage: "https://gradus.ma/wp-content/uploads/2022/09/Capture-decran-2023-03-02-a-17.12.04.png",
    galleryImages: [],
    videos: [
      "https://gradus.ma/wp-content/uploads/2022/09/manaos-afro-latin-.mp4",
      "https://gradus.ma/wp-content/uploads/2023/03/MANAOS-80S_1.mp4",
      "https://gradus.ma/wp-content/uploads/2022/09/manaos-general_1.mp4"
    ],
    format: "full"
  },
  // ROW 6: 3 columns
  {
    id: "chez-lola",
    client: "Chez Lola",
    year: "2021",
    category: "Social Media · Print",
    tags: ["Social Media", "Print"],
    description: "Création de contenu multimédia et gestion des réseaux sociaux pour le restaurant Chez Lola.",
    coverImage: "https://gradus.ma/wp-content/uploads/2022/08/MENU-CHEZ-LOLA-900x900.png",
    galleryImages: [
      "https://gradus.ma/wp-content/uploads/2022/08/menu-boissons-chez-lola-2-900x882.png",
      "https://gradus.ma/wp-content/uploads/2022/08/MOCKUP34-900x719.png"
    ],
    videos: [],
    format: "third"
  },
  {
    id: "corniche",
    client: "Corniche Baker",
    year: "2023",
    category: "3D",
    tags: ["Conception 3D"],
    description: "Conception 3D et rendu de façade pour l'espace Corniche à Casablanca.",
    coverImage: "https://gradus.ma/wp-content/uploads/2022/08/rendu-3D-de-facade-conrniche-casablanca-gradus-agency.jpg",
    galleryImages: [
      "https://gradus.ma/wp-content/uploads/2022/08/design-de-facade-corniche-casablanca-900x506.jpg",
      "https://gradus.ma/wp-content/uploads/2022/08/rendu-3D-de-facade-conrniche-casablanca-gradus-agency-900x506.jpg"
    ],
    videos: [],
    format: "third"
  },
  {
    id: "the-cloud-flyer",
    client: "The Cloud",
    year: "2023",
    category: "Print · Social Media",
    tags: ["Graphique Design", "Social Media"],
    description: "Conception graphique de flyers pour les réseaux sociaux de The Cloud.",
    coverImage: "https://gradus.ma/wp-content/uploads/2022/09/flyer-the-cloud-amine-506x900.jpg",
    galleryImages: [
      "https://gradus.ma/wp-content/uploads/2023/02/WhatsApp-Image-2023-01-30-at-16.12.49-506x900.jpeg"
    ],
    videos: [],
    format: "third"
  },
  // ROW 7: 2 columns
  {
    id: "beach-mama",
    client: "Beach Mama",
    year: "2023",
    category: "Photo & Vidéo",
    tags: ["Production Vidéo", "Photo Shooting"],
    description: "Shooting vidéo cocktail pour le restaurant Beach Mama.",
    coverImage: "https://gradus.ma/wp-content/uploads/2022/09/Capture-decran-2023-03-02-a-17.04.39.png",
    galleryImages: [],
    videos: [
      "https://gradus.ma/wp-content/uploads/2023/03/beachmama-cocktail_1.mp4"
    ],
    format: "half"
  },
  {
    id: "coco-lounge",
    client: "Coco Lounge",
    year: "2022",
    category: "Photo & Vidéo · Social Media",
    tags: ["Production Vidéo", "Social Media"],
    description: "Shooting vidéo et montage pour Coco Lounge — clips réseaux sociaux ambiance lounge.",
    coverImage: "https://gradus.ma/wp-content/uploads/2022/09/10000000_126120890365340_2615874416023205828_n.mp4",
    galleryImages: [],
    videos: [
      "https://gradus.ma/wp-content/uploads/2022/09/10000000_126120890365340_2615874416023205828_n.mp4",
      "https://gradus.ma/wp-content/uploads/2023/02/312152766_658061312453589_151332484075519709_n.mp4",
      "https://gradus.ma/wp-content/uploads/2023/02/10000000_1828799334123143_6920636884821656930_n.mp4"
    ],
    format: "half"
  },
  // ROW 8: 2 columns
  {
    id: "louna",
    client: "Louna",
    year: "2023",
    category: "Photo & Vidéo · Social Media",
    tags: ["Production Vidéo", "Social Media"],
    description: "Création de contenu média pour les réseaux sociaux de Louna — shooting et montage vidéo.",
    coverImage: "https://gradus.ma/wp-content/uploads/2022/09/Capture-decran-2023-03-02-a-17.16.43.png",
    galleryImages: [],
    videos: [
      "https://gradus.ma/wp-content/uploads/2023/03/louna-restaurant.mp4",
      "https://gradus.ma/wp-content/uploads/2023/03/Louna-Dance_1.mp4"
    ],
    format: "half"
  },
  {
    id: "manos",
    client: "Manos",
    year: "2022",
    category: "Print",
    tags: ["Graphique Design", "Print"],
    description: "Design graphique d'un menu dépliant pour le client Manos.",
    coverImage: "https://gradus.ma/wp-content/uploads/2023/01/301426983_482436530393269_8186556893304159070_n-900x900.jpg",
    galleryImages: [
      "https://gradus.ma/wp-content/uploads/2023/01/301616930_488301442634914_2034513547291059363_n-900x900.jpg"
    ],
    videos: [],
    format: "half"
  }
];
