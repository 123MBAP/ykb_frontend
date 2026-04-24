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
      <section className="bg-black border-b border-primary py-12 px-4 sm:px-6 lg:px-8">
        <div className="ykb-container">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-3">Client Requests</h1>
          <p className="text-lg text-gray-400">
            Mocked requests inbox. Requests are stored in this browser’s localStorage.
          </p>
        </div>
      </section>

      <section className="ykb-section px-4 sm:px-6 lg:px-8 bg-dark-light">
        <div className="ykb-container">
          {requests.length === 0 ? (
            <div className="ykb-card p-8 text-center">
              <h2 className="text-2xl font-bold text-white mb-2">No requests yet</h2>
              <p className="text-gray-300/80">Submit one from the client side at /request.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {requests.map((r) => (
                <div key={r.id} className="ykb-card p-7">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-white">{r.service}</h2>
                      <p className="text-gray-400 text-sm">{formatDate(r.createdAt)}</p>
                    </div>
                    <span className="text-xs text-gray-400">{r.id}</span>
                  </div>

                  <div className="mt-4 space-y-2 text-sm">
                    <div className="text-gray-300/80">
                      <span className="text-gray-500">Client:</span> {r.name}
                    </div>
                    <div className="text-gray-300/80">
                      <span className="text-gray-500">Phone:</span> {r.phone || 'N/A'}
                    </div>
                    <div className="text-gray-300/80">
                      <span className="text-gray-500">Needs:</span> {r.details}
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
