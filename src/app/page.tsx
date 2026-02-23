"use client";

import { useState, useRef, useCallback } from "react";
import { useTasks } from "@/hooks/useTasks";
import { Task } from "@/types/task";
import { TaskCard } from "@/components/TaskCard";
import { AddTaskModal } from "@/components/AddTaskModal";
import { FilterBar } from "@/components/FilterBar";
import { TaskCounter } from "@/components/TaskCounter";
import { ConfirmDialog } from "@/components/ConfirmDialog";

export default function Home() {
  const {
    tasks,
    allTasks,
    filter,
    setFilter,
    addTask,
    toggleStatus,
    deleteTask,
    reorderTasks,
    exportTasks,
    importTasks,
    counts,
    mounted,
  } = useTasks();

  const [modalOpen, setModalOpen] = useState(false);

  // Delete confirmation state
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);

  // Drag and drop state
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // File input ref for import
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDeleteRequest = useCallback(
    (id: string) => {
      const task = allTasks.find((t) => t.id === id);
      if (task) setDeleteTarget({ id, title: task.title });
    },
    [allTasks]
  );

  const handleConfirmDelete = useCallback(() => {
    if (deleteTarget) {
      deleteTask(deleteTarget.id);
      setDeleteTarget(null);
    }
  }, [deleteTarget, deleteTask]);

  // Drag handlers – work on the full (unfiltered) list
  const handleDragStart = useCallback(
    (filteredIndex: number) => {
      const task = tasks[filteredIndex];
      const realIndex = allTasks.findIndex((t) => t.id === task.id);
      setDragIndex(realIndex);
    },
    [tasks, allTasks]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent, filteredIndex: number) => {
      e.preventDefault();
      const task = tasks[filteredIndex];
      const realIndex = allTasks.findIndex((t) => t.id === task.id);
      setDragOverIndex(realIndex);
    },
    [tasks, allTasks]
  );

  const handleDragEnd = useCallback(() => {
    if (dragIndex !== null && dragOverIndex !== null && dragIndex !== dragOverIndex) {
      reorderTasks(dragIndex, dragOverIndex);
    }
    setDragIndex(null);
    setDragOverIndex(null);
  }, [dragIndex, dragOverIndex, reorderTasks]);

  // Import handler
  const handleImport = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string);
          const tasksArray: Task[] = Array.isArray(data) ? data : [];
          const valid = tasksArray.filter(
            (t) => t.id && t.title && t.status && t.priority && t.createdAt
          );
          if (valid.length > 0) {
            importTasks(valid);
          }
        } catch {
          // invalid JSON — silently ignore
        }
      };
      reader.readAsText(file);
      // reset so re-importing same file works
      e.target.value = "";
    },
    [importTasks]
  );

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white">TaskFlow</h1>
          </div>
          <p className="text-white/40 mt-1">Gerencie suas tarefas de forma simples e eficiente</p>
        </div>

        {/* Counter */}
        <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
          <TaskCounter counts={counts} />
        </div>

        {/* Actions */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <FilterBar current={filter} onChange={setFilter} counts={counts} />
          <div className="flex items-center gap-2">
            {/* Import */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm font-medium text-white/60 transition-colors hover:bg-white/10 hover:text-white/80"
              title="Importar tarefas"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <span className="hidden sm:inline">Importar</span>
            </button>

            {/* Export */}
            <button
              onClick={exportTasks}
              disabled={allTasks.length === 0}
              className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm font-medium text-white/60 transition-colors hover:bg-white/10 hover:text-white/80 disabled:opacity-30 disabled:cursor-not-allowed"
              title="Exportar tarefas"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span className="hidden sm:inline">Exportar</span>
            </button>

            {/* New Task */}
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Nova Tarefa
            </button>
          </div>
        </div>

        {/* Task List */}
        <div className="space-y-3">
          {tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 py-16 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/5">
                <svg className="h-8 w-8 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <p className="text-white/40 font-medium">Nenhuma tarefa encontrada</p>
              <p className="text-sm text-white/25 mt-1">
                {filter === "all"
                  ? "Clique em \"Nova Tarefa\" para começar"
                  : "Nenhuma tarefa com este filtro"}
              </p>
            </div>
          ) : (
            tasks.map((task, filteredIdx) => {
              const realIndex = allTasks.findIndex((t) => t.id === task.id);
              return (
                <TaskCard
                  key={task.id}
                  task={task}
                  index={filteredIdx}
                  onToggle={toggleStatus}
                  onDelete={handleDeleteRequest}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDragEnd={handleDragEnd}
                  isDragging={dragIndex === realIndex}
                  isDragOver={dragOverIndex === realIndex}
                />
              );
            })
          )}
        </div>
      </div>

      {/* Modals */}
      <AddTaskModal open={modalOpen} onClose={() => setModalOpen(false)} onAdd={addTask} />

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Excluir tarefa"
        message={`Tem certeza que deseja excluir "${deleteTarget?.title}"? Esta ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
