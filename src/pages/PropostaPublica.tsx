import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, User, Mail, Phone, FileText } from "lucide-react";
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <img src={logoWhite} alt="Velum" className="h-12 mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando proposta...</p>
        </div>
      </div>
    );
  }

  if (error || !proposal) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="bg-card border-border max-w-md w-full">
          <CardContent className="p-8 text-center">
            <img src={logoWhite} alt="Velum" className="h-10 mx-auto mb-6" />
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Proposta não encontrada
            </h2>
            <p className="text-muted-foreground">
              {error || "O link pode estar incorreto ou expirado."}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isExpired = proposal.valid_until && new Date(proposal.valid_until) < new Date();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <img src={logoWhite} alt="Velum" className="h-10" />
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Calendar className="w-4 h-4" />
              <span>Emitida em {formatDate(proposal.created_at)}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Title Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-syncopate text-foreground mb-4">
            {proposal.title}
          </h1>
          {isExpired && (
            <Badge variant="destructive" className="mb-4">
              Proposta Expirada
            </Badge>
          )}
          {proposal.valid_until && !isExpired && (
            <p className="text-muted-foreground">
              Válida até {formatDate(proposal.valid_until)}
            </p>
          )}
        </div>

        {/* Client Info */}
        <Card className="bg-card border-border mb-6">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Proposta para
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <p className="text-muted-foreground text-sm">Nome</p>
                <p className="text-foreground font-medium">{proposal.client_name}</p>
              </div>
              {proposal.client_email && (
                <div>
                  <p className="text-muted-foreground text-sm flex items-center gap-1">
                    <Mail className="w-3 h-3" /> Email
                  </p>
                  <p className="text-foreground">{proposal.client_email}</p>
                </div>
              )}
              {proposal.client_phone && (
                <div>
                  <p className="text-muted-foreground text-sm flex items-center gap-1">
                    <Phone className="w-3 h-3" /> Telefone
                  </p>
                  <p className="text-foreground">{proposal.client_phone}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        {proposal.description && (
          <Card className="bg-card border-border mb-6">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Escopo do Projeto
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {proposal.description}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Items */}
        {proposal.items.length > 0 && (
          <Card className="bg-card border-border mb-6">
            <CardHeader>
              <CardTitle className="text-foreground">Itens da Proposta</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Header - Desktop */}
                <div className="hidden sm:grid grid-cols-12 gap-4 text-sm text-muted-foreground pb-2 border-b border-border">
                  <div className="col-span-6">Descrição</div>
                  <div className="col-span-2 text-center">Qtd</div>
                  <div className="col-span-2 text-right">Valor Unit.</div>
                  <div className="col-span-2 text-right">Subtotal</div>
                </div>

                {/* Items */}
                {proposal.items.map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 py-3 border-b border-border last:border-0"
                  >
                    <div className="sm:col-span-6">
                      <p className="text-foreground">{item.description}</p>
                    </div>
                    <div className="sm:col-span-2 text-muted-foreground sm:text-center">
                      <span className="sm:hidden text-xs">Qtd: </span>
                      {item.quantity}
                    </div>
                    <div className="sm:col-span-2 text-muted-foreground sm:text-right">
                      <span className="sm:hidden text-xs">Unit: </span>
                      {formatCurrency(item.unit_price)}
                    </div>
                    <div className="sm:col-span-2 text-foreground font-medium sm:text-right">
                      <span className="sm:hidden text-xs">Subtotal: </span>
                      {formatCurrency(item.quantity * item.unit_price)}
                    </div>
                  </div>
                ))}

                {/* Total */}
                <Separator className="my-4" />
                <div className="flex justify-between items-center">
                  <span className="text-lg text-foreground font-medium">Total</span>
                  <span className="text-3xl font-bold text-primary">
                    {formatCurrency(proposal.total_value || 0)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Notes */}
        {proposal.notes && (
          <Card className="bg-card border-border mb-6">
            <CardHeader>
              <CardTitle className="text-foreground">Observações</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {proposal.notes}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="text-center py-8 text-muted-foreground text-sm">
          <p>
            Esta proposta foi gerada pela{" "}
            <a
              href="https://velumesquadrias.com.br"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Velum Esquadrias
            </a>
          </p>
          <p className="mt-2">
            Dúvidas? Entre em contato conosco pelo WhatsApp{" "}
            <a
              href="https://wa.me/5562999447553"
              className="text-primary hover:underline"
            >
              (62) 99944-7553
            </a>
          </p>
        </div>
      </main>
    </div>
  );
};

export default PropostaPublica;
