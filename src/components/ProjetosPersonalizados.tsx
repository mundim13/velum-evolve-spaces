const ProjetosPersonalizados = () => {
  return (
    <section id="personalizados" className="py-20 md:py-28 px-4 bg-background-alt">
      <div className="container mx-auto max-w-4xl text-center">
        <h2 className="font-syncopate text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-6">
          PROJETOS PERSONALIZADOS
        </h2>

        <p className="font-montserrat text-lg md:text-xl text-muted-foreground leading-relaxed mb-10">
          Para quem busca exclusividade total. Criamos projetos do zero, unindo arquitetura autoral, engenharia inteligente e gestão integrada — tudo para transformar seu terreno em um espaço único.
        </p>

        <button
          data-whatsapp="true"
          data-msg="Olá! Quero um projeto exclusivo e personalizado."
          className="btn-velum-primary"
        >
          Quero um projeto exclusivo
        </button>
      </div>
    </section>
  );
};

export default ProjetosPersonalizados;