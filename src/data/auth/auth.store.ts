// In-memory auth store for demo purposes only.
// This simulates a user table and session tokens.
import { randomUUID } from 'node:crypto';

export type StoredUser = {
  id: string;
  email: string;
  password: string; // plain for demo. In real apps use hashing.
};

class AuthMemoryDB {
  users = new Map<string, StoredUser>(); // key: lowercased email
  sessions = new Map<string, string>(); // token -> userId

  ensureSeedUser() {
    const email = 'demo@example.com'.toLowerCase();
    if (!this.users.has(email)) {
      const user: StoredUser = {
        id: randomUUID(),
        email,
        password: 'demo123',
      };
      this.users.set(email, user);
    }
  }

  createSession(userId: string): string {
    const token = randomUUID();
    this.sessions.set(token, userId);
    return token;
  }

  getUserIdByToken(token: string | undefined | null): string | null {
    if (!token) return null;
    return this.sessions.get(token) ?? null;
  }

  deleteSession(token: string | undefined | null) {
    if (!token) return;
    this.sessions.delete(token);
  }
}

declare global {
  var __authDB__: AuthMemoryDB | undefined;
}

export const authDB: AuthMemoryDB =
  globalThis.__authDB__ ?? (globalThis.__authDB__ = new AuthMemoryDB());

authDB.ensureSeedUser();
