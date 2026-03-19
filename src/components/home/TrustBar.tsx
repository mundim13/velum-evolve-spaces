import { Shield, Clock, Award, Ruler } from "lucide-react";

const credentials = [
  { icon: Shield, label: "Garantia contratual de prazo e preço" },
  { icon: Clock, label: "Obras entregues no prazo desde 2020" },
  { icon: Award, label: "CREA & CAU registrados" },
  { icon: Ruler, label: "Engenharia + Arquitetura integradas" },
];

export default function TrustBar() {
  return (
    <section className="bg-velum-bg2 border-y border-velum-border">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {credentials.map((item) => (
            <div key={item.label} className="flex items-start gap-3">
              <item.icon
                size={20}
                className="text-velum-accent mt-0.5 shrink-0"
              />
              <span className="font-dm text-sm text-velum-text/80 leading-snug">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
