-- Antispam das propostas do simulador /modulos: no máximo 3 propostas por telefone a cada 24 horas.
-- Aplicar depois de 20261024120000_propostas_simulador_modulos.sql (substitui criar_proposta_simulador,
-- com a mesma assinatura; o front não muda).

-- Telefone só com dígitos e sem o +55, para "(62) 99999-0000" e "+55 62 99999 0000" contarem juntos.
CREATE OR REPLACE FUNCTION public.telefone_normalizado(p_telefone TEXT)
RETURNS TEXT
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT CASE
    WHEN length(d) > 11 AND left(d, 2) = '55' THEN substr(d, 3)
    ELSE d
  END
  FROM (SELECT regexp_replace(coalesce(p_telefone, ''), '\D', '', 'g') AS d) AS t;
$$;

CREATE INDEX IF NOT EXISTS proposals_simulador_telefone_idx
  ON public.proposals (public.telefone_normalizado(client_phone), created_at)
  WHERE origem = 'simulador';

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
  v_telefone TEXT := public.telefone_normalizado(p_telefone);
  v_recentes INTEGER;
  v_token UUID;
BEGIN
  IF length(btrim(coalesce(p_nome, ''))) NOT BETWEEN 2 AND 120 THEN
    RAISE EXCEPTION 'nome inválido';
  END IF;
  IF length(v_telefone) NOT BETWEEN 10 AND 11 THEN
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

  -- Uma trava por telefone até o fim da transação: dois envios simultâneos não furam o limite.
  PERFORM pg_advisory_xact_lock(hashtext('proposta-simulador:' || v_telefone));
  SELECT count(*) INTO v_recentes
  FROM public.proposals
  WHERE origem = 'simulador'
    AND public.telefone_normalizado(client_phone) = v_telefone
    AND created_at > now() - interval '24 hours';
  IF v_recentes >= 3 THEN
    RAISE EXCEPTION 'limite de propostas por telefone';
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
