import { Link } from "react-router-dom";

const PortfolioSection = () => {
  // Placeholder images - ideally these would be real portfolio images
  const portfolioItems = [
    { id: 1, title: "Projeto Residencial 1" },
    { id: 2, title: "Projeto Residencial 2" },
    { id: 3, title: "Projeto Comercial 1" },
    { id: 4, title: "Projeto Modular 1" },
    { id: 5, title: "Projeto Modular 2" },
    { id: 6, title: "Projeto Gourmet 1" },
  ];

  return (
    <section id="portfolio" className="py-20 md:py-28 px-4 bg-background">
      <div className="container mx-auto max-w-6xl">
        <h2 className="font-syncopate text-2xl sm:text-3xl md:text-4xl font-bold text-foreground text-center mb-4 tracking-wider">
          NOSSO PORTFÓLIO
        </h2>

        <p className="font-montserrat text-lg text-muted-foreground text-center mb-12">
          Conheça alguns dos projetos e obras que já realizamos.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {portfolioItems.map((item) => (
            <div
              key={item.id}
              className="velum-card aspect-video flex items-center justify-center"
            >
              <span className="font-montserrat text-muted-foreground text-sm">
                {item.title}
              </span>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            to="/portfolio"
            className="btn-velum-outline inline-block"
          >
            Ver portfólio completo
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;