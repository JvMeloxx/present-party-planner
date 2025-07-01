
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Calendar, Gift, Users, TrendingUp } from "lucide-react";
import { GiftList } from "@/types/gift";
import { ListActionButtons } from "./ListActionButtons";
import LoadingSpinner from "./LoadingSpinner";

export function AuthenticatedHome() {
  const [recentLists, setRecentLists] = useState<GiftList[]>([]);
  const [stats, setStats] = useState({
    totalLists: 0,
    totalGifts: 0,
    reservedGifts: 0,
    upcomingEvents: 0
  });
  const [loading, setLoading] = useState(true);
  const [refreshIndex, setRefreshIndex] = useState(0);

  useEffect(() => {
    loadData();
  }, [refreshIndex]);

  const loadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Carregar listas recentes
      const { data: lists, error: listsError } = await supabase
        .from("gift_lists")
        .select("*")
        .eq("owner_id", user.id)
        .order("created_at", { ascending: false })
        .limit(3);

      if (listsError) throw listsError;

      // Carregar estatísticas
      const { data: allLists, error: allListsError } = await supabase
        .from("gift_lists")
        .select("id, event_date")
        .eq("owner_id", user.id);

      if (allListsError) throw allListsError;

      const { data: allGifts, error: allGiftsError } = await supabase
        .from("gift_items")
        .select("id, reserver_name, list_id, gift_lists!inner(owner_id)")
        .eq("gift_lists.owner_id", user.id);

      if (allGiftsError) throw allGiftsError;

      const now = new Date();
      const oneMonthFromNow = new Date();
      oneMonthFromNow.setMonth(now.getMonth() + 1);

      const upcomingEvents = (allLists || []).filter(list => {
        if (!list.event_date) return false;
        const eventDate = new Date(list.event_date);
        return eventDate >= now && eventDate <= oneMonthFromNow;
      }).length;

      setRecentLists(lists || []);
      setStats({
        totalLists: allLists?.length || 0,
        totalGifts: allGifts?.length || 0,
        reservedGifts: allGifts?.filter(gift => gift.reserver_name).length || 0,
        upcomingEvents
      });
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (listId: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta lista?")) {
      const { error } = await supabase
        .from("gift_lists")
        .delete()
        .eq("id", listId);

      if (!error) {
        setRefreshIndex(i => i + 1);
      }
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

  if (loading) {
    return <LoadingSpinner size="lg" text="Carregando dashboard..." />;
  }

  return (
    <div className="space-y-8">
      {/* Header de boas-vindas */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Bem-vindo de volta! 🎁
        </h1>
        <p className="text-gray-600 mb-6">
          Gerencie suas listas de presentes e acompanhe o progresso
        </p>
        <Link to="/criar-lista">
          <Button size="lg" className="gap-2">
            <Plus size={20} />
            Criar nova lista
          </Button>
        </Link>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Gift className="w-6 h-6 mx-auto mb-2 text-purple-600" />
            <div className="text-2xl font-bold text-purple-600">{stats.totalLists}</div>
            <div className="text-sm text-gray-600">Listas</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Users className="w-6 h-6 mx-auto mb-2 text-green-600" />
            <div className="text-2xl font-bold text-green-600">{stats.totalGifts}</div>
            <div className="text-sm text-gray-600">Presentes</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-6 h-6 mx-auto mb-2 text-blue-600" />
            <div className="text-2xl font-bold text-blue-600">{stats.reservedGifts}</div>
            <div className="text-sm text-gray-600">Reservados</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Calendar className="w-6 h-6 mx-auto mb-2 text-orange-600" />
            <div className="text-2xl font-bold text-orange-600">{stats.upcomingEvents}</div>
            <div className="text-sm text-gray-600">Eventos próximos</div>
          </CardContent>
        </Card>
      </div>

      {/* Listas recentes */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Listas Recentes</CardTitle>
          <Link to="/minhas-listas">
            <Button variant="outline" size="sm">
              Ver todas
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {recentLists.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <Gift className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="mb-4">Você ainda não criou nenhuma lista</p>
              <Link to="/criar-lista">
                <Button className="gap-2">
                  <Plus size={16} />
                  Criar primeira lista
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recentLists.map(list => (
                <div key={list.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <Link to={`/lista/${list.id}`} className="font-medium text-purple-800 hover:underline block truncate">
                      {list.title}
                    </Link>
                    {list.description && (
                      <p className="text-sm text-gray-600 truncate mt-1">{list.description}</p>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span>Criada em {formatDate(list.created_at)}</span>
                      {list.event_date && (
                        <div className="flex items-center gap-1">
                          <Calendar size={12} />
                          {formatDate(list.event_date)}
                        </div>
                      )}
                    </div>
                  </div>
                  <ListActionButtons
                    list={list}
                    onDelete={handleDelete}
                    onUpdated={() => setRefreshIndex(i => i + 1)}
                    showViewButton={false}
                  />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
