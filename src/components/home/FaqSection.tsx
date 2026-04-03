import { useState } from "react";
import { Helmet } from "react-helmet-async";

interface Faq {
  question: string;
  answer: string;
}

const faqs: Faq[] = [
  {
    question: "O que é Light Steel Frame?",
    answer: "Light Steel Frame é um sistema construtivo industrializado que usa perfis de aço galvanizado leve. Permite construções mais rápidas, limpas e com alto controle de qualidade. Na Velum, é a base da maioria dos nossos projetos residenciais e da Coletânea LÛM.",
  },
  {
    question: "Qual o prazo médio de uma obra?",
    answer: "Depende da complexidade e do sistema construtivo. Obras em Light Steel Frame costumam ser entregues em semanas, não meses. Projetos maiores em concreto ou sistemas híbridos levam mais tempo, mas sempre com cronograma fechado antes de começar.",
  },
  {
    question: "O preço é realmente fechado?",
    answer: "Sim. Você recebe um orçamento detalhado antes de assinar o contrato. O valor é fixo e não muda durante a obra. Se houver qualquer alteração de escopo, ela é negociada e aprovada antes da execução.",
  },
  {
    question: "Vocês fazem projeto e obra?",
    answer: "Sim. Trabalhamos com um modelo integrado: arquitetura, engenharia e gestão na mesma equipe. Isso elimina retrabalho, melhora a comunicação e garante que o projeto seja executado exatamente como foi desenhado.",
  },
  {
    question: "Em quais regiões a Velum atua?",
    answer: "Atuamos em Goiânia, região metropolitana de Goiânia (Senador Canedo, Aparecida de Goiânia, Trindade) e no Distrito Federal. Projetos em outras regiões podem ser avaliados sob consulta.",
  },
  {
    question: "Como funciona o acompanhamento da obra?",
    answer: "Você acompanha tudo em tempo real pelo nosso portal do cliente, com diário de obra fotográfico, dashboard de previsto vs realizado, gestão de suprimentos e relatórios financeiros. Tudo acessível pelo celular ou computador.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: f.answer,
    },
  })),
};

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section
      style={{
        background: "#0D0D0D",
        padding: "80px 0",
        borderTop: "1px solid rgba(34,211,238,0.08)",
      }}
    >
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <div className="max-w-3xl mx-auto px-6">
        <div className="flex items-center justify-center gap-2 mb-10">
          <div style={{ width: 16, height: 1, background: "#22D3EE" }} />
          <span className="font-dm uppercase" style={{ fontSize: 9, letterSpacing: 2.5, color: "#22D3EE" }}>
            Dúvidas frequentes
          </span>
          <div style={{ width: 16, height: 1, background: "#22D3EE" }} />
        </div>

        <h2
          className="font-syncopate font-bold uppercase text-center mb-12"
          style={{ fontSize: 28, lineHeight: 1, color: "#F9FAFB" }}
        >
          PERGUNTAS FREQUENTES
        </h2>

        <div className="flex flex-col gap-3">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                style={{
                  borderRadius: 10,
                  border: `1px solid ${isOpen ? "rgba(34,211,238,0.25)" : "rgba(34,211,238,0.1)"}`,
                  background: isOpen ? "rgba(34,211,238,0.04)" : "transparent",
                  transition: "all 200ms ease",
                }}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="flex items-center justify-between w-full text-left"
                  style={{ padding: "18px 22px", minHeight: 44 }}
                >
                  <span className="font-dm font-medium" style={{ fontSize: 14, color: "#F9FAFB", paddingRight: 16 }}>
                    {faq.question}
                  </span>
                  <span
                    className="shrink-0 font-dm"
                    style={{
                      fontSize: 20,
                      lineHeight: 1,
                      color: "#22D3EE",
                      transition: "transform 200ms ease",
                      transform: isOpen ? "rotate(45deg)" : "none",
                    }}
                  >
                    +
                  </span>
                </button>

                <div
                  style={{
                    maxHeight: isOpen ? 300 : 0,
                    opacity: isOpen ? 1 : 0,
                    overflow: "hidden",
                    transition: "max-height 300ms ease, opacity 200ms ease",
                  }}
                >
                  <p
                    className="font-dm"
                    style={{
                      padding: "0 22px 20px",
                      fontSize: 13,
                      lineHeight: 1.7,
                      color: "rgba(249,250,251,0.5)",
                    }}
                  >
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
