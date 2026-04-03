import { Helmet } from "react-helmet-async";

const BASE_URL = "https://www.grupovelum.com";

interface SeoHeadProps {
  title: string;
  description: string;
  path: string;
  schema?: object | object[];
  ogImage?: string;
}

export default function SeoHead({
  title,
  description,
  path,
  schema,
  ogImage = `${BASE_URL}/og-velum.jpg`,
}: SeoHeadProps) {
  const canonical = `${BASE_URL}${path}`;
  const fullTitle = `${title} | VELUM`;

  const schemas = Array.isArray(schema) ? schema : schema ? [schema] : [];

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="VELUM" />
      <meta property="og:locale" content="pt_BR" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(s)}
        </script>
      ))}
    </Helmet>
  );
}

/* ── Schema.org helpers ── */

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "VELUM",
  url: BASE_URL,
  logo: `${BASE_URL}/og-velum.jpg`,
  description: "Construa com prazo garantido e preço fechado. Projeto, gestão e obra integrados em Light Steel Frame.",
  telephone: "+5562999447553",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Goiânia",
    addressRegion: "GO",
    addressCountry: "BR",
  },
  sameAs: [
    "https://www.instagram.com/velum.fab/",
  ],
};

export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "VELUM Arquitetura e Construção Industrializada",
  url: BASE_URL,
  telephone: "+5562999447553",
  email: "contato@grupovelum.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Goiânia",
    addressRegion: "GO",
    addressCountry: "BR",
  },
  priceRange: "$$",
  openingHours: "Mo-Sa 08:00-18:00",
  description: "Construa com prazo garantido e preço fechado. Projeto, gestão e obra integrados em Light Steel Frame.",
};
