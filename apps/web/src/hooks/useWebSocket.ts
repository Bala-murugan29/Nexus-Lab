'use client';

import { useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useNexusStore } from '@/lib/store';

let socket: Socket | null = null;

export function useWebSocket(userId: string = 'user-demo') {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<any>(null);
  
  const addThoughtStep = useNexusStore((state) => state.addThoughtStep);
  const updateMetrics = useNexusStore((state) => state.updateMetrics);
  const setKnowledgeNodes = useNexusStore((state) => state.setKnowledgeNodes);

  useEffect(() => {
    // Initialize socket connection
    if (!socket) {
      socket = io(process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3001', {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionDelay: 1000,
      });
    }

    socket.on('connect', () => {
      console.log('WebSocket connected');
      setIsConnected(true);
      socket?.emit('join', userId);
    });

    socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
    });

    socket.on('intervention:new', (data) => {
      setLastMessage({ type: 'intervention', data });
      addThoughtStep({
        id: Date.now(),
        type: 'insight',
        content: data.message || 'New intervention detected',
        confidence: data.confidence || 0.8,
        timestamp: new Date().toISOString(),
      });
    });

    socket.on('knowledge:update', (data) => {
      setLastMessage({ type: 'knowledge', data });
      if (data.nodes) {
        setKnowledgeNodes(data.nodes);
      }
    });

    socket.on('reasoning:step', (data) => {
      setLastMessage({ type: 'reasoning', data });
      addThoughtStep({
        id: data.id || Date.now(),
        type: 'reasoning',
        content: data.content || data.step,
        confidence: data.confidence || 0.85,
        timestamp: new Date().toISOString(),
      });
    });

    socket.on('metrics:update', (data) => {
      setLastMessage({ type: 'metrics', data });
      updateMetrics(data);
    });
    
    socket.on('thought:update', (data) => {
      if (data.steps && Array.isArray(data.steps)) {
        data.steps.forEach((step: any) => addThoughtStep(step));
      }
    });
    
    socket.on('code:analysis', (data) => {
      console.log('Code analysis received:', data);
      addThoughtStep({
        id: Date.now(),
        type: 'analysis',
        content: `Code analyzed: ${data.issues?.length || 0} issues found, complexity: ${data.complexity}/10`,
        confidence: 0.9,
        timestamp: new Date().toISOString(),
      });
    });

    return () => {
      // Don't disconnect on unmount to maintain persistent connection
    };
  }, [userId, addThoughtStep, updateMetrics, setKnowledgeNodes]);

  const sendCodeChange = (code: string) => {
    socket?.emit('code:change', { code });
  };

  const requestThoughtTrace = (context: any) => {
    socket?.emit('thought:request', { context });
  };

  const logActivity = (activity: any) => {
    socket?.emit('activity:log', { userId, activity });
  };

  return {
    isConnected,
    lastMessage,
    sendCodeChange,
    requestThoughtTrace,
    logActivity,
  };
}
