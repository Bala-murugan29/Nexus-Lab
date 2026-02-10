'use client';

interface HeaderProps {
  projectName: string;
  fileName: string;
}

export function Header({ projectName, fileName }: HeaderProps) {
  return (
    <header className="h-14 border-b border-border px-6 flex items-center justify-between bg-background-secondary">
      <div className="flex items-center gap-4">
        <span className="text-text-muted text-sm">{projectName}</span>
        <span className="text-text-muted">/</span>
        <span className="text-text-primary font-medium">{fileName}</span>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search cognitive assets..."
            className="w-80 px-4 py-2 bg-background-tertiary border border-border rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary"
          />
          <span className="absolute right-3 top-2.5 text-text-muted">🔍</span>
        </div>

        <button className="p-2 hover:bg-background-tertiary rounded-lg transition-colors">
          <span className="text-text-secondary text-xl">🔔</span>
        </button>

        <button className="p-2 hover:bg-background-tertiary rounded-lg transition-colors">
          <span className="text-text-secondary text-xl">⚙️</span>
        </button>

        <button className="btn-primary flex items-center gap-2">
          <span>🚀</span>
          <span>Deploy Node</span>
        </button>
      </div>
    </header>
  );
}
