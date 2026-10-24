import { describe, expect, it } from "vitest";
import { buscarCidade, entregaPara } from "./entrega";
import { CONFIG_INICIAL, aplicarAtalho, buscarAtalho, reduzir } from "./estado";
import { CHAVE, carregarConfig, salvarConfig, validarConfig } from "./persistencia";
import { calcularPreco, kitAirbnbDisponivel, kitMobiliaDe } from "./preco";
import { usoDaConfig } from "./regras";
import { mensagemWhatsApp, montarProposta, nomeValido, resumoConfig, telefoneValido } from "./saida";
import type { Config } from "./tipos";

const comAtalho = (id: string) => aplicarAtalho(CONFIG_INICIAL, buscarAtalho(id)!);
const total = (c: Config) => calcularPreco(c).total;
const com = (c: Config, ...acoes: Parameters<typeof reduzir>[1][]) => acoes.reduce(reduzir, c);

describe("uso e kit mobília (passo 7)", () => {
  it.each([
    ["cazita", "suite", 6500],
    ["caseiro", "suite", 6500],
    ["estudio", "estudio", 8000],
    ["gourmet", "gourmet", 5500],
    ["escritorio", "escritorio", 5000],
    ["loja", "loja", 5000],
    ["academia", "academia", 12000],
    ["brinquedoteca", "brinquedoteca", 4000],
  ])("%s usa o kit %s (R$ %i)", (atalho, uso, valor) => {
    const c = comAtalho(atalho);
    expect(usoDaConfig(c)).toBe(uso);
    expect(total(com(c, { tipo: "kitMobilia", valor: true })) - total(c)).toBe(valor);
  });

  it("estar sem banheiro e sem cozinha não tem kit", () => {
    const c = com(CONFIG_INICIAL, { tipo: "zerar" }, { tipo: "kitMobilia", valor: true });
    expect(kitMobiliaDe(c)).toBeNull();
    expect(total(c)).toBe(62000 + 3500);
  });

  it("o kit acompanha a troca de aplicação", () => {
    const c = com(CONFIG_INICIAL, { tipo: "kitMobilia", valor: true }, { tipo: "vivencia", valor: "academia" });
    expect(calcularPreco(c).itens.find((i) => i.grupo === "Kit mobília")?.venda).toBe(12000);
  });
});

describe("opcionais externos (passo 8)", () => {
  it("deck, pergolado e fundação somam pelos valores da tabela", () => {
    const c = com(
      CONFIG_INICIAL,
      { tipo: "opcional", chave: "deck", valor: true },
      { tipo: "opcional", chave: "pergolado", valor: true },
      { tipo: "opcional", chave: "fundacao", valor: true },
    );
    expect(total(c)).toBe(80000 + 7200 + 6000 + 4500);
  });

  it("pergolado só existe com deck", () => {
    expect(com(CONFIG_INICIAL, { tipo: "opcional", chave: "pergolado", valor: true }).extras.pergolado).toBe(false);
    const semDeck = com(
      CONFIG_INICIAL,
      { tipo: "opcional", chave: "deck", valor: true },
      { tipo: "opcional", chave: "pergolado", valor: true },
      { tipo: "opcional", chave: "deck", valor: false },
    );
    expect(semDeck.extras.pergolado).toBe(false);
    expect(total(semDeck)).toBe(80000);
  });

  it("kit Airbnb só em suíte e estúdio", () => {
    const airbnb = { tipo: "opcional", chave: "kitAirbnb", valor: true } as const;
    expect(total(com(comAtalho("cazita"), airbnb))).toBe(80000 + 3500);
    expect(total(com(comAtalho("estudio"), airbnb))).toBe(84000 + 3500);
    const loja = com(comAtalho("loja"), airbnb);
    expect(kitAirbnbDisponivel(loja)).toBe(false);
    expect(total(loja)).toBe(74000);
  });
});

describe("entrega (passo 9)", () => {
  it("encontra a cidade sem acento, maiúscula ou UF", () => {
    expect(buscarCidade("goiania")?.nome).toBe("Goiânia");
    expect(buscarCidade("Rio Verde - GO")?.km).toBe(230);
    expect(buscarCidade("anapolis/go")?.nome).toBe("Anápolis");
  });

  it("na região o frete está incluso", () => {
    const c = com(CONFIG_INICIAL, { tipo: "entrega", valor: entregaPara("Aparecida de Goiânia") });
    expect(c.entrega.modo).toBe("regiao");
    expect(total(c)).toBe(80000);
  });

  it("fora da região cobra R$ 12 por km", () => {
    const c = com(CONFIG_INICIAL, { tipo: "entrega", valor: entregaPara("Rio Verde") });
    expect(total(c)).toBe(80000 + 230 * 12);
    expect(calcularPreco(c).itens.find((i) => i.id === "frete")?.nota).toBe("230 km × R$ 12/km");
  });

  it("cidade fora da tabela fica sob consulta, fora do total", () => {
    const c = com(CONFIG_INICIAL, { tipo: "entrega", valor: entregaPara("Cuiabá") });
    const r = calcularPreco(c);
    expect(r.total).toBe(80000);
    expect(r.sobConsulta).toContain("Frete até Cuiabá");
  });
});

