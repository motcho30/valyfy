# Valyfy Landing Page

A modern, minimalistic landing page for Valyfy - your vibe coding productivity app with integrated Stripe payment processing for Design Inspiration access.

## 🎨 Design Features

- **Minimalistic aesthetic** inspired by Notion and iPad notes
- **Clean typography** with pixel/gaming fonts for the hero title  
- **Hand-drawn arrows** pointing to call-to-action buttons
- **Smooth animations** powered by Framer Motion
- **Color palette**: Black, White, and Cyan (#74EBF6)
- **Responsive design** built with Tailwind CSS

## 🛠 Tech Stack

- **React** - Frontend framework
- **Tailwind CSS** - Styling and layout
- **Framer Motion** - Animations and transitions
- **Lucide React** - Icon library
- **JetBrains Mono** - Gaming/pixel font for headings

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view the app

## 📱 Features

- **Hero Section** - Eye-catching title with gaming aesthetic
- **Tool Sections** - Interactive sections for Cursor AI and Lovable
- **PRD Generator** - Input fields for generating personalized PRDs
- **Smooth Animations** - Engaging micro-interactions
- **Hand-drawn Elements** - Casual, friendly design touches

## 🎯 Tools Featured

1. **Cursor AI** - IDE with AI-powered coding assistance
2. **Lovable** - AI-powered app building platform

## 📦 Build for Production

```bash
npm run build
```

This builds the app for production to the `build` folder.

## 💳 Stripe Payment Integration

The Design Inspiration feature includes integrated payment processing allowing users to pay £5 for unlimited access to copy design prompts.

### Features
- **Secure Payment Processing** via Stripe Checkout
- **One-time Payment** of £5 (GBP)
- **Webhook Integration** for reliable payment confirmation
- **User Payment Tracking** via Supabase database
- **Real-time Payment Status** updates

### Setup Instructions

**⚠️ Important**: Payment setup requires additional configuration. See [`STRIPE_SETUP.md`](./STRIPE_SETUP.md) for complete setup instructions.

### Quick Test

1. **Test Card Numbers** (use in development):
   - Success: `4242 4242 4242 4242`
   - Requires 3D Secure: `4000 0027 6000 3184` 
   - Declined: `4000 0000 0000 0002`

2. **Test Flow**:
   - Go to Design Inspiration page
   - Click "Copy Prompt" on any card
   - Complete authentication if needed
   - Click "Pay £5 to Copy" 
   - Use test card details above
   - Verify payment success and prompt copying works

### Files Added
- `supabase/functions/create-checkout-session/` - Payment session creation
- `supabase/functions/stripe-webhook/` - Webhook handling
- `src/services/paymentService.js` - Payment service layer
- `src/contexts/PaymentContext.js` - Payment state management
- `src/components/PaymentModal.js` - Payment UI component
- `supabase-payments-schema.sql` - Database schema
- `STRIPE_SETUP.md` - Complete setup documentation

## 🎨 Customization

- Colors can be modified in `tailwind.config.js`
- Components are located in `src/components/`
- Animations can be adjusted in individual component files

## 🚀 Production Deployment

### **Switch to Live Stripe Mode:**

1. **Get Live Stripe Keys** (https://dashboard.stripe.com/):
   - Toggle to "Live mode" (top right)
   - Copy **Publishable key**: `pk_live_...`
   - Copy **Secret key**: `sk_live_...`

2. **Create Live Webhook Endpoint**:
   - Go to Webhooks in Live mode
   - Add endpoint: `https://kjwwfmmciwsamjjfcwio.supabase.co/functions/v1/stripe-webhook`
   - Select events: `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed`
   - Copy **Webhook signing secret**: `whsec_...`

3. **Update Environment Variables**:
   ```bash
   # Frontend (.env)
   REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_your_actual_key
   
   # Supabase Edge Functions (Dashboard > Functions > Settings)
   STRIPE_SECRET_KEY=sk_live_your_actual_key
   STRIPE_WEBHOOK_SIGNING_SECRET=whsec_your_actual_webhook_secret
   ```

4. **Test with Small Amount**: Make a £1 test payment first!

### **Deploy Commands:**
```bash
# Deploy updated Edge Functions
supabase functions deploy create-checkout-session --no-verify-jwt
supabase functions deploy stripe-webhook --no-verify-jwt

# Deploy frontend to your hosting platform
npm run build
```

---

Built with ❤️ for the vibe coding community 