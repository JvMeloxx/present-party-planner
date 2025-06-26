
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { GiftListForm } from "@/components/GiftListForm";

export default function CreateGiftListPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(formData: {
    title: string;
    description: string;
    isPublic: boolean;
    eventDate: string;
  }) {
    setLoading(true);

    try {
      // Get authenticated user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        toast({
          variant: "destructive",
          title: "Erro de autenticação",
          description: "Você precisa estar logado para criar uma lista",
        });
        return;
      }

      // Prepare insert object
      const insertObj: any = {
        title: formData.title,
        description: formData.description || null,
        is_public: formData.isPublic,
        owner_id: user.id,
      };
      
      if (formData.eventDate) {
        insertObj.event_date = formData.eventDate;
      }

      const { data, error } = await supabase
        .from("gift_lists")
        .insert([insertObj])
        .select()
        .maybeSingle();

      if (error || !data) {
        console.error("Error creating list:", error);
        toast({
          variant: "destructive",
          title: "Erro ao criar lista",
          description: "Verifique os dados e tente novamente",
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white flex items-center justify-center">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-lg p-8 border-2 border-purple-100">
        <h1 className="text-3xl font-bold text-purple-800 mb-6">
          Criar nova lista de presentes
        </h1>
        <GiftListForm
          onSubmit={handleSubmit}
          loading={loading}
          submitLabel="Criar lista"
        />
      </div>
    </div>
  );
}
