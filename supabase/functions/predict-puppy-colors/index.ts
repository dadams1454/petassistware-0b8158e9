
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import { corsHeaders } from '../_shared/cors.ts'
import { serve } from "https://deno.land/std@0.177.0/http/server.ts"

const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || ''

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create a Supabase client
    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    
    // Parse the request body
    const { breed_name, dam_color, sire_color } = await req.json()
    
    if (!breed_name || !dam_color || !sire_color) {
      return new Response(
        JSON.stringify({ error: 'Breed, dam color, and sire color are required' }), 
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      )
    }

    // Get breed-specific genetic rules from the database
    const { data: breed_colors, error: colorsError } = await supabase
      .from('breed_colors')
      .select('*')
      .eq('breed', breed_name)
    
    if (colorsError) {
      console.error('Error fetching breed colors:', colorsError)
      return new Response(
        JSON.stringify({ error: 'Error fetching breed colors' }), 
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      )
    }

    // For this MVP, we'll return a basic prediction algorithm
    // based on the colors we have in the database
    // We'll simulate color inheritance with simplified probabilities
    let predictions = []
    
    // If we have breed colors data, calculate predictions
    if (breed_colors && breed_colors.length > 0) {
      // Find the dam and sire color entries
      const damColorEntry = breed_colors.find(c => c.color_name.toLowerCase() === dam_color.toLowerCase())
      const sireColorEntry = breed_colors.find(c => c.color_name.toLowerCase() === sire_color.toLowerCase())
      
      // Simple prediction algorithm:
      // 1. Dam color has 40% chance
      // 2. Sire color has 40% chance
      // 3. Other colors divide remaining 20%
      
      // Add dam's color with high probability
      if (damColorEntry) {
        predictions.push({
          color_name: damColorEntry.color_name,
          probability: 0.4,
          is_akc_recognized: damColorEntry.is_akc_recognized
        })
      }
      
      // Add sire's color with high probability
      if (sireColorEntry && sireColorEntry.color_name !== (damColorEntry?.color_name)) {
        predictions.push({
          color_name: sireColorEntry.color_name,
          probability: 0.4,
          is_akc_recognized: sireColorEntry.is_akc_recognized
        })
      } else if (sireColorEntry && sireColorEntry.color_name === damColorEntry?.color_name) {
        // If both parents are the same color, increase the probability
        predictions[0].probability = 0.7
      }
      
      // Get other potential colors
      const otherColors = breed_colors.filter(c => 
        c.color_name !== damColorEntry?.color_name && 
        c.color_name !== sireColorEntry?.color_name
      )
      
      // Calculate remaining probability
      const usedProbability = predictions.reduce((sum, p) => sum + p.probability, 0)
      const remainingProbability = 1 - usedProbability
      
      // Distribute remaining probability among other colors
      if (otherColors.length > 0 && remainingProbability > 0) {
        const probabilityPerColor = remainingProbability / otherColors.length
        
        otherColors.forEach(color => {
          predictions.push({
            color_name: color.color_name,
            probability: probabilityPerColor,
            is_akc_recognized: color.is_akc_recognized
          })
        })
      }
      
      // Sort by probability (highest first)
      predictions.sort((a, b) => b.probability - a.probability)
    }
    
    // Return the predicted colors
    return new Response(
      JSON.stringify(predictions),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
    
  } catch (error) {
    console.error('Error processing request:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
