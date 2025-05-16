
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

type Props = {
  listId: string;
  onGiftAdded: () => void;
};

export default function GiftItemForm({ listId, onGiftAdded }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      toast({ title: "Nome obrigatório", description: "Preencha o nome do presente", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("gift_items").insert([{
      list_id: listId,
      name,
      description: description.trim() || null,
    }]);
    setLoading(false);

    if (error) {
      toast({ title: "Erro ao adicionar presente", description: error.message, variant: "destructive" });
      return;
    }
    setName("");
    setDescription("");
    toast({ title: "Presente adicionado!", description: "Seu presente foi incluído na lista." });
    onGiftAdded(); // Atualiza a lista de presentes
  }

  return (
    <form onSubmit={handleSubmit} className="mb-8 bg-white p-5 rounded-xl shadow border flex flex-col gap-5">
      <h2 className="text-xl font-semibold text-purple-800">Adicionar novo presente</h2>
      <div>
        <label htmlFor="gift-name" className="block font-medium text-gray-700 mb-1">Nome do presente <span className="text-pink-600">*</span></label>
        <Input id="gift-name" placeholder="Ex: Fraldas Pampers" value={name} onChange={e => setName(e.target.value)} disabled={loading} required />
      </div>
      <div>
        <label htmlFor="gift-description" className="block font-medium text-gray-700 mb-1">Descrição (opcional)</label>
        <Textarea id="gift-description" placeholder="Tamanho G ou M, pacote com 30 unidades, etc." value={description} onChange={e => setDescription(e.target.value)} disabled={loading} />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? "Adicionando..." : "Adicionar presente"}
      </Button>
    </form>
  );
}
