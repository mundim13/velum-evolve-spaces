import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

interface BreadcrumbsProps {
  current: string;
  path: string;
}

export default function Breadcrumbs({ current, path }: BreadcrumbsProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.grupovelum.com/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: current,
        item: `https://www.grupovelum.com${path}`,
      },
    ],
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>
      <nav
        aria-label="Breadcrumb"
        className="font-dm"
        style={{ fontSize: 11, marginBottom: 16 }}
      >
        <ol className="flex items-center gap-1.5">
          <li>
            <Link
              to="/"
              style={{ color: "rgba(249,250,251,0.35)" }}
              className="hover:text-white transition-colors"
            >
              Home
            </Link>
          </li>
          <li style={{ color: "rgba(249,250,251,0.4)" }}>/</li>
          <li style={{ color: "rgba(249,250,251,0.55)" }}>{current}</li>
        </ol>
      </nav>
    </>
  );
}
