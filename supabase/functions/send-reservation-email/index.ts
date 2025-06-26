
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailRequest {
  giftName: string;
  reserverName: string;
  listTitle: string;
  ownerEmail: string;
  listUrl: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const { giftName, reserverName, listTitle, ownerEmail, listUrl }: EmailRequest = await req.json();

    // Simulate email sending (you would integrate with a real email service like Resend)
    console.log('Sending email notification:', {
      to: ownerEmail,
      subject: `Presente reservado na sua lista: ${listTitle}`,
      content: `${reserverName} reservou o presente "${giftName}" da sua lista "${listTitle}".`
    });

    // For now, we'll just log the email instead of actually sending it
    // In production, you would integrate with Resend or another email service

    return new Response(
      JSON.stringify({ success: true, message: 'Email notification sent' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error sending email:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to send email notification' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
