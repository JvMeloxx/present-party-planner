
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { GiftListForm } from "@/components/GiftListForm";

const fetchGiftList = async (id: string) => {
  const { data, error } = await supabase
    .from("gift_lists")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  
  if (error) throw error;
  if (!data) throw new Error("Lista não encontrada");
  return data;
};

export default function EditGiftListPage() {
  const { id = "" } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const { data: list, error, isLoading } = useQuery({
    queryKey: ["gift-list-edit", id],
    queryFn: () => fetchGiftList(id),
    enabled: !!id,
  });

  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
    };
    getCurrentUser();
  }, []);

  // Check if user is the owner
  const isOwner = currentUser && list && list.owner_id === currentUser.id;

  async function handleSubmit(formData: {
    title: string;
    description: string;
    isPublic: boolean;
    eventDate: string;
  }) {
    if (!list || !isOwner) {
      toast({
        variant: "destructive",
        title: "Acesso negado",
        description: "Você não tem permissão para editar esta lista",
      });
      return;
    }

    setLoading(true);

    try {
      const updateObj: any = {
        title: formData.title,
        description: formData.description || null,
        is_public: formData.isPublic,
      };

      if (formData.eventDate) {
        updateObj.event_date = formData.eventDate;
      } else {
        updateObj.event_date = null;
      }

      const { error } = await supabase
        .from("gift_lists")
        .update(updateObj)
        .eq("id", id);

      if (error) {
        console.error("Error updating list:", error);
        toast({
          variant: "destructive",
          title: "Erro ao atualizar lista",
          description: "Verifique os dados e tente novamente",
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

    } catch (error) {
      console.error("Unexpected error:", error);
      toast({
        variant: "destructive",
        title: "Erro inesperado",
        description: "Tente novamente em alguns instantes",
      });
    } finally {
      setLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando lista...</p>
        </div>
      </div>
    );
  }

  if (error || !list) {
    return (
      <div className="min-h-screen bg-purple-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Lista não encontrada.</p>
          <Link to="/minhas-listas">
            <Button variant="outline">Voltar às minhas listas</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!isOwner) {
    return (
      <div className="min-h-screen bg-purple-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Você não tem permissão para editar esta lista.</p>
          <Link to={`/lista/${id}`}>
            <Button variant="outline">Ver lista</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white">
      <div className="max-w-lg mx-auto py-10 px-4">
        <Link 
          to={`/lista/${id}`} 
          className="inline-flex items-center gap-2 mb-6 text-gray-600 hover:text-purple-600 font-medium transition-colors"
        >
          <ArrowLeft size={20} /> Voltar para lista
        </Link>
        
        <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-purple-100">
          <h1 className="text-3xl font-bold text-purple-800 mb-6">
            Editar lista de presentes
          </h1>
          <GiftListForm
            onSubmit={handleSubmit}
            loading={loading}
            initialData={{
              title: list.title,
              description: list.description || "",
              isPublic: list.is_public,
              eventDate: list.event_date || "",
            }}
            submitLabel="Salvar alterações"
          />
        </div>
      </div>
    </div>
  );
}
