import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SeoHead from "@/components/SeoHead";
import Breadcrumbs from "@/components/Breadcrumbs";
import { useForm } from "react-hook-form";
import { MessageCircle, Mail, Instagram, MapPin, ArrowRight } from "lucide-react";

interface ContatoForm {
  nome: string;
  telefone: string;
  email: string;
  assunto: string;
  mensagem: string;
}

export default function Contato() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContatoForm>();

  const onSubmit = (data: ContatoForm) => {
    const texto = `Olá! Meu nome é ${data.nome}.%0A` +
      `Telefone: ${data.telefone}%0A` +
      `Email: ${data.email}%0A` +
      `Assunto: ${data.assunto}%0A` +
      `Mensagem: ${data.mensagem}`;
    window.open(`https://wa.me/5562999447553?text=${texto}`, "_blank");
  };

  const inputBase =
    "w-full rounded-md border px-3 py-3 text-sm text-white placeholder:text-gray-500 font-dm focus:outline-none focus:border-[#22D3EE] transition-colors";
  const inputStyle = {
    background: "rgba(255,255,255,0.04)",
    borderColor: "rgba(34,211,238,0.15)",
  };

  return (
    <div className="min-h-screen font-dm" style={{ background: "#0D0D0D", color: "#F9FAFB" }}>
      <SeoHead
        title="Contato"
        description="Fale com a Velum. Atendimento em Goiânia e Distrito Federal. WhatsApp, email e formulário de contato."
        path="/contato"
        schema={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: "Contato VELUM",
          url: "https://www.grupovelum.com/contato",
        }}
      />
      <Navbar />

      {/* Hero */}
      <section
        id="main"
        className="flex items-center justify-center text-center px-6"
        style={{ background: "#0D0D0D", paddingTop: 56, minHeight: "40vh" }}
      >
        <div>
          <Breadcrumbs current="Contato" path="/contato" />
          <p
            className="font-syncopate uppercase tracking-[0.3em] mb-4"
            style={{ fontSize: 10, color: "#22D3EE" }}
          >
            CONTATO
          </p>
          <h1 className="font-syncopate font-bold text-3xl md:text-5xl mb-4" style={{ color: "#fff" }}>
            VAMOS CONSTRUIR{" "}
            <span style={{ color: "#22D3EE" }}>JUNTOS</span>
          </h1>
          <p className="font-dm text-base md:text-lg max-w-xl mx-auto" style={{ color: "#9CA3AF" }}>
            Estamos em Goiânia e no Distrito Federal. Escolha o melhor caminho para falar com a gente.
          </p>
        </div>
      </section>

      {/* Main grid */}
      <section className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left — contact cards */}
        <div className="flex flex-col gap-6">
          {/* WhatsApp */}
          <div
            className="rounded-[10px] p-6"
            style={{
              background: "rgba(34,211,238,0.04)",
              border: "1px solid rgba(34,211,238,0.13)",
            }}
          >
            <div className="flex items-center gap-3 mb-2">
              <MessageCircle size={20} color="#22D3EE" />
              <span className="font-syncopate font-bold text-sm">(62) 99944-7553</span>
            </div>
            <p className="font-dm text-sm mb-4" style={{ color: "#9CA3AF" }}>
              Resposta rápida, atendimento de segunda a sábado
            </p>
            <a
              href="https://wa.me/5562999447553?text=Ol%C3%A1!%20Vim%20pelo%20site%20da%20Velum%20e%20gostaria%20de%20falar%20com%20um%20especialista."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-semibold transition-opacity hover:opacity-90"
              style={{ background: "#22D3EE", color: "#050505" }}
            >
              Falar via WhatsApp <ArrowRight size={14} />
            </a>
          </div>

          {/* Email */}
          <div
            className="rounded-[10px] p-6"
            style={{
              background: "rgba(34,211,238,0.04)",
              border: "1px solid rgba(34,211,238,0.13)",
            }}
          >
            <div className="flex items-center gap-3 mb-2">
              <Mail size={20} color="#22D3EE" />
              <span className="font-syncopate font-bold text-sm">fernando@grupovelum.com</span>
            </div>
            <p className="font-dm text-sm mb-4" style={{ color: "#9CA3AF" }}>
              Para envio de projetos e documentos
            </p>
            <a
              href="mailto:fernando@grupovelum.com"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-semibold border transition-opacity hover:opacity-90"
              style={{ borderColor: "rgba(34,211,238,0.4)", color: "#22D3EE" }}
            >
              Enviar email <ArrowRight size={14} />
            </a>
          </div>

          {/* Instagram */}
          <div
            className="rounded-[10px] p-6"
            style={{
              background: "rgba(34,211,238,0.04)",
              border: "1px solid rgba(34,211,238,0.13)",
            }}
          >
            <div className="flex items-center gap-3 mb-2">
              <Instagram size={20} color="#22D3EE" />
              <span className="font-syncopate font-bold text-sm">@velum.fab</span>
            </div>
            <p className="font-dm text-sm mb-4" style={{ color: "#9CA3AF" }}>
              Acompanhe nossas obras e novidades
            </p>
            <a
              href="https://www.instagram.com/velum.fab/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-semibold border transition-opacity hover:opacity-90"
              style={{ borderColor: "rgba(34,211,238,0.4)", color: "#22D3EE" }}
            >
              Ver Instagram <ArrowRight size={14} />
            </a>
          </div>
        </div>

        {/* Right — form */}
        <div>
          <h2 className="font-syncopate text-sm tracking-widest uppercase mb-6" style={{ color: "#22D3EE" }}>
            Envie uma mensagem
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div>
              <input
                type="text"
                placeholder="Nome completo"
                className={inputBase}
                style={inputStyle}
                {...register("nome", { required: true })}
              />
              {errors.nome && <span className="text-red-400 text-xs mt-1">Campo obrigatório</span>}
            </div>
            <div>
              <input
                type="text"
                placeholder="Telefone / WhatsApp"
                className={inputBase}
                style={inputStyle}
                {...register("telefone", { required: true })}
              />
              {errors.telefone && <span className="text-red-400 text-xs mt-1">Campo obrigatório</span>}
            </div>
            <div>
              <input
                type="email"
                placeholder="Email"
                className={inputBase}
                style={inputStyle}
                {...register("email", { required: true })}
              />
              {errors.email && <span className="text-red-400 text-xs mt-1">Campo obrigatório</span>}
            </div>
            <div>
              <select
                className={inputBase}
                style={inputStyle}
                {...register("assunto", { required: true })}
                defaultValue=""
              >
                <option value="" disabled>Assunto</option>
                <option value="Orçamento de obra">Orçamento de obra</option>
                <option value="Coletânea LÛM">Coletânea LÛM</option>
                <option value="Viabilidade econômica">Viabilidade econômica</option>
                <option value="Outro">Outro</option>
              </select>
              {errors.assunto && <span className="text-red-400 text-xs mt-1">Campo obrigatório</span>}
            </div>
            <div>
              <textarea
                rows={4}
                placeholder="Mensagem"
                className={inputBase + " resize-none"}
                style={inputStyle}
                {...register("mensagem", { required: true })}
              />
              {errors.mensagem && <span className="text-red-400 text-xs mt-1">Campo obrigatório</span>}
            </div>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-md text-sm font-semibold transition-opacity hover:opacity-90"
              style={{ background: "#22D3EE", color: "#050505" }}
            >
              Enviar mensagem <ArrowRight size={14} />
            </button>
          </form>
        </div>
      </section>

      {/* Localização */}
      <section style={{ background: "#080808" }} className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-syncopate font-bold text-xl md:text-2xl mb-10 text-center">
            ONDE ESTAMOS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div
              className="rounded-[10px] p-6"
              style={{
                background: "rgba(34,211,238,0.04)",
                border: "1px solid rgba(34,211,238,0.13)",
              }}
            >
              <div className="flex items-center gap-3 mb-2">
                <MapPin size={16} color="#22D3EE" />
                <span className="font-syncopate font-bold text-sm">Goiânia, Goiás</span>
              </div>
              <p className="font-dm text-sm" style={{ color: "#9CA3AF" }}>
                Condomínios da região metropolitana e interior de Goiás
              </p>
            </div>
            <div
              className="rounded-[10px] p-6"
              style={{
                background: "rgba(34,211,238,0.04)",
                border: "1px solid rgba(34,211,238,0.13)",
              }}
            >
              <div className="flex items-center gap-3 mb-2">
                <MapPin size={16} color="#22D3EE" />
                <span className="font-syncopate font-bold text-sm">Brasília, DF</span>
              </div>
              <p className="font-dm text-sm" style={{ color: "#9CA3AF" }}>
                Projetos no Distrito Federal e entorno
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section
        className="px-6 py-16 text-center"
        style={{ background: "#0D0D0D" }}
      >
        <p className="font-syncopate font-bold text-lg md:text-xl mb-6">
          Análise inicial gratuita. Retorno em 48h.
        </p>
        <a
          href="https://wa.me/5562999447553?text=Ol%C3%A1!%20Vim%20pelo%20site%20da%20Velum%20e%20gostaria%20de%20falar%20com%20um%20especialista."
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-md text-sm font-semibold transition-opacity hover:opacity-90"
          style={{ background: "#22D3EE", color: "#050505" }}
        >
          <MessageCircle size={16} /> Falar via WhatsApp
        </a>
      </section>

      <Footer />
    </div>
  );
}
