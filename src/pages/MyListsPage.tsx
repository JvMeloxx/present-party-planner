import { useState } from "react";
import { Link } from "react-router-dom";
import { Copy, Edit, Trash2, PlusCircle, Share, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { GiftList } from "@/types/gift";
import AuthenticatedLayout from "@/components/AuthenticatedLayout";
import Breadcrumbs from "@/components/Breadcrumbs";
import LoadingSpinner from "@/components/LoadingSpinner";
import DashboardStats from "@/components/DashboardStats";

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

  const breadcrumbItems = [
    { label: "Minhas listas" }
  ];

  if (isLoading) {
    return (
      <AuthenticatedLayout showFooter={false}>
        <div className="max-w-6xl mx-auto py-10 px-4">
          <Breadcrumbs items={breadcrumbItems} />
          <LoadingSpinner size="lg" text="Carregando suas listas..." />
        </div>
      </AuthenticatedLayout>
    );
  }

  if (error) {
    return (
      <AuthenticatedLayout showFooter={false}>
        <div className="max-w-6xl mx-auto py-10 px-4">
          <Breadcrumbs items={breadcrumbItems} />
          <div className="text-center text-red-500">
            Erro ao carregar listas. Tente novamente.
          </div>
        </div>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout showFooter={false}>
      <div className="max-w-6xl mx-auto py-6 px-4">
        <Breadcrumbs items={breadcrumbItems} />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-purple-800">Dashboard</h1>
            <p className="text-gray-600 mt-1">Gerencie suas listas de presentes</p>
          </div>
          <Link to="/criar-lista">
            <Button className="gap-2 w-full sm:w-auto">
              <PlusCircle size={20} />
              Nova lista
            </Button>
          </Link>
        </div>

        <DashboardStats />
        
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Suas Listas Recentes</h2>
          
          {lists.length === 0 ? (
            <div className="text-center text-gray-600 py-20">
              <p className="text-lg mb-4">Você ainda não criou nenhuma lista.</p>
              <Link to="/criar-lista">
                <Button className="gap-2">
                  <PlusCircle size={20} />
                  Criar primeira lista
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {lists.map(list => (
                <div key={list.id} className="border rounded-xl bg-gray-50 p-4 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between hover:shadow-md transition-shadow gap-4">
                  <div className="flex-1 min-w-0">
                    <Link to={`/lista/${list.id}`} className="font-bold text-lg text-purple-800 hover:underline block truncate">
                      {list.title}
                    </Link>
                    {list.description && (
                      <p className="text-gray-600 text-sm mt-1 line-clamp-2">{list.description}</p>
                    )}
                    <div className="flex flex-wrap items-center gap-4 mt-2">
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
                  <div className="flex flex-wrap gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleCopy(list.id)} title="Copiar link">
                      <Copy size={16} />
                    </Button>
                    <Link to={`/editar-lista/${list.id}`}>
                      <Button variant="ghost" size="sm" title="Editar lista">
                        <Edit size={16} />
                      </Button>
                    </Link>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(list.id)} title="Excluir lista">
                      <Trash2 size={16} />
                    </Button>
                    <Link to={`/lista/${list.id}`}>
                      <Button size="sm" className="gap-1" title="Ver lista">
                        <Share size={16} />
                        Acessar
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}

export default MyListsPage;
