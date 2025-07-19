-- Create user_payments table to track design inspiration access payments
CREATE TABLE IF NOT EXISTS user_payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_session_id VARCHAR(255) UNIQUE NOT NULL,
  stripe_payment_intent_id VARCHAR(255),
  amount_paid INTEGER NOT NULL, -- Amount in pence/cents
  currency VARCHAR(3) NOT NULL DEFAULT 'gbp',
  payment_status VARCHAR(50) NOT NULL DEFAULT 'pending',
  customer_email VARCHAR(255),
  product_type VARCHAR(100) NOT NULL DEFAULT 'design_inspiration_access',
  metadata JSONB DEFAULT '{}',
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_user_payments_user_id ON user_payments(user_id);
CREATE INDEX IF NOT EXISTS idx_user_payments_status ON user_payments(payment_status);
CREATE INDEX IF NOT EXISTS idx_user_payments_product_type ON user_payments(product_type);
CREATE INDEX IF NOT EXISTS idx_user_payments_stripe_session ON user_payments(stripe_session_id);

-- Enable Row Level Security
ALTER TABLE user_payments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only read their own payment records
CREATE POLICY "Users can view own payments" ON user_payments
  FOR SELECT USING (auth.uid() = user_id);

-- Service role can do everything (for webhooks)
CREATE POLICY "Service role full access" ON user_payments
  FOR ALL USING (auth.role() = 'service_role');

-- Create a trigger to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_payments_updated_at
    BEFORE UPDATE ON user_payments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create a view for easier payment status queries
CREATE OR REPLACE VIEW user_payment_status AS
SELECT 
  user_id,
  MAX(paid_at) as last_payment_date,
  COUNT(CASE WHEN payment_status = 'completed' THEN 1 END) as completed_payments,
  SUM(CASE WHEN payment_status = 'completed' THEN amount_paid ELSE 0 END) as total_paid,
  BOOL_OR(payment_status = 'completed' AND product_type = 'design_inspiration_access') as has_design_access
FROM user_payments
WHERE product_type = 'design_inspiration_access'
GROUP BY user_id;

-- Grant necessary permissions
GRANT SELECT ON user_payment_status TO authenticated;
GRANT SELECT ON user_payments TO authenticated; 