describe("configuração guardada no navegador", () => {
  const memoria = () => {
    const dados = new Map<string, string>();
    return { getItem: (k: string) => dados.get(k) ?? null, setItem: (k: string, v: string) => void dados.set(k, v) };
  };

  it("salva e recupera a configuração inteira", () => {
    const m = memoria();
    const c = com(
      comAtalho("estudio"),
      { tipo: "cor", valor: "grafite" },
      { tipo: "opcional", chave: "deck", valor: true },
      { tipo: "entrega", valor: entregaPara("Rio Verde") },
    );
    salvarConfig(c, m);
    expect(carregarConfig(m)).toEqual(c);
  });

  it("sem nada salvo, ou com lixo, abre o Cazita", () => {
    const m = memoria();
    expect(carregarConfig(m)).toEqual(CONFIG_INICIAL);
    m.setItem(CHAVE, "{não é json");
    expect(carregarConfig(m)).toEqual(CONFIG_INICIAL);
    expect(carregarConfig(null)).toEqual(CONFIG_INICIAL);
  });

  it("descarta valores desconhecidos e mantém as regras", () => {
    const c = validarConfig({
      banheiro: "piscina",
      vivencia: "academia",
      esquadria: { face: "fundo", tamanho: "fora" },
      extras: { pergolado: true, deck: false, fundacao: "sim" },
      entrega: { modo: "fora", cidade: "X".repeat(500), km: -3 },
      comprimento: 40,
    });
    expect(c.banheiro).toBe(CONFIG_INICIAL.banheiro);
    expect(c.vivencia).toBe("academia");
    expect(c.esquadria.face).toBe("testada");
    expect(c.extras.pergolado).toBe(false);
    expect(c.extras.fundacao).toBe(false);
    expect(c.entrega.cidade.length).toBeLessThanOrEqual(80);
    expect(c.entrega.km).toBeNull();
    expect(c.comprimento).toBe(6);
  });
});

describe("saída para WhatsApp e /propostas", () => {
  const contato = { nome: "Maria Silva", telefone: "(62) 99999-0000" };

  it("valida nome e telefone com DDD", () => {
    expect(nomeValido(" M ")).toBe(false);
    expect(nomeValido("Maria")).toBe(true);
    expect(telefoneValido("(62) 99999-0000")).toBe(true);
    expect(telefoneValido("+55 62 3333-4444")).toBe(true);
    expect(telefoneValido("99999-0000")).toBe(false);
  });

  it("a mensagem traz o resumo, o total, o link e o contato", () => {
    const c = com(comAtalho("cazita"), { tipo: "kitMobilia", valor: true });
    const r = calcularPreco(c);
    const msg = mensagemWhatsApp(c, r, contato, "https://www.grupovelum.com/proposta/abc");
    expect(msg).toContain("• Aplicação: Cazita (Airbnb)");
    expect(msg).toContain("• Kit mobília: Kit suíte");
    expect(msg).toContain("Total estimado: R$ 86.500");
    expect(msg).toContain("Ligações de água, esgoto e luz: sob consulta");
    expect(msg).toContain("Proposta: https://www.grupovelum.com/proposta/abc");
    expect(msg).toContain("Nome: Maria Silva");
  });

  it("sem link (proposta não gravada), a mensagem sai mesmo assim", () => {
    const msg = mensagemWhatsApp(CONFIG_INICIAL, calcularPreco(CONFIG_INICIAL), contato, null);
    expect(msg).not.toContain("Proposta:");
  });

  it("a proposta usa o formato da página /proposta/:token", () => {
    const c = com(comAtalho("cazita"), { tipo: "entrega", valor: entregaPara("Rio Verde") });
    const r = calcularPreco(c);
    const p = montarProposta(c, r, contato);
    expect(p.p_total).toBe(r.total);
    expect(p.p_itens.reduce((s, i) => s + i.unit_price, 0)).toBe(r.total);
    expect(p.p_itens.every((i) => i.quantity === 1 && typeof i.description === "string")).toBe(true);
    expect(p.p_notas.split("\n").every((l) => l.startsWith("•"))).toBe(true);
    expect(p.p_titulo).toBe("Módulo 3x6 · Cazita (Airbnb)");
    expect(resumoConfig(c).find(([r]) => r === "Entrega")?.[1]).toBe("Rio Verde - GO (230 km)");
  });
});
