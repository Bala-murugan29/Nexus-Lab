'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export function ProfileHeader() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('Starting logout...');
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Logout response:', response.status);

      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        const redirectUrl = typeof data.redirectUrl === 'string' ? data.redirectUrl : '/login';
        console.log('Logout successful, redirecting...');
        // Add a small delay to ensure cookies are cleared
        await new Promise((resolve) => setTimeout(resolve, 100));
        router.push(redirectUrl);
      } else {
        setError(data.error || 'Failed to logout');
        console.error('Logout failed:', data);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      setError(message);
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border-b border-accent-blue/20 bg-gradient-to-b from-background to-background/50 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm"
          >
            {error}
          </motion.div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Back Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.back()}
              disabled={isLoading}
              className="p-2 rounded-lg hover:bg-background-tertiary transition-colors text-text-primary disabled:opacity-50 disabled:cursor-not-allowed"
              title="Go back"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </motion.button>

            {/* Title */}
            <div>
              <h1 className="text-3xl font-bold text-text-primary">Profile</h1>
              <p className="text-sm text-text-muted">View and manage your account</p>
            </div>
          </div>

          {/* Logout Button */}
          <motion.button
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
            onClick={handleLogout}
            disabled={isLoading}
            className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors border border-red-500/30 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" />
                Logging out...
              </>
            ) : (
              'Logout'
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
