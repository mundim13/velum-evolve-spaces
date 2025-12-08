import { Bell } from "lucide-react";

const CalculadoraTeaser = () => {
  return (
    <section id="calculadora" className="py-20 md:py-28 px-4 bg-background-alt">
      <div className="container mx-auto max-w-4xl text-center">
        <div className="velum-card py-12 px-8">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Bell className="w-8 h-8 text-primary" />
          </div>

          <h2 className="font-syncopate text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-4">
            CALCULADORA INTELIGENTE DE OBRAS (EM BREVE)
          </h2>

          <p className="font-montserrat text-lg text-muted-foreground mb-8">
            Estamos desenvolvendo uma ferramenta exclusiva que permitirá simular o investimento da sua obra com precisão.
          </p>

          <button
            data-whatsapp="true"
            data-msg="Olá! Quero ser avisado quando a calculadora de obras estiver disponível."
            className="btn-velum-primary"
          >
            Quero ser avisado
          </button>
        </div>
      </div>
    </section>
  );
};

export default CalculadoraTeaser;