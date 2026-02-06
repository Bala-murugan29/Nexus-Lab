'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNexusStore } from '@/lib/store';

export function NexusChat() {
  const messages = useNexusStore((state) => state.messages);
  const addMessage = useNexusStore((state) => state.addMessage);
  const [input, setInput] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user' as const,
      content: input,
      timestamp: new Date().toISOString(),
    };
    
    addMessage(userMessage);
    setInput('');
    setIsTyping(true);
    
    // Simulate AI response
    setTimeout(() => {
      const aiMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant' as const,
        content: generateAIResponse(input),
        timestamp: new Date().toISOString(),
      };
      addMessage(aiMessage);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (query: string) => {
    if (query.toLowerCase().includes('help') || query.toLowerCase().includes('how')) {
      return "I'm analyzing your code context. I can help you with code optimization, debugging, and architectural suggestions. What specific area would you like to focus on?";
    }
    if (query.toLowerCase().includes('error') || query.toLowerCase().includes('bug')) {
      return "I've detected a few potential issues in your current file. Let me highlight them in the thought trace. Would you like me to suggest fixes?";
    }
    if (query.toLowerCase().includes('optimize')) {
      return "Based on the knowledge graph, I recommend focusing on state management patterns. Your current implementation could benefit from memo optimization and lazy loading.";
    }
    return "I'm processing your request and analyzing the codebase. The thought trace above shows my reasoning process. Is there anything specific you'd like me to elaborate on?";
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <motion.div
      animate={{ height: isMinimized ? 60 : 400 }}
      className="glass-panel overflow-hidden flex flex-col"
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
          <span className="text-text-primary font-semibold">NEXUS CHAT</span>
          <span className="text-text-muted text-xs">({messages.length})</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-text-secondary hover:text-text-primary transition-colors"
          >
            {isMinimized ? '▲' : '▼'}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {!isMinimized && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col"
          >
            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      message.role === 'user'
                        ? 'bg-primary text-white'
                        : message.role === 'system'
                        ? 'bg-accent-purple/20 text-accent-purple border border-accent-purple/30'
                        : 'bg-background-tertiary text-text-primary'
                    }`}
                  >
                    {message.role === 'assistant' && (
                      <div className="text-xs text-primary font-semibold mb-1">NEXUS AI</div>
                    )}
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <div className="text-xs opacity-60 mt-1">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-background-tertiary rounded-lg px-4 py-2">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                      <span className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100" />
                      <span className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask NEXUS AI anything..."
                  className="flex-1 px-4 py-2 bg-background-tertiary border border-border rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
