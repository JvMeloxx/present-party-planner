
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gift, List, Users, Calendar } from "lucide-react";
import LoadingSpinner from "./LoadingSpinner";

const fetchUserStats = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Usuário não autenticado");

  // Buscar listas do usuário
  const { data: lists, error: listsError } = await supabase
    .from("gift_lists")
    .select("*")
    .eq("owner_id", user.id);

  if (listsError) throw listsError;

  // Buscar total de presentes
  const { data: gifts, error: giftsError } = await supabase
    .from("gift_items")
    .select("*, gift_lists!inner(*)")
    .eq("gift_lists.owner_id", user.id);

  if (giftsError) throw giftsError;

  // Calcular estatísticas
  const totalLists = lists?.length || 0;
  const totalGifts = gifts?.length || 0;
  const reservedGifts = gifts?.filter(gift => gift.reserver_name).length || 0;
  const upcomingEvents = lists?.filter(list => 
    list.event_date && new Date(list.event_date) > new Date()
  ).length || 0;

  return {
    totalLists,
    totalGifts,
    reservedGifts,
    upcomingEvents
  };
};

const DashboardStats = () => {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ["user-stats"],
    queryFn: fetchUserStats,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <LoadingSpinner size="sm" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return null;
  }

  const statsData = [
    {
      title: "Total de Listas",
      value: stats?.totalLists || 0,
      icon: List,
      color: "text-blue-600"
    },
    {
      title: "Total de Presentes",
      value: stats?.totalGifts || 0,
      icon: Gift,
      color: "text-green-600"
    },
    {
      title: "Presentes Reservados",
      value: stats?.reservedGifts || 0,
      icon: Users,
      color: "text-purple-600"
    },
    {
      title: "Eventos Próximos",
      value: stats?.upcomingEvents || 0,
      icon: Calendar,
      color: "text-orange-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {statsData.map((stat, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardStats;
