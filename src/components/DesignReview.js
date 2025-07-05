import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, ArrowRight, Loader, Sparkles, AlertTriangle, Copy, Check, X } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { getDesignFeedback } from '../services/designReviewService';

const DesignReview = ({ project }) => {
  const [screenshot, setScreenshot] = useState(null);
  const [scope, setScope] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copySuccess, setCopySuccess] = useState('');

  const onDrop = useCallback(acceptedFiles => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = () => {
      setScreenshot(reader.result);
    };
    reader.readAsDataURL(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/*',
    multiple: false
  });

  const handleReview = async () => {
    if (!screenshot) {
      setError('Please upload a screenshot first.');
      return;
    }
    setLoading(true);
    setError(null);
    setFeedback(null);
    try {
      const result = await getDesignFeedback(screenshot, scope, project);
      if (result.success) {
        setFeedback(result.feedback);
      } else {
        setError(result.message || 'Failed to get feedback.');
      }
    } catch (e) {
      setError('An unexpected error occurred.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(text);
    setTimeout(() => setCopySuccess(''), 2000);
  };

  const fullFeedbackText = feedback ? 
    Object.entries(feedback)
      .map(([key, value]) => `## ${key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}\n${value.comment}`)
      .join('\n\n') 
    : '';

  return (
    <div className="p-8 w-full font-casual">
        <main className="w-full">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left side: Upload and settings */}
            <div className="space-y-8">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-1">1. Upload your design for UX review</h2>
                <p className="text-sm text-gray-500 mb-4">Upload a screenshot of your user interface to get started.</p>
                <div {...getRootProps()} className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${isDragActive ? 'border-vibe-cyan bg-cyan-50' : 'border-gray-300 hover:border-cyan-400'}`}>
                  <input {...getInputProps()} />
                  {screenshot ? (
                    <>
                      <img src={screenshot} alt="Screenshot preview" className="mx-auto max-h-64 rounded-md shadow-md" />
                      <button onClick={() => setScreenshot(null)} className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md hover:bg-gray-100">
                        <X className="w-4 h-4 text-gray-600" />
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <Upload className="w-12 h-12 mb-4 text-gray-400" />
                      <p className="font-semibold">Click to upload or drag and drop</p>
                      <p className="text-xs">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-1">2. Outline the scope and objectives of the review <span className="text-sm font-normal text-gray-400">(optional)</span></h2>
                <p className="text-sm text-gray-500 mb-4">Provide context on what you'd like to improve. The more context, the better the feedback.</p>
                <textarea
                  value={scope}
                  onChange={(e) => setScope(e.target.value)}
                  placeholder="e.g., How to improve the conversion rate of this landing page for mobile users..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vibe-cyan focus:border-vibe-cyan transition"
                  rows="4"
                />
              </div>

              <button
                onClick={handleReview}
                disabled={loading || !screenshot}
                className="w-full flex items-center justify-center gap-2 bg-vibe-cyan text-black font-semibold py-3 px-4 rounded-xl hover:shadow-lg disabled:bg-cyan-200 disabled:cursor-not-allowed transition-all duration-200"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Reviewing the design...</span>
                  </>
                ) : (
                  <>
                    <span>Start the review</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>

            {/* Right side: Feedback */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl shadow-md">
              <div className="p-6 border-b border-slate-200/80 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Review of Your Design</h2>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleCopy(fullFeedbackText)}
                    disabled={!feedback}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                  >
                    {copySuccess === fullFeedbackText ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                    Copy
                  </button>
                  <button 
                    onClick={handleReview}
                    disabled={!screenshot || loading}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-black bg-vibe-cyan rounded-md hover:shadow-lg disabled:opacity-50"
                  >
                    <Sparkles className="w-4 h-4" />
                    Regenerate
                  </button>
                </div>
              </div>
              <div className="p-6">
                {loading && (
                  <div className="flex flex-col items-center justify-center h-96 text-gray-500">
                    <Loader className="w-12 h-12 animate-spin text-vibe-cyan" />
                    <p className="mt-4 text-lg font-medium">Analyzing your design...</p>
                    <p className="text-sm">Our AI is looking at your UI, please wait a moment.</p>
                  </div>
                )}
                {error && (
                   <div className="flex flex-col items-center justify-center h-96 text-red-600 bg-red-50 rounded-lg p-4">
                    <AlertTriangle className="w-12 h-12" />
                    <p className="mt-4 text-lg font-semibold">An Error Occurred</p>
                    <p className="text-sm text-center">{error}</p>
                  </div>
                )}
                {feedback && (
                  <div className="space-y-6">
                    {Object.entries(feedback).map(([key, value]) => (
                      <div key={key}>
                        <div className="flex justify-between items-center">
                          <h3 className="text-md font-semibold text-gray-800 uppercase tracking-wider">{value.title}</h3>
                          <button 
                            onClick={() => handleCopy(value.comment)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                           {copySuccess === value.comment ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                        <p className="mt-2 text-gray-600 leading-relaxed">{value.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
                {!loading && !feedback && !error && (
                  <div className="flex flex-col items-center justify-center h-96 text-gray-400">
                    <FileText className="w-12 h-12" />
                    <p className="mt-4 text-lg font-medium">Your feedback will appear here</p>
                    <p className="text-sm text-center max-w-xs">Upload a design and start the review to get AI-powered feedback on your UI/UX.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
    </div>
  );
};

export default DesignReview; 