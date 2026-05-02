import { API_BASE, BackendAuthError, getBackendAuthHeaders, getBackendSession } from './backendAuth';
import type { BackendProviderProfile } from './backendProviders';

type ApiErrorResponse = {
  error?: {
    message?: unknown;
  };
};

async function readApiErrorMessage(res: Response): Promise<string> {
  try {
    const data = (await res.json()) as ApiErrorResponse;
    const msg = data.error?.message;
    if (typeof msg === 'string' && msg.trim().length > 0) return msg;
  } catch {
    // ignore
  }
  return `Request failed (${res.status})`;
}

function requireAdminSession() {
  const session = getBackendSession();
  if (!session?.accessToken) throw new BackendAuthError('Not authenticated.', 401);
  if (session.user.role !== 'ADMIN') throw new BackendAuthError('Admin access required.', 403);
  return session;
}

export async function fetchAdminProviders(): Promise<BackendProviderProfile[]> {
  requireAdminSession();

  let res: Response;
  try {
    res = await fetch(`${API_BASE}/admin/providers`, {
      method: 'GET',
      headers: {
        ...getBackendAuthHeaders(),
      },
    });
  } catch {
    throw new BackendAuthError('Could not reach the backend. Is it running?', 0);
  }

  if (!res.ok) {
    throw new BackendAuthError(await readApiErrorMessage(res), res.status);
  }

  const json = (await res.json()) as { providers?: BackendProviderProfile[] };
  if (!Array.isArray(json?.providers)) {
    throw new BackendAuthError('Invalid response from backend.');
  }

  return json.providers;
}

export async function fetchAdminProviderById(providerId: string): Promise<BackendProviderProfile> {
  requireAdminSession();

  let res: Response;
  try {
    res = await fetch(`${API_BASE}/admin/providers/${encodeURIComponent(providerId)}`, {
      method: 'GET',
      headers: {
        ...getBackendAuthHeaders(),
      },
    });
  } catch {
    throw new BackendAuthError('Could not reach the backend. Is it running?', 0);
  }

  if (!res.ok) {
    throw new BackendAuthError(await readApiErrorMessage(res), res.status);
  }

  const json = (await res.json()) as { provider?: BackendProviderProfile };
  if (!json?.provider?.id) {
    throw new BackendAuthError('Invalid response from backend.');
  }

  return json.provider;
}
