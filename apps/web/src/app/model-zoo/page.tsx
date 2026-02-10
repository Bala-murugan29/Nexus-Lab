'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Model {
  id: string;
  name: string;
  type: string;
  size: string;
  accuracy: number;
  latency: number;
  status: 'active' | 'training' | 'idle';
  description: string;
}

export default function ModelZooPage() {
  const [models] = useState<Model[]>([
    {
      id: '1',
      name: 'CodeBERT-v2',
      type: 'Transformer',
      size: '340M params',
      accuracy: 94.2,
      latency: 12,
      status: 'active',
      description: 'Pre-trained model for code understanding and generation',
    },
    {
      id: '2',
      name: 'Neural Architect',
      type: 'GAN',
      size: '180M params',
      accuracy: 87.5,
      latency: 8,
      status: 'active',
      description: 'Generates optimal software architecture patterns',
    },
    {
      id: '3',
      name: 'Bug Predictor',
      type: 'CNN-LSTM',
      size: '95M params',
      accuracy: 91.8,
      latency: 5,
      status: 'training',
      description: 'Predicts potential bugs before they occur',
    },
    {
      id: '4',
      name: 'Performance Optimizer',
      type: 'RL Agent',
      size: '120M params',
      accuracy: 88.3,
      latency: 15,
      status: 'active',
      description: 'Reinforcement learning model for code optimization',
    },
    {
      id: '5',
      name: 'Security Scanner',
      type: 'Transformer',
      size: '250M params',
      accuracy: 96.1,
      latency: 20,
      status: 'idle',
      description: 'Detects security vulnerabilities in code',
    },
    {
      id: '6',
      name: 'Test Generator',
      type: 'Seq2Seq',
      size: '150M params',
      accuracy: 85.7,
      latency: 10,
      status: 'active',
      description: 'Automatically generates unit tests for functions',
    },
  ]);

  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'training' | 'idle'>('all');

  const filteredModels = filter === 'all' 
    ? models 
    : models.filter(m => m.status === filter);

  return (
    <div className="h-screen w-full bg-background flex flex-col">
      {/* Header */}
      <header className="h-16 border-b border-border bg-background-secondary px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-primary hover:text-primary-light">
            ← Back to Workspace
          </Link>
          <div className="h-6 w-px bg-border" />
          <h1 className="text-xl font-semibold text-text-primary">Model Zoo</h1>
        </div>
        <div className="flex items-center gap-2">
          {['all', 'active', 'training', 'idle'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status as any)}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                filter === status
                  ? 'bg-primary text-white'
                  : 'bg-background-tertiary text-text-muted hover:text-text-primary'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Models Grid */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto">
            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 mb-8">
              <div className="glass-panel p-4">
                <div className="text-3xl font-bold text-primary">{models.length}</div>
                <div className="text-sm text-text-muted mt-1">Total Models</div>
              </div>
              <div className="glass-panel p-4">
                <div className="text-3xl font-bold text-accent-green">
                  {models.filter(m => m.status === 'active').length}
                </div>
                <div className="text-sm text-text-muted mt-1">Active</div>
              </div>
              <div className="glass-panel p-4">
                <div className="text-3xl font-bold text-accent-blue">
                  {Math.round(models.reduce((sum, m) => sum + m.accuracy, 0) / models.length)}%
                </div>
                <div className="text-sm text-text-muted mt-1">Avg Accuracy</div>
              </div>
              <div className="glass-panel p-4">
                <div className="text-3xl font-bold text-accent-purple">
                  {Math.round(models.reduce((sum, m) => sum + m.latency, 0) / models.length)}ms
                </div>
                <div className="text-sm text-text-muted mt-1">Avg Latency</div>
              </div>
            </div>

            {/* Models Grid */}
            <div className="grid grid-cols-2 gap-4">
              {filteredModels.map((model) => (
                <div
                  key={model.id}
                  className="glass-panel p-6 cursor-pointer hover:border-primary transition-all"
                  onClick={() => setSelectedModel(model)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-text-primary">{model.name}</h3>
                      <p className="text-sm text-text-muted">{model.type}</p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        model.status === 'active'
                          ? 'bg-accent-green/20 text-accent-green'
                          : model.status === 'training'
                          ? 'bg-accent-yellow/20 text-accent-yellow'
                          : 'bg-text-muted/20 text-text-muted'
                      }`}
                    >
                      {model.status.toUpperCase()}
                    </span>
                  </div>

                  <p className="text-sm text-text-secondary mb-4">{model.description}</p>

                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div className="text-center p-2 bg-background-tertiary rounded">
                      <div className="text-text-muted text-xs mb-1">Size</div>
                      <div className="text-text-primary font-semibold">{model.size}</div>
                    </div>
                    <div className="text-center p-2 bg-background-tertiary rounded">
                      <div className="text-text-muted text-xs mb-1">Accuracy</div>
                      <div className="text-accent-green font-semibold">{model.accuracy}%</div>
                    </div>
                    <div className="text-center p-2 bg-background-tertiary rounded">
                      <div className="text-text-muted text-xs mb-1">Latency</div>
                      <div className="text-accent-blue font-semibold">{model.latency}ms</div>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button className="flex-1 btn-primary text-sm">Deploy</button>
                    <button className="btn-secondary text-sm">⚙️</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Model Details Panel */}
        {selectedModel && (
          <div className="w-96 border-l border-border bg-background-secondary p-6 overflow-y-auto">
            <button
              onClick={() => setSelectedModel(null)}
              className="text-text-muted hover:text-text-primary mb-4"
            >
              ✕ Close
            </button>

            <h2 className="text-2xl font-bold text-text-primary mb-2">{selectedModel.name}</h2>
            <div className="inline-block px-3 py-1 bg-primary/20 text-primary rounded text-sm mb-4">
              {selectedModel.type}
            </div>

            <p className="text-sm text-text-secondary mb-6">{selectedModel.description}</p>

            <div className="space-y-4">
              <div>
                <div className="text-sm text-text-muted mb-2">Model Size</div>
                <div className="text-lg font-semibold text-text-primary">{selectedModel.size}</div>
              </div>

              <div>
                <div className="text-sm text-text-muted mb-2">Accuracy</div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-background-tertiary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent-green rounded-full"
                      style={{ width: `${selectedModel.accuracy}%` }}
                    />
                  </div>
                  <span className="text-lg font-bold text-accent-green">{selectedModel.accuracy}%</span>
                </div>
              </div>

              <div>
                <div className="text-sm text-text-muted mb-2">Latency</div>
                <div className="text-lg font-semibold text-text-primary">{selectedModel.latency}ms</div>
              </div>

              <div>
                <div className="text-sm text-text-muted mb-2">Status</div>
                <span
                  className={`inline-block px-3 py-1 rounded text-sm font-semibold ${
                    selectedModel.status === 'active'
                      ? 'bg-accent-green/20 text-accent-green'
                      : selectedModel.status === 'training'
                      ? 'bg-accent-yellow/20 text-accent-yellow'
                      : 'bg-text-muted/20 text-text-muted'
                  }`}
                >
                  {selectedModel.status.toUpperCase()}
                </span>
              </div>

              <div className="pt-4 space-y-2">
                <button className="w-full btn-primary">Deploy Model</button>
                <button className="w-full btn-secondary">View Metrics</button>
                <button className="w-full btn-secondary">Fine-tune</button>
                <button className="w-full btn-secondary text-accent-red">Delete Model</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
