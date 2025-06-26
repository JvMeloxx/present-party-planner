
import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Upload, X, Image } from "lucide-react";

interface ImageUploadProps {
  onImageUploaded: (url: string) => void;
  currentImageUrl?: string;
  onImageRemoved?: () => void;
  disabled?: boolean;
}

export function ImageUpload({ 
  onImageUploaded, 
  currentImageUrl, 
  onImageRemoved, 
  disabled = false 
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Arquivo inválido",
        description: "Por favor, selecione apenas arquivos de imagem.",
        variant: "destructive"
      });
      return;
    }

    // Validar tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Arquivo muito grande",
        description: "O arquivo deve ter no máximo 5MB.",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Erro de autenticação",
          description: "Você precisa estar logado para fazer upload de imagens.",
          variant: "destructive"
        });
        return;
      }

      // Gerar nome único para o arquivo
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('gift-images')
        .upload(fileName, file);

      if (error) {
        console.error('Upload error:', error);
        toast({
          title: "Erro no upload",
          description: "Não foi possível fazer upload da imagem. Tente novamente.",
          variant: "destructive"
        });
        return;
      }

      // Obter URL pública da imagem
      const { data: { publicUrl } } = supabase.storage
        .from('gift-images')
        .getPublicUrl(data.path);

      onImageUploaded(publicUrl);
      toast({
        title: "Imagem enviada!",
        description: "A imagem foi adicionada com sucesso."
      });

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro ao fazer upload da imagem.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeImage = async () => {
    if (!currentImageUrl || !onImageRemoved) return;

    try {
      // Extrair o caminho do arquivo da URL
      const url = new URL(currentImageUrl);
      const pathParts = url.pathname.split('/');
      const filePath = pathParts.slice(-2).join('/'); // user_id/filename

      const { error } = await supabase.storage
        .from('gift-images')
        .remove([filePath]);

      if (error) {
        console.error('Delete error:', error);
        toast({
          title: "Erro ao remover",
          description: "Não foi possível remover a imagem.",
          variant: "destructive"
        });
        return;
      }

      onImageRemoved();
      toast({
        title: "Imagem removida",
        description: "A imagem foi removida com sucesso."
      });

    } catch (error) {
      console.error('Delete error:', error);
      onImageRemoved(); // Remove da interface mesmo se der erro no storage
    }
  };

  return (
    <div className="space-y-3">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        className="hidden"
        disabled={disabled || uploading}
      />

      {currentImageUrl ? (
        <div className="relative">
          <img
            src={currentImageUrl}
            alt="Imagem do presente"
            className="w-full h-48 object-cover rounded-lg border"
          />
          {onImageRemoved && !disabled && (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={removeImage}
            >
              <X size={16} />
            </Button>
          )}
        </div>
      ) : (
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-purple-400 transition-colors"
          onClick={() => !disabled && !uploading && fileInputRef.current?.click()}
        >
          <div className="flex flex-col items-center gap-2">
            <Image className="text-gray-400" size={32} />
            <p className="text-sm text-gray-600">
              {uploading ? "Enviando imagem..." : "Clique para adicionar uma imagem"}
            </p>
            <p className="text-xs text-gray-500">PNG, JPG até 5MB</p>
          </div>
        </div>
      )}

      {!currentImageUrl && (
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || uploading}
          className="w-full"
        >
          <Upload size={16} />
          {uploading ? "Enviando..." : "Escolher imagem"}
        </Button>
      )}
    </div>
  );
}
