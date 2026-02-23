"use client";

import { Task } from "@/types/task";
import { Tag } from "@/types/tag";
import { TagBadge } from "./TagBadge";

const priorityConfig = {
  low: { label: "Baixa", color: "bg-emerald-500/20 text-emerald-600 border-emerald-400/40 dark:text-emerald-400 dark:border-emerald-500/30" },
  medium: { label: "Média", color: "bg-amber-500/20 text-amber-600 border-amber-400/40 dark:text-amber-400 dark:border-amber-500/30" },
  high: { label: "Alta", color: "bg-rose-500/20 text-rose-600 border-rose-400/40 dark:text-rose-400 dark:border-rose-500/30" },
};

interface TaskCardProps {
  task: Task;
  index: number;
  tags: Tag[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onDragStart: (index: number) => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDragEnd: () => void;
  isDragging: boolean;
  isDragOver: boolean;
}

export function TaskCard({
  task,
  index,
  tags,
  onToggle,
  onDelete,
  onDragStart,
  onDragOver,
  onDragEnd,
  isDragging,
  isDragOver,
}: TaskCardProps) {
  const priority = priorityConfig[task.priority];
  const isCompleted = task.status === "completed";
  const taskTags = (task.tagIds ?? [])
    .map((id) => tags.find((t) => t.id === id))
    .filter((t): t is Tag => t !== undefined);

  return (
    <div
      draggable
      onDragStart={() => onDragStart(index)}
      onDragOver={(e) => onDragOver(e, index)}
      onDragEnd={onDragEnd}
      className={`group relative rounded-xl border p-5 backdrop-blur-sm transition-all ${
        isDragging
          ? "scale-[1.02] border-violet-500/50 bg-violet-500/10 opacity-80 shadow-lg shadow-violet-500/10"
          : isDragOver
            ? "border-violet-400/40 bg-violet-50 dark:bg-white/[0.08]"
            : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20 dark:hover:bg-white/[0.07]"
      } ${isCompleted ? "opacity-60" : ""}`}
    >
      <div className="flex items-start gap-3">
        {/* Drag handle */}
        <div
          className="mt-1 flex shrink-0 cursor-grab flex-col gap-[3px] py-1 opacity-0 transition-opacity group-hover:opacity-40 hover:!opacity-70 active:cursor-grabbing"
          aria-label="Arrastar para reordenar"
        >
          {[0, 1, 2].map((row) => (
            <div key={row} className="flex gap-[3px]">
              <span className="h-[3px] w-[3px] rounded-full bg-slate-400 dark:bg-white" />
              <span className="h-[3px] w-[3px] rounded-full bg-slate-400 dark:bg-white" />
            </div>
          ))}
        </div>

        <button
          onClick={() => onToggle(task.id)}
          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
            isCompleted
              ? "border-violet-500 bg-violet-500"
              : "border-slate-300 hover:border-violet-400 dark:border-white/30"
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
          {/* Title row */}
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3
              className={`font-semibold truncate ${
                isCompleted
                  ? "line-through text-slate-400 dark:text-white/50"
                  : "text-slate-900 dark:text-white"
              }`}
            >
              {task.title}
            </h3>
            <span className={`shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-medium ${priority.color}`}>
              {priority.label}
            </span>
          </div>

          {/* Description */}
          {task.description && (
            <p className={`text-sm line-clamp-2 ${isCompleted ? "line-through text-slate-300 dark:text-white/30" : "text-slate-500 dark:text-white/50"}`}>
              {task.description}
            </p>
          )}

          {/* Tags row */}
          {taskTags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {taskTags.map((tag) => (
                <TagBadge key={tag.id} tag={tag} size={1} />
              ))}
            </div>
          )}

          {/* Date */}
          <p className="mt-2 text-xs text-slate-400 dark:text-white/30">
            {new Date(task.createdAt).toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>

        <button
          onClick={() => onDelete(task.id)}
          className="shrink-0 rounded-lg p-1.5 text-slate-300 opacity-0 transition-all hover:bg-red-50 hover:text-red-500 group-hover:opacity-100 dark:text-white/20 dark:hover:bg-red-500/20 dark:hover:text-red-400"
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
