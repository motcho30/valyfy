import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import paymentService from '../services/paymentService';

const PaymentContext = createContext();

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
};

export const PaymentProvider = ({ children }) => {
  const [hasAccess, setHasAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  // Check payment status when user authentication changes
  useEffect(() => {
    let mounted = true;

    const checkPaymentStatus = async () => {
      if (!isAuthenticated || !user) {
        setHasAccess(false);
        setPaymentStatus(null);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const status = await paymentService.getPaymentStatus();
        
        if (mounted) {
          setHasAccess(status.hasPaid);
          setPaymentStatus(status);
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
        if (mounted) {
          setHasAccess(false);
          setPaymentStatus(null);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    checkPaymentStatus();

    return () => {
      mounted = false;
    };
  }, [isAuthenticated, user]);

  // Check for successful payment redirects
  useEffect(() => {
    // Check both URL search params and hash for payment parameters
    const urlParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.split('?')[1] || '');
    
    const paymentResult = urlParams.get('payment') || hashParams.get('payment');
    const sessionId = urlParams.get('session_id') || hashParams.get('session_id');
    const redirectTo = urlParams.get('redirect') || 'design-inspiration'; // Default to design-inspiration

    if (paymentResult && sessionId) {
      handlePaymentRedirect(paymentResult, sessionId, redirectTo);
    }
  }, []);

  const handlePaymentRedirect = async (paymentResult, sessionId, redirectTo) => {
    console.log('🔄 Handling payment redirect:', { paymentResult, sessionId, redirectTo });
    
    if (paymentResult === 'success') {
      // Payment was successful, refresh the payment status with retry logic
      try {
        console.log('✅ Payment successful! Starting verification...');
        // Wait a bit for webhook to process
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        let attempts = 0;
        let isVerified = false;
        
        // Retry verification up to 5 times (10 seconds total)
        while (attempts < 5 && !isVerified) {
          console.log(`🔍 Verification attempt ${attempts + 1}/5`);
          isVerified = await paymentService.verifyCheckoutSession(sessionId);
          if (!isVerified) {
            console.log(`⏳ Attempt ${attempts + 1} failed, waiting 2 seconds...`);
            await new Promise(resolve => setTimeout(resolve, 2000));
            attempts++;
          }
        }
        
        if (isVerified) {
          setHasAccess(true);
          paymentService.updateStoredPaymentStatus('completed');
          
          // Refresh payment status from backend
          const status = await paymentService.getPaymentStatus();
          setPaymentStatus(status);
          
          console.log('✅ Payment verified! Access granted.');
        } else {
          console.warn('⚠️ Payment verification failed after retries');
        }
      } catch (error) {
        console.error('Error verifying payment:', error);
      }
    } else if (paymentResult === 'cancelled') {
      // Payment was cancelled
      paymentService.updateStoredPaymentStatus('cancelled');
    }

    // Navigate to the specified page if provided
    if (redirectTo) {
      // Navigate immediately, don't wait
      navigate(redirectTo);
    }

    // Clean up URL parameters from both search and hash
    const url = new URL(window.location);
    url.searchParams.delete('payment');
    url.searchParams.delete('session_id');
    url.searchParams.delete('redirect');
    
    // Also clean hash parameters
    if (url.hash.includes('?')) {
      const hashPart = url.hash.split('?')[0];
      url.hash = hashPart;
    }
    
    window.history.replaceState({}, document.title, url.toString());
  };

  const initiatePayment = async (context = 'design-inspiration') => {
    try {
      if (!isAuthenticated) {
        throw new Error('User must be authenticated to make a payment');
      }

      const { sessionId, url } = await paymentService.createCheckoutSession(window.location.origin, context);
      
      // Store payment attempt for state management
      paymentService.storePaymentAttempt(sessionId);
      
      // Redirect to Stripe Checkout
      window.location.href = url;
      
      return { success: true, sessionId };
    } catch (error) {
      console.error('Error initiating payment:', error);
      throw error;
    }
  };

  const refreshPaymentStatus = async () => {
    if (!isAuthenticated) return;

    try {
      setIsLoading(true);
      const status = await paymentService.getPaymentStatus();
      setHasAccess(status.hasPaid);
      setPaymentStatus(status);
    } catch (error) {
      console.error('Error refreshing payment status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    hasAccess,
    isLoading,
    paymentStatus,
    initiatePayment,
    refreshPaymentStatus,
    isPaymentRequired: isAuthenticated && !hasAccess, // User is logged in but hasn't paid
    // Debug function to manually check payment status
    debugCheckPayment: async () => {
      console.log('🐛 Manual payment status check triggered');
      const hasPaid = await paymentService.hasUserPaid();
      setHasAccess(hasPaid);
      console.log('🐛 Manual check result:', hasPaid);
      return hasPaid;
    }
  };

  return (
    <PaymentContext.Provider value={value}>
      {children}
    </PaymentContext.Provider>
  );
};

export default PaymentContext; 