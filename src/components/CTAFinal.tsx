const CTAFinal = () => {
  return (
    <section id="cta-final" className="py-24 md:py-32 px-4 bg-background diagonal-texture">
      <div className="container mx-auto max-w-4xl text-center relative z-10">
        <h2 className="font-syncopate text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
          PROJETO, GESTÃO E OBRA EM UM ÚNICO LUGAR
        </h2>

        <p className="font-montserrat text-xl md:text-2xl text-muted-foreground mb-12">
          Prazo garantido e preço fechado de verdade.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap">
          <a
            href="#coletanea-lum"
            className="btn-velum-primary text-center"
          >
            Quero conhecer os módulos LÛM
          </a>
          <button
            data-whatsapp="true"
            data-msg="Olá! Quero um projeto personalizado."
            className="btn-velum-outline text-center"
          >
            Quero um projeto personalizado
          </button>
          <button
            data-whatsapp="true"
            data-msg="Olá! Gostaria de falar com um especialista da Velum."
            className="btn-velum-outline text-center"
          >
            Falar com um especialista
          </button>
        </div>
      </div>
    </section>
  );
};

export default CTAFinal;