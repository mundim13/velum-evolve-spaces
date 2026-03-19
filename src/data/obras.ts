export interface Obra {
  id: string;
  titulo: string;
  tipo: "residencial" | "comercial" | "modular";
  localizacao: string;
  area: string;
  descricao: string;
  imagens: string[];
  destaque?: boolean;
}

export const obras: Obra[] = [
  {
    id: "residencia-alphaville",
    titulo: "Residência Alphaville",
    tipo: "residencial",
    localizacao: "Alphaville Flamboyant, Goiânia",
    area: "320 m²",
    descricao: "Residência contemporânea com integração total entre áreas sociais e jardim.",
    imagens: [],
    destaque: true,
  },
  {
    id: "clinica-setor-bueno",
    titulo: "Clínica Setor Bueno",
    tipo: "comercial",
    localizacao: "Setor Bueno, Goiânia",
    area: "180 m²",
    descricao: "Clínica odontológica com design biofílico e conforto acústico.",
    imagens: [],
  },
  {
    id: "lum-studio-modelo",
    titulo: "LÛM Studio — Modelo",
    tipo: "modular",
    localizacao: "Showroom VELUM, Goiânia",
    area: "28 m²",
    descricao: "Primeiro módulo LÛM Studio montado como showroom da coletânea.",
    imagens: [],
    destaque: true,
  },
  {
    id: "casa-jardins-paris",
    titulo: "Casa Jardins Paris",
    tipo: "residencial",
    localizacao: "Jardins Paris, Goiânia",
    area: "450 m²",
    descricao: "Residência de alto padrão com automação completa e piscina aquecida.",
    imagens: [],
  },
];
