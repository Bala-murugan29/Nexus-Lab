'use client';

import { motion } from 'framer-motion';
import { useUserProfile } from '@/hooks/useUserProfile';

interface ProfileDashboard {
  user: {
    id: string;
    email: string;
    name: string | null;
    createdAt: string;
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
  productivityData: Array<{
    id: string;
    date: string;
    efficiencyScore: number;
    taskMetrics: any;
    focusMetrics: any;
  }>;
  learningGoals: Array<{
    id: string;
    concept: string;
    targetMastery: number;
    progress: number;
    deadline: string | null;
  }>;
}

export function UserDashboard() {
  const { profile, loading, error } = useUserProfile();

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
        <p className="text-red-400">{error || 'Failed to load dashboard'}</p>
      </div>
    );
  }

  const { stats, productivityData, learningGoals } = profile;

  // Calculate weekly stats
  const weeklyData = productivityData.slice(0, 7).map(data => {
    const focusMetrics = typeof data.focusMetrics === 'string' 
      ? JSON.parse(data.focusMetrics) 
      : data.focusMetrics;
    const taskMetrics = typeof data.taskMetrics === 'string' 
      ? JSON.parse(data.taskMetrics) 
      : data.taskMetrics;
    return {
      focusTime: focusMetrics?.totalMinutes || 0,
      tasks: taskMetrics?.completed || 0,
      date: data.date,
    };
  });
  
  const weeklyFocusTime = weeklyData.reduce((sum, data) => sum + data.focusTime, 0);
  const weeklyTasks = weeklyData.reduce((sum, data) => sum + data.tasks, 0);
  const avgDailyFocusTime = weeklyFocusTime > 0 ? Math.round(weeklyFocusTime / 7) : 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-accent-blue/20 to-accent-purple/20 border border-accent-blue/30 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-text-primary mb-2">
          Welcome back, {profile.user.name || 'User'}! 👋
        </h2>
        <p className="text-text-muted">Here's your learning and productivity overview</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Daily Focus Time"
          value={`${avgDailyFocusTime}m`}
          subtitle="This week"
          color="blue"
          icon="⏱️"
        />
        <MetricCard
          title="Tasks Completed"
          value={weeklyTasks}
          subtitle="This week"
          color="green"
          icon="✅"
        />
        <MetricCard
          title="Knowledge Areas"
          value={stats.knowledgeNodeCount}
          subtitle={`${Math.round(stats.averageMasteryLevel * 100)}% average mastery`}
          color="purple"
          icon="🧠"
        />
        <MetricCard
          title="Learning Goals"
          value={`${stats.completedGoals}/${stats.learningGoalsCount}`}
          subtitle="Completed"
          color="cyan"
          icon="🎯"
        />
      </div>

      {/* Productivity Trend */}
      <div className="bg-background/50 border border-accent-green/20 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Weekly Productivity</h3>
        <div className="space-y-4">
          {/* Focus Time Chart */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-text-muted">Focus Time (minutes)</span>
              <span className="text-sm font-semibold text-accent-green">{weeklyFocusTime}m total</span>
            </div>
            <div className="flex gap-1 h-32">
              {weeklyData.map((data, index) => {
                const maxFocusTime = Math.max(...weeklyData.map(d => d.focusTime), 1);
                const height = (data.focusTime / maxFocusTime) * 100;
                const date = new Date(data.date);
                const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                
                return (
                  <motion.div
                    key={index}
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ delay: index * 0.05 }}
                    className="flex-1 flex flex-col items-center justify-end"
                  >
                    <div className="w-full bg-gradient-to-t from-accent-green to-accent-green/50 rounded-t group relative cursor-pointer">
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-background border border-accent-green rounded px-2 py-1 text-xs text-text-primary whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                        {data.focusTime}m
                      </div>
                    </div>
                    <span className="text-xs text-text-muted mt-2">{dayName}</span>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Tasks Chart */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-text-muted">Tasks Completed</span>
              <span className="text-sm font-semibold text-accent-blue">{weeklyTasks} total</span>
            </div>
            <div className="flex gap-1 h-24">
              {weeklyData.map((data, index) => {
                const maxTasks = Math.max(...weeklyData.map(d => d.tasks), 1);
                const height = (data.tasks / maxTasks) * 100;
                
                return (
                  <motion.div
                    key={index}
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ delay: index * 0.05 }}
                    className="flex-1 bg-gradient-to-t from-accent-blue to-accent-blue/50 rounded-t group relative cursor-pointer"
                  >
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-background border border-accent-blue rounded px-2 py-1 text-xs text-text-primary whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                      {data.tasks}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Learning Goals Progress */}
      {learningGoals.length > 0 && (
        <div className="bg-background/50 border border-accent-purple/20 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Learning Goals</h3>
          <div className="space-y-4">
            {learningGoals.map((goal, index) => (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="text-sm font-medium text-text-primary">{goal.concept}</h4>
                    <p className="text-xs text-text-muted">
                      {goal.progress >= goal.targetMastery ? '✓ Completed' : 
                       goal.progress > 0 ? 'In progress' : 'Not started'}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-accent-purple">
                    {Math.round((goal.progress / goal.targetMastery) * 100)}%
                  </span>
                </div>
                <div className="w-full h-2 bg-background rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.round((goal.progress / goal.targetMastery) * 100)}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className={`h-full rounded-full ${
                      goal.progress >= goal.targetMastery
                        ? 'bg-accent-green'
                        : 'bg-gradient-to-r from-accent-purple to-accent-blue'
                    }`}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatBoxCard
          title="Total Focus Time"
          value={`${Math.round(stats.totalFocusTime / 60)}h`}
          description="Cumulative focus sessions"
          gradient="from-accent-blue to-accent-cyan"
        />
        <StatBoxCard
          title="All-Time Tasks"
          value={stats.totalTasksCompleted}
          description="Tasks you've completed"
          gradient="from-accent-green to-accent-cyan"
        />
        <StatBoxCard
          title="Active Projects"
          value={stats.totalProjects}
          description="Projects in progress"
          gradient="from-accent-purple to-accent-blue"
        />
      </div>
    </motion.div>
  );
}

function MetricCard({
  title,
  value,
  subtitle,
  color,
  icon,
}: {
  title: string;
  value: string | number;
  subtitle: string;
  color: 'blue' | 'green' | 'purple' | 'cyan';
  icon: string;
}) {
  const colorClasses = {
    blue: 'from-accent-blue/20 to-accent-blue/5 border-accent-blue/30',
    green: 'from-accent-green/20 to-accent-green/5 border-accent-green/30',
    purple: 'from-accent-purple/20 to-accent-purple/5 border-accent-purple/30',
    cyan: 'from-accent-cyan/20 to-accent-cyan/5 border-accent-cyan/30',
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`bg-gradient-to-br ${colorClasses[color]} border rounded-lg p-4`}
    >
      <div className="text-2xl mb-2">{icon}</div>
      <p className="text-xs text-text-muted uppercase tracking-wider mb-1">{title}</p>
      <p className="text-2xl font-bold text-text-primary mb-1">{value}</p>
      <p className="text-xs text-text-muted">{subtitle}</p>
    </motion.div>
  );
}

function StatBoxCard({
  title,
  value,
  description,
  gradient,
}: {
  title: string;
  value: string | number;
  description: string;
  gradient: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`bg-gradient-to-br ${gradient} bg-opacity-10 border border-text-muted/20 rounded-lg p-6 text-center`}
    >
      <p className="text-xs text-text-muted uppercase tracking-wider mb-2">{title}</p>
      <p className="text-3xl font-bold text-text-primary mb-2">{value}</p>
      <p className="text-xs text-text-muted">{description}</p>
    </motion.div>
  );
}
