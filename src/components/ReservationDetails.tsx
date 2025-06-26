
import { User, Calendar, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Gift } from "../types/gift";
import { Button } from "@/components/ui/button";

interface ReservationDetailsProps {
  gift: Gift;
}

export function ReservationDetails({ gift }: ReservationDetailsProps) {
  const [showDetails, setShowDetails] = useState(false);

  if (!gift.reserver_name) return null;

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Data inválida';
    }
  };

  return (
    <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-green-700">
          <User size={16} />
          <span className="font-medium">Reservado por:</span>
          <span className="font-semibold">{gift.reserver_name}</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowDetails(!showDetails)}
          className="h-8 px-2 text-green-600 hover:text-green-700"
        >
          {showDetails ? <EyeOff size={16} /> : <Eye size={16} />}
        </Button>
      </div>
      
      {showDetails && gift.reserved_at && (
        <div className="mt-2 pt-2 border-t border-green-200">
          <div className="flex items-center gap-2 text-sm text-green-600">
            <Calendar size={14} />
            <span>Reservado em: {formatDate(gift.reserved_at)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
