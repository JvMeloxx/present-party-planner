
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";

export default function CreateGiftListPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      toast({ title: "Preencha o nome da lista", description: "O campo Nome é obrigatório", variant: "destructive" });
      return;
    }
    setLoading(true);

    // Por enquanto, owner_id é mock (depois trocar para o id do usuário logado)
    const owner_id = "00000000-0000-0000-0000-000000000000";

    const { data, error } = await supabase
      .from("gift_lists")
      .insert([
        {
          title,
          description: description.trim() || null,
          is_public: isPublic,
          owner_id,
        }
      ])
      .select()
      .maybeSingle();

    setLoading(false);

    if (error || !data) {
      toast({
        variant: "destructive",
        title: "Erro ao criar lista",
        description: error?.message || "Tente novamente ou contate o suporte",
      });
      return;
    }

    toast({
      title: "Lista criada!",
      description: "Redirecionando para a sua lista...",
    });

    setTimeout(() => {
      navigate(`/lista/${data.id}`);
    }, 800);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white flex items-center justify-center">
      <form
        className="max-w-lg w-full bg-white rounded-2xl shadow-lg p-8 border-2 border-purple-100 flex flex-col gap-6"
        onSubmit={handleSubmit}
      >
        <h1 className="text-3xl font-bold text-purple-800 mb-2">Criar nova lista de presentes</h1>
        <div>
          <label htmlFor="title" className="block font-semibold text-gray-700 mb-1">
            Nome da lista <span className="text-pink-600">*</span>
          </label>
          <Input
            id="title"
            placeholder="Chá de Bebê da Ana"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            className="text-base"
            disabled={loading}
          />
        </div>
        <div>
          <label htmlFor="description" className="block font-semibold text-gray-700 mb-1">
            Descrição (opcional)
          </label>
          <Textarea
            id="description"
            placeholder="Ex: O evento será no dia 14/08, confira a lista e participe!"
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="text-base"
            disabled={loading}
          />
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="isPublic"
            checked={isPublic}
            onCheckedChange={val => setIsPublic(!!val)}
            disabled={loading}
          />
          <label htmlFor="isPublic" className="text-gray-700 cursor-pointer">
            Deixar minha lista pública para quem tiver o link
          </label>
        </div>
        <Button type="submit" className="w-full mt-2" disabled={loading}>
          {loading ? "Criando..." : "Criar lista"}
        </Button>
      </form>
    </div>
  );
}
