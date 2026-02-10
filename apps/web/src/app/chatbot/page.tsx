'use client';

import { useState } from 'react';
import Chatbot from '@/components/workspace/Chatbot';

export default function ChatbotPage() {
  return (
    <div className="h-screen w-full bg-background-primary">
      <Chatbot />
    </div>
  );
}
