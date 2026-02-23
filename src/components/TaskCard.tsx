"use client";

import { Task } from "@/types/task";

const priorityConfig = {
  low: { label: "Baixa", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  medium: { label: "Média", color: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
  high: { label: "Alta", color: "bg-rose-500/20 text-rose-400 border-rose-500/30" },
};

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TaskCard({ task, onToggle, onDelete }: TaskCardProps) {
  const priority = priorityConfig[task.priority];
  const isCompleted = task.status === "completed";

  return (
    <div
      className={`group relative rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/[0.07] ${
        isCompleted ? "opacity-60" : ""
      }`}
    >
      <div className="flex items-start gap-4">
        <button
          onClick={() => onToggle(task.id)}
          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
            isCompleted
              ? "border-violet-500 bg-violet-500"
              : "border-white/30 hover:border-violet-400"
          }`}
          aria-label={isCompleted ? "Marcar como pendente" : "Marcar como concluída"}
        >
          {isCompleted && (
            <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h3
              className={`font-semibold text-white truncate ${
                isCompleted ? "line-through text-white/50" : ""
              }`}
            >
              {task.title}
            </h3>
            <span
              className={`shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-medium ${priority.color}`}
            >
              {priority.label}
            </span>
          </div>
          {task.description && (
            <p className={`text-sm text-white/50 line-clamp-2 ${isCompleted ? "line-through" : ""}`}>
              {task.description}
            </p>
          )}
          <p className="mt-2 text-xs text-white/30">
            {new Date(task.createdAt).toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>

        <button
          onClick={() => onDelete(task.id)}
          className="shrink-0 rounded-lg p-1.5 text-white/20 opacity-0 transition-all hover:bg-red-500/20 hover:text-red-400 group-hover:opacity-100"
          aria-label="Excluir tarefa"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}
