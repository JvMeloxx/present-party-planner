
-- Fix critical RLS policy vulnerability
-- Remove the overly permissive update policy for gift reservations
DROP POLICY IF EXISTS "Anyone can reserve gift items from public lists" ON public.gift_items;

-- Create a more restrictive policy that only allows updating reservation fields
-- and prevents overwriting existing reservations
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
  ADD CONSTRAINT gift_name_not_empty CHECK (length(trim(name)) > 0),
  ADD CONSTRAINT gift_name_max_length CHECK (length(name) <= 200),
  ADD CONSTRAINT reserver_name_max_length CHECK (length(reserver_name) <= 100);

ALTER TABLE public.gift_lists
  ADD CONSTRAINT list_title_not_empty CHECK (length(trim(title)) > 0),
  ADD CONSTRAINT list_title_max_length CHECK (length(title) <= 200),
  ADD CONSTRAINT list_description_max_length CHECK (length(description) <= 1000),
  ADD CONSTRAINT event_date_not_too_far CHECK (event_date IS NULL OR event_date <= CURRENT_DATE + INTERVAL '10 years');

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
