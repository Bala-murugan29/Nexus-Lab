import { useEffect, useState, useCallback } from 'react';

export interface UserProfile {
  user: {
    id: string;
    email: string;
    name: string | null;
    createdAt: string;
    updatedAt: string;
  };
  stats: {
    totalProjects: number;
    activeSessions: number;
    totalFocusTime: number;
    totalTasksCompleted: number;
    knowledgeNodeCount: number;
    averageMasteryLevel: number;
    learningGoalsCount: number;
    completedGoals: number;
  };
  recentProjects: Array<{
    id: string;
    name: string;
    status: string;
    createdAt: string;
  }>;
  topKnowledgeAreas: Array<{
    concept: string;
    masteryLevel: number;
    category: string;
  }>;
  learningGoals: Array<{
    id: string;
    concept: string;
    targetMastery: number;
    progress: number;
    deadline: string | null;
  }>;
  productivityData: Array<{
    id: string;
    date: string;
    efficiencyScore: number;
    taskMetrics: any;
    focusMetrics: any;
  }>;
}

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/user/profile');
      if (!response.ok) {
        throw new Error(`Failed to fetch profile: ${response.statusText}`);
      }
      const data = await response.json();
      setProfile(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      console.error('Error fetching user profile:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfile = useCallback(async (name: string) => {
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      await fetchProfile();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    }
  }, [fetchProfile]);

  const refreshProfile = useCallback(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    loading,
    error,
    updateProfile,
    refreshProfile,
  };
}
