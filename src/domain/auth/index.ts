// Domain Layer: Authentication
// This file groups the auth domain interface and use case to enable incremental integration.
// Later, we can split into entities/, repositories/, and use-cases/ folders if needed.

export type User = {
  id: string;
  email: string;
  // Domain stays agnostic about hashing implementation
  passwordHash?: string;
};

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

export interface AuthRepository {
  signup(email: string, password: string): Promise<User>;
  login(email: string, password: string): Promise<User>;
  getCurrentUser(): Promise<User | null>;
  logout(): Promise<void>;
}

export type LoginUserInput = {
  email: string;
  password: string;
};

export class LoginUser {
  constructor(private readonly authRepo: AuthRepository) {}

  async execute({ email, password }: LoginUserInput): Promise<User> {
    if (!email || !email.trim()) {
      throw new ValidationError('Email is required');
    }
    if (!password || !password.trim()) {
      throw new ValidationError('Password is required');
    }

    const normalizedEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      throw new ValidationError('Invalid email format');
    }

    return this.authRepo.login(normalizedEmail, password);
  }
}

export class SignupUser {
  constructor(private readonly authRepo: AuthRepository) {}

  async execute({ email, password }: LoginUserInput): Promise<User> {
    if (!email || !email.trim()) {
      throw new ValidationError('Email is required');
    }
    if (!password || !password.trim()) {
      throw new ValidationError('Password is required');
    }
    if (password.length < 6) {
      throw new ValidationError('Password must be at least 6 characters');
    }

    const normalizedEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      throw new ValidationError('Invalid email format');
    }

    return this.authRepo.signup(normalizedEmail, password);
  }
}
