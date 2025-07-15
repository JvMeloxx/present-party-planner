/*
  # Complete database schema with security improvements

  1. New Tables
    - `gift_lists` - Stores gift lists with owner information
    - `gift_items` - Stores individual gifts within lists
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own lists
    - Add policies for public access to public lists
    - Add secure reservation function to prevent race conditions
  
  3. Constraints
    - Add validation constraints for data integrity
    - Prevent empty names and enforce length limits
</sql>

-- Create gift_lists table
CREATE TABLE IF NOT EXISTS public.gift_lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT true,
  event_date DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create gift_items table
CREATE TABLE IF NOT EXISTS public.gift_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  list_id UUID NOT NULL REFERENCES public.gift_lists(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  reserver_name TEXT,
  reserved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.gift_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gift_items ENABLE ROW LEVEL SECURITY;

-- Policies for gift_lists
CREATE POLICY "Users can view public gift lists" 
  ON public.gift_lists 
  FOR SELECT 
  USING (is_public = true);

CREATE POLICY "Users can view their own gift lists" 
  ON public.gift_lists 
  FOR SELECT 
  TO authenticated 
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can create their own gift lists" 
  ON public.gift_lists 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own gift lists" 
  ON public.gift_lists 
  FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own gift lists" 
  ON public.gift_lists 
  FOR DELETE 
  TO authenticated 
  USING (auth.uid() = owner_id);

-- Policies for gift_items
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

CREATE POLICY "Users can view gift items from their own lists" 
  ON public.gift_items 
  FOR SELECT 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM public.gift_lists 
      WHERE gift_lists.id = gift_items.list_id 
      AND gift_lists.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can create gift items in their own lists" 
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

CREATE POLICY "Users can update gift items in their own lists" 
  ON public.gift_items 
  FOR UPDATE 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM public.gift_lists 
      WHERE gift_lists.id = gift_items.list_id 
      AND gift_lists.owner_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.gift_lists 
      WHERE gift_lists.id = gift_items.list_id 
      AND gift_lists.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete gift items from their own lists" 
  ON public.gift_items 
  FOR DELETE 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM public.gift_lists 
      WHERE gift_lists.id = gift_items.list_id 
      AND gift_lists.owner_id = auth.uid()
    )
  );

-- Secure reservation policy - only allows reserving available items from public lists
CREATE POLICY "Anyone can reserve available gift items from public lists" 
  ON public.gift_items 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.gift_lists 
      WHERE gift_lists.id = gift_items.list_id 
      AND gift_lists.is_public = true
    )
    AND reserver_name IS NULL -- Only allow reserving if not already reserved
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.gift_lists 
      WHERE gift_lists.id = gift_items.list_id 
      AND gift_lists.is_public = true
    )
    AND reserver_name IS NOT NULL -- Ensure reservation info is provided
    AND reserved_at IS NOT NULL -- Ensure timestamp is set
  );

-- Add database constraints for better data validation
ALTER TABLE public.gift_items 
  ADD CONSTRAINT IF NOT EXISTS gift_name_not_empty CHECK (length(trim(name)) > 0),
  ADD CONSTRAINT IF NOT EXISTS gift_name_max_length CHECK (length(name) <= 200),
  ADD CONSTRAINT IF NOT EXISTS reserver_name_max_length CHECK (length(reserver_name) <= 100);

ALTER TABLE public.gift_lists
  ADD CONSTRAINT IF NOT EXISTS list_title_not_empty CHECK (length(trim(title)) > 0),
  ADD CONSTRAINT IF NOT EXISTS list_title_max_length CHECK (length(title) <= 200),
  ADD CONSTRAINT IF NOT EXISTS list_description_max_length CHECK (description IS NULL OR length(description) <= 1000),
  ADD CONSTRAINT IF NOT EXISTS event_date_not_too_far CHECK (event_date IS NULL OR event_date <= CURRENT_DATE + INTERVAL '10 years');

-- Create a function for atomic gift reservation to prevent race conditions
CREATE OR REPLACE FUNCTION public.reserve_gift_item(
  gift_id UUID,
  reserver_name_param TEXT
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSONB;
  gift_record RECORD;
BEGIN
  -- Validate input
  IF length(trim(reserver_name_param)) = 0 THEN
    RETURN jsonb_build_object('success', false, 'error', 'Nome é obrigatório');
  END IF;
  
  IF length(reserver_name_param) > 100 THEN
    RETURN jsonb_build_object('success', false, 'error', 'Nome muito longo');
  END IF;

  -- Lock the row for update to prevent race conditions
  SELECT * INTO gift_record 
  FROM public.gift_items 
  WHERE id = gift_id 
  FOR UPDATE;
  
  -- Check if gift exists
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Presente não encontrado');
  END IF;
  
  -- Check if already reserved
  IF gift_record.reserver_name IS NOT NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Presente já foi reservado');
  END IF;
  
  -- Check if list is public
  IF NOT EXISTS (
    SELECT 1 FROM public.gift_lists 
    WHERE id = gift_record.list_id AND is_public = true
  ) THEN
    RETURN jsonb_build_object('success', false, 'error', 'Lista não é pública');
  END IF;
  
  -- Perform the reservation
  UPDATE public.gift_items 
  SET 
    reserver_name = trim(reserver_name_param),
    reserved_at = NOW()
  WHERE id = gift_id;
  
  RETURN jsonb_build_object('success', true, 'message', 'Presente reservado com sucesso');
END;
$$;

-- Grant execute permission to authenticated and anonymous users
GRANT EXECUTE ON FUNCTION public.reserve_gift_item(UUID, TEXT) TO authenticated, anon;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_gift_lists_owner_id ON public.gift_lists(owner_id);
CREATE INDEX IF NOT EXISTS idx_gift_lists_is_public ON public.gift_lists(is_public);
CREATE INDEX IF NOT EXISTS idx_gift_items_list_id ON public.gift_items(list_id);
CREATE INDEX IF NOT EXISTS idx_gift_items_reserver_name ON public.gift_items(reserver_name);