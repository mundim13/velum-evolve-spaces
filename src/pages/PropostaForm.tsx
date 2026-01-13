import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Plus, Trash2, Save, Copy } from "lucide-react";
import logoWhite from "@/assets/logo-velum-white.svg";

interface ProposalItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
}

interface ProposalData {
  title: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  description: string;
  status: string;
  notes: string;
  valid_until: string;
  items: ProposalItem[];
}

const PropostaForm = () => {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const [formData, setFormData] = useState<ProposalData>({
    title: "",
    client_name: "",
    client_email: "",
    client_phone: "",
    description: "",
    status: "draft",
    notes: "",
    valid_until: "",
    items: [],
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      if (isEditing) {
        fetchProposal();
      }
    };

    checkAuth();
  }, [id, navigate]);

  const fetchProposal = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("proposals")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      if (data) {
        const items = Array.isArray(data.items) 
          ? (data.items as unknown as ProposalItem[]) 
          : [];
        setFormData({
          title: data.title,
          client_name: data.client_name,
          client_email: data.client_email || "",
          client_phone: data.client_phone || "",
          description: data.description || "",
          status: data.status,
          notes: data.notes || "",
          valid_until: data.valid_until || "",
          items,
        });
        setAccessToken(data.access_token);
      }
    } catch (error: any) {
      toast({
        title: "Erro ao carregar proposta",
        description: error.message,
        variant: "destructive",
      });
      navigate("/admin/propostas");
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    return formData.items.reduce(
      (sum, item) => sum + item.quantity * item.unit_price,
      0
    );
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        {
          id: crypto.randomUUID(),
          description: "",
          quantity: 1,
          unit_price: 0,
        },
      ],
    });
  };

  const updateItem = (itemId: string, field: keyof ProposalItem, value: any) => {
    setFormData({
      ...formData,
      items: formData.items.map((item) =>
        item.id === itemId ? { ...item, [field]: value } : item
      ),
    });
  };

  const removeItem = (itemId: string) => {
    setFormData({
      ...formData,
      items: formData.items.filter((item) => item.id !== itemId),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const proposalData = {
        title: formData.title,
        client_name: formData.client_name,
        client_email: formData.client_email || null,
        client_phone: formData.client_phone || null,
        description: formData.description || null,
        status: formData.status,
        notes: formData.notes || null,
        valid_until: formData.valid_until || null,
        items: formData.items as unknown as Json,
        total_value: calculateTotal(),
        created_by: user?.id,
      };

      if (isEditing) {
        const { error } = await supabase
          .from("proposals")
          .update(proposalData)
          .eq("id", id);

        if (error) throw error;
        toast({
          title: "Proposta atualizada!",
          description: "As alterações foram salvas com sucesso.",
        });
      } else {
        const { data, error } = await supabase
          .from("proposals")
          .insert(proposalData)
          .select("access_token")
          .single();

        if (error) throw error;
        
        toast({
          title: "Proposta criada!",
          description: "A proposta foi criada com sucesso.",
        });
        
        if (data) {
          setAccessToken(data.access_token);
          navigate(`/admin/propostas/${id || ""}`, { replace: true });
        }
      }

      navigate("/admin/propostas");
    } catch (error: any) {
      toast({
        title: "Erro ao salvar",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const copyLink = () => {
    if (accessToken) {
      const link = `${window.location.origin}/proposta/${accessToken}`;
      navigator.clipboard.writeText(link);
      toast({
        title: "Link copiado!",
        description: "O link da proposta foi copiado para a área de transferência.",
      });
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/admin/propostas")}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <img src={logoWhite} alt="Velum" className="h-8 hidden sm:block" />
          </div>
          <div className="flex items-center gap-2">
            {accessToken && (
              <Button variant="outline" onClick={copyLink} className="border-border">
                <Copy className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Copiar Link</span>
              </Button>
            )}
            <Button
              onClick={handleSubmit}
              disabled={saving}
              className="bg-primary text-primary-foreground"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </div>
      </header>

      {/* Form */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-2xl sm:text-3xl font-syncopate text-foreground mb-8">
          {isEditing ? "Editar Proposta" : "Nova Proposta"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Informações Básicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título da Proposta *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                    placeholder="Ex: Projeto Jardins Porto"
                    className="bg-background border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      setFormData({ ...formData, status: value })
                    }
                  >
                    <SelectTrigger className="bg-background border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Rascunho</SelectItem>
                      <SelectItem value="sent">Enviada</SelectItem>
                      <SelectItem value="viewed">Visualizada</SelectItem>
                      <SelectItem value="accepted">Aceita</SelectItem>
                      <SelectItem value="rejected">Rejeitada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Descreva o escopo do projeto..."
                  rows={4}
                  className="bg-background border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="valid_until">Válido até</Label>
                <Input
                  id="valid_until"
                  type="date"
                  value={formData.valid_until}
                  onChange={(e) =>
                    setFormData({ ...formData, valid_until: e.target.value })
                  }
                  className="bg-background border-border"
                />
              </div>
            </CardContent>
          </Card>

          {/* Client Info */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Dados do Cliente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="client_name">Nome do Cliente *</Label>
                  <Input
                    id="client_name"
                    value={formData.client_name}
                    onChange={(e) =>
                      setFormData({ ...formData, client_name: e.target.value })
                    }
                    required
                    placeholder="Nome completo"
                    className="bg-background border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client_email">Email</Label>
                  <Input
                    id="client_email"
                    type="email"
                    value={formData.client_email}
                    onChange={(e) =>
                      setFormData({ ...formData, client_email: e.target.value })
                    }
                    placeholder="cliente@email.com"
                    className="bg-background border-border"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="client_phone">Telefone</Label>
                <Input
                  id="client_phone"
                  value={formData.client_phone}
                  onChange={(e) =>
                    setFormData({ ...formData, client_phone: e.target.value })
                  }
                  placeholder="(00) 00000-0000"
                  className="bg-background border-border"
                />
              </div>
            </CardContent>
          </Card>

          {/* Items */}
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-foreground">Itens da Proposta</CardTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addItem}
                className="border-border"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Item
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.items.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  Nenhum item adicionado. Clique em "Adicionar Item" para começar.
                </p>
              ) : (
                <>
                  {formData.items.map((item, index) => (
                    <div
                      key={item.id}
                      className="grid grid-cols-12 gap-2 items-end p-4 bg-background rounded-lg border border-border"
                    >
                      <div className="col-span-12 md:col-span-5 space-y-1">
                        <Label className="text-xs">Descrição</Label>
                        <Input
                          value={item.description}
                          onChange={(e) =>
                            updateItem(item.id, "description", e.target.value)
                          }
                          placeholder="Descrição do item"
                          className="bg-card border-border"
                        />
                      </div>
                      <div className="col-span-4 md:col-span-2 space-y-1">
                        <Label className="text-xs">Qtd</Label>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            updateItem(item.id, "quantity", parseInt(e.target.value) || 1)
                          }
                          className="bg-card border-border"
                        />
                      </div>
                      <div className="col-span-6 md:col-span-3 space-y-1">
                        <Label className="text-xs">Preço Unit.</Label>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.unit_price}
                          onChange={(e) =>
                            updateItem(item.id, "unit_price", parseFloat(e.target.value) || 0)
                          }
                          className="bg-card border-border"
                        />
                      </div>
                      <div className="col-span-2 md:col-span-2 flex justify-end">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-end pt-4 border-t border-border">
                    <div className="text-right">
                      <p className="text-muted-foreground text-sm">Total</p>
                      <p className="text-2xl font-bold text-primary">
                        {formatCurrency(calculateTotal())}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Notes */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Observações</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="Condições de pagamento, prazos, observações gerais..."
                rows={4}
                className="bg-background border-border"
              />
            </CardContent>
          </Card>
        </form>
      </main>
    </div>
  );
};

export default PropostaForm;
