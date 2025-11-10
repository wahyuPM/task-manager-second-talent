import { describe, it, expect, vi } from 'vitest';
import { CreateTask, DeleteTask, ListTasks, UpdateTask, ValidationError, type TaskRepository, type Task } from './index';

type Repo = TaskRepository & {
  _data?: Task[];
};

function makeRepo(initial: Task[] = []): Repo {
  const data: Task[] = [...initial];
  return {
    _data: data,
    async createTask(input) {
      const t: Task = {
        id: String(Math.random()),
        title: input.title,
        description: input.description,
        status: input.status ?? 'todo',
        ownerId: 'u1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      data.push(t);
      return t;
    },
    async updateTask(input) {
      const idx = data.findIndex((x) => x.id === input.id);
      if (idx === -1) throw new Error('not found');
      const cur = data[idx];
      const next: Task = {
        ...cur,
        ...('title' in input ? { title: input.title! } : {}),
        ...('description' in input ? { description: input.description } : {}),
        ...('status' in input ? { status: input.status! } : {}),
        updatedAt: new Date().toISOString(),
      };
      data[idx] = next;
      return next;
    },
    async deleteTask(id: string) {
      const idx = data.findIndex((x) => x.id === id);
      if (idx !== -1) data.splice(idx, 1);
    },
    async listTasks(filter) {
      return data.filter((t) => (filter?.status ? t.status === filter.status : true));
    },
  };
}

describe('Task Domain Use Cases', () => {
  describe('CreateTask', () => {
    it('requires title', async () => {
      const uc = new CreateTask(makeRepo());
      await expect(uc.execute({ title: '  ' })).rejects.toThrow(ValidationError);
    });

    it('defaults status to todo', async () => {
      const repo = makeRepo();
      const uc = new CreateTask(repo);
      const task = await uc.execute({ title: 'Hello' });
      expect(task.status).toBe('todo');
    });
  });

  describe('UpdateTask', () => {
    it('requires id and at least one field', async () => {
      const uc = new UpdateTask(makeRepo());
      // @ts-expect-error testing validation
      await expect(uc.execute({})).rejects.toThrow(ValidationError);
      await expect(uc.execute({ id: '1' })).rejects.toThrow(ValidationError);
    });
  });

  describe('DeleteTask', () => {
    it('requires id', async () => {
      const uc = new DeleteTask(makeRepo());
      // @ts-expect-error
      await expect(uc.execute()).rejects.toThrow(ValidationError);
    });
  });

  describe('ListTasks', () => {
    it('validates status filter', async () => {
      const uc = new ListTasks(makeRepo());
      // @ts-expect-error invalid status
      await expect(uc.execute({ status: 'wrong' })).rejects.toThrow(ValidationError);
    });

    it('filters by status', async () => {
      const repo = makeRepo([
        { id: '1', title: 'a', status: 'todo', description: '', ownerId: 'u', createdAt: '', updatedAt: '' },
        { id: '2', title: 'b', status: 'done', description: '', ownerId: 'u', createdAt: '', updatedAt: '' },
      ]);
      const uc = new ListTasks(repo);
      const list = await uc.execute({ status: 'done' });
      expect(list.map((t) => t.id)).toEqual(['2']);
    });
  });
});
