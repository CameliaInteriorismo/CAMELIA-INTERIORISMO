export type ProjectGalleryImages = {
  imageA?: string;
  pair1?: [string | undefined, string | undefined];
  imageB?: string;
  pair2?: [string | undefined, string | undefined];
};

// The only three service labels allowed anywhere in the project fichas —
// never a variant like "Proyecto de interiorismo" or "Ejecución de obra".
export type ProjectService =
  "Interiorismo" | "Decoración" | "Ejecución y supervisión de obra";

export type ProjectDetail = {
  slug: string;
  name: string;
  year: string;
  location: string;
  province: string;
  services: ProjectService[];
  heroVideo?: string;
  heroImage?: string;
  paragraphs: string[];
  gallery: ProjectGalleryImages;
};

// "Municipio (Provincia)" — except when the municipality IS the provincial
// capital itself (e.g. Valencia, Madrid), which reads on its own.
export function formatProjectLocation(project: ProjectDetail): string {
  return project.location === project.province
    ? project.location
    : `${project.location} (${project.province})`;
}

// Copy definitivo confirmado para los 5 proyectos. Vídeo de hero solo para
// los proyectos que ya lo tienen exportado en Diseño/Videos proyectos/
// (Ermita, Plaza Mayor) — el resto mantiene su imagen de la grid hasta que
// exista un vídeo. Galería con foto real solo para Ermita; el resto usa
// placeholders explícitos hasta tener las fotos de detalle.
export const PROJECT_DETAILS: Record<string, ProjectDetail> = {
  "plaza-mayor": {
    slug: "plaza-mayor",
    name: "Plaza Mayor",
    year: "[AÑO]",
    location: "Alzira",
    province: "Valencia",
    services: ["Interiorismo"],
    heroVideo: "/assets/proyectos/Video Plaza Mayor.mp4",
    paragraphs: [
      "Reforma integral de una vivienda en Alzira, desarrollada a partir de un vaciado completo, conservando únicamente la estructura original. Esto permitió replantear el espacio desde la base, sin condicionantes.",
      "El proyecto responde a la necesidad de una pareja joven, con una hija recién nacida, de adaptar una vivienda familiar a su forma de vida actual, priorizando el orden, el buen funcionamiento y la tranquilidad en el uso diario.",
      "Se renovaron instalaciones, ventanas y carpinterías, y se reorganizó la vivienda para mejorar su coherencia. La madera en tono roble, las molduras y el pavimento en espiga construyen una base cálida y equilibrada, acompañada por una iluminación indirecta más serena.",
      "La cocina, en un tono verde profundo, actúa como pieza central del conjunto, conectando con el resto de la vivienda a través de una puerta de roble macizo y vidrio.",
      "El resultado es un espacio pensado para mantenerse en el tiempo, donde cada decisión responde a un criterio claro.",
    ],
    gallery: {},
  },
  "llum-de-vila": {
    slug: "llum-de-vila",
    name: "Llum de Vila",
    year: "[AÑO]",
    location: "Alzira",
    province: "Valencia",
    services: ["Interiorismo", "Ejecución y supervisión de obra"],
    heroImage: "/assets/proyectos/Proyecto Llum de Vila - Cocina.jpg",
    paragraphs: [
      "Proyecto desarrollado en una vivienda en Alzira, concebida como un lienzo en blanco, donde una pareja joven buscaba empezar una nueva etapa y hacer suyo el espacio desde el principio. Aunque la cocina existente era reciente, resultaba excesivamente básica, lo que llevó a replantearla por completo y abrirla al comedor para dar continuidad y sentido al conjunto.",
      "El proyecto se construye desde una decisión clara y compartida: apostar por una propuesta que realmente representara a los clientes. La cocina, en un tono rosa empolvado con moldura, introduce una sensibilidad distinta, acompañada de un pavimento de gresite en tonos blanco, negro y rosa que aporta ritmo sin perder equilibrio.",
      "La madera oscura y los detalles en negro ayudan a sostener el conjunto, mientras que la iluminación indirecta envuelve el espacio de forma más tranquila. La apertura de un hueco con cristalera permite que la luz natural entre con mayor suavidad y acompañe el uso diario.",
      "El resultado es un espacio muy personal, pensado desde lo cotidiano, donde cada decisión busca generar una sensación de calma y coherencia en la forma de habitarlo.",
    ],
    gallery: {},
  },
  ermita: {
    slug: "ermita",
    name: "Ermita",
    year: "[AÑO]",
    location: "Alzira",
    province: "Valencia",
    services: ["Interiorismo", "Decoración", "Ejecución y supervisión de obra"],
    heroVideo: "/assets/proyectos/Video Ermita.mp4",
    paragraphs: [
      "Proyecto desarrollado en una vivienda de obra nueva en Alzira, entregada con un acabado básico y sin elementos que definieran el espacio. La clienta buscaba dotarla de calidez y hacerla más propia desde lo cotidiano.",
      "El trabajo se centró en la selección de iluminación, cortinas y piezas de mobiliario, incorporando elementos a medida como una vitrina en chapa de roble barnizada, junto con otras piezas que aportan equilibrio al conjunto. La terraza se plantea como una prolongación de la vivienda, con una pérgola bioclimática, estores y cortinas que permiten un uso más cómodo del espacio.",
      "Uno de los gestos más significativos del proyecto surge a partir de una alfombra persa de la clienta, que se coloca en la pared de la zona de lectura, aportando calidez a la doble altura y un carácter más personal.",
      "El resultado es una vivienda que gana identidad sin grandes cambios estructurales, construida desde decisiones cuidadas y pensada para vivirse con mayor calma.",
    ],
    gallery: {
      imageA: "/assets/proyectos/Proyecto Ermita - Salon Detalle.png",
      pair1: [
        "/assets/proyectos/Proyecto Ermita - Comedor.png",
        "/assets/proyectos/Proyecto Ermita - Vitrina.png",
      ],
      imageB: "/assets/proyectos/Proyecto Ermita - Terraza.png",
      pair2: [
        "/assets/proyectos/Proyecto Ermita - Pergola.png",
        "/assets/proyectos/Proyecto Ermita - Banco.png",
      ],
    },
  },
  somni: {
    slug: "somni",
    name: "Somni",
    year: "[AÑO]",
    location: "Algemesí",
    province: "Valencia",
    services: ["Interiorismo"],
    heroImage: "/assets/proyectos/Proyecto Somni - Puertas correderas.png",
    paragraphs: [
      "Reforma integral de una vivienda en Algemesí, desarrollada para una pareja joven que buscaba actualizar una vivienda familiar y adaptarla a su forma de vida actual.",
      "La intervención se planteó desde un vaciado completo, conservando únicamente la estructura, lo que permitió rehacer la vivienda desde la base. Se renovaron instalaciones y se reorganizó el espacio para mejorar su funcionamiento y dar coherencia al conjunto.",
      "La materialidad se apoya en una combinación de roble y blanco, construyendo una base equilibrada y luminosa. La pieza más representativa del proyecto son las puertas correderas de cuatro hojas, realizadas en madera maciza con vidrio, que permiten separar o conectar cocina y comedor según el momento.",
      "El resultado es una vivienda más ordenada y clara, donde cada elemento responde a una lógica de uso y donde el espacio se adapta con naturalidad al día a día.",
    ],
    gallery: {},
  },
  "atico-valencia": {
    slug: "atico-valencia",
    name: "Ático Valencia",
    year: "[AÑO]",
    location: "Valencia",
    province: "Valencia",
    services: ["Interiorismo", "Decoración", "Ejecución y supervisión de obra"],
    heroImage: "/assets/proyectos/Cocina Àtico Valencia.png",
    paragraphs: [
      "Proyecto desarrollado en una vivienda de obra nueva en Valencia, adquirida por una pareja joven que buscaba mejorar unos acabados iniciales demasiado básicos, tanto a nivel estético como funcional.",
      "El trabajo se centró en replantear los espacios principales, abriendo la cocina al comedor y sustituyéndola por una nueva propuesta más coherente con el conjunto. También se revisó la iluminación de la vivienda y se reformó el baño para actualizar sus materiales y equipamiento.",
      "A partir de ahí, se completó el proyecto con la selección y montaje de mobiliario y elementos decorativos, buscando dar continuidad al espacio y dejar la vivienda lista para su uso desde el primer momento.",
      "El resultado es un ático más equilibrado y habitable, donde pequeñas decisiones bien planteadas transforman la percepción y el uso del conjunto.",
    ],
    gallery: {},
  },
};
