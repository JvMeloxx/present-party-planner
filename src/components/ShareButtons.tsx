
import { Share2, Copy, MessageCircle, Facebook, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/use-toast";

interface ShareButtonsProps {
  listTitle: string;
  listUrl: string;
}

export function ShareButtons({ listTitle, listUrl }: ShareButtonsProps) {
  const handleCopyLink = () => {
    navigator.clipboard.writeText(listUrl);
    toast({ 
      title: "Link copiado!", 
      description: "O link da lista foi copiado para a área de transferência." 
    });
  };

  const handleWhatsAppShare = () => {
    const message = `Confira minha lista de presentes: ${listTitle} - ${listUrl}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleFacebookShare = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(listUrl)}`;
    window.open(facebookUrl, '_blank');
  };

  const handleTwitterShare = () => {
    const message = `Confira minha lista de presentes: ${listTitle}`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(listUrl)}`;
    window.open(twitterUrl, '_blank');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Share2 size={16} />
          Compartilhar
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48">
        <DropdownMenuItem onClick={handleCopyLink} className="gap-2">
          <Copy size={16} />
          Copiar link
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleWhatsAppShare} className="gap-2">
          <MessageCircle size={16} />
          WhatsApp
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleFacebookShare} className="gap-2">
          <Facebook size={16} />
          Facebook
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleTwitterShare} className="gap-2">
          <Twitter size={16} />
          Twitter
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
