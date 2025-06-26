
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Gift } from "../types/gift";
import { AlertTriangle } from "lucide-react";

type DeleteGiftModalProps = {
  open: boolean;
  onClose: () => void;
  gift: Gift | null;
  onDeleted: () => void;
};

export function DeleteGiftModal({ open, onClose, gift, onDeleted }: DeleteGiftModalProps) {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!gift) return;

    setLoading(true);

    try {
      const { error } = await supabase
        .from("gift_items")
        .delete()
        .eq("id", gift.id);

      if (error) {
        console.error("Erro ao excluir presente:", error);
        toast({ 
          title: "Erro ao excluir presente", 
          description: "Tente novamente em alguns instantes", 
          variant: "destructive" 
        });
        return;
      }

      toast({ 
        title: "Presente excluído!", 
        description: "O presente foi removido da lista com sucesso." 
      });
      
      onDeleted();
      onClose();
      
    } catch (error) {
      console.error("Erro inesperado:", error);
      toast({ 
        title: "Erro inesperado", 
        description: "Tente novamente em alguns instantes", 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    if (!loading) {
      onClose();
    }
  }

  const isReserved = gift && gift.reserver_name;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-red-600 flex items-center gap-2">
            <AlertTriangle size={24} />
            Excluir presente
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 pt-4">
          <div className="text-gray-700">
            <p className="mb-2">
              Tem certeza que deseja excluir o presente <strong>"{gift?.name}"</strong>?
            </p>
            {isReserved && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                <p className="text-yellow-800 text-sm font-medium flex items-center gap-2">
                  <AlertTriangle size={16} />
                  Atenção: Este presente já foi reservado por {gift.reserver_name}
                </p>
                <p className="text-yellow-700 text-sm mt-1">
                  Ao excluir, a pessoa que reservou será notificada automaticamente.
                </p>
              </div>
            )}
            <p className="text-sm text-gray-600">
              Esta ação não pode ser desfeita.
            </p>
          </div>
          <div className="flex gap-2 pt-2">
            <Button 
              variant="outline" 
              onClick={handleClose} 
              disabled={loading}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button 
              variant="destructive"
              onClick={handleDelete} 
              disabled={loading} 
              className="flex-1"
            >
              {loading ? "Excluindo..." : "Sim, excluir"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
