import { useCallback, useEffect, useMemo, useState } from 'react';
import { BackendAuthError } from '../../utils/backendAuth';
import { fetchAdminRequests, type BackendAdminRequest, type BackendRequestStatus, updateAdminRequest } from '../../utils/backendAdmin';

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

function formatBudget(value: BackendAdminRequest['budget']): string {
  if (value == null) return 'N/A';
  if (typeof value === 'number' && Number.isFinite(value)) return value.toLocaleString();
  if (typeof value === 'string' && value.trim().length > 0) return value;
  return 'N/A';
}

function deriveRequestTitle(request: BackendAdminRequest): string {
  const description = request.description ?? '';
  const match = description.match(/^Service:\s*(.+)$/m);
  const service = match?.[1]?.trim();
  return service && service.length > 0 ? service : 'Service request';
}

export function AdminRequests() {
  const [requests, setRequests] = useState<BackendAdminRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const requestById = useMemo(() => {
    const map = new Map<string, BackendAdminRequest>();
    requests.forEach((r) => map.set(r.id, r));
    return map;
  }, [requests]);

  const loadRequests = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const next = await fetchAdminRequests();
      setRequests(next);
    } catch (err) {
      const status = err instanceof BackendAuthError ? err.status : undefined;
      if (status === 401) {
        setError('Please login as an admin to view requests.');
      } else if (status === 403) {
        setError('Admin access required.');
      } else if (status === 0 && err instanceof BackendAuthError) {
        setError(err.message);
      } else {
        setError(err instanceof Error ? err.message : 'Could not load requests.');
      }
      setRequests([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const markReceived = useCallback(
    async (requestId: string) => {
      const existing = requestById.get(requestId);
      if (!existing) return;
      if (existing.status === 'IN_REVIEW') return;

      setUpdatingId(requestId);
      setActionError(null);

      const nextStatus: BackendRequestStatus = 'IN_REVIEW';
      setRequests((prev) => prev.map((r) => (r.id === requestId ? { ...r, status: nextStatus } : r)));

      try {
        const updated = await updateAdminRequest(requestId, { status: nextStatus });
        setRequests((prev) => prev.map((r) => (r.id === requestId ? updated : r)));
      } catch (err) {
        setRequests((prev) => prev.map((r) => (r.id === requestId ? existing : r)));
        const status = err instanceof BackendAuthError ? err.status : undefined;
        if (status === 401) setActionError('Please login again to update this request.');
        else if (status === 403) setActionError('Admin access required.');
        else if (status === 0 && err instanceof BackendAuthError) setActionError(err.message);
        else setActionError(err instanceof Error ? err.message : 'Could not update request.');
      } finally {
        setUpdatingId(null);
      }
    },
    [requestById]
  );

  const markResolved = useCallback(
    async (requestId: string) => {
      const existing = requestById.get(requestId);
      if (!existing) return;
      if (existing.status === 'RESOLVED') return;

      setUpdatingId(requestId);
      setActionError(null);

      const nextStatus: BackendRequestStatus = 'RESOLVED';
      setRequests((prev) => prev.map((r) => (r.id === requestId ? { ...r, status: nextStatus } : r)));

      try {
        const updated = await updateAdminRequest(requestId, { status: nextStatus });
        setRequests((prev) => prev.map((r) => (r.id === requestId ? updated : r)));
      } catch (err) {
        setRequests((prev) => prev.map((r) => (r.id === requestId ? existing : r)));
        const status = err instanceof BackendAuthError ? err.status : undefined;
        if (status === 401) setActionError('Please login again to update this request.');
        else if (status === 403) setActionError('Admin access required.');
        else if (status === 0 && err instanceof BackendAuthError) setActionError(err.message);
        else setActionError(err instanceof Error ? err.message : 'Could not update request.');
      } finally {
        setUpdatingId(null);
      }
    },
    [requestById]
  );

  useEffect(() => {
    void loadRequests();

    const onVisibility = () => {
      if (document.visibilityState === 'visible') void loadRequests();
    };

    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [loadRequests]);

  return (
    <main className="pt-16">

      <section className="ykb-section bg-dark-light">
        <div className="ykb-container">
          {error ? (
            <div className="ykb-card p-6 text-center">
              <h2 className="text-2xl font-bold text-primary mb-2">Could not load requests</h2>
              <p className="text-textSecondary">{error}</p>
            </div>
          ) : (
            <>
              {actionError ? <div className="ykb-alert ykb-alert-error mb-4">{actionError}</div> : null}

              {isLoading ? (
                <div className="ykb-card p-6 text-center">
                  <h2 className="text-2xl font-bold text-primary mb-2">Loading…</h2>
                  <p className="text-textSecondary">Fetching requests from the backend.</p>
                </div>
              ) : requests.length === 0 ? (
                <div className="ykb-card p-6 text-center">
                  <h2 className="text-2xl font-bold text-primary mb-2">No requests yet</h2>
                  <p className="text-textSecondary">Submit one from the client side at /request.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {requests.map((r) => (
                    <div key={r.id} className="ykb-card">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h2 className="text-xl font-bold text-primary">{deriveRequestTitle(r)}</h2>
                          <p className="text-textSecondary text-sm">{formatDate(r.createdAt)}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className="text-xs text-textSecondary">{r.id}</span>
                          {r.status === 'PENDING' ? (
                            <button
                              type="button"
                              onClick={() => void markReceived(r.id)}
                              disabled={updatingId === r.id}
                              className="ykb-button-solid px-3 py-1.5 text-xs disabled:opacity-70"
                            >
                              {updatingId === r.id ? 'Updating…' : 'Mark received'}
                            </button>
                          ) : r.status === 'IN_REVIEW' ? (
                            <button
                              type="button"
                              onClick={() => void markResolved(r.id)}
                              disabled={updatingId === r.id}
                              className="ykb-button-solid px-3 py-1.5 text-xs disabled:opacity-70"
                            >
                              {updatingId === r.id ? 'Updating…' : 'Mark resolved'}
                            </button>
                          ) : null}
                        </div>
                      </div>

                      <div className="mt-4 space-y-2 text-sm">
                        <div className="text-textSecondary">
                          <span className="font-semibold text-primary">Client:</span> {r.user?.name || r.user?.email || 'N/A'}
                        </div>
                        <div className="text-textSecondary">
                          <span className="font-semibold text-primary">Phone:</span> {r.user?.phone || 'N/A'}
                        </div>
                        <div className="text-textSecondary">
                          <span className="font-semibold text-primary">Status:</span> {r.status}
                        </div>
                        <div className="text-textSecondary">
                          <span className="font-semibold text-primary">Location:</span> {r.location}
                        </div>
                        <div className="text-textSecondary">
                          <span className="font-semibold text-primary">Preferred date:</span>{' '}
                          {r.preferredDate ? formatDate(r.preferredDate) : 'N/A'}
                        </div>
                        <div className="text-textSecondary">
                          <span className="font-semibold text-primary">Budget:</span> {formatBudget(r.budget)}
                        </div>
                        <div className="text-textSecondary">
                          <span className="font-semibold text-primary">Description:</span> {r.description}
                        </div>
                        {r.customerNotes ? (
                          <div className="text-textSecondary whitespace-pre-wrap">
                            <span className="font-semibold text-primary">Customer notes:</span> {r.customerNotes}
                          </div>
                        ) : null}
                        {r.adminNotes ? (
                          <div className="text-textSecondary">
                            <span className="font-semibold text-primary">Admin notes:</span> {r.adminNotes}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
}
