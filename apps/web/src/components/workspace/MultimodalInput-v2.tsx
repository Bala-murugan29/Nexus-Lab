'use client';

import { useState } from 'react';
import { useDropzone } from 'react-dropzone';

export function MultimodalInput() {
  const [isProcessing, setIsProcessing] = useState(false);

  const onDrop = async (acceptedFiles: File[]) => {
    setIsProcessing(true);
    
    try {
      for (const file of acceptedFiles) {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch('/api/input/process', {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) {
          throw new Error('Failed to process file');
        }
        
        const result = await response.json();
        console.log('Processed:', result);
      }
    } catch (error) {
      console.error('Error processing files:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'],
      'application/pdf': ['.pdf'],
      'text/yaml': ['.yaml', '.yml'],
      'application/json': ['.json'],
      'text/typescript': ['.ts', '.tsx'],
      'text/javascript': ['.js', '.jsx'],
    },
  });

  return (
    <div
      {...getRootProps()}
      className={`glass-panel h-32 flex flex-col items-center justify-center cursor-pointer transition-all ${
        isDragActive ? 'border-primary bg-primary/10 scale-105' : 'border-border hover:border-primary/50'
      } ${isProcessing ? 'opacity-50 cursor-wait' : ''}`}
    >
      <input {...getInputProps()} disabled={isProcessing} />
      <div className="flex items-center gap-4 text-text-secondary mb-2">
        <span className="text-2xl">{'<>'}</span>
        <span className="text-2xl">🖼</span>
        <span className="text-2xl">💾</span>
      </div>
      {isProcessing ? (
        <p className="text-sm text-primary font-medium animate-pulse">Processing...</p>
      ) : (
        <>
          <p className="text-sm text-text-primary font-medium">
            Drop code, diagrams, or logs to augment context
          </p>
          <p className="text-xs text-text-muted mt-1">SUPPORTS PNG, PDF, YAML, JSON, TS</p>
        </>
      )}
    </div>
  );
}
