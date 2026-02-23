"use client";

import { Tag } from "@/types/tag";

interface TagFilterBarProps {
  tags: Tag[];
  activeTagId: string | null;
  onChange: (tagId: string | null) => void;
}

export function TagFilterBar({ tags, activeTagId, onChange }: TagFilterBarProps) {
  if (tags.length === 0) return null;

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-0.5">
      <span className="shrink-0 text-xs font-medium text-slate-400 dark:text-white/30">Tags:</span>
      <div className="flex gap-1.5">
        <button
          onClick={() => onChange(null)}
          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
            activeTagId === null
              ? "bg-violet-600 text-white"
              : "bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-white/5 dark:text-white/40 dark:hover:bg-white/10"
          }`}
        >
          Todas
        </button>
        {tags.map((tag) => {
          const active = activeTagId === tag.id;
          return (
            <button
              key={tag.id}
              onClick={() => onChange(active ? null : tag.id)}
              className="shrink-0 inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium transition-all"
              style={
                active
                  ? {
                      backgroundColor: tag.color,
                      borderColor: tag.color,
                      color: "#fff",
                    }
                  : {
                      backgroundColor: `${tag.color}15`,
                      borderColor: `${tag.color}35`,
                      color: tag.color,
                      opacity: 0.75,
                    }
              }
              aria-pressed={active}
            >
              <span
                className="shrink-0 rounded-full"
                style={{ width: 5, height: 5, backgroundColor: active ? "#fff" : tag.color }}
              />
              {tag.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
