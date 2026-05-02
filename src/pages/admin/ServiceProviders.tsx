import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { BackendAuthError } from '../../utils/backendAuth';
import { fetchAdminProviders } from '../../utils/backendAdmin';
import type { BackendProviderProfile } from '../../utils/backendProviders';

export function AdminServiceProviders() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [providers, setProviders] = useState<BackendProviderProfile[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const serviceFilter = searchParams.get('service');
  const normalizedServiceFilter = (serviceFilter ?? '').trim().toLowerCase();

  const filteredProviders = normalizedServiceFilter
    ? providers.filter((provider) => {
        const mainService = (provider.mainService ?? '').trim().toLowerCase();
        if (mainService && (mainService === normalizedServiceFilter || mainService.includes(normalizedServiceFilter))) {
          return true;
        }

        const offerings = provider.serviceOfferings;
        if (Array.isArray(offerings)) {
          return offerings.some((o) => {
            const name = (o?.name ?? '').trim().toLowerCase();
            return name === normalizedServiceFilter || name.includes(normalizedServiceFilter);
          });
        }

        return false;
      })
    : providers;

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setStatus('loading');
      setError(null);

      try {
        const result = await fetchAdminProviders();
        if (!mounted) return;
        setProviders(result);
        setStatus('ready');
      } catch (err) {
        if (!mounted) return;
        const message = err instanceof BackendAuthError ? err.message : 'Could not load service providers.';
        setError(message);
        setStatus('error');
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <main className="pt-16">

      <section className="ykb-section bg-dark-light">
        <div className="ykb-container">
          {serviceFilter ? (
            <div className="mb-4 ykb-card flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.22em] text-textSecondary">Filtered by service</div>
                <div className="mt-1 text-lg font-semibold text-primary">{serviceFilter}</div>
                <div className="mt-1 text-sm text-textSecondary">Showing {filteredProviders.length} provider(s).</div>
              </div>
              <button
                type="button"
                className="ykb-button-outline"
                onClick={() => setSearchParams({})}
              >
                Clear filter
              </button>
            </div>
          ) : null}

          {status === 'loading' || status === 'idle' ? (
            <div className="ykb-card">
              <p className="text-sm text-textSecondary">Loading service providers…</p>
            </div>
          ) : status === 'error' ? (
            <div className="ykb-card">
              <div className="ykb-alert ykb-alert-error">{error ?? 'Could not load service providers.'}</div>
            </div>
          ) : filteredProviders.length === 0 ? (
            <div className="ykb-card">
              <div className="ykb-alert ykb-alert-info">No service providers match this service yet.</div>
            </div>
          ) : (
            <div className="overflow-hidden rounded-lg border border-border bg-border">
              <div className="grid grid-cols-1 gap-px md:grid-cols-2 lg:grid-cols-3">
                {filteredProviders.map((p) => (
                  <Link
                    key={p.id}
                    to={`/admin/providers/${p.id}`}
                    className="bg-white p-5 transition-colors hover:bg-surface/60"
                  >
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <h2 className="text-base font-semibold text-primary">{p.businessName ?? p.user?.name ?? 'Service Provider'}</h2>
                        <p className="text-sm text-primary font-medium">{p.mainService ?? '—'}</p>
                      </div>
                      <span className="text-xs text-textSecondary">{p.status}</span>
                    </div>

                    <div className="space-y-1 text-sm text-textSecondary">
                      <div>
                        <span className="font-semibold text-primary">Location:</span> {p.location ?? '—'}
                      </div>
                      <div>
                        <span className="font-semibold text-primary">Email:</span> {p.user?.email ?? '—'}
                      </div>
                      {p.user?.phone ? (
                        <div>
                          <span className="font-semibold text-primary">Phone:</span> {p.user.phone}
                        </div>
                      ) : null}
                      <div>
                        <span className="font-semibold text-primary">Services:</span>{' '}
                        {Array.isArray(p.serviceOfferings) ? p.serviceOfferings.length : 0}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
