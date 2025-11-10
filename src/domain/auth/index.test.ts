import { describe, it, expect, vi } from 'vitest';
import { LoginUser, SignupUser, ValidationError, type AuthRepository, type User } from './index';

function makeRepo(overrides: Partial<AuthRepository> = {}): AuthRepository {
  return {
    signup: vi.fn(async (email: string, password: string): Promise<User> => ({ id: '1', email })),
    login: vi.fn(async (email: string, password: string): Promise<User> => ({ id: '1', email })),
    getCurrentUser: vi.fn(async () => null),
    logout: vi.fn(async () => {}),
    ...overrides,
  } satisfies AuthRepository as AuthRepository;
}

describe('Auth Domain Use Cases', () => {
  describe('LoginUser', () => {
    it('throws on empty email', async () => {
      const uc = new LoginUser(makeRepo());
      await expect(uc.execute({ email: '', password: 'x' })).rejects.toThrow(ValidationError);
    });

    it('throws on invalid email format', async () => {
      const uc = new LoginUser(makeRepo());
      await expect(uc.execute({ email: 'invalid', password: 'x' })).rejects.toThrow(ValidationError);
    });

    it('calls repo.login with normalized email', async () => {
      const repo = makeRepo();
      const uc = new LoginUser(repo);
      await uc.execute({ email: 'User@Example.COM', password: 'pass' });
      expect((repo.login as any).mock.calls[0][0]).toBe('user@example.com');
    });
  });

  describe('SignupUser', () => {
    it('throws on short password', async () => {
      const uc = new SignupUser(makeRepo());
      await expect(uc.execute({ email: 'a@b.com', password: '123' })).rejects.toThrow(ValidationError);
    });

    it('normalizes email and calls repo.signup', async () => {
      const repo = makeRepo();
      const uc = new SignupUser(repo);
      await uc.execute({ email: 'A@B.com', password: '123456' });
      expect((repo.signup as any).mock.calls[0][0]).toBe('a@b.com');
    });
  });
});
