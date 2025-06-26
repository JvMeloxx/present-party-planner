
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const fetchGiftList = async (id: string) => {
  const { data, error } = await supabase
    .from("gift_lists")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new Error("Lista não encontrada");
  
  // Verifica se o usuário é o dono da lista
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || data.owner_id !== user.id) {
    throw new Error("Você não tem permissão para editar esta lista");
  }
  
  return data;
};

export default function EditGiftListPage() {
  const { id = "" } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [eventDate, setEventDate] = useState("");
  const [loading, setLoading] = useState(false);

  const { data: list, isLoading, error } = useQuery({
    queryKey: ["gift-list-edit", id],
    queryFn: () => fetchGiftList(id),
    enabled: !!id,
  });

  useEffect(() => {
    if (list) {
      setTitle(list.title);
      setDescription(list.description || "");
      setIsPublic(list.is_public);
      setEventDate(list.event_date || "");
    }
  }, [list]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      toast({ title: "Preencha o nome da lista", description: "O campo Nome é obrigatório", variant: "destructive" });
      return;
    }
    
    setLoading(true);

    const updateObj: any = {
      title,
      description: description.trim() || null,
      is_public: isPublic,
    };
    if (eventDate) updateObj.event_date = eventDate;
    else updateObj.event_date = null;

    const { error } = await supabase
      .from("gift_lists")
      .update(updateObj)
      .eq("id", id);

    setLoading(false);

    if (error) {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar lista",
        description: error.message,
      });
      return;
    }

    toast({
      title: "Lista atualizada!",
      description: "Redirecionando para a sua lista...",
    });

    setTimeout(() => {
      navigate(`/lista/${id}`);
    }, 800);
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dados da lista...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error.message}</p>
          <Link to="/minhas-listas">
            <Button variant="outline">Voltar às minhas listas</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white flex items-center justify-center">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-lg p-8 border-2 border-purple-100">
        <Link to="/minhas-listas" className="inline-flex items-center gap-2 mb-6 text-gray-600 hover:text-purple-600 font-medium transition-colors">
          <ArrowLeft size={20} /> Voltar às minhas listas
        </Link>
        
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <h1 className="text-3xl font-bold text-purple-800 mb-2">Editar lista de presentes</h1>
          
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
          
          <div>
            <label htmlFor="event-date" className="block font-semibold text-gray-700 mb-1">
              Data do evento <span className="text-xs text-gray-400">(opcional)</span>
            </label>
            <div className="relative flex items-center">
              <Input
                id="event-date"
                type="date"
                value={eventDate}
                onChange={e => setEventDate(e.target.value)}
                className="text-base pr-10"
                disabled={loading}
              />
              <Calendar className="absolute right-2 text-gray-400" size={20} />
            </div>
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
            {loading ? "Salvando..." : "Salvar alterações"}
          </Button>
        </form>
      </div>
    </div>
  );
}
