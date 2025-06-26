import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Gift, GiftList } from "../types/gift";
import { GiftCard } from "../components/GiftCard";
import { ArrowLeft, Calendar, Share2, Users } from "lucide-react";
import GiftItemForm from "../components/GiftItemForm";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

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
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  const { data, error, isLoading } = useQuery({
    queryKey: ["gift-list", id, refreshIndex],
    queryFn: () => fetchGiftList(id || ""),
    enabled: !!id,
  });

  // Verifica o usuário atual
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
    };
    getCurrentUser();
  }, []);

  // Verifica se o usuário atual é o dono da lista
  const isOwner = currentUser && data?.list?.owner_id === currentUser.id;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    try {
      return new Date(dateString).toLocaleDateString('pt-BR');
    } catch {
      return null;
    }
  };

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast({ title: "Link copiado!", description: "O link da lista foi copiado para a área de transferência." });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando lista de presentes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-purple-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Erro ao carregar lista de presentes.</p>
          <Link to="/">
            <Button variant="outline">Voltar ao início</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!data?.list) {
    return (
      <div className="min-h-screen bg-purple-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Lista não encontrada.</p>
          <Link to="/">
            <Button variant="outline">Voltar ao início</Button>
          </Link>
        </div>
      </div>
    );
  }

  const reservedCount = data.items.filter(item => item.reserver_name).length;
  const totalCount = data.items.length;

  return (
    <div className="min-h-screen bg-purple-50">
      <div className="max-w-2xl mx-auto py-10 px-4">
        <Link to="/" className="inline-flex items-center gap-2 mb-6 text-gray-600 hover:text-purple-600 font-medium transition-colors">
          <ArrowLeft size={20} /> Voltar
        </Link>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border mb-8">
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-3xl font-bold text-purple-800">{data.list.title}</h1>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              className="flex items-center gap-2"
            >
              <Share2 size={16} />
              Compartilhar
            </Button>
          </div>
          
          {data.list.description && (
            <p className="text-gray-700 mb-4">{data.list.description}</p>
          )}
          
          <div className="flex flex-wrap gap-4">
            {data.list.event_date && (
              <div className="flex items-center gap-2 text-purple-600 bg-purple-100 px-3 py-2 rounded-lg">
                <Calendar size={16} />
                <span className="text-sm font-medium">
                  {formatDate(data.list.event_date)}
                </span>
              </div>
            )}
            
            {totalCount > 0 && (
              <div className="flex items-center gap-2 text-gray-600 bg-gray-100 px-3 py-2 rounded-lg">
                <Users size={16} />
                <span className="text-sm font-medium">
                  {reservedCount}/{totalCount} presentes reservados
                </span>
              </div>
            )}
          </div>
        </div>
        
        {isOwner && (
          <GiftItemForm
            listId={data.list.id}
            onGiftAdded={() => setRefreshIndex(i => i + 1)}
          />
        )}
        
        <div className="grid md:grid-cols-2 gap-6">
          {data.items.length === 0 ? (
            <div className="col-span-2 text-center text-gray-500 py-20 bg-white rounded-xl">
              <p className="text-lg mb-2">Ainda não há presentes cadastrados nesta lista.</p>
              {!isOwner && (
                <p className="text-sm">Aguarde o dono da lista adicionar os presentes desejados.</p>
              )}
            </div>
          ) : (
            data.items.map((item) => (
              <GiftCard 
                key={item.id} 
                gift={item} 
                onReserved={() => setRefreshIndex(i => i + 1)} 
                showActions={isOwner}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
