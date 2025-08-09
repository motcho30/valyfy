import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  console.log('🚀 Function started')
  console.log('📋 Environment check:')
  console.log('- STRIPE_SECRET_KEY exists:', !!Deno.env.get('STRIPE_SECRET_KEY'))
  console.log('- STRIPE_WEBHOOK_SIGNING_SECRET exists:', !!Deno.env.get('STRIPE_WEBHOOK_SIGNING_SECRET'))
  console.log('- SUPABASE_SERVICE_ROLE_KEY exists:', !!Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'))
  console.log('- SUPABASE_URL exists:', !!Deno.env.get('SUPABASE_URL'))

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('✅ Handling CORS preflight request')
    return new Response('ok', { headers: corsHeaders })
  }

  console.log('🔄 Processing POST request...')

  try {
    console.log('🔧 Step 1: Initializing Stripe...')
    // Initialize Stripe
    const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY')
    
    console.log('🔑 Stripe key starts with:', STRIPE_SECRET_KEY?.substring(0, 8))
    console.log('🔑 Key type:', STRIPE_SECRET_KEY?.startsWith('sk_live_') ? 'LIVE' : STRIPE_SECRET_KEY?.startsWith('sk_test_') ? 'TEST' : 'UNKNOWN')
    
    if (!STRIPE_SECRET_KEY) {
      console.error('❌ Missing STRIPE_SECRET_KEY environment variable')
      throw new Error('Missing STRIPE_SECRET_KEY environment variable')
    }

    console.log('🔧 Step 2: Creating Stripe instance...')
    const stripe = (await import('https://esm.sh/stripe@14.21.0')).default(STRIPE_SECRET_KEY, {
      httpClient: (await import('https://esm.sh/stripe@14.21.0')).default.createFetchHttpClient(),
    })
    console.log('✅ Stripe instance created successfully')

    console.log('🔧 Step 3: Checking authorization...')
    // Get the authorization token and verify the user
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      console.error('❌ Missing authorization header')
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    console.log('✅ Authorization header found')

    console.log('🔧 Step 4: Initializing Supabase client...')
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )
    console.log('✅ Supabase client initialized')

    console.log('🔧 Step 5: Getting user...')
    // Get the current user
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    if (userError || !user) {
      console.error('❌ Authentication failed:', userError)
      return new Response(
        JSON.stringify({ error: 'Authentication failed' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    console.log('✅ User authenticated:', user.id)

    console.log('🔧 Step 6: Parsing request body...')
    // Parse the request body
    let requestBody
    try {
      const bodyText = await req.text()
      console.log('📝 Request body text:', bodyText)
      requestBody = JSON.parse(bodyText)
      console.log('📋 Parsed request body:', requestBody)
    } catch (parseError) {
      console.error('❌ Failed to parse request body:', parseError)
      return new Response(
        JSON.stringify({ error: 'Invalid request body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('🔧 Step 7: Creating Stripe Checkout Session...')
    // Create Stripe Checkout Session
    try {
      console.log('💳 Creating checkout session with params:')
      console.log('- Amount: 500 (£5.00)')
      console.log('- Currency: gbp') 
      console.log('- User ID:', user.id)
      console.log('- User email:', user.email)
      console.log('- Context:', requestBody.context || 'design-inspiration')
      
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'gbp',
              product_data: {
                name: 'Design Inspiration Access',
                description: 'Unlock all design prompts and copy functionality',
              },
              unit_amount: 500, // £5.00
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        client_reference_id: user.id,
        customer_email: user.email,
        success_url: (() => {
          const origin = req.headers.get('origin');
          if (requestBody.context === 'project-creation') {
            return `${origin}/create-project?payment=success&session_id={CHECKOUT_SESSION_ID}`
          }
          if (requestBody.context === 'gpt5-prd-generator') {
            return `${origin}/?payment=success&session_id={CHECKOUT_SESSION_ID}&redirect=/#gpt5-prd`;
          }
          return `${origin}/?payment=success&session_id={CHECKOUT_SESSION_ID}#design-inspiration`;
        })(),
        cancel_url: (() => {
          const origin = req.headers.get('origin');
          if (requestBody.context === 'project-creation') {
            return `${origin}/create-project?payment=cancelled`;
          }
          if (requestBody.context === 'gpt5-prd-generator') {
            return `${origin}/?payment=cancelled&redirect=/#gpt5-prd`;
          }
          return `${origin}/?payment=cancelled#design-inspiration`;
        })(),
        metadata: {
          user_id: user.id,
          user_email: user.email || '',
          product_type: 'design_inspiration_access'
        }
      })

      console.log('✅ Checkout session created successfully:', session.id)
      
      return new Response(
        JSON.stringify({ 
          sessionId: session.id,
          url: session.url 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    } catch (stripeError) {
      console.error('❌ Stripe API Error:', stripeError)
      console.error('❌ Stripe Error Type:', stripeError.type)
      console.error('❌ Stripe Error Code:', stripeError.code)
      console.error('❌ Stripe Error Message:', stripeError.message)
      console.error('❌ Stripe Error Details:', JSON.stringify(stripeError, null, 2))
      
      throw stripeError
    }

  } catch (error) {
    console.error('❌ Error creating checkout session:', error)
    console.error('❌ Error details:', {
      message: error.message,
      type: error.type,
      code: error.code,
      statusCode: error.statusCode,
      stack: error.stack
    })
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        type: error.type,
        code: error.code
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: error.statusCode || 500,
      }
    )
  }
}) 