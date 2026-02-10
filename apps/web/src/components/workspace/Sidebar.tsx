'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useNexusStore } from '@/lib/store';

interface SidebarProps {
  activeProject: string;
  onProjectChange: (project: string) => void;
}

export function Sidebar({ activeProject, onProjectChange }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const projects = useNexusStore((state) => state.projects);
  const metrics = useNexusStore((state) => state.metrics);
  const router = useRouter();

  const navItems = [
    { icon: '▶', label: 'Workspace', active: true, path: '/' },
    { icon: '◆', label: 'Knowledge Graph', active: false, path: '/knowledge-graph' },
    { icon: '⚗', label: 'Research Lab', active: false, path: '/research-lab' },
    { icon: '◇', label: 'Model Zoo', active: false, path: '/model-zoo' },
  ];

  return (
    <motion.div
      initial={false}
      animate={{ width: collapsed ? 60 : 240 }}
      className="bg-background-secondary border-r border-border flex flex-col h-full"
    >
      {/* Logo */}
      <div className="p-4 border-b border-border flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-xl">N</span>
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <div className="text-text-primary font-semibold">NEXUS.LAB</div>
            <div className="text-text-muted text-xs uppercase tracking-wider">Cognitive Engine</div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6">
        {navItems.map((item, index) => (
          <button
            key={index}
            onClick={() => router.push(item.path)}
            className={cn(
              'w-full px-4 py-3 flex items-center gap-3 hover:bg-background-tertiary transition-colors',
              item.active && 'bg-background-tertiary border-l-2 border-primary'
            )}
            className={cn(
              'w-full px-4 py-3 flex items-center gap-3 hover:bg-background-tertiary transition-colors',
              item.active && 'bg-background-tertiary border-l-2 border-primary'
            )}
          >
            <span className="text-primary text-xl">{item.icon}</span>
            {!collapsed && (
              <span className={cn(
                'text-sm font-medium',
                item.active ? 'text-primary' : 'text-text-secondary'
              )}>
                {item.label}
              </span>
            )}
          </button>
        ))}

        {!collapsed && (
          <div className="mt-8 px-4">
            <div className="text-text-muted text-xs uppercase tracking-wider mb-3">Projects</div>
            {projects.map((project, index) => (
              <button
                key={index}
                onClick={() => onProjectChange(project.name)}
                className={cn(
                  "w-full px-3 py-2 flex items-center gap-2 hover:bg-background-tertiary rounded-lg transition-colors mb-1",
                  project.name === activeProject && "bg-background-tertiary"
                )}
              >
                <div className={cn('w-2 h-2 rounded-full', project.color)} />
                <span className="text-sm text-text-primary">{project.name}</span>
              </button>
            ))}
            <button className="w-full px-3 py-2 flex items-center gap-2 hover:bg-background-tertiary rounded-lg transition-colors text-text-muted text-sm">
              <span>+</span>
              <span>New Project</span>
            </button>
          </div>
        )}
      </nav>

      {/* Metrics Dashboard */}
      {!collapsed && (
        <div className="px-4 pb-4">
          <div className="glass-panel p-3">
            <div className="text-xs font-semibold text-text-primary mb-2">TODAY'S METRICS</div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-muted">Focus Score</span>
                <span className="text-accent-green font-semibold">{metrics.focusScore}%</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-muted">Tasks</span>
                <span className="text-accent-blue font-semibold">{metrics.tasksCompleted}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-muted">Efficiency</span>
                <span className="text-accent-purple font-semibold">{metrics.efficiencyScore}%</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-muted">Learning</span>
                <span className="text-accent-cyan font-semibold">{metrics.learningVelocity}%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Session Button */}
      <div className="p-4">
        <button className="w-full btn-primary flex items-center justify-center gap-2">
          <span>+</span>
          {!collapsed && <span>New Session</span>}
        </button>
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-border flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center flex-shrink-0">
          <span className="text-white font-semibold">DA</span>
        </div>
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-text-primary">Dr. Aris</div>
            <div className="text-xs text-text-muted">Premium Mode</div>
          </div>
        )}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="text-text-muted hover:text-text-primary transition-colors"
        >
          {collapsed ? '→' : '←'}
        </button>
      </div>
    </motion.div>
  );
}
