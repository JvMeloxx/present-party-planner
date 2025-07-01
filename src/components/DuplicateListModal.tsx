
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { GiftList } from "@/types/gift";
import { Copy, Loader2 } from "lucide-react";

interface DuplicateListModalProps {
  open: boolean;
  onClose: () => void;
  list: GiftList;
  onDuplicated: () => void;
}

export function DuplicateListModal({ open, onClose, list, onDuplicated }: DuplicateListModalProps) {
  const [title, setTitle] = useState(`${list.title} - Cópia`);
  const [loading, setLoading] = useState(false);

  const handleDuplicate = async () => {
    if (!title.trim()) {
      toast.error("Por favor, insira um título para a nova lista");
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      // Criar nova lista
      const { data: newList, error: listError } = await supabase
        .from("gift_lists")
        .insert({
          title: title.trim(),
          description: list.description,
          is_public: list.is_public,
          event_date: list.event_date,
          owner_id: user.id
        })
        .select()
        .single();

      if (listError) throw listError;

      // Buscar itens da lista original
      const { data: originalItems, error: itemsError } = await supabase
        .from("gift_items")
        .select("*")
        .eq("list_id", list.id);

      if (itemsError) throw itemsError;

      // Duplicar itens (sem reservas)
      if (originalItems && originalItems.length > 0) {
        const itemsToInsert = originalItems.map(item => ({
          list_id: newList.id,
          name: item.name,
          description: item.description,
          image_url: item.image_url
        }));

        const { error: insertError } = await supabase
          .from("gift_items")
          .insert(itemsToInsert);

        if (insertError) throw insertError;
      }

      toast.success("Lista duplicada com sucesso!");
      onDuplicated();
      onClose();
    } catch (error) {
      console.error("Erro ao duplicar lista:", error);
      toast.error("Erro ao duplicar lista. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Copy size={20} className="text-purple-600" />
            Duplicar Lista
          </DialogTitle>
          <DialogDescription>
            Crie uma cópia da lista "{list.title}" com todos os presentes (sem reservas).
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Título da nova lista</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Digite o título da nova lista"
              className="mt-1"
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button onClick={handleDuplicate} disabled={loading}>
              {loading && <Loader2 size={16} className="mr-2 animate-spin" />}
              Duplicar Lista
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
