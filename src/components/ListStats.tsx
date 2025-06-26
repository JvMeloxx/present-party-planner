
import { Users, Gift, CheckCircle, Clock } from "lucide-react";
import { Gift as GiftType } from "../types/gift";

interface ListStatsProps {
  gifts: GiftType[];
}

export function ListStats({ gifts }: ListStatsProps) {
  const totalGifts = gifts.length;
  const reservedGifts = gifts.filter(gift => gift.reserver_name).length;
  const availableGifts = totalGifts - reservedGifts;
  const reservationPercentage = totalGifts > 0 ? Math.round((reservedGifts / totalGifts) * 100) : 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-lg p-4 shadow-sm border border-purple-100">
        <div className="flex items-center gap-2 mb-2">
          <Gift className="text-purple-500" size={20} />
          <span className="text-sm font-medium text-gray-600">Total</span>
        </div>
        <div className="text-2xl font-bold text-purple-800">{totalGifts}</div>
      </div>

      <div className="bg-white rounded-lg p-4 shadow-sm border border-green-100">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle className="text-green-500" size={20} />
          <span className="text-sm font-medium text-gray-600">Reservados</span>
        </div>
        <div className="text-2xl font-bold text-green-600">{reservedGifts}</div>
      </div>

      <div className="bg-white rounded-lg p-4 shadow-sm border border-pink-100">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="text-pink-500" size={20} />
          <span className="text-sm font-medium text-gray-600">Disponíveis</span>
        </div>
        <div className="text-2xl font-bold text-pink-600">{availableGifts}</div>
      </div>

      <div className="bg-white rounded-lg p-4 shadow-sm border border-blue-100">
        <div className="flex items-center gap-2 mb-2">
          <Users className="text-blue-500" size={20} />
          <span className="text-sm font-medium text-gray-600">Progresso</span>
        </div>
        <div className="text-2xl font-bold text-blue-600">{reservationPercentage}%</div>
      </div>
    </div>
  );
}
