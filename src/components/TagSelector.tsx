"use client";

import { useState } from "react";
import { Tag, TAG_PRESET_COLORS } from "@/types/tag";
import { TagBadge } from "./TagBadge";

interface TagSelectorProps {
  tags: Tag[];
  selectedTagIds: string[];
  onToggle: (tagId: string) => void;
  onCreateTag: (name: string, color: string) => string;
  onDeleteTag: (tagId: string) => void;
}

export function TagSelector({
  tags,
  selectedTagIds,
  onToggle,
  onCreateTag,
  onDeleteTag,
}: TagSelectorProps) {
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState(TAG_PRESET_COLORS[5].value); // blue default

  function handleCreate() {
    if (!newName.trim()) return;
    const id = onCreateTag(newName, newColor);
    onToggle(id); // auto-select new tag
    setNewName("");
    setNewColor(TAG_PRESET_COLORS[5].value);
    setShowForm(false);
  }

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-600 dark:text-white/70">
        Tags
      </label>

      {/* Existing tags */}
      {tags.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1.5">
          {tags.map((tag) => {
            const selected = selectedTagIds.includes(tag.id);
            return (
              <button
                type="button"
                key={tag.id}
                onClick={() => onToggle(tag.id)}
                className={`group relative rounded-full border font-medium text-xs px-2 py-0.5 transition-all ${
                  selected
                    ? "ring-2 ring-offset-1 ring-offset-white dark:ring-offset-gray-900"
                    : "opacity-60 hover:opacity-90"
                }`}
                style={{
                  backgroundColor: `${tag.color}18`,
                  borderColor: selected ? tag.color : `${tag.color}40`,
                  color: tag.color,
                  ...(selected ? { ringColor: tag.color } : {}),
                }}
                aria-pressed={selected}
              >
                <span className="flex items-center gap-1">
                  <span
                    className="shrink-0 rounded-full"
                    style={{ width: 6, height: 6, backgroundColor: tag.color }}
                  />
                  {tag.name}
                  {selected && (
                    <span className="ml-0.5 opacity-80">✓</span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Inline create form */}
      {showForm ? (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-white/5">
          <div className="mb-2 flex gap-2">
            <input
              autoFocus
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleCreate(); } if (e.key === "Escape") setShowForm(false); }}
              placeholder="Nome da tag"
              maxLength={24}
              className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-200 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder-white/30 dark:focus:border-violet-500/50 dark:focus:ring-violet-500/25"
            />
          </div>

          {/* Color palette */}
          <div className="mb-3 flex flex-wrap gap-2">
            {TAG_PRESET_COLORS.map((c) => (
              <button
                type="button"
                key={c.value}
                title={c.label}
                onClick={() => setNewColor(c.value)}
                className={`h-6 w-6 rounded-full border-2 transition-transform hover:scale-110 ${
                  newColor === c.value ? "border-white scale-110 shadow-md" : "border-transparent"
                }`}
                style={{ backgroundColor: c.value }}
                aria-label={c.label}
              />
            ))}
            {/* Custom color picker */}
            <label className="relative h-6 w-6 cursor-pointer" title="Cor personalizada">
              <input
                type="color"
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              />
              <span
                className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-dashed border-slate-300 text-[9px] font-bold text-slate-400 dark:border-white/20 dark:text-white/30"
              >
                +
              </span>
            </label>
          </div>

          {/* Preview + actions */}
          <div className="flex items-center justify-between gap-2">
            <div className="text-xs text-slate-400 dark:text-white/40">
              {newName.trim() ? (
                <span
                  className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-medium"
                  style={{ backgroundColor: `${newColor}18`, borderColor: `${newColor}40`, color: newColor }}
                >
                  <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: newColor }} />
                  {newName}
                </span>
              ) : (
                "Preview da tag"
              )}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => { setShowForm(false); setNewName(""); }}
                className="rounded-lg px-2.5 py-1 text-xs text-slate-500 hover:bg-slate-100 dark:text-white/50 dark:hover:bg-white/10"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleCreate}
                disabled={!newName.trim()}
                className="rounded-lg bg-violet-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Criar
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1 rounded-lg border border-dashed border-slate-300 px-2.5 py-1 text-xs text-slate-400 transition-colors hover:border-violet-400 hover:text-violet-500 dark:border-white/20 dark:text-white/30 dark:hover:border-violet-500/50 dark:hover:text-violet-400"
          >
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Nova tag
          </button>
          {/* Delete tags that are selected */}
          {selectedTagIds.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {selectedTagIds.map((id) => {
                const tag = tags.find((t) => t.id === id);
                return tag ? (
                  <TagBadge key={id} tag={tag} onRemove={() => onToggle(id)} />
                ) : null;
              })}
            </div>
          )}
        </div>
      )}

      {/* Manage existing tags (delete) */}
      {tags.length > 0 && !showForm && (
        <details className="mt-2">
          <summary className="cursor-pointer text-xs text-slate-400 hover:text-slate-500 dark:text-white/30 dark:hover:text-white/50 select-none">
            Gerenciar tags ({tags.length})
          </summary>
          <div className="mt-2 space-y-1">
            {tags.map((tag) => (
              <div key={tag.id} className="flex items-center justify-between gap-2">
                <TagBadge tag={tag} />
                <button
                  type="button"
                  onClick={() => onDeleteTag(tag.id)}
                  className="text-xs text-slate-400 hover:text-red-500 dark:text-white/30 dark:hover:text-red-400"
                  aria-label={`Excluir tag ${tag.name}`}
                >
                  Excluir
                </button>
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  );
}
