import { useState } from "react";
import { Link } from "react-router-dom";
import { Copy, Edit, Trash2, PlusCircle, Share, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { GiftList } from "@/types/gift";

const fetchUserLists = async (): Promise<GiftList[]> => {
  // Pega o usuário autenticado
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Usuário não autenticado");
  
  const { data, error } = await supabase
    .from("gift_lists")
    .select("*")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
};

function MyListsPage() {
  const [refreshIndex, setRefreshIndex] = useState(0);
  
  const { data: lists = [], isLoading, error } = useQuery({
    queryKey: ["user-lists", refreshIndex],
    queryFn: fetchUserLists,
  });

  const handleCopy = (listId: string) => {
    const url = window.location.origin + "/lista/" + listId;
    navigator.clipboard.writeText(url);
    toast({ title: "Link copiado!", description: "O link da lista foi copiado para a área de transferência." });
  };

  const handleDelete = async (listId: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta lista?")) {
      const { error } = await supabase
        .from("gift_lists")
        .delete()
        .eq("id", listId);

      if (error) {
        toast({ 
          title: "Erro ao excluir", 
          description: error.message, 
          variant: "destructive" 
        });
        return;
      }

      toast({ title: "Lista excluída", description: "A lista foi excluída com sucesso." });
      setRefreshIndex(i => i + 1);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    try {
      return new Date(dateString).toLocaleDateString('pt-BR');
    } catch {
      return null;
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto py-10 px-4">
        <div className="flex justify-center">Carregando suas listas...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto py-10 px-4">
        <div className="flex justify-center text-red-500">
          Erro ao carregar listas. Tente novamente.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-extrabold text-purple-800">Minhas listas</h1>
        <Link to="/criar-lista">
          <Button variant="default" className="gap-2">
            <PlusCircle size={20} />Nova lista
          </Button>
        </Link>
      </div>
      
      {lists.length === 0 ? (
        <div className="text-center text-gray-600">
          Você ainda não criou nenhuma lista.{" "}
          <Link to="/criar-lista" className="text-purple-600 underline">
            Criar agora
          </Link>
        </div>
      ) : (
        <ul className="space-y-5">
          {lists.map(list => (
            <li key={list.id} className="border rounded-xl bg-purple-50 p-5 flex flex-col sm:flex-row sm:items-center justify-between shadow-sm">
              <div className="flex-1">
                <Link to={`/lista/${list.id}`} className="font-bold text-lg text-purple-800 hover:underline">
                  {list.title}
                </Link>
                {list.description && (
                  <p className="text-gray-600 text-sm mt-1">{list.description}</p>
                )}
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-xs text-gray-400">
                    Criada em {formatDate(list.created_at)}
                  </span>
                  {list.event_date && (
                    <div className="flex items-center gap-1 text-xs text-purple-600">
                      <Calendar size={12} />
                      Evento: {formatDate(list.event_date)}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-2 mt-4 sm:mt-0">
                <Button variant="ghost" onClick={() => handleCopy(list.id)} title="Copiar link">
                  <Copy size={18} />
                </Button>
                <Link to={`/editar-lista/${list.id}`}>
                  <Button variant="ghost" title="Editar lista">
                    <Edit size={18} />
                  </Button>
                </Link>
                <Button variant="ghost" onClick={() => handleDelete(list.id)} title="Excluir lista">
                  <Trash2 size={18} />
                </Button>
                <Link to={`/lista/${list.id}`}>
                  <Button variant="secondary" className="gap-1" title="Ver lista">
                    <Share size={16} />Acessar
                  </Button>
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MyListsPage;
