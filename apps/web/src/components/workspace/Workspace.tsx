'use client';

import { useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { CodeEditor } from './CodeEditor';
import { ThoughtTrace } from './ThoughtTrace';
import { KnowledgeTopology } from './KnowledgeTopology';
import { NexusChat } from './NexusChat';
import { MultimodalInput } from './MultimodalInput';
import { useNexusStore } from '@/lib/store';
import { useWebSocket } from '@/hooks/useWebSocket';

export function Workspace() {
  const activeProject = useNexusStore((state) => state.activeProject);
  const activeFile = useNexusStore((state) => state.activeFile);
  const setActiveProject = useNexusStore((state) => state.setActiveProject);
  const setActiveFile = useNexusStore((state) => state.setActiveFile);
  
  // Initialize WebSocket connection
  const { isConnected } = useWebSocket();

  useEffect(() => {
    // Log workspace initialization
    console.log('NEXUS Workspace initialized', { activeProject, isConnected });
  }, [activeProject, isConnected]);

  return (
    <div className="flex h-screen w-full bg-background">
      {/* Connection Status Indicator */}
      <div className="fixed top-2 right-2 z-50">
        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-accent-green' : 'bg-accent-red'} animate-pulse`} />
      </div>

      {/* Sidebar */}
      <Sidebar 
        activeProject={activeProject}
        onProjectChange={setActiveProject}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header 
          projectName={activeProject}
          fileName={activeFile}
        />

        {/* Main Workspace Grid */}
        <div className="flex-1 grid grid-cols-12 gap-4 p-4 overflow-hidden">
          {/* Left Panel - Code Editor */}
          <div className="col-span-5 flex flex-col gap-4">
            <CodeEditor 
              fileName={activeFile}
              onFileChange={setActiveFile}
            />
            <MultimodalInput />
          </div>

          {/* Middle Panel - Thought Trace */}
          <div className="col-span-3 flex flex-col">
            <ThoughtTrace />
          </div>

          {/* Right Panel - Knowledge & Chat */}
          <div className="col-span-4 flex flex-col gap-4">
            <KnowledgeTopology />
            <NexusChat />
          </div>
        </div>
      </div>
    </div>
  );
}
