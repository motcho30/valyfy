import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, Sparkles, Edit, Check, Download, X, Bot, Map, Megaphone, ListChecks, GitBranch } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { getPMResponse } from '../services/productManagerService';
import { generateReactFlowData } from '../services/diagramService';
import Diagram from './Diagram';
import DiagramEditor from './DiagramEditor';

const ProductManagerTab = ({ project }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const [error, setError] = useState(null);
  const [editingDiagram, setEditingDiagram] = useState(null);

  const suggestionTags = [
    { text: 'Create a product roadmap for me', icon: <Map className="w-6 h-6 mb-3 text-slate-400" /> },
    { text: 'How can I market this product?', icon: <Megaphone className="w-6 h-6 mb-3 text-slate-400" /> },
    { text: 'What are the key features?', icon: <ListChecks className="w-6 h-6 mb-3 text-slate-400" /> },
    { text: 'Create a user flow diagram for me', icon: <GitBranch className="w-6 h-6 mb-3 text-slate-400" /> },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    setError(null);
    try {
      const savedMessages = localStorage.getItem(`chatHistory_${project.name}`);
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error("Failed to load messages from localStorage", error);
      setMessages([]);
    }
  }, [project.name]);

  useEffect(() => {
    try {
      if (messages.length > 0) {
        localStorage.setItem(`chatHistory_${project.name}`, JSON.stringify(messages));
      } else {
        localStorage.removeItem(`chatHistory_${project.name}`);
      }
    } catch (error) {
      console.error("Failed to save messages to localStorage", error);
    }
  }, [messages, project.name]);

  const handleSend = async (messageText = input) => {
    if (!messageText.trim() || isLoading) return;
    setError(null);

    if (messageText === 'Create a user flow diagram for me') {
      handleDiagramGeneration();
      return;
    }

    const userMessage = { id: `msg-${Date.now()}`, sender: 'user', text: messageText };
    const currentMessages = [...messages, userMessage];
    setMessages(currentMessages);
    setInput('');
    setIsLoading(true);

    try {
      const aiResponseText = await getPMResponse(project, currentMessages);
      const aiResponse = { id: `msg-${Date.now()}`, sender: 'ai', text: aiResponseText };
      setMessages(prev => [...prev, aiResponse]);
    } catch (err) {
      setError(err.message || 'Sorry, I encountered an error. Please try again.');
      setMessages(currentMessages);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDiagramGeneration = async () => {
    setInput('');
    setIsLoading(true);
    setError(null);
    setMessages(prev => [...prev, { id: `msg-${Date.now()}`, sender: 'user', text: 'Create a user flow diagram for me' }]);

    try {
      const diagramData = await generateReactFlowData(project);
      const aiResponse = { id: `msg-${Date.now()}`, sender: 'ai', type: 'diagram', content: diagramData };
      setMessages(prev => [...prev, aiResponse]);
    } catch (err) {
      setError(err.message || 'Sorry, I could not generate the diagram. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSuggestionClick = (suggestion) => {
    handleSend(suggestion.text);
  };

  return (
    <div className="flex flex-col h-full bg-white">
       <AnimatePresence>
        {editingDiagram && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex flex-col"
          >
            <div className="flex justify-between items-center p-4 bg-white/80 border-b border-slate-200">
              <h3 className="font-semibold text-lg">Diagram Editor</h3>
              <button onClick={() => setEditingDiagram(null)} className="p-2 rounded-full hover:bg-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1">
              <DiagramEditor initialNodes={editingDiagram.nodes} initialEdges={editingDiagram.edges} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 && !isLoading ? (
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <div className="mb-8">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bot className="w-6 h-6 text-slate-500" />
                </div>
                <h2 className="text-xl font-semibold text-slate-800">AI Product Manager</h2>
                <p className="text-slate-500">How can I help with "{project.name}"?</p>
            </div>
            <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
              {suggestionTags.map((tag, i) => (
                <motion.button
                  key={i}
                  whileHover={{ y: -4, boxShadow: "0 8px 25px -5px rgb(0 0 0 / 0.07), 0 10px 10px -5px rgb(0 0 0 / 0.04)" }}
                  onClick={() => handleSuggestionClick(tag)}
                  className="p-6 bg-white border border-slate-200/70 rounded-2xl text-center flex flex-col items-center justify-center aspect-square"
                >
                  {tag.icon}
                  <p className="font-medium text-sm text-slate-700">{tag.text}</p>
                </motion.button>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-4 md:p-6">
            <AnimatePresence>
              {messages.map((msg, index) => (
                <motion.div
                  key={msg.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`flex items-start gap-4 my-6 ${msg.sender === 'user' ? 'justify-end' : ''}`}
                >
                  {msg.sender === 'ai' && (
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                      <Bot className="w-5 h-5 text-slate-500" />
                    </div>
                  )}
                  
                  <div className="w-full max-w-2xl">
                    {msg.type === 'diagram' ? (
                      <>
                        <Diagram chart={`graph TD\nA[Start] --> B[End]`} />
                        <div className="flex justify-end items-center gap-2 mt-2">
                             <button 
                                onClick={() => setEditingDiagram(msg.content)}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
                            >
                                <Edit className="w-3.5 h-3.5" />
                                <span>Edit Visually</span>
                            </button>
                        </div>
                      </>
                    ) : (
                      <div
                        className={`prose prose-sm max-w-2xl p-4 rounded-2xl shadow-sm ${
                          msg.sender === 'user'
                            ? 'bg-black text-white rounded-br-none prose-invert'
                            : 'bg-slate-50 text-slate-800 rounded-bl-none'
                        }`}
                      >
                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-4 my-6"
                >
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                    <Bot className="w-5 h-5 text-slate-500" />
                  </div>
                  <div className="max-w-xl p-4 rounded-2xl bg-slate-50 text-slate-800 rounded-bl-none">
                    <motion.div
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="flex space-x-1.5"
                    >
                        <span className="w-2 h-2 bg-slate-400 rounded-full"></span>
                        <span className="w-2 h-2 bg-slate-400 rounded-full"></span>
                        <span className="w-2 h-2 bg-slate-400 rounded-full"></span>
                    </motion.div>
                  </div>
                </motion.div>
            )}
            {error && (
                <div className="flex justify-center my-4">
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
                        <strong>Error:</strong> {error}
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="px-4 md:px-6 pt-4 pb-4">
        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
            placeholder="Ask anything..."
            className="w-full pl-5 pr-16 py-3.5 bg-white border border-slate-200 rounded-full focus:ring-2 focus:ring-slate-300 focus:border-slate-300 focus:outline-none transition-all duration-200 resize-none text-sm placeholder:text-slate-400"
            rows={1}
            style={{ minHeight: '52px' }}
          />
          <motion.button
            onClick={() => handleSend()}
            disabled={isLoading || !input.trim()}
            className="absolute right-2.5 bottom-[9px] w-9 h-9 flex items-center justify-center rounded-full transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            variants={{
              disabled: { backgroundColor: '#e2e8f0', color: '#94a3b8' },
              enabled: { backgroundColor: '#0f172a', color: '#ffffff' }
            }}
            animate={!input.trim() || isLoading ? "disabled" : "enabled"}
          >
            <ArrowUp className="w-4 h-4" />
          </motion.button>
        </div>
        <p className="text-xs text-slate-400 mt-2 text-center">Your AI PM has context of your project's files and specifications.</p>
      </div>
    </div>
  );
};

export default ProductManagerTab; 