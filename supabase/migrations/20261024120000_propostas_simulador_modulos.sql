-- Propostas geradas pelo simulador /modulos.
--
-- 1. Segurança: a política anônima anterior ("Public can view proposals via access_token") usava
--    USING (true), o que deixava qualquer visitante ler TODAS as propostas (nome, telefone, e-mail).
--    Ela sai, e a leitura pública passa a ser só pelo token, via função.
-- 2. O simulador é público (visitante sem login) e não pode inserir direto na tabela: cria a proposta
--    por uma função que valida os dados e grava com origem 'simulador'.

DROP POLICY IF EXISTS "Public can view proposals via access_token" ON public.proposals;

ALTER TABLE public.proposals
  ADD COLUMN IF NOT EXISTS origem TEXT NOT NULL DEFAULT 'admin' CHECK (origem IN ('admin', 'simulador')),
  ADD COLUMN IF NOT EXISTS configuracao JSONB;

-- Leitura pública de UMA proposta pelo token do link (/proposta/:token). Marca como vista.
CREATE OR REPLACE FUNCTION public.proposta_por_token(p_token UUID)
RETURNS SETOF public.proposals
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.proposals SET status = 'viewed' WHERE access_token = p_token AND status = 'sent';
  RETURN QUERY SELECT * FROM public.proposals WHERE access_token = p_token;
END;
$$;

REVOKE ALL ON FUNCTION public.proposta_por_token(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.proposta_por_token(UUID) TO anon, authenticated;

-- Criação pelo simulador. Devolve só o token do link.
CREATE OR REPLACE FUNCTION public.criar_proposta_simulador(
  p_nome TEXT,
  p_telefone TEXT,
  p_titulo TEXT,
  p_descricao TEXT,
  p_itens JSONB,
  p_total NUMERIC,
  p_notas TEXT,
  p_configuracao JSONB
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_digitos TEXT := regexp_replace(coalesce(p_telefone, ''), '\D', '', 'g');
  v_token UUID;
BEGIN
  IF length(btrim(coalesce(p_nome, ''))) NOT BETWEEN 2 AND 120 THEN
    RAISE EXCEPTION 'nome inválido';
  END IF;
  IF length(v_digitos) NOT BETWEEN 10 AND 13 THEN
    RAISE EXCEPTION 'telefone inválido';
  END IF;
  IF p_itens IS NULL OR jsonb_typeof(p_itens) <> 'array' OR jsonb_array_length(p_itens) NOT BETWEEN 1 AND 40 THEN
    RAISE EXCEPTION 'itens inválidos';
  END IF;
  IF p_total IS NULL OR p_total < 0 OR p_total > 2000000 THEN
    RAISE EXCEPTION 'total inválido';
  END IF;
  IF length(coalesce(p_titulo, '')) > 200
     OR length(coalesce(p_descricao, '')) > 4000
     OR length(coalesce(p_notas, '')) > 4000
     OR pg_column_size(p_configuracao) > 20000 THEN
    RAISE EXCEPTION 'conteúdo grande demais';
  END IF;

  INSERT INTO public.proposals (
    title, client_name, client_phone, description, items, total_value, notes,
    status, valid_until, origem, configuracao
  )
  VALUES (
    coalesce(nullif(btrim(p_titulo), ''), 'Módulo 3x6'),
    btrim(p_nome),
    btrim(p_telefone),
    p_descricao,
    p_itens,
    p_total,
    p_notas,
    'sent',
    current_date + 15,
    'simulador',
    p_configuracao
  )
  RETURNING access_token INTO v_token;

  RETURN v_token;
END;
$$;

REVOKE ALL ON FUNCTION public.criar_proposta_simulador(TEXT, TEXT, TEXT, TEXT, JSONB, NUMERIC, TEXT, JSONB) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.criar_proposta_simulador(TEXT, TEXT, TEXT, TEXT, JSONB, NUMERIC, TEXT, JSONB) TO anon, authenticated;
