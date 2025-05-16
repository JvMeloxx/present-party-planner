
import { Gift } from "../types/gift";
import { Gift as GiftIcon, Check, User } from "lucide-react";

export function GiftCard({ gift }: { gift: Gift }) {
  return (
    <div className="bg-white rounded-xl border-2 border-purple-100 p-6 shadow-sm relative flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <GiftIcon className="text-purple-400" size={22} />
        <span className="font-bold text-purple-700 text-lg">{gift.name}</span>
      </div>
      {gift.description && (
        <div className="text-gray-600 text-sm mt-1">{gift.description}</div>
      )}
      {gift.reserver_name ? (
        <div className="flex items-center gap-2 mt-2 text-green-600 text-sm font-medium">
          <Check size={16} /> Reservado por <User className="ml-1" size={14} /> {gift.reserver_name}
        </div>
      ) : (
        <div className="flex items-center gap-2 mt-2 text-pink-500 text-sm font-semibold">
          <GiftIcon size={16} /> Disponível para presentear
        </div>
      )}
      {/* Futuramente: botão "Quero presentear" */}
    </div>
  );
}
