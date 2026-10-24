# Architecture rules

- Proposal RPCs (`criar_proposta_simulador`, `proposta_por_token`) are already typed in the generated `src/integrations/supabase/types.ts` (migrations applied). Call them through the managed `supabase` client from `src/integrations/supabase/client.ts`; do not add wrapper clients or type casts for them.
