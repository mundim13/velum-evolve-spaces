import { Brain, Clock, TrendingDown, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

const Calculator = () => {
  return (
    <section id="orcamentos" className="scroll-mt-28 py-20 md:py-24 px-4 bg-gradient-to-b from-secondary/30 to-background">
      <div className="container mx-auto max-w-4xl text-center">
        {/* Header */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <Brain className="w-8 h-8 md:w-10 md:h-10 text-primary-variant" />
          <h2 className="text-3xl md:text-4xl font-bold">
            Planeje com <span className="gradient-text">Inteligência</span>
          </h2>
        </div>

        {/* Description */}
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
          Veja quanto tempo você pode economizar com a metodologia <strong className="text-foreground">VELUM</strong>:
          <br className="hidden md:block" />
          Obras até <strong className="text-foreground">70% mais rápidas</strong>, custos{" "}
          <strong className="text-foreground">previsíveis</strong> desde o início
          e uma jornada <strong className="text-foreground">sem sujeira, sem dor de cabeça</strong>.
        </p>

        {/* Benefits Grid */}
        <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto mb-12">
          <div className="flex flex-col items-center gap-3 p-6 rounded-lg bg-card hover:shadow-card transition-shadow">
            <Clock className="w-10 h-10 text-primary-variant" />
            <p className="text-sm md:text-base text-foreground font-medium">
              Economia real de tempo e recursos
            </p>
          </div>
          <div className="flex flex-col items-center gap-3 p-6 rounded-lg bg-card hover:shadow-card transition-shadow">
            <TrendingDown className="w-10 h-10 text-primary-variant" />
            <p className="text-sm md:text-base text-foreground font-medium">
              Planejamento transparente e previsível
            </p>
          </div>
          <div className="flex flex-col items-center gap-3 p-6 rounded-lg bg-card hover:shadow-card transition-shadow">
            <Shield className="w-10 h-10 text-primary-variant" />
            <p className="text-sm md:text-base text-foreground font-medium">
              Tecnologia a favor do seu conforto
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <Button
          data-whatsapp="true"
          data-msg="Olá! Quero entender quanto tempo e investimento meu projeto precisa com a metodologia Velum."
          size="lg"
          className="h-14 px-8 text-base md:text-lg font-semibold bg-gradient-to-r from-primary-variant to-primary hover:opacity-90 text-white transition-all duration-300 hover:scale-105 hover:shadow-[0_4px_12px_rgba(0,118,255,0.3)]"
        >
          Simular comigo no WhatsApp 💬
        </Button>
      </div>
    </section>
  );
};

export default Calculator;
