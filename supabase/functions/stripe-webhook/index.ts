import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('🔗 Webhook received, processing...')
    
    const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY')
    const STRIPE_WEBHOOK_SIGNING_SECRET = Deno.env.get('STRIPE_WEBHOOK_SIGNING_SECRET')
    
    if (!STRIPE_SECRET_KEY || !STRIPE_WEBHOOK_SIGNING_SECRET) {
      console.error('❌ Missing environment variables')
      throw new Error('Missing Stripe environment variables')
    }

    console.log('✅ Environment variables loaded')

    const stripe = (await import('https://esm.sh/stripe@14.21.0')).default(STRIPE_SECRET_KEY, {
      httpClient: (await import('https://esm.sh/stripe@14.21.0')).default.createFetchHttpClient(),
    })

    // Verify the webhook signature
    const body = await req.text()
    const signature = req.headers.get('stripe-signature')

    console.log('🔐 Verifying webhook signature...')
    
    if (!signature) {
      console.error('❌ No Stripe signature provided')
      return new Response('No signature provided', { status: 400 })
    }

    let event
    try {
      event = await stripe.webhooks.constructEventAsync(body, signature, STRIPE_WEBHOOK_SIGNING_SECRET)
      console.log('✅ Webhook signature verified, event type:', event.type)
    } catch (err) {
      console.error('❌ Webhook signature verification failed:', err.message)
      return new Response(`Webhook signature verification failed: ${err.message}`, { status: 400 })
    }

    // Initialize Supabase admin client (using service role key for admin operations)
    console.log('🔌 Connecting to Supabase...')
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        console.log('💳 Payment succeeded for session:', session.id)

        // Extract user information
        const userId = session.client_reference_id || session.metadata?.user_id
        const userEmail = session.customer_details?.email || session.metadata?.user_email

        console.log('👤 User details - ID:', userId, 'Email:', userEmail)

        if (!userId) {
          console.error('❌ No user ID found in session metadata')
          break
        }

        // Store the successful payment in the database
        console.log('💾 Storing payment record...')
        const { error: insertError } = await supabase
          .from('user_payments')
          .insert({
            user_id: userId,
            stripe_session_id: session.id,
            stripe_payment_intent_id: session.payment_intent,
            amount_paid: session.amount_total,
            currency: session.currency,
            payment_status: 'completed',
            customer_email: userEmail,
            paid_at: new Date().toISOString(),
            product_type: 'design_inspiration_access'
          })

        if (insertError) {
          console.error('❌ Error storing payment record:', insertError)
        } else {
          console.log('✅ Payment record stored successfully for user:', userId)
        }

        break
      }

      case 'checkout.session.async_payment_succeeded': {
        const session = event.data.object
        console.log('Async payment succeeded for session:', session.id)

        // Update payment status to completed for delayed payments
        const { error: updateError } = await supabase
          .from('user_payments')
          .update({ 
            payment_status: 'completed',
            paid_at: new Date().toISOString()
          })
          .eq('stripe_session_id', session.id)

        if (updateError) {
          console.error('Error updating payment status:', updateError)
        }

        break
      }

      case 'checkout.session.async_payment_failed': {
        const session = event.data.object
        console.log('Async payment failed for session:', session.id)

        // Update payment status to failed
        const { error: updateError } = await supabase
          .from('user_payments')
          .update({ 
            payment_status: 'failed',
            updated_at: new Date().toISOString()
          })
          .eq('stripe_session_id', session.id)

        if (updateError) {
          console.error('Error updating payment status:', updateError)
        }

        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    })

  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
}) 