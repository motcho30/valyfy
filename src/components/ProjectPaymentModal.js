import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePayment } from '../contexts/PaymentContext';

const ProjectPaymentModal = ({ isOpen, onClose, onPaymentInitiated, project }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const { initiatePayment } = usePayment();

  const handlePayment = async () => {
    try {
      setIsProcessing(true);
      setError(null);
      
      // Notify parent component that payment is being initiated
      if (onPaymentInitiated) {
        onPaymentInitiated();
      }
      
      await initiatePayment('project-creation');
      // The payment service will redirect to Stripe Checkout
      // so we don't need to do anything else here
      
    } catch (error) {
      console.error('Payment initiation failed:', error);
      setError(error.message || 'Failed to initiate payment. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-gray-100"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <div className="absolute top-4 right-4">
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center transition-colors group"
              disabled={isProcessing}
            >
              <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Header */}
          <div className="text-center pt-8 pb-6 px-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-vibe-cyan/20 to-blue-100 rounded-2xl mb-4">
              <svg className="w-8 h-8 text-vibe-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-2m-16 0h2m0 0h2m-2 0v-9m0 9h2M7 3h10M7 7h.01M7 11h.01m4-8h.01m0 4h.01m4-4h.01m0 4h.01" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Unlock Project Dashboard
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              Access your full project workspace with AI-powered development tools
            </p>
          </div>

          {/* Project Info */}
          {project && (
            <div className="px-6 mb-6">
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <div className="text-center">
                  <h3 className="font-medium text-gray-900">{project.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {project.features?.length || 0} features • {project.type}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Price Section */}
          <div className="px-6 mb-6">
            <div className="bg-gradient-to-r from-gray-50 to-vibe-cyan/10 rounded-2xl p-4 text-center border border-gray-100">
              <div className="flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-900">£5</span>
                <span className="text-sm text-gray-500 ml-2">one-time</span>
              </div>
              <div className="text-xs text-gray-400 mt-1">Lifetime access • No subscriptions</div>
            </div>
          </div>

          {/* Features */}
          <div className="px-6 mb-6">
            <div className="space-y-3">
              {[
                'Complete project dashboard access',
                'AI-powered file generation',
                'Visual PRD editor & analytics',
                'Prompt template system',
                'Design specification tools',
                'Project management features'
              ].map((feature, index) => (
                <div key={index} className="flex items-center text-sm text-gray-600">
                  <div className="w-1.5 h-1.5 bg-vibe-cyan rounded-full mr-3 flex-shrink-0"></div>
                  {feature}
                </div>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="px-6 mb-4">
              <div className="p-3 bg-red-50 border border-red-100 rounded-xl">
                <p className="text-sm text-red-600 text-center">{error}</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="p-6 pt-0">
            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full bg-vibe-cyan text-black px-6 py-3.5 rounded-xl font-semibold hover:bg-vibe-cyan/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {isProcessing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Redirecting to Stripe...
                </>
              ) : (
                'Upgrade to Pro - £5'
              )}
            </button>

            {/* Security Notice */}
            <div className="mt-3 text-center">
              <p className="text-xs text-gray-400">
                🔒 Secured by Stripe
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProjectPaymentModal; 