import { useEffect, useState } from 'react';
import { ServiceCard } from '../components/ServiceCard';

type PublicService = {
  id: number;
  title: string;
  description: string;
};

type ApiErrorResponse = {
  error?: {
    message?: unknown;
  };
};

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api';

async function readApiErrorMessage(response: Response): Promise<string> {
  try {
    const data = (await response.json()) as ApiErrorResponse;
    const message = data?.error?.message;
    if (typeof message === 'string' && message.trim().length > 0) return message;
  } catch {
    // ignore
  }

  return `Request failed (${response.status})`;
}

export function Services() {
  const [services, setServices] = useState<PublicService[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setStatus('loading');
      setError(null);

      try {
        const response = await fetch(`${API_BASE}/services`);
        if (!response.ok) throw new Error(await readApiErrorMessage(response));

        const json = (await response.json()) as { services?: PublicService[] };
        const list = Array.isArray(json.services) ? json.services : [];

        if (!mounted) return;
        setServices(list);
        setStatus('ready');
      } catch (err) {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : 'Could not load services.');
        setServices([]);
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
          <h1 className="text-3xl md:text-4xl font-serif text-start font-bold text-primary mb-2">Services</h1>
          <p className="text-sm text-textSecondary mb-6">Explore available services and request what you need.</p>

          {status === 'loading' || status === 'idle' ? (
            <div className="ykb-card">
              <p className="text-sm text-textSecondary">Loading services…</p>
            </div>
          ) : status === 'error' ? (
            <div className="ykb-card">
              <div className="ykb-alert ykb-alert-error">{error ?? 'Could not load services.'}</div>
            </div>
          ) : services.length === 0 ? (
            <div className="ykb-card">
              <div className="ykb-alert ykb-alert-info">No services available yet.</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service, index) => (
                <ServiceCard
                  key={service.id}
                  title={service.title}
                  description={service.description}
                  count={index + 1}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
