// Data Layer: Auth repository implementation and server actions
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { authDB } from './auth.store';
import type { AuthRepository, User } from '@domain/auth';
import { LoginUser, SignupUser, ValidationError } from '@domain/auth';

const SESSION_COOKIE = 'tm_session';

function mapStoredToUser(stored: { id: string; email: string }): User {
  return { id: stored.id, email: stored.email };
}

export class AuthRepositoryImpl implements AuthRepository {
  async signup(email: string, password: string): Promise<User> {
    const normalized = email.toLowerCase();
    console.log('[Data][AuthRepositoryImpl.signup] input', { email, normalized });
    if (authDB.users.has(normalized)) {
      console.log('[Data][AuthRepositoryImpl.signup] email already exists');
      throw new Error('Email already exists');
    }
    const id = crypto.randomUUID?.() ?? Math.random().toString(36).slice(2);
    const user = { id, email: normalized, password };
    authDB.users.set(normalized, user);
    const token = authDB.createSession(user.id);
    const c = await cookies();
    c.set(SESSION_COOKIE, token, { httpOnly: true, sameSite: 'lax', path: '/' });
    console.log('[Data][AuthRepositoryImpl.signup] success', { id, email: normalized });
    return mapStoredToUser(user);
  }

  async login(email: string, password: string): Promise<User> {
    const normalized = email.toLowerCase();
    console.log('[Data][AuthRepositoryImpl.login] input', { email, normalized });
    const user = authDB.users.get(normalized);
    console.log('[Data][AuthRepositoryImpl.login] lookup', { found: !!user });
    if (!user) {
      console.log('[Data][AuthRepositoryImpl.login] user not found');
      throw new Error('Invalid credentials');
    }
    if (user.password !== password) {
      console.log('[Data][AuthRepositoryImpl.login] password mismatch', { providedLength: password.length });
      throw new Error('Invalid credentials');
    }
    const token = authDB.createSession(user.id);
    console.log('[Data][AuthRepositoryImpl.login] success', { userId: user.id, email: user.email, token });
    const c = await cookies();
    c.set(SESSION_COOKIE, token, { httpOnly: true, sameSite: 'lax', path: '/' });
    return mapStoredToUser(user);
  }

  async getCurrentUser(): Promise<User | null> {
    const c = await cookies();
    const token = c.get(SESSION_COOKIE)?.value;
    console.log('[Data][AuthRepositoryImpl.getCurrentUser] token', { token });
    const userId = authDB.getUserIdByToken(token);
    console.log('[Data][AuthRepositoryImpl.getCurrentUser] userId', { userId });
    if (!userId) return null;
    for (const u of authDB.users.values()) {
      if (u.id === userId) {
        console.log('[Data][AuthRepositoryImpl.getCurrentUser] user found', { email: u.email });
        return mapStoredToUser(u);
      }
    }
    console.log('[Data][AuthRepositoryImpl.getCurrentUser] userId not in users map');
    return null;
  }

  async logout(): Promise<void> {
    const c = await cookies();
    const token = c.get(SESSION_COOKIE)?.value;
    console.log('[Data][AuthRepositoryImpl.logout] token', { token });
    authDB.deleteSession(token);
    c.delete(SESSION_COOKIE);
  }
}

// Server actions
export async function loginAction(formData: FormData) {
  'use server';
  const email = String(formData.get('email') ?? '');
  const password = String(formData.get('password') ?? '');
  console.log('[Action][loginAction] start', { email, passwordProvided: !!password });
  const repo = new AuthRepositoryImpl();
  const login = new LoginUser(repo);
  // run use case and handle failure
  try {
    await login.execute({ email, password });
    console.log('[Action][loginAction] success');
  } catch (e) {
    console.log('[Action][loginAction] error', e);
    let msg = 'Invalid email or password';
    if (e instanceof ValidationError) {
      msg = e.message;
    } else if (e instanceof Error && e.message) {
      // Repository may throw generic errors like 'Invalid credentials'
      msg = e.message === 'Invalid credentials' ? 'Invalid email or password' : e.message;
    }
    redirect(`/login?error=${encodeURIComponent(msg)}`);
  }
  redirect('/tasks');
}

export async function logoutAction() {
  'use server';
  console.log('[Action][logoutAction] start');
  const repo = new AuthRepositoryImpl();
  await repo.logout();
  console.log('[Action][logoutAction] done');
  redirect('/login');
}

export async function signupAction(formData: FormData) {
  'use server';
  const email = String(formData.get('email') ?? '');
  const password = String(formData.get('password') ?? '');
  console.log('[Action][signupAction] start', { email, passwordProvided: !!password });
  const repo = new AuthRepositoryImpl();
  const signup = new SignupUser(repo);
  try {
    await signup.execute({ email, password });
    console.log('[Action][signupAction] success');
  } catch (e) {
    console.log('[Action][signupAction] error', e);
    let msg = 'Unable to sign up';
    if (e instanceof ValidationError) {
      msg = e.message;
    } else if (e instanceof Error && e.message) {
      msg = e.message;
    }
    redirect(`/signup?error=${encodeURIComponent(msg)}`);
  }
  redirect('/tasks');
}

export async function getCurrentUserAction(): Promise<User | null> {
  'use server';
  console.log('[Action][getCurrentUserAction] start');
  const repo = new AuthRepositoryImpl();
  const u = await repo.getCurrentUser();
  console.log('[Action][getCurrentUserAction] result', { hasUser: !!u });
  return u;
}
