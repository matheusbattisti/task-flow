"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Tag } from "@/types/tag";

const STORAGE_KEY = "task-flow-tags";

function getInitialTags(): Tag[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveTags(tags: Tag[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tags));
}

export function useTags() {
  const [tags, setTags] = useState<Tag[]>(getInitialTags);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    saveTags(tags);
  }, [tags]);

  const createTag = useCallback((name: string, color: string): string => {
    const id = crypto.randomUUID();
    setTags((prev) => [...prev, { id, name: name.trim(), color }]);
    return id;
  }, []);

  const deleteTag = useCallback((id: string) => {
    setTags((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const getTagById = useCallback(
    (id: string) => tags.find((t) => t.id === id),
    [tags]
  );

  return { tags, createTag, deleteTag, getTagById };
}
