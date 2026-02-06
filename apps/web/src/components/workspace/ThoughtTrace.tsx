'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useNexusStore } from '@/lib/store';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useEffect, useRef } from 'react';

export function ThoughtTrace() {
  const thoughtSteps = useNexusStore((state) => state.thoughtSteps);
  const { requestThoughtTrace } = useWebSocket();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll to bottom when new thoughts are added
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [thoughtSteps]);

  useEffect(() => {
    // Request initial thought trace
    requestThoughtTrace({ type: 'initial-load' });
  }, [requestThoughtTrace]);

  const getStatusColor = (type: string) => {
    switch (type) {
      case 'analysis':
        return 'bg-accent-blue border-accent-blue';
      case 'reasoning':
        return 'bg-accent-purple border-accent-purple';
      case 'suggestion':
        return 'bg-accent-green border-accent-green';
      case 'insight':
        return 'bg-accent-cyan border-accent-cyan';
      default:
        return 'bg-primary border-primary';
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const then = new Date(timestamp);
    const diff = Math.floor((now.getTime() - then.getTime()) / 1000);
    
    if (diff < 60) return `T-${diff}s`;
    if (diff < 3600) return `T-${Math.floor(diff / 60)}m`;
    return `T-${Math.floor(diff / 3600)}h`;
  };

  return (
    <div className="glass-panel h-full overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-primary text-xl">🧠</span>
          <span className="text-text-primary font-semibold">THOUGHT TRACE</span>
        </div>
        <span className="text-text-muted text-xs">{thoughtSteps.length} steps</span>
      </div>

      {/* Timeline */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4">
        {thoughtSteps.length === 0 ? (
          <div className="h-full flex items-center justify-center text-center">
            <div className="text-text-muted">
              <div className="text-4xl mb-2">🌀</div>
              <p>Thought trace will appear here</p>
              <p className="text-xs mt-1">Start coding to activate reasoning</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {thoughtSteps.map((thought, index) => (
                <motion.div
                  key={thought.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="relative pl-6 pb-4"
                >
                  {/* Timeline Line */}
                  {index < thoughtSteps.length - 1 && (
                    <div className="absolute left-2 top-6 w-0.5 h-full bg-border" />
                  )}

                  {/* Timeline Dot */}
                  <div
                    className={`absolute left-0 top-1 w-4 h-4 rounded-full border-2 ${getStatusColor(thought.type)} ${
                      index === thoughtSteps.length - 1 ? 'animate-pulse' : ''
                    }`}
                  />

                  {/* Content */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-text-muted font-mono">
                        {getTimeAgo(thought.timestamp)}
                      </span>
                      {index === thoughtSteps.length - 1 && (
                        <span className="px-2 py-0.5 text-xs bg-primary/20 text-primary rounded">
                          Now
                        </span>
                      )}
                      <span className={`px-2 py-0.5 text-xs rounded ${
                        thought.type === 'analysis' ? 'bg-accent-blue/20 text-accent-blue' :
                        thought.type === 'reasoning' ? 'bg-accent-purple/20 text-accent-purple' :
                        thought.type === 'suggestion' ? 'bg-accent-green/20 text-accent-green' :
                        'bg-accent-cyan/20 text-accent-cyan'
                      }`}>
                        {thought.type}
                      </span>
                    </div>
                    <p className="text-sm text-text-primary">{thought.content}</p>
                    <div className="flex items-center gap-2 text-xs text-text-muted">
                      <span>Confidence: {Math.round(thought.confidence * 100)}%</span>
                      <div className="flex-1 h-1 bg-background-tertiary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${thought.confidence * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
