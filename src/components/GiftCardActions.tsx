
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MoreVertical, Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Gift } from "../types/gift";
import { EditGiftModal } from "./EditGiftModal";
import { DeleteGiftModal } from "./DeleteGiftModal";

type GiftCardActionsProps = {
  gift: Gift;
  onUpdated: () => void;
};

export function GiftCardActions({ gift, onUpdated }: GiftCardActionsProps) {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0 hover:bg-purple-100"
            aria-label="Mais opções"
          >
            <MoreVertical size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem 
            onClick={() => setEditModalOpen(true)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Edit size={16} />
            Editar presente
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => setDeleteModalOpen(true)}
            className="flex items-center gap-2 cursor-pointer text-red-600 focus:text-red-600"
          >
            <Trash2 size={16} />
            Excluir presente
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditGiftModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        gift={gift}
        onUpdated={onUpdated}
      />

      <DeleteGiftModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        gift={gift}
        onDeleted={onUpdated}
      />
    </>
  );
}
