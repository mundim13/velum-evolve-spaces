import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Separator } from "@/components/ui/separator";
import { Calendar, CheckCircle, Users, Target, Layers, ClipboardList, DollarSign, FileText } from "lucide-react";
import logoWhite from "@/assets/logo-velum-white.svg";

interface ProposalItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
}

interface Proposal {
  id: string;
  title: string;
  client_name: string;
  client_email: string | null;
  client_phone: string | null;
  description: string | null;
  total_value: number | null;
  status: string;
  items: ProposalItem[];
  notes: string | null;
  valid_until: string | null;
  created_at: string;
}

const PropostaPublica = () => {
  const { token } = useParams();
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProposal = async () => {
      try {
        const { data, error } = await supabase
          .from("proposals")
          .select("*")
          .eq("access_token", token)
          .single();

        if (error) throw error;

        if (data) {
          const items = Array.isArray(data.items) 
            ? (data.items as unknown as ProposalItem[]) 
            : [];
          setProposal({
            ...data,
            items,
          });

          // Update status to viewed if it was sent
          if (data.status === "sent") {
            await supabase
              .from("proposals")
              .update({ status: "viewed" })
              .eq("id", data.id);
          }
        }
      } catch (error: any) {
        setError("Proposta não encontrada ou link inválido.");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchProposal();
    }
  }, [token]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  // Parse description to extract benefits
  const extractBenefits = (description: string | null): string[] => {
    if (!description) return [];
    const match = description.match(/PRINCIPAIS BENEFÍCIOS:\n([\s\S]*?)$/);
    if (match) {
      return match[1].split('\n').filter(line => line.trim().startsWith('•')).map(line => line.replace('•', '').trim());
    }
    return [];
  };

  // Parse notes to extract payment conditions and deadlines
  const parseNotes = (notes: string | null) => {
    if (!notes) return { observations: [], payments: [], deadlines: [] };
    
    const observations: string[] = [];
    const payments: string[] = [];
    const deadlines: string[] = [];
    
    const lines = notes.split('\n');
    let section = 'observations';
    
    lines.forEach(line => {
      if (line.includes('CONDIÇÕES DE PAGAMENTO')) {
        section = 'payments';
        return;
      }
      if (line.includes('PRAZOS DE EXECUÇÃO')) {
        section = 'deadlines';
        return;
      }
      
      const cleanLine = line.replace(/^[•\d.]+\s*/, '').trim();
      if (!cleanLine) return;
      
      if (section === 'observations' && line.startsWith('•')) {
        observations.push(cleanLine);
      } else if (section === 'payments' && line.startsWith('•')) {
        payments.push(cleanLine);
      } else if (section === 'deadlines' && /^\d/.test(line.trim())) {
        deadlines.push(cleanLine);
      }
    });
    
    return { observations, payments, deadlines };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <img src={logoWhite} alt="Velum" className="h-12 mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Carregando proposta...</p>
        </div>
      </div>
    );
  }

  if (error || !proposal) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-card border border-border rounded-xl p-8 text-center max-w-md w-full">
          <img src={logoWhite} alt="Velum" className="h-10 mx-auto mb-6" />
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Proposta não encontrada
          </h2>
          <p className="text-muted-foreground">
            {error || "O link pode estar incorreto ou expirado."}
          </p>
        </div>
      </div>
    );
  }

  const isExpired = proposal.valid_until && new Date(proposal.valid_until) < new Date();
  const benefits = extractBenefits(proposal.description);
  const { observations, payments, deadlines } = parseNotes(proposal.notes);
  
  // Get main description without benefits
  const mainDescription = proposal.description?.split('PRINCIPAIS BENEFÍCIOS:')[0].trim() || '';

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <img src={logoWhite} alt="Velum" className="h-8 sm:h-10" />
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Proposta Comercial</p>
              <p className="text-xs text-muted-foreground">{formatDate(proposal.created_at)}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center pt-20 pb-12 px-4">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-syncopate text-foreground mb-4">
            VELUM
          </h1>
          <div className="w-20 h-1 bg-primary mx-auto mb-8"></div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-syncopate text-foreground mb-6 tracking-wider">
            PROPOSTA COMERCIAL
          </h2>
          <p className="text-lg sm:text-xl text-primary mb-2">
            {proposal.title}
          </p>
          <p className="text-muted-foreground mb-12">
            Engenharia Integrada + Gestão de Projetos
          </p>
          
          {/* Client Box */}
          <div className="bg-card/50 border border-border rounded-xl p-8 inline-block">
            <p className="text-sm text-muted-foreground mb-2">Preparada para</p>
            <p className="text-3xl sm:text-4xl font-syncopate text-primary tracking-wider">
              {proposal.client_name}
            </p>
          </div>
          
          <p className="text-sm text-muted-foreground mt-8">
            {isExpired ? (
              <span className="text-destructive">Proposta Expirada</span>
            ) : (
              `Válido por 30 dias a partir da data de emissão`
            )}
          </p>
        </div>
      </section>

      {/* Sumário Executivo */}
      {mainDescription && (
        <section className="py-20 px-4 bg-card/30">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-2xl sm:text-3xl font-syncopate text-foreground mb-8 text-center">
              SUMÁRIO EXECUTIVO
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              {mainDescription.split('\n\n').map((paragraph, index) => (
                <p key={index} className="text-base sm:text-lg">
                  {paragraph}
                </p>
              ))}
            </div>
            
            {benefits.length > 0 && (
              <div className="mt-12">
                <h3 className="text-xl font-syncopate text-foreground mb-6 flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-primary" />
                  PRINCIPAIS BENEFÍCIOS
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-card/50 rounded-lg border border-border">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                      <p className="text-foreground">{benefit}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Escopo e Entregáveis */}
      {proposal.items.length > 0 && (
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-2xl sm:text-3xl font-syncopate text-foreground mb-4 text-center">
              ESCOPO E ENTREGÁVEIS
            </h2>
            <p className="text-center text-muted-foreground mb-12">
              Disciplinas incluídas nesta proposta
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {proposal.items.map((item, index) => (
                <div 
                  key={item.id} 
                  className="flex items-center gap-4 p-4 bg-card/50 rounded-lg border border-border hover:border-primary/50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold">
                    {index + 1}
                  </div>
                  <span className="text-foreground">{item.description}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Investimento */}
      <section className="py-20 px-4 bg-card/30">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-2xl sm:text-3xl font-syncopate text-foreground mb-4 text-center flex items-center justify-center gap-3">
            <DollarSign className="w-8 h-8 text-primary" />
            INVESTIMENTO E CONDIÇÕES
          </h2>
          <p className="text-center text-muted-foreground mb-12">
            Detalhamento do investimento
          </p>
          
          {/* Items Table */}
          <div className="bg-card border border-border rounded-xl overflow-hidden mb-8">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-card/50">
                    <th className="text-left p-4 text-muted-foreground font-medium">Descrição</th>
                    <th className="text-right p-4 text-muted-foreground font-medium">Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {proposal.items.map((item) => (
                    <tr key={item.id} className="border-b border-border last:border-0">
                      <td className="p-4 text-foreground">{item.description}</td>
                      <td className="p-4 text-right text-foreground whitespace-nowrap">
                        {formatCurrency(item.unit_price)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Total */}
            <div className="bg-primary/10 p-6 flex justify-between items-center">
              <span className="text-lg font-syncopate text-foreground">VALOR TOTAL DO INVESTIMENTO</span>
              <span className="text-2xl sm:text-3xl font-bold text-primary">
                {formatCurrency(proposal.total_value || 0)}
              </span>
            </div>
          </div>

          {/* Payment Conditions */}
          {payments.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-syncopate text-foreground mb-4">
                CONDIÇÕES DE PAGAMENTO
              </h3>
              <div className="space-y-2">
                {payments.map((payment, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-card/50 rounded-lg border border-border">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                      {index + 1}ª
                    </div>
                    <span className="text-foreground">{payment}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Deadlines */}
          {deadlines.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-syncopate text-foreground mb-4">
                PRAZOS DE EXECUÇÃO
              </h3>
              <div className="space-y-3">
                {deadlines.map((deadline, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 bg-card/50 rounded-lg border border-border">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold flex-shrink-0">
                      {index + 1}
                    </div>
                    <span className="text-foreground pt-1">{deadline}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Observations */}
          {observations.length > 0 && (
            <div className="bg-card/50 border border-border rounded-xl p-6">
              <h3 className="text-lg font-syncopate text-foreground mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                OBSERVAÇÕES
              </h3>
              <ul className="space-y-2">
                {observations.map((obs, index) => (
                  <li key={index} className="flex items-start gap-2 text-muted-foreground">
                    <span className="text-primary">•</span>
                    <span>{obs}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border">
        <div className="container mx-auto max-w-4xl text-center">
          <img src={logoWhite} alt="Velum" className="h-8 mx-auto mb-6" />
          <p className="text-muted-foreground mb-4">
            Esta proposta foi gerada pela{" "}
            <a
              href="https://velumesquadrias.com.br"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Velum
            </a>
          </p>
          <p className="text-muted-foreground">
            Dúvidas? Entre em contato conosco pelo WhatsApp{" "}
            <a
              href="https://wa.me/5562999447553"
              className="text-primary hover:underline"
            >
              (62) 99944-7553
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PropostaPublica;
