"use client";

import { TaskStatus } from "@/types/task";

type FilterValue = "all" | TaskStatus;

interface FilterBarProps {
  current: FilterValue;
  onChange: (value: FilterValue) => void;
  counts: { all: number; pending: number; completed: number };
}

const filters: { value: FilterValue; label: string }[] = [
  { value: "all", label: "Todas" },
  { value: "pending", label: "Pendentes" },
  { value: "completed", label: "Concluídas" },
];

export function FilterBar({ current, onChange, counts }: FilterBarProps) {
  return (
    <div className="flex gap-2">
      {filters.map((f) => (
        <button
          key={f.value}
          onClick={() => onChange(f.value)}
          className={`rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors ${
            current === f.value
              ? "bg-violet-600 text-white"
              : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/70"
          }`}
        >
          {f.label}
          <span className="ml-1.5 text-xs opacity-70">
            {counts[f.value]}
          </span>
        </button>
      ))}
    </div>
  );
}
