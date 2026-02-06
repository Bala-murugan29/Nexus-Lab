'use client';

import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { useNexusStore } from '@/lib/store';
import { useWebSocket } from '@/hooks/useWebSocket';

interface CodeEditorProps {
  fileName: string;
  onFileChange: (fileName: string) => void;
}

export function CodeEditor({ fileName, onFileChange }: CodeEditorProps) {
  const files = useNexusStore((state) => state.files);
  const updateFileContent = useNexusStore((state) => state.updateFileContent);
  const isProcessing = useNexusStore((state) => state.isProcessing);
  const { sendCodeChange, isConnected } = useWebSocket();
  
  const currentFile = files.find(f => f.name === fileName) || files[0];
  const [localContent, setLocalContent] = useState(currentFile?.content || '');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    if (currentFile) {
      setLocalContent(currentFile.content);
      setHasUnsavedChanges(false);
    }
  }, [currentFile]);

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setLocalContent(value);
      setHasUnsavedChanges(true);
      
      // Send code to analysis engine with debounce
      const debounceTimer = setTimeout(() => {
        sendCodeChange(value);
      }, 1000);
      
      return () => clearTimeout(debounceTimer);
    }
  };

  const handleSave = () => {
    if (currentFile) {
      updateFileContent(currentFile.id, localContent);
      setHasUnsavedChanges(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [localContent, currentFile]);

  return (
    <div className="flex-1 glass-panel overflow-hidden flex flex-col">
      {/* Editor Header */}
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <select
            value={currentFile?.name || ''}
            onChange={(e) => onFileChange(e.target.value)}
            className="bg-background-tertiary text-text-primary px-3 py-1 rounded border border-border text-sm"
          >
            {files.map((file) => (
              <option key={file.id} value={file.name}>
                {file.name} {file.modified ? '●' : ''}
              </option>
            ))}
          </select>
          <span className="px-2 py-1 text-xs bg-accent-blue/20 text-accent-blue rounded">
            AUTO-SYNC
          </span>
          {hasUnsavedChanges && (
            <span className="text-accent-yellow text-xs">●</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isProcessing && (
            <span className="text-accent-blue text-xs animate-pulse">Analyzing...</span>
          )}
          <button 
            onClick={handleSave}
            disabled={!hasUnsavedChanges}
            className="text-primary hover:text-primary-light text-sm disabled:opacity-30"
          >
            💾
          </button>
        </div>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1 overflow-hidden">
        <Editor
          height="100%"
          language={currentFile?.language || 'typescript'}
          value={localContent}
          onChange={handleEditorChange}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: 'Fira Code, monospace',
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            padding: { top: 16, bottom: 16 },
            wordWrap: 'on',
          }}
          beforeMount={(monaco) => {
            monaco.editor.defineTheme('nexus-dark', {
              base: 'vs-dark',
              inherit: true,
              rules: [
                { token: 'comment', foreground: '6b7280', fontStyle: 'italic' },
                { token: 'keyword', foreground: '8b5cf6' },
                { token: 'string', foreground: '10b981' },
                { token: 'number', foreground: 'f59e0b' },
              ],
              colors: {
                'editor.background': '#1a1f2e',
                'editor.foreground': '#e5e7eb',
                'editor.lineHighlightBackground': '#0f1419',
                'editorLineNumber.foreground': '#6b7280',
                'editor.selectionBackground': '#3b82f640',
              },
            });
          }}
          onMount={(editor, monaco) => {
            monaco.editor.setTheme('nexus-dark');
          }}
        />
      </div>

      {/* Status Bar */}
      <div className="px-4 py-2 border-t border-border flex items-center justify-between text-xs">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-accent-green' : 'bg-accent-red'} animate-pulse`} />
            <span className={isConnected ? 'text-accent-green' : 'text-accent-red'}>
              {isConnected ? 'Neural Engine Active' : 'Engine Offline'}
            </span>
          </span>
          <span className="text-text-muted">main*</span>
        </div>
        <div className="flex items-center gap-4 text-text-muted">
          <span>Ln 24, Col 12</span>
          <span>UTF-8</span>
          <span>TypeScript React</span>
        </div>
      </div>
    </div>
  );
}
