
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  MoreVertical, 
  Copy, 
  Edit, 
  Trash2, 
  Share, 
  Download,
  Eye
} from "lucide-react";
import { GiftList } from "@/types/gift";
import { DuplicateListModal } from "./DuplicateListModal";
import { ShareListModal } from "./ShareListModal";
import { Link } from "react-router-dom";

interface ListActionButtonsProps {
  list: GiftList;
  onDelete: (listId: string) => void;
  onUpdated: () => void;
  showViewButton?: boolean;
}

export function ListActionButtons({ 
  list, 
  onDelete, 
  onUpdated, 
  showViewButton = true 
}: ListActionButtonsProps) {
  const [duplicateModalOpen, setDuplicateModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  const handlePrintList = () => {
    const printUrl = `/lista/${list.id}?print=true`;
    window.open(printUrl, '_blank');
  };

  return (
    <>
      <div className="flex items-center gap-2">
        {showViewButton && (
          <Link to={`/lista/${list.id}`}>
            <Button size="sm" className="gap-1">
              <Eye size={16} />
              Ver
            </Button>
          </Link>
        )}
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreVertical size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem 
              onClick={() => setShareModalOpen(true)}
              className="gap-2"
            >
              <Share size={16} />
              Compartilhar
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setDuplicateModalOpen(true)}
              className="gap-2"
            >
              <Copy size={16} />
              Duplicar lista
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={handlePrintList}
              className="gap-2"
            >
              <Download size={16} />
              Imprimir/PDF
            </DropdownMenuItem>
            <Link to={`/editar-lista/${list.id}`}>
              <DropdownMenuItem className="gap-2">
                <Edit size={16} />
                Editar lista
              </DropdownMenuItem>
            </Link>
            <DropdownMenuItem 
              onClick={() => onDelete(list.id)}
              className="gap-2 text-red-600 focus:text-red-600"
            >
              <Trash2 size={16} />
              Excluir lista
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <DuplicateListModal
        open={duplicateModalOpen}
        onClose={() => setDuplicateModalOpen(false)}
        list={list}
        onDuplicated={onUpdated}
      />

      <ShareListModal
        open={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        list={list}
      />
    </>
  );
}
