
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
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
      toast({ title: "Nome obrigatório", description: "Por favor, informe seu nome.", variant: "destructive" });
      return;
    }
    if (!giftId) return;
    setLoading(true);
    const { error } = await supabase
      .from("gift_items")
      .update({
        reserver_name: name.trim(),
        reserved_at: new Date().toISOString(),
      })
      .eq("id", giftId)
      .eq("reserver_name", null); // Garante que só reserva se ainda estiver disponível
    setLoading(false);

    if (error) {
      toast({ title: "Erro ao reservar presente", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Presente reservado!", description: "Obrigado por escolher presentear 🎁" });
    setName("");
    onReserved();
    onClose();
  }

  function handleClose() {
    if (!loading) {
      setName("");
      onClose();
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reservar presente</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <Input
            placeholder="Seu nome"
            value={name}
            onChange={e => setName(e.target.value)}
            disabled={loading}
            autoFocus
          />
          <Button onClick={handleReserve} disabled={loading} className="w-full">
            {loading ? "Reservando..." : "Confirmar reserva"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
