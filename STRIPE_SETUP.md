# Stripe Payment Integration Setup

This document explains how to set up Stripe payment processing for the Design Inspiration feature.

## Overview

The payment integration allows users to pay £5 to unlock copying of all design inspiration prompts. The system uses:

- **Stripe Checkout Sessions** for secure payment processing
- **Supabase Edge Functions** for backend payment handling
- **Webhooks** for reliable payment confirmation
- **React Context** for payment state management

## Prerequisites

1. **Stripe Account**: Create a [Stripe account](https://stripe.com) if you don't have one
2. **Supabase Project**: Ensure your Supabase project is set up
3. **Node.js & npm**: Required for local development

## Step 1: Stripe Dashboard Configuration

### 1.1 Get API Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Developers > API keys**
3. Copy your **Publishable key** (starts with `pk_test_`)
4. Copy your **Secret key** (starts with `sk_test_`)

### 1.2 Configure Webhooks

1. Go to **Developers > Webhooks**
2. Click **Add endpoint**
3. Set the endpoint URL to: `https://your-project-ref.supabase.co/functions/v1/stripe-webhook`
4. Select these events:
   - `checkout.session.completed`
   - `checkout.session.async_payment_succeeded`
   - `checkout.session.async_payment_failed`
5. Copy the **Webhook signing secret** (starts with `whsec_`)

## Step 2: Database Setup

### 2.1 Run Database Schema

Execute the SQL in `supabase-payments-schema.sql` in your Supabase SQL editor:

```sql
-- Run the entire contents of supabase-payments-schema.sql
```

This creates:
- `user_payments` table to track payments
- Proper indexes for performance
- Row Level Security (RLS) policies
- A view for easy payment status queries

## Step 3: Environment Variables

### 3.1 Frontend Environment Variables

Create a `.env` file in the project root:

```bash
# Copy from .env.example and fill in your values
cp .env.example .env
```

Fill in these values:
```env
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### 3.2 Supabase Edge Functions Environment Variables

In your Supabase project dashboard:

1. Go to **Edge Functions**
2. Click **Settings**
3. Add these secrets:

```bash
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SIGNING_SECRET=whsec_...
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
FRONTEND_URL=http://localhost:3000
```

## Step 4: Deploy Supabase Functions

### 4.1 Install Supabase CLI

```bash
npm install -g supabase-cli
```

### 4.2 Login to Supabase

```bash
supabase login
```

### 4.3 Link Your Project

```bash
supabase link --project-ref your-project-ref
```

### 4.4 Deploy Functions

```bash
supabase functions deploy create-checkout-session
supabase functions deploy stripe-webhook
```

## Step 5: Test the Integration

### 5.1 Local Testing

1. Start your React app:
```bash
npm start
```

2. Navigate to the Design Inspiration page
3. Click "Copy Prompt" on any card
4. If not authenticated, sign up first
5. After authentication, you should see the payment modal

### 5.2 Test Payment Flow

Use Stripe's test card numbers:

- **Successful payment**: `4242 4242 4242 4242`
- **Requires authentication**: `4000 0027 6000 3184`
- **Declined card**: `4000 0000 0000 0002`

For all test cards:
- Use any future expiry date
- Use any 3-digit CVC
- Use any billing postal code

### 5.3 Verify Payment Processing

1. Complete a test payment
2. Check your Stripe Dashboard for the payment
3. Check your Supabase `user_payments` table for the record
4. Verify that you can now copy all prompts

## Step 6: Production Deployment

### 6.1 Production Stripe Keys

1. Activate your Stripe account
2. Get your live API keys from the Stripe Dashboard
3. Update your production environment variables

### 6.2 Production URLs

Update these URLs in your production environment:
- `FRONTEND_URL` in Supabase Edge Functions
- Webhook endpoint URL in Stripe Dashboard
- Success/cancel URLs in the code (if needed)

## Testing Commands

### Test Local Payment Flow
```bash
# Start the development server
npm start

# Test the payment flow by:
# 1. Going to Design Inspiration page
# 2. Clicking "Copy Prompt" 
# 3. Completing authentication
# 4. Proceeding with payment
```

### Test Webhook Locally (Optional)

If you want to test webhooks locally:

```bash
# Install Stripe CLI
# Follow instructions at https://stripe.com/docs/stripe-cli

# Forward webhooks to local functions
stripe listen --forward-to http://localhost:54321/functions/v1/stripe-webhook
```

## Troubleshooting

### Common Issues

1. **"Missing Stripe environment variables"**
   - Check that all Stripe keys are set in Supabase Edge Functions settings
   - Verify the key format (pk_test_, sk_test_, whsec_)

2. **"User not authenticated"**
   - Ensure the user is logged in before attempting payment
   - Check that the auth context is properly set up

3. **"Payment not recorded"**
   - Verify webhook endpoint is correctly configured
   - Check webhook signing secret matches
   - Look at Edge Function logs in Supabase

4. **"CORS errors"**
   - Ensure all allowed origins are configured
   - Check that your domain is whitelisted

### Debug Steps

1. **Check Supabase Edge Function logs**:
   ```bash
   supabase functions logs
   ```

2. **Check Stripe Dashboard**:
   - Go to **Developers > Logs** to see API requests
   - Check **Developers > Webhooks** for webhook delivery status

3. **Check browser console** for any JavaScript errors

4. **Check Network tab** in browser dev tools for failed requests

## Security Notes

- Never commit actual API keys to version control
- Use test keys for development
- Enable webhook signature verification (already implemented)
- Implement proper error handling
- Use HTTPS in production
- Validate all inputs on the server side

## Currency and Pricing

- **Amount**: £5.00 (500 pence)
- **Currency**: GBP (British Pounds)
- **Payment Type**: One-time payment
- **Product**: Design Inspiration Access

To change the price, modify the `unit_amount` in `supabase/functions/create-checkout-session/index.ts`:
```typescript
unit_amount: 500, // £5.00 in pence
```

## Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review Stripe documentation: https://stripe.com/docs
3. Check Supabase documentation: https://supabase.com/docs
4. Review the code comments for additional context

## Files Modified/Created

- `supabase/functions/create-checkout-session/index.ts` - Payment session creation
- `supabase/functions/stripe-webhook/index.ts` - Webhook handler
- `src/services/paymentService.js` - Payment service layer
- `src/contexts/PaymentContext.js` - Payment state management
- `src/components/PaymentModal.js` - Payment UI component
- `src/components/DesignInspiration.js` - Updated with payment integration
- `supabase-payments-schema.sql` - Database schema
- `STRIPE_SETUP.md` - This documentation file 