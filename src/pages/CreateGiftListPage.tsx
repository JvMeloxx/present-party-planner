
import AuthenticatedLayout from "@/components/AuthenticatedLayout";
import Breadcrumbs from "@/components/Breadcrumbs";
import { GiftListForm } from "@/components/GiftListForm";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function CreateGiftListPage() {
  const navigate = useNavigate();
  
  const breadcrumbItems = [
    { label: "Minhas listas", href: "/minhas-listas" },
    { label: "Nova lista" }
  ];

  const handleSubmit = async (data: {
    title: string;
    description: string;
    isPublic: boolean;
    eventDate: string;
  }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const { data: newList, error } = await supabase
        .from("gift_lists")
        .insert({
          title: data.title,
          description: data.description,
          is_public: data.isPublic,
          event_date: data.eventDate || null,
          owner_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      toast.success("Lista criada com sucesso!");
      navigate(`/lista/${newList.id}`);
    } catch (error) {
      console.error("Erro ao criar lista:", error);
      toast.error("Erro ao criar lista. Tente novamente.");
    }
  };

  return (
    <AuthenticatedLayout showFooter={false}>
      <div className="max-w-4xl mx-auto py-6 px-4">
        <Breadcrumbs items={breadcrumbItems} />
        
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-purple-800">Criar Nova Lista</h1>
          <p className="text-gray-600 mt-2">Crie uma lista de presentes personalizada para sua ocasião especial</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <GiftListForm 
            onSubmit={handleSubmit} 
            loading={false}
            submitLabel="Criar lista" 
          />
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
