import { UserDashboard } from '@/components/workspace/UserDashboard';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-accent-blue/20 bg-gradient-to-b from-background to-background/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold text-text-primary mb-2">Dashboard</h1>
          <p className="text-text-muted">Monitor your learning progress and productivity</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <UserDashboard />
      </div>
    </div>
  );
}
