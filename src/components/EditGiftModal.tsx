
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Gift } from "../types/gift";

type EditGiftModalProps = {
  open: boolean;
  onClose: () => void;
  gift: Gift | null;
  onUpdated: () => void;
};

export function EditGiftModal({ open, onClose, gift, onUpdated }: EditGiftModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (gift && open) {
      setName(gift.name);
      setDescription(gift.description || "");
    }
  }, [gift, open]);

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({ 
        title: "Nome obrigatório", 
        description: "Preencha o nome do presente", 
        variant: "destructive" 
      });
      return;
    }

    if (!gift) return;

    setLoading(true);

    try {
      const { error } = await supabase
        .from("gift_items")
        .update({
          name: name.trim(),
          description: description.trim() || null,
        })
        .eq("id", gift.id);

      if (error) {
        console.error("Erro ao atualizar presente:", error);
        toast({ 
          title: "Erro ao atualizar presente", 
          description: "Tente novamente em alguns instantes", 
          variant: "destructive" 
        });
        return;
      }

      toast({ 
        title: "Presente atualizado!", 
        description: "As alterações foram salvas com sucesso." 
      });
      
      onUpdated();
      handleClose();
      
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
      setName("");
      setDescription("");
      onClose();
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-purple-800">
            Editar presente
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleUpdate} className="flex flex-col gap-4 pt-4">
          <div>
            <label htmlFor="gift-name" className="block font-medium text-gray-700 mb-1">
              Nome do presente <span className="text-pink-600">*</span>
            </label>
            <Input
              id="gift-name"
              placeholder="Ex: Fraldas Pampers"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              required
              maxLength={100}
            />
          </div>
          <div>
            <label htmlFor="gift-description" className="block font-medium text-gray-700 mb-1">
              Descrição (opcional)
            </label>
            <Textarea
              id="gift-description"
              placeholder="Tamanho G ou M, pacote com 30 unidades, etc."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
              maxLength={500}
            />
          </div>
          <div className="flex gap-2 pt-2">
            <Button 
              type="button"
              variant="outline" 
              onClick={handleClose} 
              disabled={loading}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              disabled={loading || !name.trim()} 
              className="flex-1"
            >
              {loading ? "Salvando..." : "Salvar alterações"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
