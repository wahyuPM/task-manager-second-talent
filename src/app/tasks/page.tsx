import { getCurrentUserAction, logoutAction } from '@data/auth/auth.repository';
import { createTaskAction, listTasksAction, deleteTaskAction, updateTaskAction } from '@data/task/task.repository';
import { redirect } from 'next/navigation';
import FilterTabs from '@/components/tasks/FilterTabs';
import TaskList from '@/components/tasks/TaskList';


function isStatus(s?: string): s is 'todo' | 'in_progress' | 'done' {
  return s === 'todo' || s === 'in_progress' || s === 'done';
}

export default async function TasksPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const user = await getCurrentUserAction();
  if (!user) redirect('/login');

  const sp = await searchParams;
  const statusParam = typeof sp.status === 'string' ? sp.status : undefined;
  const errorParam = typeof sp.error === 'string' ? sp.error : undefined;
  const statusFilter = isStatus(statusParam) ? statusParam : undefined;

  const tasks = await listTasksAction(statusFilter ? { status: statusFilter } : undefined);

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Tasks</h1>
          <form action={logoutAction}>
            <button className="border px-3 py-1 rounded">Logout</button>
          </form>
        </header>

        <p className="text-sm text-gray-600">Welcome, {user.email}.</p>
        {errorParam && (
          <p className="text-sm text-red-600">{decodeURIComponent(errorParam)}</p>
        )}

        {/* Create Task */}
        <section className="border rounded p-4 space-y-3">
          <h2 className="font-medium">Create Task</h2>
          <form action={createTaskAction} className="grid gap-3">
            <div>
              <label htmlFor="title" className="block text-sm">Title</label>
              <input id="title" name="title" required className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm">Description</label>
              <textarea id="description" name="description" className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label htmlFor="status" className="block text-sm">Status</label>
              <select id="status" name="status" defaultValue="todo" className="w-full border rounded px-3 py-2">
                <option value="todo">To do</option>
                <option value="in_progress">In progress</option>
                <option value="done">Done</option>
              </select>
            </div>
            <div>
              <button type="submit" className="bg-black text-white rounded px-4 py-2">Add</button>
            </div>
          </form>
        </section>

        {/* Filters (client, reacts to URL) */}
        <FilterTabs />

        {/* List with accordion edit form */}
        <section className="space-y-4">
          <TaskList tasks={tasks} onDelete={deleteTaskAction} onUpdate={updateTaskAction} />
        </section>
      </div>
    </div>
  );
}
