
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Gift, GiftList } from "../types/gift";
import { GiftCard } from "../components/GiftCard";
import { ListStats } from "../components/ListStats";
import { GiftSearch } from "../components/GiftSearch";
import { ShareButtons } from "../components/ShareButtons";
import { ArrowLeft, Calendar, Users } from "lucide-react";
import GiftItemForm from "../components/GiftItemForm";
import { useState, useEffect, useMemo } from "react";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<'all' | 'available' | 'reserved'>('all');
  const [sort, setSort] = useState<'name' | 'date' | 'status'>('name');
  
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

  // Filtrar e ordenar presentes
  const filteredAndSortedGifts = useMemo(() => {
    if (!data?.items) return [];
    
    let filtered = data.items;
    
    // Aplicar busca
    if (searchTerm) {
      filtered = filtered.filter(gift => 
        gift.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (gift.description && gift.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Aplicar filtro
    if (filter === 'available') {
      filtered = filtered.filter(gift => !gift.reserver_name);
    } else if (filter === 'reserved') {
      filtered = filtered.filter(gift => gift.reserver_name);
    }
    
    // Aplicar ordenação
    const sorted = [...filtered].sort((a, b) => {
      switch (sort) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'date':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'status':
          if (a.reserver_name && !b.reserver_name) return -1;
          if (!a.reserver_name && b.reserver_name) return 1;
          return 0;
        default:
          return 0;
      }
    });
    
    return sorted;
  }, [data?.items, searchTerm, filter, sort]);

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
  const currentUrl = window.location.href;

  return (
    <div className="min-h-screen bg-purple-50">
      <div className="max-w-4xl mx-auto py-10 px-4">
        <Link to="/" className="inline-flex items-center gap-2 mb-6 text-gray-600 hover:text-purple-600 font-medium transition-colors">
          <ArrowLeft size={20} /> Voltar
        </Link>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border mb-8">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 gap-4">
            <h1 className="text-3xl font-bold text-purple-800">{data.list.title}</h1>
            <ShareButtons 
              listTitle={data.list.title}
              listUrl={currentUrl}
            />
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
        
        {/* Estatísticas - apenas para o dono */}
        {isOwner && totalCount > 0 && (
          <ListStats gifts={data.items} />
        )}
        
        {isOwner && (
          <GiftItemForm
            listId={data.list.id}
            onGiftAdded={() => setRefreshIndex(i => i + 1)}
          />
        )}
        
        {/* Busca e filtros - apenas se houver presentes */}
        {totalCount > 0 && (
          <GiftSearch
            onSearch={setSearchTerm}
            onFilter={setFilter}
            onSort={setSort}
            currentFilter={filter}
            currentSort={sort}
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
          ) : filteredAndSortedGifts.length === 0 ? (
            <div className="col-span-2 text-center text-gray-500 py-20 bg-white rounded-xl">
              <p className="text-lg mb-2">Nenhum presente encontrado com os filtros aplicados.</p>
              <p className="text-sm">Tente ajustar sua busca ou filtros.</p>
            </div>
          ) : (
            filteredAndSortedGifts.map((item) => (
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
