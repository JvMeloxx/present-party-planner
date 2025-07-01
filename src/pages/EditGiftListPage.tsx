
import AuthenticatedLayout from "@/components/AuthenticatedLayout";
import Breadcrumbs from "@/components/Breadcrumbs";
import { GiftListForm } from "@/components/GiftListForm";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function EditGiftListPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const breadcrumbItems = [
    { label: "Minhas listas", href: "/minhas-listas" },
    { label: "Editar lista" }
  ];

  const { data: giftList, isLoading } = useQuery({
    queryKey: ["gift-list", id],
    queryFn: async () => {
      if (!id) throw new Error("ID da lista não fornecido");
      
      const { data, error } = await supabase
        .from("gift_lists")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id
  });

  const handleSubmit = async (data: {
    title: string;
    description: string;
    isPublic: boolean;
    eventDate: string;
  }) => {
    try {
      if (!id) throw new Error("ID da lista não fornecido");

      const { error } = await supabase
        .from("gift_lists")
        .update({
          title: data.title,
          description: data.description,
          is_public: data.isPublic,
          event_date: data.eventDate || null
        })
        .eq("id", id);

      if (error) throw error;

      toast.success("Lista atualizada com sucesso!");
      navigate(`/lista/${id}`);
    } catch (error) {
      console.error("Erro ao atualizar lista:", error);
      toast.error("Erro ao atualizar lista. Tente novamente.");
    }
  };

  if (isLoading) {
    return (
      <AuthenticatedLayout showFooter={false}>
        <div className="max-w-4xl mx-auto py-6 px-4">
          <div className="flex justify-center">
            <LoadingSpinner size="lg" text="Carregando lista..." />
          </div>
        </div>
      </AuthenticatedLayout>
    );
  }

  if (!giftList) {
    return (
      <AuthenticatedLayout showFooter={false}>
        <div className="max-w-4xl mx-auto py-6 px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Lista não encontrada</h1>
            <p className="text-gray-600">A lista que você está procurando não existe ou foi removida.</p>
          </div>
        </div>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout showFooter={false}>
      <div className="max-w-4xl mx-auto py-6 px-4">
        <Breadcrumbs items={breadcrumbItems} />
        
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-purple-800">Editar Lista</h1>
          <p className="text-gray-600 mt-2">Modifique os detalhes da sua lista de presentes</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <GiftListForm 
            onSubmit={handleSubmit}
            loading={false}
            initialData={{
              title: giftList.title,
              description: giftList.description || "",
              isPublic: giftList.is_public,
              eventDate: giftList.event_date || ""
            }}
            submitLabel="Salvar alterações"
          />
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
