'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useNexusStore } from '@/lib/store';

interface Experiment {
  id: string;
  name: string;
  status: 'running' | 'completed' | 'failed';
  progress: number;
  startTime: string;
  results?: any;
}

export default function ResearchLabPage() {
  const addThoughtStep = useNexusStore((state) => state.addThoughtStep);
  const [experiments, setExperiments] = useState<Experiment[]>([
    {
      id: '1',
      name: 'Neural Architecture Search',
      status: 'running',
      progress: 67,
      startTime: '2 hours ago',
    },
    {
      id: '2',
      name: 'Code Pattern Analysis',
      status: 'completed',
      progress: 100,
      startTime: '5 hours ago',
      results: { patterns: 42, insights: 15 },
    },
    {
      id: '3',
      name: 'Performance Optimization Test',
      status: 'running',
      progress: 34,
      startTime: '1 hour ago',
    },
  ]);

  const startNewExperiment = () => {
    const newExp: Experiment = {
      id: Date.now().toString(),
      name: 'New Research Experiment',
      status: 'running',
      progress: 0,
      startTime: 'Just now',
    };
    setExperiments([newExp, ...experiments]);
    
    addThoughtStep({
      id: Date.now(),
      type: 'analysis',
      content: `Started new experiment: ${newExp.name}`,
      confidence: 0.9,
      timestamp: new Date().toISOString(),
    });
  };

  return (
    <div className="h-screen w-full bg-background flex flex-col">
      {/* Header */}
      <header className="h-16 border-b border-border bg-background-secondary px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-primary hover:text-primary-light">
            ← Back to Workspace
          </Link>
          <div className="h-6 w-px bg-border" />
          <h1 className="text-xl font-semibold text-text-primary">Research Lab</h1>
        </div>
        <button onClick={startNewExperiment} className="btn-primary">
          + New Experiment
        </button>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-6xl mx-auto">
          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="glass-panel p-4">
              <div className="text-3xl font-bold text-primary">{experiments.length}</div>
              <div className="text-sm text-text-muted mt-1">Total Experiments</div>
            </div>
            <div className="glass-panel p-4">
              <div className="text-3xl font-bold text-accent-green">
                {experiments.filter(e => e.status === 'running').length}
              </div>
              <div className="text-sm text-text-muted mt-1">Running Now</div>
            </div>
            <div className="glass-panel p-4">
              <div className="text-3xl font-bold text-accent-blue">
                {experiments.filter(e => e.status === 'completed').length}
              </div>
              <div className="text-sm text-text-muted mt-1">Completed</div>
            </div>
            <div className="glass-panel p-4">
              <div className="text-3xl font-bold text-accent-purple">89%</div>
              <div className="text-sm text-text-muted mt-1">Success Rate</div>
            </div>
          </div>

          {/* Experiments List */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-text-primary mb-4">Active Experiments</h2>
            {experiments.map((exp) => (
              <div key={exp.id} className="glass-panel p-6 hover:border-primary transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary mb-1">{exp.name}</h3>
                    <p className="text-sm text-text-muted">Started {exp.startTime}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded text-xs font-semibold ${
                        exp.status === 'running'
                          ? 'bg-accent-green/20 text-accent-green'
                          : exp.status === 'completed'
                          ? 'bg-accent-blue/20 text-accent-blue'
                          : 'bg-accent-red/20 text-accent-red'
                      }`}
                    >
                      {exp.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                {exp.status === 'running' && (
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-text-muted">Progress</span>
                      <span className="text-text-primary font-semibold">{exp.progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-background-tertiary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${exp.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {exp.results && (
                  <div className="mt-4 p-4 bg-background-tertiary rounded-lg">
                    <div className="text-sm font-semibold text-text-primary mb-2">Results</div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-text-muted">Patterns Found:</span>
                        <span className="text-accent-green font-semibold ml-2">{exp.results.patterns}</span>
                      </div>
                      <div>
                        <span className="text-text-muted">Insights:</span>
                        <span className="text-accent-blue font-semibold ml-2">{exp.results.insights}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-4 flex gap-2">
                  <button className="btn-secondary text-sm">View Details</button>
                  {exp.status === 'running' && (
                    <button className="btn-secondary text-sm">Stop</button>
                  )}
                  {exp.status === 'completed' && (
                    <button className="btn-primary text-sm">Export Results</button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Research Topics */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-text-primary mb-4">Suggested Research Topics</h2>
            <div className="grid grid-cols-3 gap-4">
              {[
                'Memory Leak Detection',
                'API Performance Analysis',
                'Code Duplication Study',
                'Security Vulnerability Scan',
                'Dependency Graph Analysis',
                'Type Coverage Report',
              ].map((topic, i) => (
                <button
                  key={i}
                  className="glass-panel p-4 text-left hover:border-primary transition-colors"
                  onClick={() => {
                    const newExp: Experiment = {
                      id: Date.now().toString(),
                      name: topic,
                      status: 'running',
                      progress: 0,
                      startTime: 'Just now',
                    };
                    setExperiments([newExp, ...experiments]);
                  }}
                >
                  <div className="text-2xl mb-2">🔬</div>
                  <div className="text-sm font-medium text-text-primary">{topic}</div>
                  <div className="text-xs text-text-muted mt-1">Click to start</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
