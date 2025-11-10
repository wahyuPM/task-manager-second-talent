"use client";
import { useState } from 'react';
import type { Task } from '@domain/task';

type ServerAction = (formData: FormData) => void | Promise<void>;

export default function TaskList({ tasks, onDelete, onUpdate }: { tasks: Task[]; onDelete: ServerAction; onUpdate: ServerAction }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (!tasks.length) return <p className="text-sm text-gray-600">No tasks.</p>;

  return (
    <ul className="space-y-4">
      {tasks.map((t) => (
        <li key={t.id} className="border rounded p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs border-white/20 bg-white/10">
                  {t.status.replace('_', ' ')}
                </span>
                <span className="text-xs text-gray-400">Updated {new Date(t.updatedAt).toLocaleString()}</span>
              </div>
              <h3 className="text-lg font-medium">{t.title}</h3>
              {t.description && <p className="text-sm text-gray-200/90 whitespace-pre-wrap">{t.description}</p>}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setExpandedId(expandedId === t.id ? null : t.id)}
                className="px-3 py-1.5 rounded border border-white/20 bg-white/10 hover:bg-white/15"
              >
                {expandedId === t.id ? 'Close' : 'Edit'}
              </button>
              <form action={onDelete}>
                <input type="hidden" name="id" value={t.id} />
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded border border-red-300/30 bg-red-400/10 text-red-200 hover:bg-red-400/15"
                >
                  Delete
                </button>
              </form>
            </div>
          </div>

          {expandedId === t.id && (
            <div className="mt-4 border-t border-white/10 pt-4">
              <form action={onUpdate} className="grid gap-3">
                <input type="hidden" name="id" value={t.id} />
                <div>
                  <label className="block text-sm" htmlFor={`title-${t.id}`}>Title</label>
                  <input id={`title-${t.id}`} name="title" defaultValue={t.title} className="w-full border rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm" htmlFor={`description-${t.id}`}>Description</label>
                  <textarea id={`description-${t.id}`} name="description" defaultValue={t.description} className="w-full border rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm" htmlFor={`status-${t.id}`}>Status</label>
                  <select id={`status-${t.id}`} name="status" defaultValue={t.status} className="w-full border rounded px-3 py-2">
                    <option value="todo">To do</option>
                    <option value="in_progress">In progress</option>
                    <option value="done">Done</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <button type="submit" className="border rounded px-4 py-2">Save</button>
                  <button type="button" onClick={() => setExpandedId(null)} className="border rounded px-4 py-2">Cancel</button>
                </div>
              </form>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
