import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const WhatsAppButton = () => {
  return (
    <Button
      data-whatsapp="true"
      data-msg="Olá! Vim pelo site da Velum e gostaria de um orçamento."
      className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-accent hover:bg-accent/90 text-white shadow-elevated p-0"
      aria-label="Fale conosco no WhatsApp"
    >
      <MessageCircle className="h-7 w-7" />
    </Button>
  );
};

export default WhatsAppButton;
