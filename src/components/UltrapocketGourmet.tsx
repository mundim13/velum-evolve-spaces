import { CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const UltrapocketGourmet = () => {
  const specs = [
    "Técnica certa para cada espaço e estilo de vida",
    "Robustez tradicional com agilidade industrial",
    "Expansão modular sem desperdício nem ruptura",
    "Neuroarquitetura aplicada ao bem-estar diário",
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="ultrapocket" className="scroll-mt-28 py-20 px-4 bg-gradient-to-b from-background to-secondary">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <Badge className="bg-accent/10 text-accent border-accent/20 mb-4 px-4 py-2">
            Pré-venda exclusiva
          </Badge>
        </div>

        <p className="text-xl md:text-2xl text-center italic text-muted-foreground mb-8 leading-relaxed">
          "Mais do que uma área gourmet, um espaço que amadurece junto com a sua história."
        </p>

        <Card className="shadow-elevated mb-8">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold mb-6">Especificações Técnicas</h3>
            <div className="space-y-4">
              {specs.map((spec, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-accent flex-shrink-0 mt-0.5" />
                  <p className="text-foreground">{spec}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            size="lg"
            onClick={() => scrollToSection("orcamentos")}
            className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-white h-12 px-8"
          >
            Quero personalização
          </Button>
          <Button
            size="lg"
            variant="link"
            onClick={() => scrollToSection("colecao-lum")}
            className="w-full sm:w-auto text-primary-variant hover:text-primary-variant/80"
          >
            Ver próximos lançamentos
          </Button>
        </div>
      </div>
    </section>
  );
};

export default UltrapocketGourmet;
