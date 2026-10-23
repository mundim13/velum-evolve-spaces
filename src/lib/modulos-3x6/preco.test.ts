import { describe, expect, it } from "vitest";
import { CONFIG_INICIAL, aplicarAtalho, buscarAtalho, reduzir } from "./estado";
import { calcularPreco } from "./preco";
import { aberturas, areaRipadoFrontal, opcoesEsquadria, varianteEsquadria } from "./regras";
import type { Config } from "./tipos";

const comAtalho = (id: string) => aplicarAtalho(CONFIG_INICIAL, buscarAtalho(id)!);

describe("preço dos atalhos (sempre a soma da tabela)", () => {
  it.each([
    ["estudio", 84000],
    ["gourmet", 77400],
    ["cazita", 80000],
    ["caseiro", 80000],
    ["loja", 74000],
    ["escritorio", 70000],
    ["academia", 70000],
    ["brinquedoteca", 70000],
  ])("%s custa R$ %i", (id, total) => {
    expect(calcularPreco(comAtalho(id)).total).toBe(total);
  });

  it("abre com o Cazita carregado", () => {
    expect(CONFIG_INICIAL.atalho).toBe("cazita");
    expect(calcularPreco(CONFIG_INICIAL).total).toBe(80000);
  });

  it("começar do zero parte do módulo vazio com a vivência mais simples", () => {
    expect(calcularPreco(reduzir(CONFIG_INICIAL, { tipo: "zerar" })).total).toBe(62000 + 3500);
  });

  it("ligações ficam fora do total, como sob consulta", () => {
    expect(calcularPreco(CONFIG_INICIAL).sobConsulta).toContain("Ligações de água, esgoto e luz");
  });
});

describe("esquadria principal", () => {
  const lateralFora = (c: Config, face: "ladoA" | "ladoB" = "ladoA") =>
    reduzir(c, { tipo: "esquadria", face, tamanho: "fora" });

  it("fora a fora vira 4,50 m com banheiro ou cozinha e 6,00 m sem eles", () => {
    expect(varianteEsquadria(lateralFora(CONFIG_INICIAL))).toBe("fora450");
    expect(varianteEsquadria(lateralFora(comAtalho("escritorio")))).toBe("fora600");
    const soCozinha = reduzir(comAtalho("escritorio"), { tipo: "cozinha", valor: "copa" });
    expect(varianteEsquadria(lateralFora(soCozinha))).toBe("fora450");
  });

  it("vão acima de 3 m traz a etiqueta de verga reforçada, sem custo extra", () => {
    const r = calcularPreco(lateralFora(CONFIG_INICIAL));
    expect(r.etiquetas).toContain("Verga reforçada inclusa");
    expect(r.total).toBe(80000 + 10400);
    expect(calcularPreco(lateralFora(comAtalho("escritorio"))).total).toBe(70000 + 16800);
  });

  it("lateral parcial soma R$ 3.400 e não leva verga reforçada", () => {
    const c = reduzir(CONFIG_INICIAL, { tipo: "esquadria", face: "ladoB", tamanho: "parcial" });
    const r = calcularPreco(c);
    expect(r.total).toBe(83400);
    expect(r.etiquetas).toHaveLength(0);
  });

  it("testada só aceita a porta padrão; tocar numa lateral escolhe a parcial", () => {
    const naTestada = reduzir(CONFIG_INICIAL, { tipo: "esquadria", face: "testada", tamanho: "fora" });
    expect(naTestada.esquadria).toEqual({ face: "testada", tamanho: "padrao" });
    const tocouLateral = reduzir(CONFIG_INICIAL, { tipo: "esquadria", face: "ladoA" });
    expect(tocouLateral.esquadria).toEqual({ face: "ladoA", tamanho: "parcial" });
  });

  it("o vidro nunca invade a faixa do banheiro e o fundo nunca recebe esquadria", () => {
    for (const op of opcoesEsquadria(CONFIG_INICIAL)) {
      const c = { ...CONFIG_INICIAL, esquadria: { face: op.face, tamanho: op.tamanho } };
      const vao = aberturas(c).find((a) => a.id === "principal")!;
      expect(vao.face).not.toBe("fundo");
      if (vao.face !== "testada") expect(vao.u0).toBeGreaterThanOrEqual(-3 + 1.5 - 1e-9);
    }
  });

  it("banheiro sempre tem basculante; janela secundária só com a porta na testada", () => {
    const ids = (c: Config) => aberturas(c).map((a) => a.id);
    expect(ids(CONFIG_INICIAL)).toEqual(expect.arrayContaining(["basculante", "secundaria", "veneziana"]));
    const lateral = reduzir(CONFIG_INICIAL, { tipo: "esquadria", face: "ladoA" });
    expect(ids(lateral)).not.toContain("secundaria");
    expect(ids(comAtalho("escritorio"))).not.toContain("basculante");
  });
});

describe("fachada", () => {
  const ripadoFrontal = (c: Config) => reduzir(c, { tipo: "fachada", valor: "ripadoFrontal" });

  it("ripado frontal na testada: 4,5 m² a R$ 120 = R$ 540", () => {
    const c = ripadoFrontal(CONFIG_INICIAL);
    expect(areaRipadoFrontal(c)).toBeCloseTo(4.5, 5);
    expect(calcularPreco(c).total).toBe(80540);
  });

  it("ripado frontal numa lateral com vão de 3 m: 11,1 m² = R$ 1.332", () => {
    const c = ripadoFrontal(reduzir(CONFIG_INICIAL, { tipo: "esquadria", face: "ladoB" }));
    expect(areaRipadoFrontal(c)).toBeCloseTo(11.1, 5);
    expect(calcularPreco(c).total).toBe(80000 + 3400 + 1332);
  });

  it("ripado completo é fixo em R$ 5.600", () => {
    const c = reduzir(CONFIG_INICIAL, { tipo: "fachada", valor: "ripadoCompleto" });
    expect(calcularPreco(c).total).toBe(85600);
  });

  it("trocar de atalho mantém a fachada escolhida", () => {
    const c = reduzir(reduzir(CONFIG_INICIAL, { tipo: "cor", valor: "musgo" }), { tipo: "atalho", id: "loja" });
    expect(c.fachada.cor).toBe("musgo");
  });
});
