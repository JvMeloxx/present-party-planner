
import { Card, CardContent } from "@/components/ui/card";
import { Gift, Users, Calendar, TrendingUp } from "lucide-react";
import { Gift as GiftType } from "@/types/gift";

interface QuickStatsProps {
  gifts: GiftType[];
  eventDate?: string | null;
}

export function QuickStats({ gifts, eventDate }: QuickStatsProps) {
  const totalGifts = gifts.length;
  const reservedGifts = gifts.filter(gift => gift.reserver_name).length;
  const availableGifts = totalGifts - reservedGifts;
  const completionRate = totalGifts > 0 ? Math.round((reservedGifts / totalGifts) * 100) : 0;

  const getDaysUntilEvent = () => {
    if (!eventDate) return null;
    const today = new Date();
    const event = new Date(eventDate);
    const diffTime = event.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilEvent = getDaysUntilEvent();

  const stats = [
    {
      icon: Gift,
      label: "Total de presentes",
      value: totalGifts.toString(),
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      icon: Users,
      label: "Já reservados",
      value: reservedGifts.toString(),
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      icon: TrendingUp,
      label: "Taxa de conclusão",
      value: `${completionRate}%`,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    }
  ];

  if (daysUntilEvent !== null) {
    stats.push({
      icon: Calendar,
      label: daysUntilEvent > 0 ? "Dias restantes" : daysUntilEvent === 0 ? "Hoje!" : "Evento passou",
      value: daysUntilEvent > 0 ? daysUntilEvent.toString() : daysUntilEvent === 0 ? "🎉" : Math.abs(daysUntilEvent).toString(),
      color: daysUntilEvent > 0 ? "text-orange-600" : daysUntilEvent === 0 ? "text-green-600" : "text-gray-600",
      bgColor: daysUntilEvent > 0 ? "bg-orange-50" : daysUntilEvent === 0 ? "bg-green-50" : "bg-gray-50"
    });
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <Card key={index} className="border-0 shadow-sm">
          <CardContent className={`p-4 text-center ${stat.bgColor} rounded-lg`}>
            <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
            <div className={`text-xl font-bold ${stat.color}`}>
              {stat.value}
            </div>
            <div className="text-xs text-gray-600 mt-1">
              {stat.label}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
