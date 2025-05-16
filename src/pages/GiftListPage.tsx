import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Gift, GiftList } from "../types/gift";
import { GiftCard } from "../components/GiftCard";
import { ArrowLeft } from "lucide-react";
import GiftItemForm from "../components/GiftItemForm";
import { useState } from "react";

const fetchGiftList = async (id: string) => {
  // Busca dados da lista
  const { data: list, error: listError } = await supabase
    .from("gift_lists")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (listError) throw listError;
  if (!list) throw new Error("Lista não encontrada");

  // Busca presentes
  const { data: items, error: itemsError } = await supabase
    .from("gift_items")
    .select("*")
    .eq("list_id", id);
  if (itemsError) throw itemsError;

  return { list, items };
};

export default function GiftListPage() {
  const { id = "" } = useParams<{ id: string }>();
  const [refreshIndex, setRefreshIndex] = useState(0);
  const { data, error, isLoading } = useQuery({
    queryKey: ["gift-list", id, refreshIndex],
    queryFn: () => fetchGiftList(id || ""),
    enabled: !!id,
  });

  // Dono mockado para demo. Troque depois por id do usuário autenticado!
  const isOwner = data?.list?.owner_id === "00000000-0000-0000-0000-000000000000";

  if (isLoading) return <div className="flex justify-center py-10">Carregando...</div>;
  if (error) return <div className="flex justify-center py-10 text-red-500">Erro ao carregar lista de presentes.</div>;
  if (!data?.list) return <div className="flex justify-center py-10">Lista não encontrada.</div>;

  return (
    <div className="min-h-screen bg-purple-50">
      <div className="max-w-2xl mx-auto py-10 px-4">
        <Link to="/" className="inline-flex items-center gap-2 mb-4 text-gray-600 hover:text-purple-600 font-medium transition-colors">
          <ArrowLeft size={20} /> Voltar
        </Link>
        <h1 className="text-3xl font-bold text-purple-800 mb-2">{data.list.title}</h1>
        {data.list.description && (
          <p className="text-gray-700 mb-6">{data.list.description}</p>
        )}
        {isOwner && (
          <GiftItemForm
            listId={data.list.id}
            onGiftAdded={() => setRefreshIndex(i => i + 1)}
          />
        )}
        <div className="grid md:grid-cols-2 gap-6">
          {data.items.length === 0 ? (
            <div className="col-span-2 text-center text-gray-500 py-20">Ainda não há presentes cadastrados nesta lista.</div>
          ) : (
            data.items.map((item) => <GiftCard key={item.id} gift={item} />)
          )}
        </div>
      </div>
    </div>
  );
}
