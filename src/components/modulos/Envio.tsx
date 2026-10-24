import { useState, type FormEvent } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import { formatarReais, type ResultadoPreco } from "@/lib/modulos-3x6/preco";
import { usoDaConfig } from "@/lib/modulos-3x6/regras";
import { mensagemWhatsApp, montarProposta, nomeValido, telefoneValido, type Contato } from "@/lib/modulos-3x6/saida";
import type { Config } from "@/lib/modulos-3x6/tipos";
import { VELUM_WHATSAPP, getUtm } from "@/lib/whatsapp";

type Falha = "limite" | "falha";
type Estado =
  | { fase: "formulario" }
  | { fase: "enviando" }
  | { fase: "pronto"; link: string | null; url: string; falha?: Falha };

const urlWhatsApp = (mensagem: string) => `https://wa.me/${VELUM_WHATSAPP}?text=${encodeURIComponent(mensagem + getUtm())}`;

/**
 * Grava a proposta (Supabase) e devolve o link /proposta/:token. Sem link, diz por quê: o limite de
 * 3 propostas por telefone em 24 h (aplicado no banco) ou uma falha qualquer.
 */
async function criarProposta(config: Config, resultado: ResultadoPreco, contato: Contato): Promise<{ link: string } | { falha: Falha }> {
  try {
    const p = montarProposta(config, resultado, contato);
    const { data, error } = await supabase.rpc("criar_proposta_simulador", {
      ...p,
      p_itens: p.p_itens as unknown as Json,
      p_configuracao: p.p_configuracao as unknown as Json,
    });
    if (error) return { falha: error.message.includes("limite de propostas") ? "limite" : "falha" };
    if (!data) return { falha: "falha" };
    return { link: `${window.location.origin}/proposta/${data}` };
  } catch {
    return { falha: "falha" };
  }
}

interface Props {
  aberto: boolean;
  onFechar: () => void;
  config: Config;
  resultado: ResultadoPreco;
}

/**
 * Saída do simulador: pede nome e telefone, grava a proposta em /propostas e abre o WhatsApp da Velum
 * com o resumo, o total e o link. Se a proposta não puder ser gravada, a mensagem sai mesmo assim.
 */
