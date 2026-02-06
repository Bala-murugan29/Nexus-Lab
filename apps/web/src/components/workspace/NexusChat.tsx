'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNexusStore } from '@/lib/store';

export function NexusChat() {
  const messages = useNexusStore((state) => state.messages);
  const addMessage = useNexusStore((state) => state.addMessage);
  const [input, setInput] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    if (scrollRef.current) {
      setTimeout(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
      }, 0);
    }
  }, [messages]);

  // Auto-clear error message after 5 seconds
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    // Create user message
    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user' as const,
      content: input,
      timestamp: new Date().toISOString(),
    };

    // Add user message to store
    addMessage(userMessage);
    setInput('');
    setIsLoading(true);
    setErrorMessage('');

    try {
      // Prepare messages for API - include all previous messages
      const messagesToSend = messages.map((m) => ({
        role: m.role === 'system' ? 'system' : m.role,
        content: m.content,
      }));

      // Add the new user message
      messagesToSend.push({
        role: 'user',
        content: userMessage.content,
      });

      console.log('[NexusChat] Sending messages:', messagesToSend.length);

      // Call API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: messagesToSend,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: response.statusText }));
        throw new Error(errorData.error || `API Error: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Invalid response from API');
      }

      if (!data.message) {
        throw new Error('No message content in response');
      }

      // Create AI response message
      const aiMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant' as const,
        content: data.message,
        timestamp: new Date().toISOString(),
      };

      // Add AI message to store
      addMessage(aiMessage);
      console.log('[NexusChat] Response added to store');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('[NexusChat] Error:', errorMsg);
      setErrorMessage(errorMsg);

      // Add error message to chat
      const errorNotification = {
        id: `error-${Date.now()}`,
        role: 'system' as const,
        content: `Error: ${errorMsg}. Please try again.`,
        timestamp: new Date().toISOString(),
      };
      addMessage(errorNotification);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (iso?: string) => {
    try {
      return new Date(iso || '').toLocaleTimeString(undefined, {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    } catch {
      return '';
    }
  };

  return (
    <motion.div
      animate={{ height: isMinimized ? 60 : 'auto', maxHeight: isMinimized ? 60 : 500 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="glass-panel flex flex-col border border-border/50 w-full"
      style={{ minHeight: isMinimized ? 60 : 300 }}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-border flex items-center justify-between bg-gradient-to-r from-primary/10 to-accent-purple/10 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
          <span className="text-text-primary font-semibold">NEXUS CHAT</span>
          <span className="text-text-muted text-xs">({messages.length} messages)</span>
        </div>
        <div className="flex items-center gap-3">
          {errorMessage && (
            <span className="text-xs text-red-400 bg-red-500/10 px-2 py-1 rounded">
              {errorMessage.substring(0, 30)}...
            </span>
          )}
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-text-secondary hover:text-text-primary transition-colors text-xl"
          >
            {isMinimized ? '▲' : '▼'}
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!isMinimized && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="flex-1 flex flex-col overflow-hidden w-full"
          >
            {/* Messages Container - Scrollable */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-3 w-full"
              style={{ scrollBehavior: 'smooth' }}
            >
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-text-muted">
                  <p className="text-sm">No messages yet. Start typing!</p>
                </div>
              ) : (
                messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                        message.role === 'user'
                          ? 'bg-primary text-white rounded-br-none'
                          : message.role === 'system'
                          ? 'bg-red-500/10 text-red-400 border border-red-500/30 rounded-bl-none'
                          : 'bg-background-tertiary text-text-primary border border-border/30 rounded-bl-none'
                      }`}
                    >
                      {message.role === 'assistant' && (
                        <div className="text-xs text-accent-green font-semibold mb-1">
                          AI RESPONSE
                        </div>
                      )}
                      {message.role === 'system' && (
                        <div className="text-xs text-red-400 font-semibold mb-1">
                          SYSTEM
                        </div>
                      )}
                      <p className="whitespace-pre-wrap break-words leading-relaxed">
                        {message.content}
                      </p>
                      <span className="text-xs opacity-50 mt-1 block">
                        {formatTime(message.timestamp)}
                      </span>
                    </div>
                  </motion.div>
                ))
              )}

              {/* Loading indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-background-tertiary border border-border/30 rounded-lg rounded-bl-none px-3 py-2">
                    <div className="text-xs text-accent-purple font-semibold mb-2">
                      AI THINKING...
                    </div>
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                      <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input Section - Fixed at bottom */}
            <div className="p-4 border-t border-border bg-background-secondary/50 flex-shrink-0 w-full">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask NEXUS AI anything..."
                  disabled={isLoading}
                  className="flex-1 px-3 py-2 bg-background-tertiary border border-border rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="px-3 py-2 bg-primary hover:bg-primary-dark text-white text-sm font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 flex-shrink-0"
                >
                  {isLoading ? '...' : 'Send'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
