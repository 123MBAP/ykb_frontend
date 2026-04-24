import { appendJsonArrayItem, readJson, writeJson } from './storage';

export type UserRole = 'starter' | 'serviceProvider';

export type StarterUser = {
  id: string;
  role: 'starter';
  name: string;
  country: string;
  phone: string;
  email: string;
  password: string;
  createdAt: string;
};

export type ServiceProviderUser = {
  id: string;
  role: 'serviceProvider';
  name: string;
  businessName: string;
  service: string;
  location: string;
  phone: string;
  email: string;
  password: string;
  createdAt: string;
};

export type AuthUser = StarterUser | ServiceProviderUser;

export type RegisterInput =
  | Omit<StarterUser, 'id' | 'createdAt'>
  | Omit<ServiceProviderUser, 'id' | 'createdAt'>;

export type AuthSession = {
  userId: string;
  role: UserRole;
  email: string;
  createdAt: string;
};

const USERS_KEY = 'authUsers';
const SESSION_KEY = 'authSession';

function getUsers(): AuthUser[] {
  return readJson<AuthUser[]>(USERS_KEY, []);
}

function setUsers(next: AuthUser[]): void {
  writeJson<AuthUser[]>(USERS_KEY, next);
}

export function getSession(): AuthSession | null {
  return readJson<AuthSession | null>(SESSION_KEY, null);
}

export function logout(): void {
  writeJson<AuthSession | null>(SESSION_KEY, null);
}

export function registerUser(input: RegisterInput): {
  ok: true;
  user: AuthUser;
} | {
  ok: false;
  message: string;
} {
  const users = getUsers();
  const email = input.email.trim().toLowerCase();

  if (!email) return { ok: false, message: 'Email is required.' };
  if (users.some((u) => u.email.toLowerCase() === email)) {
    return { ok: false, message: 'An account with this email already exists.' };
  }

  const user: AuthUser = {
    ...input,
    email,
    id: `user-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };

  // Keep newest first.
  const next = [user, ...users];
  setUsers(next);

  return { ok: true, user };
}

export function login(emailRaw: string, passwordRaw: string): {
  ok: true;
  session: AuthSession;
} | {
  ok: false;
  message: string;
} {
  const email = emailRaw.trim().toLowerCase();
  const password = passwordRaw;

  if (!email || !password) return { ok: false, message: 'Email and password are required.' };

  const users = getUsers();
  const user = users.find((u) => u.email.toLowerCase() === email);

  if (!user) return { ok: false, message: 'No account found for that email.' };
  if (user.password !== password) return { ok: false, message: 'Incorrect password.' };

  const session: AuthSession = {
    userId: user.id,
    role: user.role,
    email: user.email,
    createdAt: new Date().toISOString(),
  };

  writeJson<AuthSession>(SESSION_KEY, session);
  return { ok: true, session };
}

export function seedAuthIfEmpty(): void {
  const users = getUsers();
  if (users.length > 0) return;

  const seeded: AuthUser = {
    id: 'user-seed-1',
    role: 'starter',
    name: 'Starter Member',
    country: 'Rwanda',
    phone: '+250 7xx xxx xxx',
    email: 'starter@example.com',
    password: 'password123',
    createdAt: new Date().toISOString(),
  };

  appendJsonArrayItem<AuthUser>(USERS_KEY, seeded);
}