export function Envio({ aberto, onFechar, config, resultado }: Props) {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  // Campo-armadilha: invisível para pessoas; robôs que preenchem tudo caem nele e nada é gravado.
  const [armadilha, setArmadilha] = useState("");
  const [tentou, setTentou] = useState(false);
  const [estado, setEstado] = useState<Estado>({ fase: "formulario" });

  const nomeOk = nomeValido(nome);
  const telefoneOk = telefoneValido(telefone);

  const enviar = async (ev: FormEvent) => {
    ev.preventDefault();
    setTentou(true);
    if (!nomeOk || !telefoneOk) return;
    if (armadilha.trim()) {
      setEstado({ fase: "pronto", link: null, url: urlWhatsApp("") });
      return;
    }
    // A janela abre já no clique (senão o navegador bloqueia o pop-up depois da espera pela gravação).
    const janela = window.open("", "_blank");
    if (janela) janela.opener = null;
    setEstado({ fase: "enviando" });
    const contato = { nome, telefone };
    const gravada = await criarProposta(config, resultado, contato);
    const link = "link" in gravada ? gravada.link : null;
    const falha = "falha" in gravada ? gravada.falha : undefined;
    const url = urlWhatsApp(mensagemWhatsApp(config, resultado, contato, link));
    (window as unknown as { dataLayer?: unknown[] }).dataLayer?.push({
      event: "modulos_envio_whatsapp",
      uso: usoDaConfig(config) ?? "personalizado",
      atalho: config.atalho ?? "nenhum",
      total: resultado.total,
      proposta: !!link,
      falha: falha ?? "nenhuma",
    });
    if (janela) janela.location.href = url;
    else window.location.href = url;
    setEstado({ fase: "pronto", link, url, falha });
  };

  const fechar = () => {
    onFechar();
    if (estado.fase === "pronto") setEstado({ fase: "formulario" });
  };

  const campo = {
    minHeight: 48,
    padding: "10px 12px",
    borderRadius: 8,
    fontSize: 16,
    background: "rgba(255,255,255,0.03)",
    color: "#F9FAFB",
    width: "100%",
  } as const;
  const borda = (ok: boolean) => `1px solid ${tentou && !ok ? "#F87171" : "rgba(34,211,238,0.25)"}`;

  return (
    <Dialog open={aberto} onOpenChange={(v) => !v && fechar()}>
      <DialogContent className="font-dm max-w-md" style={{ background: "#0D0D0D", borderColor: "rgba(34,211,238,0.25)", color: "#F9FAFB" }}>
        {estado.fase !== "pronto" ? (
          <form onSubmit={enviar} className="grid gap-4" noValidate>
            <div>
              <DialogTitle className="font-syncopate uppercase" style={{ fontSize: 15, letterSpacing: 1 }}>
                Receber a proposta
              </DialogTitle>
              <DialogDescription className="font-dm" style={{ fontSize: 13, color: "rgba(249,250,251,0.6)", marginTop: 6 }}>
                Total estimado de {formatarReais(resultado.total)}. A gente gera a sua proposta com link e abre o WhatsApp da Velum com tudo
                preenchido.
              </DialogDescription>
            </div>
            <div aria-hidden="true" style={{ position: "absolute", left: -10000, top: "auto", width: 1, height: 1, overflow: "hidden" }}>
              <label>
                Empresa
                <input name="empresa" tabIndex={-1} autoComplete="off" value={armadilha} onChange={(e) => setArmadilha(e.target.value)} />
              </label>
            </div>
            <label className="grid gap-1.5">
              <span style={{ fontSize: 12, color: "rgba(249,250,251,0.6)" }}>Nome</span>
              <input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                autoComplete="name"
                maxLength={120}
                required
                aria-invalid={tentou && !nomeOk}
                style={{ ...campo, border: borda(nomeOk) }}
              />
              {tentou && !nomeOk && <span style={{ fontSize: 12, color: "#FCA5A5" }}>Digite seu nome.</span>}
            </label>
            <label className="grid gap-1.5">
              <span style={{ fontSize: 12, color: "rgba(249,250,251,0.6)" }}>Telefone com DDD</span>
              <input
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="(62) 99999-0000"
                maxLength={20}
                required
                aria-invalid={tentou && !telefoneOk}
                style={{ ...campo, border: borda(telefoneOk) }}
              />
              {tentou && !telefoneOk && <span style={{ fontSize: 12, color: "#FCA5A5" }}>Digite o telefone com DDD.</span>}
            </label>
            <button
              type="submit"
              disabled={estado.fase === "enviando"}
              className="font-medium hover:brightness-110 transition-all disabled:opacity-60"
              style={{ minHeight: 48, borderRadius: 8, fontSize: 14, background: "#22D3EE", color: "#050505" }}
            >
              {estado.fase === "enviando" ? "Gerando a proposta…" : "Enviar pelo WhatsApp"}
            </button>
            <p style={{ fontSize: 11, color: "rgba(249,250,251,0.4)" }}>
              Seu nome e telefone vão para a Velum só para o atendimento desta proposta.
            </p>
          </form>
        ) : (
          <div className="grid gap-4">
            <DialogTitle className="font-syncopate uppercase" style={{ fontSize: 15, letterSpacing: 1 }}>
              Pronto
            </DialogTitle>
            <DialogDescription style={{ fontSize: 13, color: "rgba(249,250,251,0.7)" }}>
              {estado.link
                ? "Sua proposta está pronta e o WhatsApp da Velum abriu com a mensagem. Se não abriu, use o botão abaixo."
                : estado.falha === "limite"
                  ? "Este telefone já gerou 3 propostas nas últimas 24 horas, então não criamos outro link. A sua configuração foi para o WhatsApp da Velum. Se não abriu, use o botão abaixo."
                  : "Não conseguimos gerar o link da proposta agora, mas a sua configuração foi para o WhatsApp da Velum. Se não abriu, use o botão abaixo."}
            </DialogDescription>
            <a
              href={estado.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-center font-medium"
              style={{ minHeight: 48, lineHeight: "48px", borderRadius: 8, fontSize: 14, background: "#22D3EE", color: "#050505" }}
            >
              Abrir o WhatsApp
            </a>
            {estado.link && (
              <a
                href={estado.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-center font-medium"
                style={{ minHeight: 48, lineHeight: "48px", borderRadius: 8, fontSize: 14, color: "#22D3EE", border: "1px solid rgba(34,211,238,0.45)" }}
              >
                Ver a proposta
              </a>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
