import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Produtos from "./pages/Produtos";
import Portfolio from "./pages/Portfolio";
import Auth from "./pages/Auth";
import AdminPropostas from "./pages/AdminPropostas";
import PropostaForm from "./pages/PropostaForm";
import PropostaPublica from "./pages/PropostaPublica";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/produtos" element={<Produtos />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/admin/propostas" element={<AdminPropostas />} />
          <Route path="/admin/propostas/nova" element={<PropostaForm />} />
          <Route path="/admin/propostas/:id" element={<PropostaForm />} />
          <Route path="/proposta/:token" element={<PropostaPublica />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
