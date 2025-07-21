import { supabase } from './supabase';

class PaymentService {
  /**
   * Creates a Stripe checkout session for design inspiration access
   * @param {string} origin - The origin URL for redirect URLs
   * @param {string} context - The context for the payment (e.g., 'project-creation' or 'design-inspiration')
   * @returns {Promise<{sessionId: string, url: string}>}
   */
  async createCheckoutSession(origin = window.location.origin, context = 'design-inspiration') {
    try {
      // Get current session to ensure user is authenticated
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        throw new Error('User must be authenticated to proceed with payment');
      }

      // Call the Supabase Edge Function to create checkout session
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: { origin, context }
      });

      if (error) {
        console.error('Error creating checkout session:', error);
        throw new Error(error.message || 'Failed to create checkout session');
      }

      return data;
    } catch (error) {
      console.error('Payment service error:', error);
      throw error;
    }
  }

  /**
   * Checks if the current user has paid for design inspiration access
   * @returns {Promise<boolean>}
   */
  async hasUserPaid() {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        console.log('🔍 No authenticated user found');
        return false;
      }

      console.log('🔍 Checking payment status for user:', user.id);

      // Check if user has any successful payments
      const { data: payments, error } = await supabase
        .from('user_payments')
        .select('payment_status, paid_at, stripe_session_id')
        .eq('user_id', user.id)
        .eq('payment_status', 'completed')
        .eq('product_type', 'design_inspiration_access')
        .order('paid_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('❌ Error checking payment status:', error);
        return false;
      }

      console.log('💳 Payment query result:', payments);
      const hasPaid = payments && payments.length > 0;
      console.log(`✅ User has${hasPaid ? '' : ' NOT'} paid for access`);
      
      return hasPaid;
    } catch (error) {
      console.error('❌ Error checking payment status:', error);
      return false;
    }
  }

  /**
   * Gets the payment status for the current user
   * @returns {Promise<{hasPaid: boolean, lastPayment: Object|null}>}
   */
  async getPaymentStatus() {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        return { hasPaid: false, lastPayment: null };
      }

      // Get the most recent payment
      const { data: payments, error } = await supabase
        .from('user_payments')
        .select('*')
        .eq('user_id', user.id)
        .eq('product_type', 'design_inspiration_access')
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error fetching payment status:', error);
        return { hasPaid: false, lastPayment: null };
      }

      const lastPayment = payments && payments.length > 0 ? payments[0] : null;
      const hasPaid = lastPayment && lastPayment.payment_status === 'completed';

      return { hasPaid, lastPayment };
    } catch (error) {
      console.error('Error fetching payment status:', error);
      return { hasPaid: false, lastPayment: null };
    }
  }

  /**
   * Verifies a checkout session and updates local state
   * @param {string} sessionId - The Stripe checkout session ID
   * @returns {Promise<boolean>} - True if payment was successful
   */
  async verifyCheckoutSession(sessionId) {
    try {
      // The webhook should have already updated the database,
      // but we'll check the payment status to be sure
      return await this.hasUserPaid();
    } catch (error) {
      console.error('Error verifying checkout session:', error);
      return false;
    }
  }

  /**
   * Store payment attempt in local storage for UI state management
   * This is used to show loading states and handle redirects
   */
  storePaymentAttempt(sessionId) {
    const paymentData = {
      sessionId,
      timestamp: new Date().toISOString(),
      status: 'pending'
    };
    localStorage.setItem('designInspiration_payment', JSON.stringify(paymentData));
  }

  /**
   * Get stored payment attempt from local storage
   */
  getStoredPaymentAttempt() {
    try {
      const stored = localStorage.getItem('designInspiration_payment');
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Error reading stored payment attempt:', error);
      return null;
    }
  }

  /**
   * Clear stored payment attempt
   */
  clearStoredPaymentAttempt() {
    localStorage.removeItem('designInspiration_payment');
  }

  /**
   * Update stored payment attempt status
   */
  updateStoredPaymentStatus(status) {
    const stored = this.getStoredPaymentAttempt();
    if (stored) {
      stored.status = status;
      stored.updatedAt = new Date().toISOString();
      localStorage.setItem('designInspiration_payment', JSON.stringify(stored));
    }
  }
}

// Export singleton instance
export const paymentService = new PaymentService();
export default paymentService; 