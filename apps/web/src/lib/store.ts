import { create } from 'zustand';

export interface ThoughtStep {
  id: number;
  type: 'analysis' | 'reasoning' | 'suggestion' | 'insight';
  content: string;
  confidence: number;
  timestamp: string;
}

export interface KnowledgeNode {
  id: string;
  concept: string;
  category: string;
  mastery: number;
  x: number;
  y: number;
  connections: string[];
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

export interface ProjectFile {
  id: string;
  name: string;
  path: string;
  language: string;
  content: string;
  modified: boolean;
}

interface NexusStore {
  // Project state
  activeProject: string;
  projects: Array<{ name: string; color: string }>;
  setActiveProject: (project: string) => void;
  
  // File state
  activeFile: string;
  files: ProjectFile[];
  setActiveFile: (file: string) => void;
  updateFileContent: (id: string, content: string) => void;
  
  // Thought trace state
  thoughtSteps: ThoughtStep[];
  addThoughtStep: (step: ThoughtStep) => void;
  clearThoughtSteps: () => void;
  
  // Knowledge graph state
  knowledgeNodes: KnowledgeNode[];
  setKnowledgeNodes: (nodes: KnowledgeNode[]) => void;
  updateNodeMastery: (id: string, mastery: number) => void;
  
  // Chat state
  messages: Message[];
  addMessage: (message: Message) => void;
  clearMessages: () => void;
  
  // Metrics state
  metrics: {
    focusScore: number;
    tasksCompleted: number;
    efficiencyScore: number;
    learningVelocity: number;
  };
  updateMetrics: (metrics: Partial<NexusStore['metrics']>) => void;
  
  // UI state
  isProcessing: boolean;
  setProcessing: (processing: boolean) => void;
}

export const useNexusStore = create<NexusStore>((set) => ({
  // Initial project state
  activeProject: 'Project Alpha',
  projects: [
    { name: 'Neural Synth v2', color: 'bg-accent-purple' },
    { name: 'Auth Module API', color: 'bg-accent-blue' },
    { name: 'Project Alpha', color: 'bg-accent-cyan' },
  ],
  setActiveProject: (project) => set({ activeProject: project }),
  
  // Initial file state
  activeFile: 'CoreEngine.tsx',
  files: [
    {
      id: '1',
      name: 'CoreEngine.tsx',
      path: '/src/CoreEngine.tsx',
      language: 'typescript',
      content: `import React, { useState, useEffect } from 'react';\n\ninterface CoreEngineProps {\n  mode: 'premium' | 'standard';\n}\n\nexport const CoreEngine: React.FC<CoreEngineProps> = ({ mode }) => {\n  const [state, setState] = useState('idle');\n  \n  useEffect(() => {\n    console.log('Engine initialized in', mode, 'mode');\n  }, [mode]);\n  \n  return (\n    <div className="engine-container">\n      <h2>Core Engine Active</h2>\n      <p>Status: {state}</p>\n    </div>\n  );\n};`,
      modified: false,
    },
  ],
  setActiveFile: (file) => set({ activeFile: file }),
  updateFileContent: (id, content) => set((state) => ({
    files: state.files.map(f => 
      f.id === id ? { ...f, content, modified: true } : f
    ),
  })),
  
  // Thought trace
  thoughtSteps: [],
  addThoughtStep: (step) => set((state) => ({
    thoughtSteps: [...state.thoughtSteps, step],
  })),
  clearThoughtSteps: () => set({ thoughtSteps: [] }),
  
  // Knowledge graph
  knowledgeNodes: [
    { id: '1', concept: 'React Hooks', category: 'Frontend', mastery: 0.85, x: 100, y: 100, connections: ['2', '3'] },
    { id: '2', concept: 'TypeScript', category: 'Language', mastery: 0.92, x: 200, y: 150, connections: ['1', '4'] },
    { id: '3', concept: 'State Management', category: 'Frontend', mastery: 0.78, x: 150, y: 250, connections: ['1'] },
    { id: '4', concept: 'REST APIs', category: 'Backend', mastery: 0.88, x: 300, y: 200, connections: ['2', '5'] },
    { id: '5', concept: 'Database Design', category: 'Backend', mastery: 0.75, x: 350, y: 300, connections: ['4'] },
  ],
  setKnowledgeNodes: (nodes) => set({ knowledgeNodes: nodes }),
  updateNodeMastery: (id, mastery) => set((state) => ({
    knowledgeNodes: state.knowledgeNodes.map(node =>
      node.id === id ? { ...node, mastery } : node
    ),
  })),
  
  // Chat messages
  messages: [
    {
      id: '1',
      role: 'system',
      content: 'Neural Engine Activemain* Ready to assist with your cognitive tasks.',
      timestamp: new Date().toISOString(),
    },
  ],
  addMessage: (message) => set((state) => ({
    messages: [...state.messages, message],
  })),
  clearMessages: () => set({ messages: [] }),
  
  // Metrics
  metrics: {
    focusScore: 85,
    tasksCompleted: 12,
    efficiencyScore: 87,
    learningVelocity: 92,
  },
  updateMetrics: (newMetrics) => set((state) => ({
    metrics: { ...state.metrics, ...newMetrics },
  })),
  
  // UI state
  isProcessing: false,
  setProcessing: (processing) => set({ isProcessing: processing }),
}));
