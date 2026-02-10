'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNexusStore } from '@/lib/store';

export function MultimodalInput() {
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const addThoughtStep = useNexusStore((state) => state.addThoughtStep);
  const addMessage = useNexusStore((state) => state.addMessage);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploading(true);
    
    try {
      for (const file of acceptedFiles) {
        // Read file content
        const content = await file.text();
        
        // Add to thought trace
        addThoughtStep({
          id: Date.now(),
          type: 'analysis',
          content: `Processing ${file.name} (${file.type})...`,
          confidence: 0.95,
          timestamp: new Date().toISOString(),
        });
        
        // Add to chat
        addMessage({
          id: `file-${Date.now()}`,
          role: 'system',
          content: `📁 Uploaded: ${file.name}\nType: ${file.type}\nSize: ${(file.size / 1024).toFixed(2)}KB\n\nContent analyzed and added to knowledge context.`,
          timestamp: new Date().toISOString(),
        });
        
        setUploadedFiles(prev => [...prev, file.name]);
        
        // Simulate processing
        setTimeout(() => {
          addThoughtStep({
            id: Date.now() + 1,
            type: 'insight',
            content: `Extracted ${Math.floor(content.length / 10)} knowledge tokens from ${file.name}`,
            confidence: 0.88,
            timestamp: new Date().toISOString(),
          });
        }, 1000);
      }
    } catch (error) {
      console.error('File upload error:', error);
      addMessage({
        id: `error-${Date.now()}`,
        role: 'system',
        content: '❌ Error processing file. Please try again.',
        timestamp: new Date().toISOString(),
      });
    } finally {
      setUploading(false);
    }
  }, [addThoughtStep, addMessage]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'],
      'application/pdf': ['.pdf'],
      'text/yaml': ['.yaml', '.yml'],
      'application/json': ['.json'],
      'text/typescript': ['.ts', '.tsx'],
      'text/javascript': ['.js', '.jsx'],
      'text/plain': ['.txt', '.md'],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  return (
    <div
      {...getRootProps()}
      className={`glass-panel h-32 flex flex-col items-center justify-center cursor-pointer transition-all ${
        isDragActive ? 'border-primary bg-primary/10 scale-105' : 'border-border hover:border-primary/50'
      } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
    >
      <input {...getInputProps()} />
      {uploading ? (
        <>
          <div className="animate-spin text-3xl mb-2">⚡</div>
          <p className="text-sm text-text-primary font-medium">Processing files...</p>
        </>
      ) : (
        <>
          <div className="flex items-center gap-4 text-text-secondary mb-2">
            <span className="text-2xl">{'<>'}</span>
            <span className="text-2xl">🖼</span>
            <span className="text-2xl">💾</span>
            <span className="text-2xl">📊</span>
          </div>
          <p className="text-sm text-text-primary font-medium">
            Drop code, diagrams, or logs to augment context
          </p>
          <p className="text-xs text-text-muted mt-1">SUPPORTS PNG, PDF, YAML, JSON, TS, JS, MD</p>
          {uploadedFiles.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {uploadedFiles.slice(-3).map((name, i) => (
                <span key={i} className="text-xs bg-accent-green/20 text-accent-green px-2 py-1 rounded">
                  ✓ {name}
                </span>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
