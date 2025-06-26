
-- Habilitar RLS nas tabelas
ALTER TABLE public.gift_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gift_items ENABLE ROW LEVEL SECURITY;

-- Políticas para gift_lists
-- Permitir que todos vejam listas públicas
CREATE POLICY "Anyone can view public gift lists" 
  ON public.gift_lists 
  FOR SELECT 
  USING (is_public = true);

-- Permitir que donos vejam suas próprias listas (públicas ou privadas)
CREATE POLICY "Users can view their own gift lists" 
  ON public.gift_lists 
  FOR SELECT 
  USING (auth.uid() = owner_id);

-- Permitir que usuários autenticados criem listas
CREATE POLICY "Authenticated users can create gift lists" 
  ON public.gift_lists 
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = owner_id);

-- Permitir que donos atualizem suas listas
CREATE POLICY "Users can update their own gift lists" 
  ON public.gift_lists 
  FOR UPDATE 
  USING (auth.uid() = owner_id);

-- Permitir que donos excluam suas listas
CREATE POLICY "Users can delete their own gift lists" 
  ON public.gift_lists 
  FOR DELETE 
  USING (auth.uid() = owner_id);

-- Políticas para gift_items
-- Permitir que todos vejam itens de listas públicas
CREATE POLICY "Anyone can view gift items from public lists" 
  ON public.gift_items 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.gift_lists 
      WHERE gift_lists.id = gift_items.list_id 
      AND gift_lists.is_public = true
    )
  );

-- Permitir que donos vejam itens de suas listas
CREATE POLICY "Users can view their own gift items" 
  ON public.gift_items 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.gift_lists 
      WHERE gift_lists.id = gift_items.list_id 
      AND gift_lists.owner_id = auth.uid()
    )
  );

-- Permitir que donos adicionem itens às suas listas
CREATE POLICY "Users can add items to their own gift lists" 
  ON public.gift_items 
  FOR INSERT 
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.gift_lists 
      WHERE gift_lists.id = gift_items.list_id 
      AND gift_lists.owner_id = auth.uid()
    )
  );

-- Permitir que donos atualizem itens de suas listas
CREATE POLICY "Users can update their own gift items" 
  ON public.gift_items 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.gift_lists 
      WHERE gift_lists.id = gift_items.list_id 
      AND gift_lists.owner_id = auth.uid()
    )
  );

-- Permitir que visitantes reservem presentes (atualizar campos de reserva)
CREATE POLICY "Anyone can reserve gift items from public lists" 
  ON public.gift_items 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.gift_lists 
      WHERE gift_lists.id = gift_items.list_id 
      AND gift_lists.is_public = true
    )
  );

-- Permitir que donos excluam itens de suas listas
CREATE POLICY "Users can delete their own gift items" 
  ON public.gift_items 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.gift_lists 
      WHERE gift_lists.id = gift_items.list_id 
      AND gift_lists.owner_id = auth.uid()
    )
  );
