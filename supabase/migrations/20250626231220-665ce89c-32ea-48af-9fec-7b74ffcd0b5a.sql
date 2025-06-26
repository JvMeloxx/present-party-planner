
-- Criar bucket para imagens de presentes
INSERT INTO storage.buckets (id, name, public)
VALUES ('gift-images', 'gift-images', true);

-- Política para permitir que qualquer usuário autenticado faça upload
CREATE POLICY "Authenticated users can upload gift images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'gift-images' AND
  auth.role() = 'authenticated'
);

-- Política para permitir visualização pública das imagens
CREATE POLICY "Public can view gift images" ON storage.objects
FOR SELECT USING (bucket_id = 'gift-images');

-- Política para permitir que usuários deletem suas próprias imagens
CREATE POLICY "Users can delete their own gift images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'gift-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Adicionar coluna image_url na tabela gift_items
ALTER TABLE public.gift_items 
ADD COLUMN image_url TEXT;
