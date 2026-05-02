import { useMemo } from 'react';
import { readJson } from '../../utils/storage';

type ServiceRequest = {
  id: string;
  createdAt: string;
  service: string;
  name: string;
  phone: string;
  details: string;
};

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

export function AdminRequests() {
  const requests = useMemo(() => readJson<ServiceRequest[]>('serviceRequests', []), []);

  return (
    <main className="pt-16">

      <section className="ykb-section bg-dark-light">
        <div className="ykb-container">
          {requests.length === 0 ? (
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
                      <h2 className="text-xl font-bold text-primary">{r.service}</h2>
                      <p className="text-textSecondary text-sm">{formatDate(r.createdAt)}</p>
                    </div>
                    <span className="text-xs text-textSecondary">{r.id}</span>
                  </div>

                  <div className="mt-4 space-y-2 text-sm">
                    <div className="text-textSecondary">
                      <span className="font-semibold text-primary">Client:</span> {r.name}
                    </div>
                    <div className="text-textSecondary">
                      <span className="font-semibold text-primary">Phone:</span> {r.phone || 'N/A'}
                    </div>
                    <div className="text-textSecondary">
                      <span className="font-semibold text-primary">Needs:</span> {r.details}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
