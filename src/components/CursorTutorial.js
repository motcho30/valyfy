import React from 'react';
import { motion } from 'framer-motion';

const CursorTutorial = ({ onClose }) => {

  return (
    <div className="min-h-full bg-white">
      {/* Header */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-slate-200 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>
            <h1 className="text-xl font-semibold text-black">Getting Started with Cursor</h1>
          </div>
          <div className="text-sm text-slate-500">
            AI-powered coding assistant
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Main Content */}
        <div className="w-full">
          {/* Overview Section */}
          <section id="overview" className="mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <span className="text-2xl">📖</span>
                <h2 className="text-2xl font-bold text-black">What is Cursor?</h2>
              </div>
              
              <div className="prose prose-slate max-w-none">
                <p className="text-lg text-slate-700 leading-relaxed mb-6">
                  Cursor is a codebase-aware AI assistant that lives in your sidebar, letting you interact with your codebase through natural language. You can ask questions, request code edits, get terminal command suggestions, and more - all without switching context.
                </p>
                
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-6">
                  <h3 className="font-semibold text-black mb-4 flex items-center">
                    <span className="text-vibe-cyan mr-2">✨</span>
                    Key Benefits
                  </h3>
                  <ul className="space-y-2 text-slate-700">
                    <li className="flex items-start">
                      <span className="text-vibe-cyan mr-2 mt-1">•</span>
                      <span>Understands your entire codebase context</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-vibe-cyan mr-2 mt-1">•</span>
                      <span>Makes intelligent code suggestions and edits</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-vibe-cyan mr-2 mt-1">•</span>
                      <span>Provides terminal command suggestions</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-vibe-cyan mr-2 mt-1">•</span>
                      <span>Automates repetitive workflows</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </section>

          {/* Installation Section */}
          <section id="installation" className="mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <span className="text-2xl">⚡</span>
                <h2 className="text-2xl font-bold text-black">Installation</h2>
              </div>

              <div className="space-y-6">
                <div className="bg-gradient-to-r from-vibe-cyan/5 to-transparent border-l-4 border-vibe-cyan pl-6 py-4">
                  <h3 className="font-semibold text-black mb-2">Quick Start</h3>
                  <ol className="space-y-3 text-slate-700">
                    <li className="flex items-start">
                      <span className="bg-vibe-cyan text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">1</span>
                      <span>Visit <code className="bg-slate-100 px-2 py-1 rounded text-sm">cursor.com</code> and click "Download"</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-vibe-cyan text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">2</span>
                      <span>Run the installer and wait for installation to complete</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-vibe-cyan text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">3</span>
                      <span>Launch Cursor via Desktop shortcut or Applications menu</span>
                    </li>
                  </ol>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                  <h3 className="font-semibold text-black mb-4">Initial Setup</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-vibe-cyan/20 rounded-lg flex items-center justify-center">
                          <span className="text-sm">⌨️</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-black">Keyboard Shortcuts</h4>
                          <p className="text-sm text-slate-600">Choose familiar shortcuts from your previous editor</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-vibe-cyan/20 rounded-lg flex items-center justify-center">
                          <span className="text-sm">🗂️</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-black">Codebase Indexing</h4>
                          <p className="text-sm text-slate-600">Indexes your code for better AI suggestions</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-vibe-cyan/20 rounded-lg flex items-center justify-center">
                          <span className="text-sm">🌐</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-black">Language</h4>
                          <p className="text-sm text-slate-600">Set your preferred language for AI interactions</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-vibe-cyan/20 rounded-lg flex items-center justify-center">
                          <span className="text-sm">💻</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-black">CLI Shortcuts</h4>
                          <p className="text-sm text-slate-600">Install cursor and code commands for terminal</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </section>

          {/* Getting Started Section */}
          <section id="getting-started" className="mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <span className="text-2xl">🚀</span>
                <h2 className="text-2xl font-bold text-black">Getting Started</h2>
              </div>

              <div className="space-y-6">
                <div className="bg-gradient-to-br from-vibe-cyan/10 to-transparent border border-vibe-cyan/20 rounded-xl p-6">
                  <h3 className="font-semibold text-black mb-4 flex items-center">
                    <span className="text-vibe-cyan mr-2">🎯</span>
                    Access Cursor Agent
                  </h3>
                  <div className="flex items-center space-x-4 mb-4">
                    <kbd className="px-3 py-1 bg-slate-100 border border-slate-300 rounded text-sm font-mono">⌘+L</kbd>
                    <span className="text-slate-600">Mac</span>
                    <span className="text-slate-400">or</span>
                    <kbd className="px-3 py-1 bg-slate-100 border border-slate-300 rounded text-sm font-mono">Ctrl+L</kbd>
                    <span className="text-slate-600">Windows/Linux</span>
                  </div>
                  <p className="text-slate-700">
                    Type your request in natural language, and the AI will respond accordingly. The agent understands your codebase context and can help with various tasks.
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                    <h4 className="font-semibold text-black mb-2 flex items-center">
                      <span className="text-lg mr-2">🏗️</span>
                      Build Features
                    </h4>
                    <p className="text-sm text-slate-600 mb-3">
                      Agent can implement new features by understanding your codebase and making intelligent changes across multiple files.
                    </p>
                    <div className="text-xs text-slate-500">
                      Perfect for feature requests
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                    <h4 className="font-semibold text-black mb-2 flex items-center">
                      <span className="text-lg mr-2">🔧</span>
                      Refactor Code
                    </h4>
                    <p className="text-sm text-slate-600 mb-3">
                      Explain your current structure and desired changes. Agent will plan and implement refactoring seamlessly.
                    </p>
                    <div className="text-xs text-slate-500">
                      Ideal for code improvements
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                    <h4 className="font-semibold text-black mb-2 flex items-center">
                      <span className="text-lg mr-2">🆕</span>
                      Setup Projects
                    </h4>
                    <p className="text-sm text-slate-600 mb-3">
                      Tell Agent what you want to build, and it will create the project structure and initial code.
                    </p>
                    <div className="text-xs text-slate-500">
                      Great for new projects
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </section>

          {/* Core Capabilities Section */}
          <section id="capabilities" className="mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <span className="text-2xl">🎯</span>
                <h2 className="text-2xl font-bold text-black">Core Capabilities</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-vibe-cyan/20 rounded-lg flex items-center justify-center">
                        <span className="text-lg">📚</span>
                      </div>
                      <h3 className="font-semibold text-black">Understand Code</h3>
                    </div>
                    <p className="text-slate-700 text-sm leading-relaxed">
                      Ask questions about unfamiliar code, get explanations, or explore your codebase structure with intelligent analysis.
                    </p>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-vibe-cyan/20 rounded-lg flex items-center justify-center">
                        <span className="text-lg">💻</span>
                      </div>
                      <h3 className="font-semibold text-black">Run Commands</h3>
                    </div>
                    <p className="text-slate-700 text-sm leading-relaxed">
                      Get terminal command suggestions for your specific use case, from package management to deployment scripts.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-vibe-cyan/20 rounded-lg flex items-center justify-center">
                        <span className="text-lg">✏️</span>
                      </div>
                      <h3 className="font-semibold text-black">Edit Code</h3>
                    </div>
                    <p className="text-slate-700 text-sm leading-relaxed">
                      Make small tweaks or large multi-file changes without manually navigating files. Agent handles the complexity.
                    </p>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-vibe-cyan/20 rounded-lg flex items-center justify-center">
                        <span className="text-lg">⚡</span>
                      </div>
                      <h3 className="font-semibold text-black">Automate Workflows</h3>
                    </div>
                    <p className="text-slate-700 text-sm leading-relaxed">
                      Let Cursor search, reason and execute to automate your development workflows and repetitive tasks.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </section>

          {/* Modes Section */}
          <section id="modes" className="mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <span className="text-2xl">🔧</span>
                <h2 className="text-2xl font-bold text-black">Cursor Modes</h2>
              </div>

              <div className="space-y-4">
                <div className="bg-gradient-to-r from-vibe-cyan/5 to-transparent border-l-4 border-vibe-cyan pl-6 py-4">
                  <p className="text-slate-700 mb-4">
                    Cursor offers different modes optimized for specific tasks. Switch between modes using the mode picker or <kbd className="px-2 py-1 bg-slate-100 border border-slate-300 rounded text-sm font-mono">⌘+.</kbd> shortcut.
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-white border-2 border-vibe-cyan/20 rounded-xl p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-vibe-cyan/20 rounded-lg flex items-center justify-center">
                        <span className="text-lg">🤖</span>
                      </div>
                      <h3 className="font-semibold text-black">Agent</h3>
                    </div>
                    <p className="text-sm text-slate-700 mb-3">
                      Allow Cursor to <strong>autonomously learn</strong> your codebase and make <strong>codebase-wide changes</strong> on your behalf.
                    </p>
                    <div className="text-xs text-vibe-cyan font-medium">
                      Best for: Feature development, refactoring
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-xl p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                        <span className="text-lg">💬</span>
                      </div>
                      <h3 className="font-semibold text-black">Ask</h3>
                    </div>
                    <p className="text-sm text-slate-700 mb-3">
                      Get explanations and answers about your codebase, and plan out features with the AI.
                    </p>
                    <div className="text-xs text-slate-500 font-medium">
                      Best for: Code understanding, planning
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-xl p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                        <span className="text-lg">🎯</span>
                      </div>
                      <h3 className="font-semibold text-black">Manual</h3>
                    </div>
                    <p className="text-sm text-slate-700 mb-3">
                      Make focused edits, using only the context you provide for precise control.
                    </p>
                    <div className="text-xs text-slate-500 font-medium">
                      Best for: Specific edits, fine-tuning
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </section>

          {/* Pro Tips Section */}
          <section id="tips" className="mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <span className="text-2xl">💡</span>
                <h2 className="text-2xl font-bold text-black">Pro Tips</h2>
              </div>

              <div className="space-y-6">
                <div className="bg-gradient-to-br from-vibe-cyan/10 to-transparent border border-vibe-cyan/20 rounded-xl p-6">
                  <h3 className="font-semibold text-black mb-4 flex items-center">
                    <span className="text-vibe-cyan mr-2">🚀</span>
                    Start with Agent Mode
                  </h3>
                  <p className="text-slate-700 mb-4">
                    For new users, Agent mode is the most powerful way to experience Cursor. It can autonomously understand your codebase and make intelligent changes across multiple files.
                  </p>
                  <div className="bg-white/60 rounded-lg p-4 border border-white/40">
                    <p className="text-sm text-slate-600 font-medium mb-2">Try saying:</p>
                    <div className="space-y-1 text-sm text-slate-700">
                      <div>"Add a dark mode toggle to my React app"</div>
                      <div>"Refactor this component to use TypeScript"</div>
                      <div>"Add user authentication to my project"</div>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                    <h4 className="font-semibold text-black mb-3 flex items-center">
                      <span className="text-lg mr-2">📝</span>
                      Be Specific
                    </h4>
                    <p className="text-sm text-slate-700 mb-3">
                      The more context you provide, the better Cursor can help. Mention specific files, technologies, or requirements.
                    </p>
                    <div className="text-xs text-slate-500">
                      "Update the UserProfile component in src/components to include an avatar upload feature using React hooks"
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                    <h4 className="font-semibold text-black mb-3 flex items-center">
                      <span className="text-lg mr-2">🔄</span>
                      Iterate & Refine
                    </h4>
                    <p className="text-sm text-slate-700 mb-3">
                      Don't hesitate to ask follow-up questions or request modifications. Cursor learns from your feedback.
                    </p>
                    <div className="text-xs text-slate-500">
                      "That's great, but can you make the button more prominent and add a loading state?"
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-6">
                  <h4 className="font-semibold text-black mb-4 flex items-center">
                    <span className="text-lg mr-2">⚡</span>
                    Keyboard Shortcuts to Remember
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-700">Open Agent</span>
                        <kbd className="px-2 py-1 bg-slate-100 border border-slate-300 rounded text-xs font-mono">⌘+L</kbd>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-700">Switch Modes</span>
                        <kbd className="px-2 py-1 bg-slate-100 border border-slate-300 rounded text-xs font-mono">⌘+.</kbd>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-700">New Chat</span>
                        <kbd className="px-2 py-1 bg-slate-100 border border-slate-300 rounded text-xs font-mono">⌘+N</kbd>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-700">Command Palette</span>
                        <kbd className="px-2 py-1 bg-slate-100 border border-slate-300 rounded text-xs font-mono">⌘+⇧+P</kbd>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </section>

          {/* CTA Section */}
          <section className="mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-gradient-to-r from-vibe-cyan/10 to-transparent border border-vibe-cyan/20 rounded-xl p-8 text-center"
            >
              <h3 className="text-xl font-semibold text-black mb-4">
                Ready to boost your productivity? 🚀
              </h3>
              <p className="text-slate-700 mb-6">
                Start with Agent mode and experience the power of AI-assisted coding. Remember, the more you use Cursor, the better it becomes at understanding your codebase and coding style.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="bg-vibe-cyan text-black px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
              >
                Start Coding with Cursor ✨
              </motion.button>
            </motion.div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CursorTutorial; 