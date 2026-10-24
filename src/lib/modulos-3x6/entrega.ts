import { cidades, tabela, type Cidade, type Entrega } from "./tipos";

const normalizar = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();

/** Procura a cidade na tabela (sem diferença de acento e maiúscula; aceita "Cidade - UF" e "Cidade/UF"). */
export function buscarCidade(nome: string): Cidade | undefined {
  const [base] = nome.split(/\s*[-/,]\s*(?=[A-Za-z]{2}\s*$)/);
  const alvo = normalizar(base ?? nome);
  if (!alvo) return undefined;
  return cidades.find((c) => normalizar(c.nome) === alvo);
}

/**
 * Entrega para uma cidade informada pela pessoa (ou encontrada pelo CEP).
 * Nas cidades inclusas da tabela de preços o frete está no preço; nas demais, vale a distância da lista;
 * cidade fora da lista fica com frete sob consulta.
 */
export function entregaPara(nome: string, cep = ""): Entrega {
  const cidade = buscarCidade(nome);
  if (!cidade) return { modo: "fora", cidade: nome.trim(), cep, km: null };
  const rotulo = `${cidade.nome} - ${cidade.uf}`;
  const modo = tabela.opcionais.freteKm.cidadesInclusas.includes(cidade.nome) ? "regiao" : "fora";
  return { modo, cidade: rotulo, cep, km: cidade.km };
}

export const ENTREGA_REGIAO: Entrega = { modo: "regiao", cidade: "", cep: "", km: null };

export const limparCep = (cep: string) => cep.replace(/\D/g, "").slice(0, 8);

/** Consulta o CEP no ViaCEP e devolve "Cidade - UF", ou null se o CEP não existir ou a consulta falhar. */
export async function cidadeDoCep(cep: string, sinal?: AbortSignal): Promise<string | null> {
  const digitos = limparCep(cep);
  if (digitos.length !== 8) return null;
  try {
    const resposta = await fetch(`https://viacep.com.br/ws/${digitos}/json/`, { signal: sinal });
    if (!resposta.ok) return null;
    const dados = (await resposta.json()) as { localidade?: string; uf?: string; erro?: boolean | string };
    if (dados.erro || !dados.localidade) return null;
    return `${dados.localidade} - ${dados.uf ?? ""}`.trim();
  } catch {
    return null;
  }
}
