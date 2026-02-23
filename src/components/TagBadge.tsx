"use client";

import { Tag } from "@/types/tag";

interface TagBadgeProps {
  tag: Tag;
  onRemove?: () => void;
  size?: "sm" | "md";
}

export function TagBadge({ tag, onRemove, size = "md" }: TagBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border font-medium ${
        size === "sm" ? "px-1.5 py-px text-[10px]" : "px-2 py-0.5 text-xs"
      }`}
      style={{
        backgroundColor: `${tag.color}18`,
        borderColor: `${tag.color}40`,
        color: tag.color,
      }}
    >
      <span
        className="shrink-0 rounded-full"
        style={{
          width: size === "sm" ? 5 : 6,
          height: size === "sm" ? 5 : 6,
          backgroundColor: tag.color,
        }}
      />
      {tag.name}
      {onRemove && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          className="ml-0.5 shrink-0 rounded-full leading-none opacity-60 hover:opacity-100"
          aria-label={`Remover tag ${tag.name}`}
        >
          ×
        </button>
      )}
    </span>
  );
}
