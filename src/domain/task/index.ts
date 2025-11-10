// Domain Layer: Task Management
// Defines Task entity, repository contract, and use cases

export type Task = {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  ownerId: string; // who created/owns the task
  createdAt: string; // ISO string for portability (no Date in domain)
  updatedAt: string;
};

export type TaskStatus = 'todo' | 'in_progress' | 'done';

export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DomainError';
  }
}

export class ValidationError extends DomainError {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export interface TaskRepository {
  createTask(input: CreateTaskInput): Promise<Task>;
  updateTask(input: UpdateTaskInput): Promise<Task>;
  deleteTask(id: string): Promise<void>;
  listTasks(filter?: { status?: TaskStatus }): Promise<Task[]>;
}

export type CreateTaskInput = {
  title: string;
  description?: string;
  status?: TaskStatus; // default to 'todo' if not provided
};

export type UpdateTaskInput = {
  id: string;
  title?: string;
  description?: string;
  status?: TaskStatus;
};

export class CreateTask {
  constructor(private readonly repo: TaskRepository) {}

  async execute(input: CreateTaskInput): Promise<Task> {
    const title = (input.title ?? '').trim();
    if (!title) throw new ValidationError('Title is required');

    const status: TaskStatus = input.status ?? 'todo';
    if (!isValidStatus(status)) throw new ValidationError('Invalid status');

    const description = input.description?.trim();

    return this.repo.createTask({ title, description, status });
  }
}

export class UpdateTask {
  constructor(private readonly repo: TaskRepository) {}

  async execute(input: UpdateTaskInput): Promise<Task> {
    const { id } = input;
    if (!id || !id.trim()) throw new ValidationError('Task id is required');

    if (
      input.title === undefined &&
      input.description === undefined &&
      input.status === undefined
    ) {
      throw new ValidationError('Nothing to update');
    }

    const payload: UpdateTaskInput = { id };

    if (input.title !== undefined) {
      const t = input.title.trim();
      if (!t) throw new ValidationError('Title cannot be empty');
      payload.title = t;
    }
    if (input.description !== undefined) {
      payload.description = input.description.trim();
    }
    if (input.status !== undefined) {
      if (!isValidStatus(input.status)) throw new ValidationError('Invalid status');
      payload.status = input.status;
    }

    return this.repo.updateTask(payload);
  }
}

export class DeleteTask {
  constructor(private readonly repo: TaskRepository) {}

  async execute(id: string): Promise<void> {
    if (!id || !id.trim()) throw new ValidationError('Task id is required');
    await this.repo.deleteTask(id);
  }
}

export class ListTasks {
  constructor(private readonly repo: TaskRepository) {}

  async execute(filter?: { status?: TaskStatus }): Promise<Task[]> {
    if (filter?.status && !isValidStatus(filter.status)) {
      throw new ValidationError('Invalid status');
    }
    return this.repo.listTasks(filter);
  }
}

function isValidStatus(s: string): s is TaskStatus {
  return s === 'todo' || s === 'in_progress' || s === 'done';
}
