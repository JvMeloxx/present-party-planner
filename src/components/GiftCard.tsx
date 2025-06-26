
import { Gift } from "../types/gift";
import { Gift as GiftIcon, Check, User, Plus } from "lucide-react";
import { useState } from "react";
import { ReserveGiftModal } from "./ReserveGiftModal";

export function GiftCard({ gift, onReserved }: { gift: Gift, onReserved?: () => void }) {
  const [modalOpen, setModalOpen] = useState(false);

  const isReserved = !!gift.reserver_name;
  
  return (
    <div className="bg-white rounded-xl border-2 border-purple-100 p-6 shadow-sm relative flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <GiftIcon className="text-purple-400" size={22} />
        <span className="font-bold text-purple-700 text-lg">{gift.name}</span>
      </div>
      
      {gift.description && (
        <div className="text-gray-600 text-sm">{gift.description}</div>
      )}

      {isReserved ? (
        <div className="flex items-center gap-2 mt-2 text-green-600 text-sm font-medium bg-green-50 p-3 rounded-lg">
          <Check size={16} /> 
          <span>Reservado por</span>
          <User className="ml-1" size={14} /> 
          <span className="font-semibold">{gift.reserver_name}</span>
        </div>
      ) : (
        <div className="flex flex-col gap-3 mt-2">
          <div className="flex items-center gap-2 text-pink-500 text-sm font-semibold bg-pink-50 p-2 rounded-lg">
            <GiftIcon size={16} /> Disponível para presentear
          </div>
          <button
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-purple-600 text-white px-4 py-2 font-medium shadow hover:bg-purple-700 transition-colors text-sm w-full"
            onClick={() => setModalOpen(true)}
            aria-label="Reservar presente"
            type="button"
          >
            <Plus size={16} /> Quero presentear
          </button>
        </div>
      )}
      
      <ReserveGiftModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        giftId={gift.id}
        onReserved={onReserved || (() => {})}
      />
    </div>
  );
}
