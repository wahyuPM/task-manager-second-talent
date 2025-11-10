// In-memory Task store (demo only). For production, replace with a real database.
import { randomUUID } from 'node:crypto';
import type { TaskStatus } from '@domain/task';

export type StoredTask = {
  id: string;
  ownerId: string;
  title: string;
  description?: string;
  status: TaskStatus;
  createdAt: string; // ISO
  updatedAt: string; // ISO
};

class TaskMemoryDB {
  tasks = new Map<string, StoredTask>(); // id -> task

  create(ownerId: string, input: { title: string; description?: string; status: TaskStatus }): StoredTask {
    const now = new Date().toISOString();
    const t: StoredTask = {
      id: randomUUID(),
      ownerId,
      title: input.title,
      description: input.description,
      status: input.status,
      createdAt: now,
      updatedAt: now,
    };
    this.tasks.set(t.id, t);
    return t;
  }

  getById(id: string): StoredTask | null {
    return this.tasks.get(id) ?? null;
  }

  update(id: string, updates: { title?: string; description?: string; status?: TaskStatus }): StoredTask {
    const existing = this.tasks.get(id);
    if (!existing) throw new Error('Task not found');
    const next: StoredTask = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.tasks.set(id, next);
    return next;
  }

  delete(id: string): void {
    this.tasks.delete(id);
  }

  listByOwner(ownerId: string, filter?: { status?: TaskStatus }): StoredTask[] {
    const out: StoredTask[] = [];
    for (const t of this.tasks.values()) {
      if (t.ownerId !== ownerId) continue;
      if (filter?.status && t.status !== filter.status) continue;
      out.push(t);
    }
    // newest first by updatedAt
    out.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
    return out;
  }
}

declare global {
  // eslint-disable-next-line no-var
  var __taskDB__: TaskMemoryDB | undefined;
}

export const taskDB: TaskMemoryDB = globalThis.__taskDB__ ?? (globalThis.__taskDB__ = new TaskMemoryDB());
