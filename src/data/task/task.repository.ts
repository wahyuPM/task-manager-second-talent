// Data Layer: Task repository implementation + server actions
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { Task, TaskRepository, TaskStatus } from '@domain/task';
import { CreateTask, DeleteTask, ListTasks, UpdateTask, ValidationError } from '@domain/task';
import { taskDB } from './task.store';
import { authDB } from '../auth/auth.store';

function mapStoredToTask(s: {
  id: string;
  ownerId: string;
  title: string;
  description?: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}): Task {
  return {
    id: s.id,
    ownerId: s.ownerId,
    title: s.title,
    description: s.description,
    status: s.status,
    createdAt: s.createdAt,
    updatedAt: s.updatedAt,
  };
}

const SESSION_COOKIE = 'tm_session';

async function getCurrentUserId(): Promise<string | null> {
  const c = await cookies();
  const token = c.get(SESSION_COOKIE)?.value;
  return authDB.getUserIdByToken(token);
}

export class TaskRepositoryImpl implements TaskRepository {
  async createTask(input: { title: string; description?: string; status?: TaskStatus }): Promise<Task> {
    const userId = await getCurrentUserId();
    if (!userId) throw new Error('Unauthorized');
    const status: TaskStatus = input.status ?? 'todo';
    const stored = taskDB.create(userId, { title: input.title, description: input.description, status });
    return mapStoredToTask(stored);
  }

  async updateTask(input: { id: string; title?: string; description?: string; status?: TaskStatus }): Promise<Task> {
    const userId = await getCurrentUserId();
    if (!userId) throw new Error('Unauthorized');
    const existing = taskDB.getById(input.id);
    if (!existing || existing.ownerId !== userId) throw new Error('Task not found');
    const updated = taskDB.update(input.id, { title: input.title, description: input.description, status: input.status as TaskStatus | undefined });
    return mapStoredToTask(updated);
  }

  async deleteTask(id: string): Promise<void> {
    const userId = await getCurrentUserId();
    if (!userId) throw new Error('Unauthorized');
    const existing = taskDB.getById(id);
    if (!existing || existing.ownerId !== userId) throw new Error('Task not found');
    taskDB.delete(id);
  }

  async listTasks(filter?: { status?: TaskStatus }): Promise<Task[]> {
    const userId = await getCurrentUserId();
    if (!userId) throw new Error('Unauthorized');
    const list = taskDB.listByOwner(userId, filter);
    return list.map(mapStoredToTask);
  }
}

// Server actions
export async function createTaskAction(formData: FormData) {
  'use server';
  const title = String(formData.get('title') ?? '');
  const description = String(formData.get('description') ?? '');
  const status = (formData.get('status') as TaskStatus | null) ?? 'todo';

  const repo = new TaskRepositoryImpl();
  const usecase = new CreateTask(repo);

  try {
    await usecase.execute({ title, description, status });
  } catch (e) {
    let msg = 'Unable to create task';
    if (e instanceof ValidationError) msg = e.message;
    else if (e instanceof Error && e.message) msg = e.message;
    redirect(`/tasks?error=${encodeURIComponent(msg)}`);
  }
  redirect('/tasks');
}

export async function updateTaskAction(formData: FormData) {
  'use server';
  const id = String(formData.get('id') ?? '');
  const title = formData.has('title') ? String(formData.get('title') ?? '') : undefined;
  const description = formData.has('description') ? String(formData.get('description') ?? '') : undefined;
  const status = (formData.has('status') ? (formData.get('status') as TaskStatus | null) : undefined) as TaskStatus | undefined;

  const repo = new TaskRepositoryImpl();
  const usecase = new UpdateTask(repo);

  try {
    await usecase.execute({ id, title, description, status });
  } catch (e) {
    let msg = 'Unable to update task';
    if (e instanceof ValidationError) msg = e.message;
    else if (e instanceof Error && e.message) msg = e.message;
    redirect(`/tasks?error=${encodeURIComponent(msg)}`);
  }
  redirect('/tasks');
}

export async function deleteTaskAction(formData: FormData) {
  'use server';
  const id = String(formData.get('id') ?? '');
  const repo = new TaskRepositoryImpl();
  const usecase = new DeleteTask(repo);
  try {
    await usecase.execute(id);
  } catch (e) {
    let msg = 'Unable to delete task';
    if (e instanceof ValidationError) msg = e.message;
    else if (e instanceof Error && e.message) msg = e.message;
    redirect(`/tasks?error=${encodeURIComponent(msg)}`);
  }
  redirect('/tasks');
}

export async function listTasksAction(params?: { status?: TaskStatus }): Promise<Task[]> {
  'use server';
  const repo = new TaskRepositoryImpl();
  const usecase = new ListTasks(repo);
  const tasks = await usecase.execute(params);
  return tasks;
}
