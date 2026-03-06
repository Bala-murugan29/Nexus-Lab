'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useUserProfile } from '@/hooks/useUserProfile';

export function UserProfileCard() {
  const { profile, loading, error, updateProfile } = useUserProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');

  const handleSaveName = async () => {
    if (!editName.trim()) return;
    const success = await updateProfile(editName);
    if (success) {
      setIsEditing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-blue"></div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="p-6 bg-red-500/10 border border-red-500 rounded-lg">
        <p className="text-red-400">{error || 'Failed to load profile'}</p>
      </div>
    );
  }

  const { user, stats } = profile;
  const initials = user.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase() || user.email[0].toUpperCase();

  const memberSinceMonths = Math.floor(
    (Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24 * 30)
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header Card */}
      <div className="bg-gradient-to-br from-accent-blue/20 to-accent-purple/20 border border-accent-blue/30 rounded-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-16 h-16 rounded-full bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center flex-shrink-0"
            >
              <span className="text-2xl font-bold text-white">{initials}</span>
            </motion.div>
            <div>
              {isEditing ? (
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveName();
                      if (e.key === 'Escape') setIsEditing(false);
                    }}
                    className="px-3 py-1 bg-background border border-accent-blue rounded text-text-primary"
                    autoFocus
                  />
                  <button
                    onClick={handleSaveName}
                    className="px-3 py-1 bg-accent-blue text-white rounded text-sm hover:bg-accent-blue/80"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-3 py-1 bg-text-muted/20 text-text-muted rounded text-sm hover:bg-text-muted/40"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-2xl font-bold text-text-primary">
                    {user.name || 'User'}
                  </h1>
                  <button
                    onClick={() => {
                      setEditName(user.name || '');
                      setIsEditing(true);
                    }}
                    className="text-text-muted hover:text-accent-blue transition-colors text-xs"
                  >
                    Edit
                  </button>
                </div>
              )}
              <p className="text-text-muted text-sm">{user.email}</p>
            </div>
          </div>
        </div>
        <div className="flex gap-4 text-sm text-text-muted">
          <span>Member for {memberSinceMonths} months</span>
          <span>•</span>
          <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Total Projects"
          value={stats.totalProjects}
          icon="📁"
        />
        <StatCard
          label="Active Sessions"
          value={stats.activeSessions}
          icon="⏱️"
        />
        <StatCard
          label="Tasks Completed"
          value={stats.totalTasksCompleted}
          icon="✅"
        />
        <StatCard
          label="Learning Goals"
          value={`${stats.completedGoals}/${stats.learningGoalsCount}`}
          icon="🎯"
        />
      </div>

      {/* Knowledge & Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-background/50 border border-accent-blue/20 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
            <span>🧠</span> Knowledge
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">Knowledge Areas</span>
              <span className="text-accent-blue font-semibold">
                {stats.knowledgeNodeCount}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">Avg. Mastery Level</span>
              <span className="text-accent-purple font-semibold">
                {Math.round(stats.averageMasteryLevel * 100)}%
              </span>
            </div>
          </div>
        </div>

        <div className="bg-background/50 border border-accent-green/20 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
            <span>⚡</span> Productivity
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">Total Focus Time</span>
              <span className="text-accent-green font-semibold">
                {Math.round(stats.totalFocusTime / 60)}h
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">Tasks This Week</span>
              <span className="text-accent-green font-semibold">
                {stats.totalTasksCompleted}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Knowledge Areas */}
      {profile.topKnowledgeAreas.length > 0 && (
        <div className="bg-background/50 border border-accent-blue/20 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-text-primary mb-4">
            Top Knowledge Areas
          </h3>
          <div className="space-y-3">
            {profile.topKnowledgeAreas.slice(0, 5).map((area, index) => (
              <motion.div
                key={`${area.concept}-${index}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="space-y-1"
              >
                <div className="flex justify-between items-center text-sm mb-1">
                  <span className="text-text-muted">{area.concept}</span>
                  <span className="text-xs font-semibold text-accent-blue">
                    {Math.round(area.masteryLevel * 100)}%
                  </span>
                </div>
                <div className="w-full h-2 bg-background rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.round(area.masteryLevel * 100)}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-accent-blue to-accent-purple rounded-full"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Projects */}
      {profile.recentProjects.length > 0 && (
        <div className="bg-background/50 border border-accent-purple/20 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-text-primary mb-4">
            Recent Projects
          </h3>
          <div className="space-y-2">
            {profile.recentProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-2 bg-background rounded hover:bg-accent-blue/10 transition-colors"
              >
                <span className="text-sm text-text-primary">{project.name}</span>
                <span className={`text-xs px-2 py-1 rounded ${
                  project.status === 'active'
                    ? 'bg-accent-green/20 text-accent-green'
                    : 'bg-text-muted/20 text-text-muted'
                }`}>
                  {project.status}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-gradient-to-br from-background to-background/50 border border-accent-blue/20 rounded-lg p-4 text-center hover:border-accent-blue/50 transition-colors"
    >
      <div className="text-2xl mb-2">{icon}</div>
      <p className="text-2xl font-bold text-text-primary mb-1">{value}</p>
      <p className="text-xs text-text-muted">{label}</p>
    </motion.div>
  );
}
