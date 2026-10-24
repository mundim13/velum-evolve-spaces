import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import type { Database, Json } from "@/integrations/supabase/types";

type PropostasDatabase = Omit<Database, "public"> & {
  public: Omit<Database["public"], "Functions"> & {
    Functions: {
      criar_proposta_simulador: {
        Args: {
          p_nome: string;
          p_telefone: string;
          p_titulo: string;
          p_descricao: string;
          p_itens: Json;
          p_total: number;
          p_notas: string;
          p_configuracao: Json;
        };
        Returns: string;
      };
      proposta_por_token: {
        Args: { p_token: string };
        Returns: (Database["public"]["Tables"]["proposals"]["Row"] & {
          origem?: string;
          configuracao?: Json | null;
        })[];
      };
    };
  };
};

// Reuse the managed client and its session while migrations await application.
export const propostasClient = supabase as unknown as SupabaseClient<PropostasDatabase>;