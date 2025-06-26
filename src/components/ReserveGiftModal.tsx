
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

type ReserveGiftModalProps = {
  open: boolean;
  onClose: () => void;
  giftId: string | null;
  onReserved: () => void;
};

// Define the expected return type from the RPC function
type ReserveGiftResponse = {
  success: boolean;
  error?: string;
  message?: string;
};

export function ReserveGiftModal({ open, onClose, giftId, onReserved }: ReserveGiftModalProps) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateName = (name: string): string | null => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      return "Nome é obrigatório";
    }
    if (trimmedName.length > 100) {
      return "Nome muito longo (máximo 100 caracteres)";
    }
    if (trimmedName.length < 2) {
      return "Nome deve ter pelo menos 2 caracteres";
    }
    // Check for potentially malicious content
    if (/<script|javascript:|data:/i.test(trimmedName)) {
      return "Nome contém caracteres não permitidos";
    }
    return null;
  };

  async function handleReserve() {
    setError(null);
    
    const validationError = validateName(name);
    if (validationError) {
      setError(validationError);
      return;
    }
    
    if (!giftId) {
      setError("ID do presente não encontrado");
      return;
    }
    
    setLoading(true);
    
    try {
      // Use the new secure reservation function
      const { data, error: rpcError } = await supabase.rpc('reserve_gift_item', {
        gift_id: giftId,
        reserver_name_param: name.trim()
      });

      if (rpcError) {
        console.error("Erro RPC ao reservar presente:", rpcError);
        setError("Erro interno. Tente novamente.");
        return;
      }

      // Type assertion to handle the Json type from Supabase
      const response = data as ReserveGiftResponse;

      if (!response.success) {
        setError(response.error || "Erro desconhecido ao reservar presente");
        return;
      }

      toast({ 
        title: "Presente reservado! 🎁", 
        description: response.message || "Obrigado por escolher presentear! O dono da lista será notificado." 
      });
      
      setName("");
      setError(null);
      onReserved();
      onClose();
      
    } catch (error) {
      console.error("Erro inesperado:", error);
      setError("Erro inesperado. Tente novamente em alguns instantes.");
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    if (!loading) {
      setName("");
      setError(null);
      onClose();
    }
  }

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newName = e.target.value;
    setName(newName);
    
    // Clear error when user starts typing
    if (error) {
      setError(null);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-purple-800">
            Reservar presente 🎁
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 pt-4">
          <p className="text-gray-600 text-sm">
            Informe seu nome completo para reservar este presente. O dono da lista será notificado da sua escolha.
          </p>
          <div className="space-y-2">
            <Input
              placeholder="Seu nome completo"
              value={name}
              onChange={handleNameChange}
              disabled={loading}
              autoFocus
              maxLength={100}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !loading && !error && name.trim()) {
                  handleReserve();
                }
              }}
              className={error ? "border-red-500" : ""}
            />
            {error && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <span>⚠️</span>
                {error}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={handleClose} 
              disabled={loading}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleReserve} 
              disabled={loading || !!error || !name.trim()} 
              className="flex-1"
            >
              {loading ? "Reservando..." : "Confirmar reserva"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
