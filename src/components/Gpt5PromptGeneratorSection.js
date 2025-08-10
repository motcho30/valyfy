import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generatePRDForGPT5 } from '../services/prdGeneratorService';
import { useAuth } from '../contexts/AuthContext';
import Auth from './Auth';
import { usePayment } from '../contexts/PaymentContext';
import PaymentModal from './PaymentModal';

const Gpt5PromptGeneratorSection = () => {
  const [idea, setIdea] = useState('');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();
  const { hasAccess, isPaymentRequired, initiatePayment } = usePayment();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  
  // Restore buffer after payment redirect
  useEffect(() => {
    try {
      const stored = localStorage.getItem('gpt5_prd_generator_buffer');
      if (stored) {
        const { idea: savedIdea, prompt: savedPrompt } = JSON.parse(stored);
        if (savedIdea) setIdea(savedIdea);
        if (savedPrompt) setPrompt(savedPrompt);
        localStorage.removeItem('gpt5_prd_generator_buffer');
        // Scroll into view if navigated back with hash
        if (document && document.getElementById('gpt5-prd')) {
          document.getElementById('gpt5-prd').scrollIntoView({ behavior: 'smooth' });
        }
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const saveBufferForPayment = () => {
    try {
      localStorage.setItem('gpt5_prd_generator_buffer', JSON.stringify({ idea, prompt, ts: Date.now() }));
    } catch (e) {
      // ignore
    }
  };

  // Dynamic loading messages while generating
  const loadingMessages = useMemo(() => [
    'Identifying potential features…',
    'Structuring product requirements…',
    'Outlining data model & schema…',
    'Exploring design specs for your app…',
    'Drafting user stories & flows…',
    'Defining MVP scope and priorities…'
  ], []);
  const [loadingIndex, setLoadingIndex] = useState(0);
  useEffect(() => {
    if (!isGenerating) return;
    const id = setInterval(() => {
      setLoadingIndex((i) => (i + 1) % loadingMessages.length);
    }, 2800);
    return () => clearInterval(id);
  }, [isGenerating, loadingMessages.length]);

  const wrapPrdAsBuildPrompt = (prd, ideaText) => {
    const trimmedIdea = ideaText?.trim();
    const ideaLine = trimmedIdea ? `App idea: ${trimmedIdea}\n\n` : '';
    return (
      `Here is a PRD breakdown of an app I want to build. Follow this PRD and build the app in the Canvas tool:\n\n` +
      ideaLine +
      `PRD (markdown):\n` +
      `------------------------------\n` +
      `${prd}\n` +
      `------------------------------`
    );
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    setPrompt('');
    try {
      const prd = await generatePRDForGPT5(idea.trim(), (partial) => {
        setPrompt(wrapPrdAsBuildPrompt(partial, idea));
      });
      setPrompt(wrapPrdAsBuildPrompt(prd, idea));
    } catch (e) {
      setError(e.message || 'Failed to generate PRD. Check API key or network.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (!prompt) return;
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <section id="gpt5-prd" className="px-4 py-16 md:py-24 bg-gradient-to-b from-white to-slate-50 border-t border-slate-100">
      <div className="max-w-5xl mx-auto">
        {/* New tag + Title */}
        <div className="flex items-center justify-center mb-6">
          <motion.span 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
            className="relative text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-black to-gray-800 text-white px-4 py-1.5 rounded-full mr-3 shadow-lg"
          >
            <motion.div
              animate={{ 
                boxShadow: [
                  "0 0 0 0 rgba(0, 0, 0, 0.3)",
                  "0 0 0 4px rgba(0, 0, 0, 0.1)",
                  "0 0 0 0 rgba(0, 0, 0, 0)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 rounded-full"
            />
            <span className="relative z-10">New</span>
            <motion.div 
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full"
            />
          </motion.span>
          <motion.span 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-xs font-semibold uppercase tracking-wider text-black/60"
          >
          
          </motion.span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-3">
          GPT-5 PRD Prompt Generator
        </h2>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-10">
          Describe what you want to build. We’ll generate a complete PRD prompt optimized for GPT-5 that you can copy into your workflow.
        </p>

        {/* Input card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 md:p-6">
          <label className="block text-sm font-medium text-slate-700 mb-2">Your app idea</label>
          <textarea
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="e.g., A marketplace where creators sell AI prompts with subscriptions and analytics"
            className="w-full h-28 md:h-32 border border-slate-300 rounded-xl p-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black/20"
          />

          <div className="flex items-center justify-between mt-4">
            <p className="text-xs text-slate-500">Output: full build prompt for GPT-5 (includes PRD), ready to copy</p>
            <motion.button
              whileHover={{ scale: idea.trim() ? 1.02 : 1 }}
              whileTap={{ scale: idea.trim() ? 0.98 : 1 }}
              disabled={!idea.trim() || isGenerating}
              onClick={handleGenerate}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                idea.trim() && !isGenerating
                  ? 'bg-black text-white hover:bg-black/90'
                  : 'bg-black/10 text-black/40 cursor-not-allowed'
              }`}
            >
              {isGenerating ? 'Generating…' : 'Generate PRD'}
            </motion.button>
          </div>
        </div>

        {/* Result */}
        {(prompt || isGenerating || error) && (
          <div className="mt-6 bg-white rounded-2xl border border-slate-200 shadow-sm relative">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
              <div className="text-sm font-medium text-slate-700">Generated build prompt</div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (!prompt) return;
                    if (!isAuthenticated) {
                      setShowAuthModal(true);
                      return;
                    }
                    if (isPaymentRequired) {
                      saveBufferForPayment();
                      setShowPaymentModal(true);
                      return;
                    }
                    handleCopy();
                  }}
                  disabled={!prompt}
                  className={`text-sm px-3 py-1.5 rounded-lg border ${
                    prompt
                      ? 'border-slate-300 hover:bg-slate-50'
                      : 'border-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>
            <div className={`p-4 max-h-96 ${(!isAuthenticated || isPaymentRequired) && !isGenerating && !error && prompt ? 'overflow-hidden' : 'overflow-auto'} relative`}>
              {error ? (
                <p className="text-sm text-red-600">{error}</p>
              ) : (
                <pre className="text-sm text-slate-800 whitespace-pre-wrap font-mono">
                  {prompt || (isGenerating ? loadingMessages[loadingIndex] : '')}
                </pre>
              )}
              {/* Content overlay is moved to the card root to cover header, copy button, and content */}
            </div>
            {!isGenerating && !error && prompt && (!isAuthenticated || isPaymentRequired) && (
              <div className="absolute inset-0 backdrop-blur-sm bg-white/60 flex items-center justify-center rounded-2xl">
                <div className="text-center px-6 space-y-3">
                  {!isAuthenticated ? (
                    <>
                      <p className="text-sm text-slate-700">Create a free account to continue</p>
                      <button
                        onClick={() => setShowAuthModal(true)}
                        className="px-4 py-2 rounded-lg bg-black text-white text-sm hover:bg-black/90"
                      >
                        Sign up to Continue
                      </button>
                    </>
                  ) : (
                    <>
                      <p className="text-sm text-slate-700">Unlock this prompt with a one-time payment</p>
                      <button
                        onClick={() => { saveBufferForPayment(); setShowPaymentModal(true); }}
                        className="px-4 py-2 rounded-lg bg-black text-white text-sm hover:bg-black/90"
                      >
                        Unlock prompt
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      {/* Authentication Modal (reuses the same pattern as DesignInspiration) */}
      <AnimatePresence>
        {showAuthModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowAuthModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-md overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <Auth
                onClose={() => {
                  setShowAuthModal(false);
                  setTimeout(() => {
                    // After auth, if payment is required, open payment modal
                    if (isPaymentRequired) setShowPaymentModal(true);
                  }, 100);
                }}
                defaultMode="signup"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onPaymentInitiated={() => {
          saveBufferForPayment();
        }}
        context="gpt5-prd-generator"
      />
    </section>
  );
};

export default Gpt5PromptGeneratorSection;

