import { readJson, writeJson } from './storage';

export type BackendRole = 'ADMIN' | 'CUSTOMER' | 'PROVIDER' | (string & {});

export type BackendUser = {
  id: string;
  email: string;
  name: string;
  role: BackendRole;
  phone?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type BackendAuthResult = {
  user: BackendUser;
  accessToken: string;
};

export type BackendSession = BackendAuthResult & {
  createdAt: string;
};

export const API_BASE = (import.meta as any).env?.VITE_API_URL ?? 'http://localhost:4000/api';

const SESSION_KEY = 'backendSession';

export class BackendAuthError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'BackendAuthError';
    this.status = status;
  }
}

async function readApiErrorMessage(res: Response): Promise<string> {
  try {
    const data = (await res.json()) as any;
    const msg = data?.error?.message;
    if (typeof msg === 'string' && msg.trim().length > 0) return msg;
  } catch {
    // ignore
  }
  return `Request failed (${res.status})`;
}

export function getBackendSession(): BackendSession | null {
  return readJson<BackendSession | null>(SESSION_KEY, null);
}

export function setBackendSession(session: BackendSession | null): void {
  writeJson<BackendSession | null>(SESSION_KEY, session);
}

export function logoutBackend(): void {
  setBackendSession(null);
}

export function getBackendAccessToken(): string | null {
  return getBackendSession()?.accessToken ?? null;
}

export function isBackendAdmin(): boolean {
  const session = getBackendSession();
  return session?.user?.role === 'ADMIN';
}

export function getBackendAuthHeaders(): Record<string, string> {
  const token = getBackendAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function loginBackend(emailRaw: string, passwordRaw: string): Promise<BackendSession> {
  const email = emailRaw.trim().toLowerCase();
  const password = passwordRaw;

  if (!email || !password) {
    throw new BackendAuthError('Email and password are required.');
  }

  let res: Response;
  try {
    res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
  } catch {
    throw new BackendAuthError('Could not reach the backend. Is it running?', 0);
  }

  if (!res.ok) {
    throw new BackendAuthError(await readApiErrorMessage(res), res.status);
  }

  const json = (await res.json()) as BackendAuthResult;
  if (!json?.user || !json?.accessToken) {
    throw new BackendAuthError('Invalid response from backend.');
  }

  const session: BackendSession = { ...json, createdAt: new Date().toISOString() };
  setBackendSession(session);
  return session;
}
