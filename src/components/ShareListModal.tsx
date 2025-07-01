
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Share2, 
  Copy, 
  MessageCircle, 
  Facebook, 
  Twitter, 
  Mail,
  Check
} from "lucide-react";
import { GiftList } from "@/types/gift";
import { toast } from "sonner";

interface ShareListModalProps {
  open: boolean;
  onClose: () => void;
  list: GiftList;
}

export function ShareListModal({ open, onClose, list }: ShareListModalProps) {
  const [copied, setCopied] = useState(false);
  const listUrl = `${window.location.origin}/lista/${list.id}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(listUrl);
      setCopied(true);
      toast.success("Link copiado!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Erro ao copiar link");
    }
  };

  const handleWhatsAppShare = () => {
    const message = `Confira minha lista de presentes: ${list.title}\n${listUrl}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleEmailShare = () => {
    const subject = `Lista de Presentes: ${list.title}`;
    const body = `Olá!\n\nConfira minha lista de presentes "${list.title}":\n${listUrl}\n\nObrigado!`;
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
  };

  const handleFacebookShare = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(listUrl)}`;
    window.open(facebookUrl, '_blank');
  };

  const handleTwitterShare = () => {
    const message = `Confira minha lista de presentes: ${list.title}`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(listUrl)}`;
    window.open(twitterUrl, '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 size={20} className="text-purple-600" />
            Compartilhar Lista
          </DialogTitle>
          <DialogDescription>
            Compartilhe sua lista "{list.title}" com amigos e familiares
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Link direto */}
          <div>
            <Label htmlFor="url">Link da lista</Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="url"
                value={listUrl}
                readOnly
                className="bg-gray-50"
              />
              <Button
                onClick={handleCopyLink}
                size="sm"
                variant={copied ? "default" : "outline"}
                className="gap-1 min-w-fit"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? "Copiado" : "Copiar"}
              </Button>
            </div>
          </div>

          {/* Opções de compartilhamento */}
          <div>
            <Label>Compartilhar via</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <Button
                variant="outline"
                onClick={handleWhatsAppShare}
                className="gap-2 h-12"
              >
                <MessageCircle size={18} className="text-green-600" />
                WhatsApp
              </Button>
              <Button
                variant="outline"
                onClick={handleEmailShare}
                className="gap-2 h-12"
              >
                <Mail size={18} className="text-blue-600" />
                Email
              </Button>
              <Button
                variant="outline"
                onClick={handleFacebookShare}
                className="gap-2 h-12"
              >
                <Facebook size={18} className="text-blue-700" />
                Facebook
              </Button>
              <Button
                variant="outline"
                onClick={handleTwitterShare}
                className="gap-2 h-12"
              >
                <Twitter size={18} className="text-blue-400" />
                Twitter
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
