
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

type ReserveGiftModalProps = {
  open: boolean;
  onClose: () => void;
  giftId: string | null;
  onReserved: () => void;
};

export function ReserveGiftModal({ open, onClose, giftId, onReserved }: ReserveGiftModalProps) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleReserve() {
    if (!name.trim()) {
      toast({ 
        title: "Nome obrigatório", 
        description: "Por favor, informe seu nome para reservar o presente.", 
        variant: "destructive" 
      });
      return;
    }
    
    if (!giftId) return;
    
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from("gift_items")
        .update({
          reserver_name: name.trim(),
          reserved_at: new Date().toISOString(),
        })
        .eq("id", giftId)
        .is("reserver_name", null); // Garante que só reserva se ainda estiver disponível

      if (error) {
        console.error("Erro ao reservar presente:", error);
        toast({ 
          title: "Erro ao reservar presente", 
          description: "Tente novamente ou verifique se o presente ainda está disponível.", 
          variant: "destructive" 
        });
        return;
      }

      toast({ 
        title: "Presente reservado! 🎁", 
        description: "Obrigado por escolher presentear! O dono da lista será notificado." 
      });
      
      setName("");
      onReserved();
      onClose();
      
    } catch (error) {
      console.error("Erro inesperado:", error);
      toast({ 
        title: "Erro inesperado", 
        description: "Tente novamente em alguns instantes.", 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    if (!loading) {
      setName("");
      onClose();
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-purple-800">
            Reservar presente 🎁
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 pt-4">
          <p className="text-gray-600 text-sm">
            Informe seu nome para reservar este presente. O dono da lista será notificado da sua escolha.
          </p>
          <Input
            placeholder="Seu nome completo"
            value={name}
            onChange={e => setName(e.target.value)}
            disabled={loading}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !loading && name.trim()) {
                handleReserve();
              }
            }}
          />
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={handleClose} 
              disabled={loading}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleReserve} 
              disabled={loading || !name.trim()} 
              className="flex-1"
            >
              {loading ? "Reservando..." : "Confirmar reserva"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
