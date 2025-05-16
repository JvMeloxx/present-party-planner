
import { Gift } from "../types/gift";
import { Gift as GiftIcon, Check, User, Plus } from "lucide-react";
import { useState } from "react";
import { ReserveGiftModal } from "./ReserveGiftModal";

export function GiftCard({ gift, onReserved }: { gift: Gift, onReserved?: () => void }) {
  const [modalOpen, setModalOpen] = useState(false);

  const isAvailable = !gift.reserver_name;
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
        <div className="flex flex-col gap-2 mt-2">
          <div className="flex items-center gap-2 text-pink-500 text-sm font-semibold">
            <GiftIcon size={16} /> Disponível para presentear
          </div>
          <button
            className="mt-1 inline-flex items-center gap-1 rounded bg-purple-600 text-white px-3 py-1.5 font-medium shadow hover:bg-purple-700 transition-colors text-sm w-fit"
            onClick={() => setModalOpen(true)}
            aria-label="Reservar presente"
            type="button"
          >
            <Plus size={16} /> Quero presentear
          </button>
          <ReserveGiftModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            giftId={gift.id}
            onReserved={onReserved || (() => {})}
          />
        </div>
      )}
      {/* Futuramente: botão "Cancelar reserva" */}
    </div>
  );
}
