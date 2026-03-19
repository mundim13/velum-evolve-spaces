export interface Modulo {
  id: string;
  nome: string;
  categoria: "residencial" | "comercial" | "gourmet" | "wellness";
  area: string;
  descricao: string;
  features: string[];
  preco?: string;
  imagem?: string;
}

export const modulos: Modulo[] = [
  {
    id: "lum-studio",
    nome: "LÛM Studio",
    categoria: "residencial",
    area: "28 m²",
    descricao: "Módulo compacto ideal para home office, estúdio ou espaço criativo.",
    features: ["Isolamento acústico", "Iluminação natural otimizada", "Pré-instalação elétrica e hidráulica"],
  },
  {
    id: "lum-habitat",
    nome: "LÛM Habitat",
    categoria: "residencial",
    area: "45 m²",
    descricao: "Espaço residencial completo com sala, cozinha e banheiro integrados.",
    features: ["Cozinha planejada", "Banheiro completo", "Varanda opcional"],
  },
  {
    id: "lum-gourmet",
    nome: "LÛM Gourmet",
    categoria: "gourmet",
    area: "35 m²",
    descricao: "Espaço gourmet completo para receber com conforto e estilo.",
    features: ["Churrasqueira integrada", "Bancada em granito", "Espaço para adega"],
  },
  {
    id: "lum-wellness",
    nome: "LÛM Wellness",
    categoria: "wellness",
    area: "20 m²",
    descricao: "Módulo dedicado a saúde e bem-estar: sauna, spa ou academia.",
    features: ["Ventilação cruzada", "Revestimento antimicrobiano", "Piso emborrachado"],
  },
  {
    id: "lum-comercial",
    nome: "LÛM Comercial",
    categoria: "comercial",
    area: "50 m²",
    descricao: "Módulo comercial flexível para lojas, clínicas ou escritórios.",
    features: ["Fachada personalizável", "Acessibilidade PCD", "Pré-instalação de ar-condicionado"],
  },
];
