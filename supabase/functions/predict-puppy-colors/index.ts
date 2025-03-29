
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
}

interface ColorPredictionRequest {
  breed_name: string
  dam_color: string
  sire_color: string
}

interface PuppyColorPrediction {
  color: string
  probability: number
}

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get request body
    const { breed_name, dam_color, sire_color } = await req.json() as ColorPredictionRequest

    if (!breed_name || !dam_color || !sire_color) {
      return new Response(
        JSON.stringify({
          error: 'Missing required parameters',
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    console.log(`Predicting colors for ${breed_name}, dam: ${dam_color}, sire: ${sire_color}`)

    // For now, let's return some sample data
    // In a real implementation, we would query the color_inheritance_rules table
    // and perform the actual genetic calculations
    const mockPredictions: PuppyColorPrediction[] = [
      { color: dam_color, probability: 0.5 },
      { color: sire_color, probability: 0.3 },
      { color: 'Mixed', probability: 0.2 },
    ]

    return new Response(
      JSON.stringify(mockPredictions),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error(error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
