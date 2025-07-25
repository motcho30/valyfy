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
    `## Overall Score: ${feedback.overallScore}/10

## Context Analysis
- Primary User Goal: ${feedback.contextAnalysis?.primaryUserGoal || 'N/A'}
- Target Persona: ${feedback.contextAnalysis?.targetPersona || 'N/A'}
- Key Metrics: ${feedback.contextAnalysis?.keyMetrics || 'N/A'}

## Critical Findings
${feedback.criticalFindings?.map(finding => 
  `- **${finding.severity}**: ${finding.issue}\n  Location: ${finding.location}\n  Impact: ${finding.impact}\n  Recommendation: ${finding.recommendation}\n  Effort: ${finding.effort}`
).join('\n\n') || 'None'}

## Category Analysis
${Object.entries(feedback.categoryAnalysis || {}).map(([key, value]) => 
  `### ${key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')} (${value.score}/5)
  
**Strengths:**
${value.strengths?.map(strength => `- ${strength}`).join('\n') || 'None'}

**Issues:**
${value.issues?.map(issue => `- **Finding**: ${issue.finding}\n  **Fix**: ${issue.fix}\n  **Example**: ${issue.example}`).join('\n\n') || 'None'}`
).join('\n\n')}

## Top Recommendations
${feedback.topRecommendations?.map((rec, index) => 
  `${index + 1}. **${rec.action}**\n   Expected Impact: ${rec.expectedImpact}`
).join('\n\n') || 'None'}

## Benchmark Comparison
${feedback.benchmarkComparison || 'N/A'}`
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
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Design Review</h2>
                  <p className="text-sm text-gray-600 mt-1">Expert UX/UI analysis and recommendations</p>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => handleCopy(fullFeedbackText)}
                    disabled={!feedback}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 disabled:opacity-50 transition-colors"
                  >
                    {copySuccess === fullFeedbackText ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                    Copy All
                  </button>
                  <button 
                    onClick={handleReview}
                    disabled={!screenshot || loading}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-vibe-cyan rounded-xl hover:bg-vibe-cyan/90 disabled:opacity-50 transition-colors shadow-sm"
                  >
                    <Sparkles className="w-4 h-4" />
                    Regenerate
                  </button>
                </div>
              </div>
              <div className="p-6">
                {loading && (
                  <div className="flex flex-col items-center justify-center h-96">
                    <div className="relative">
                      <div className="w-16 h-16 border-4 border-vibe-cyan/20 border-t-vibe-cyan rounded-full animate-spin"></div>
                      <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-vibe-cyan/40 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                    </div>
                    <div className="mt-6 text-center">
                      <p className="text-lg font-semibold text-gray-900 mb-2">Analyzing your design...</p>
                      <p className="text-sm text-gray-600">Our AI is examining your UI with expert precision</p>
                    </div>
                  </div>
                )}
                {error && (
                   <div className="flex flex-col items-center justify-center h-96">
                    <div className="bg-red-50 border border-red-100 rounded-2xl p-8 max-w-md">
                      <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
                        <AlertTriangle className="w-6 h-6 text-red-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">Analysis Failed</h3>
                      <p className="text-sm text-gray-600 text-center">{error}</p>
                    </div>
                  </div>
                )}
                {feedback && (
                  <div className="space-y-8">
                    {/* Overall Score */}
                    <div className="bg-gradient-to-br from-vibe-cyan/10 to-blue-50/50 border border-vibe-cyan/20 rounded-2xl p-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">Overall Score</h3>
                          <p className="text-sm text-gray-600">Based on comprehensive UX/UI analysis</p>
                        </div>
                        <div className="text-right">
                          <span className="text-4xl font-bold text-vibe-cyan">{feedback.overallScore}</span>
                          <span className="text-lg text-gray-500">/10</span>
                        </div>
                      </div>
                    </div>

                    {/* Context Analysis */}
                    {feedback.contextAnalysis && (
                      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <div className="w-2 h-2 bg-vibe-cyan rounded-full"></div>
                          Context Analysis
                        </h3>
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">Primary Goal</p>
                              <p className="text-sm text-gray-600">{feedback.contextAnalysis.primaryUserGoal}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">Target Persona</p>
                              <p className="text-sm text-gray-600">{feedback.contextAnalysis.targetPersona}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">Key Metrics</p>
                              <p className="text-sm text-gray-600">{feedback.contextAnalysis.keyMetrics}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Critical Findings */}
                    {feedback.criticalFindings && feedback.criticalFindings.length > 0 && (
                      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          Critical Findings
                        </h3>
                        <div className="space-y-4">
                          {feedback.criticalFindings.map((finding, index) => (
                            <div key={index} className="bg-gray-50/50 rounded-xl p-4 border border-gray-100">
                              <div className="flex justify-between items-start mb-3">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  finding.severity === 'Critical' ? 'bg-red-100 text-red-700' :
                                  finding.severity === 'Major' ? 'bg-orange-100 text-orange-700' :
                                  'bg-yellow-100 text-yellow-700'
                                }`}>
                                  {finding.severity}
                                </span>
                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Effort: {finding.effort}</span>
                              </div>
                              <p className="text-sm font-medium text-gray-900 mb-2">{finding.issue}</p>
                              <div className="space-y-1 text-xs text-gray-600">
                                <p><span className="font-medium">Location:</span> {finding.location}</p>
                                <p><span className="font-medium">Impact:</span> {finding.impact}</p>
                                <p><span className="font-medium">Fix:</span> {finding.recommendation}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Category Analysis */}
                    {feedback.categoryAnalysis && (
                      <div className="space-y-6">
                        {Object.entries(feedback.categoryAnalysis).map(([key, value]) => (
                          <div key={key} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                            <div className="flex justify-between items-center mb-4">
                              <h3 className="text-lg font-semibold text-gray-900 capitalize">
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                              </h3>
                              <div className="flex items-center gap-3">
                                <div className="bg-vibe-cyan/10 px-3 py-1 rounded-full">
                                  <span className="text-lg font-bold text-vibe-cyan">{value.score}</span>
                                  <span className="text-sm text-gray-500 ml-1">/5</span>
                                </div>
                                <button 
                                  onClick={() => handleCopy(JSON.stringify(value, null, 2))}
                                  className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                  {copySuccess === JSON.stringify(value, null, 2) ? 
                                    <Check className="w-4 h-4 text-green-500" /> : 
                                    <Copy className="w-4 h-4" />
                                  }
                                </button>
                              </div>
                            </div>
                            
                            {/* Strengths */}
                            {value.strengths && value.strengths.length > 0 && (
                              <div className="mb-4">
                                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                  Strengths
                                </h4>
                                <ul className="space-y-2">
                                  {value.strengths.map((strength, index) => (
                                    <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                                      <span className="text-green-500 mt-0.5">✓</span>
                                      <span>{strength}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Issues */}
                            {value.issues && value.issues.length > 0 && (
                              <div>
                                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                                  Issues
                                </h4>
                                <div className="space-y-3">
                                  {value.issues.map((issue, index) => (
                                    <div key={index} className="bg-gray-50/50 rounded-lg p-3 border border-gray-100">
                                      <p className="text-sm text-gray-900 mb-2"><span className="font-medium">Finding:</span> {issue.finding}</p>
                                      <p className="text-sm text-gray-700 mb-1"><span className="font-medium">Fix:</span> {issue.fix}</p>
                                      {issue.example && (
                                        <p className="text-xs text-gray-600"><span className="font-medium">Example:</span> {issue.example}</p>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Top Recommendations */}
                    {feedback.topRecommendations && feedback.topRecommendations.length > 0 && (
                      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          Top Recommendations
                        </h3>
                        <div className="space-y-3">
                          {feedback.topRecommendations.map((rec, index) => (
                            <div key={index} className="bg-gradient-to-r from-green-50/50 to-emerald-50/50 rounded-xl p-4 border border-green-100">
                              <div className="flex items-start gap-3">
                                <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">
                                  {rec.priority}
                                </span>
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-gray-900 mb-1">{rec.action}</p>
                                  <p className="text-xs text-gray-600">Expected Impact: {rec.expectedImpact}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Benchmark Comparison */}
                    {feedback.benchmarkComparison && (
                      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          Benchmark Comparison
                        </h3>
                        <p className="text-sm text-gray-700 leading-relaxed">{feedback.benchmarkComparison}</p>
                      </div>
                    )}
                  </div>
                )}
                {!loading && !feedback && !error && (
                  <div className="flex flex-col items-center justify-center h-96">
                    <div className="bg-gray-50/50 border border-gray-100 rounded-2xl p-8 max-w-md">
                      <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mx-auto mb-4">
                        <FileText className="w-6 h-6 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">Ready for Analysis</h3>
                      <p className="text-sm text-gray-600 text-center">Upload a design and start the review to get expert AI-powered feedback on your UI/UX.</p>
                    </div>
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