"use client";

interface TaskCounterProps {
  counts: { all: number; pending: number; completed: number };
}

export function TaskCounter({ counts }: TaskCounterProps) {
  const percentage = counts.all > 0 ? Math.round((counts.completed / counts.all) * 100) : 0;

  return (
    <div className="flex flex-wrap items-center gap-6">
      <div>
        <p className="text-3xl font-bold text-slate-900 dark:text-white">{counts.all}</p>
        <p className="text-sm text-slate-400 dark:text-white/40">Total</p>
      </div>
      <div className="h-10 w-px bg-slate-200 dark:bg-white/10" />
      <div>
        <p className="text-3xl font-bold text-amber-500 dark:text-amber-400">{counts.pending}</p>
        <p className="text-sm text-slate-400 dark:text-white/40">Pendentes</p>
      </div>
      <div className="h-10 w-px bg-slate-200 dark:bg-white/10" />
      <div>
        <p className="text-3xl font-bold text-emerald-500 dark:text-emerald-400">{counts.completed}</p>
        <p className="text-sm text-slate-400 dark:text-white/40">Concluídas</p>
      </div>
      {counts.all > 0 && (
        <>
          <div className="h-10 w-px bg-slate-200 dark:bg-white/10" />
          <div className="flex items-center gap-3">
            <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-500"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <span className="text-sm font-medium text-slate-500 dark:text-white/60">{percentage}%</span>
          </div>
        </>
      )}
    </div>
  );
}
