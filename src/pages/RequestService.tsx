import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchPublicServices, type PublicService } from '../data/registrationServices';
import { appendJsonArrayItem } from '../utils/storage';
import { openWhatsApp } from '../utils/whatsapp';

type ServiceRequest = {
  id: string;
  createdAt: string;
  service: string;
  name: string;
  phone: string;
  details: string;
};

function useQueryParam(name: string): string {
  const { search } = useLocation();
  return new URLSearchParams(search).get(name) ?? '';
}

export function RequestService() {
  const navigate = useNavigate();
  const presetService = useQueryParam('service');
  const [publicServices, setPublicServices] = useState<PublicService[]>([]);
  const [isLoadingServices, setIsLoadingServices] = useState(true);
  const [submittedRequest, setSubmittedRequest] = useState<ServiceRequest | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadServices = async () => {
      setIsLoadingServices(true);

      try {
        const services = await fetchPublicServices();
        if (!mounted) return;
        setPublicServices(services);
      } catch {
        if (!mounted) return;
        setPublicServices([]);
      } finally {
        if (mounted) setIsLoadingServices(false);
      }
    };

    loadServices();

    return () => {
      mounted = false;
    };
  }, []);

  const serviceOptions = useMemo(() => {
    const base = publicServices.map((service) => service.title);
    const extra = ['Service Provider Booking', 'Custom Service'];
    return Array.from(new Set([...base, ...extra]));
  }, [publicServices]);

  const [form, setForm] = useState({
    service: '',
    name: '',
    phone: '',
    details: '',
  });

  useEffect(() => {
    if (serviceOptions.length === 0) return;

    setForm((prev) => {
      if (prev.service && serviceOptions.includes(prev.service)) return prev;
      if (presetService && serviceOptions.includes(presetService)) {
        return { ...prev, service: presetService };
      }

      const firstService = publicServices[0]?.title ?? '';
      if (!firstService) return prev;

      return { ...prev, service: firstService };
    });
  }, [presetService, publicServices, serviceOptions]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const request: ServiceRequest = {
      id: `req-${Date.now()}`,
      createdAt: new Date().toISOString(),
      service: form.service,
      name: form.name.trim(),
      phone: form.phone.trim(),
      details: form.details.trim(),
    };

    appendJsonArrayItem<ServiceRequest>('serviceRequests', request);
    setSubmittedRequest(request);
  };

  const sendToWhatsApp = () => {
    if (!submittedRequest) return;
    openWhatsApp(
      [
        'Hello Your Kigali Bestie, I would like to request a service:',
        `Service: ${submittedRequest.service}`,
        `Name: ${submittedRequest.name}`,
        `Phone: ${submittedRequest.phone || 'N/A'}`,
        `Needs: ${submittedRequest.details}`,
      ].join('\n')
    );
  };

  const isServiceUnavailable = !isLoadingServices && publicServices.length === 0;

  return (
    <main className="pt-16 bg-white text-gray-900">
      <section className="border-b border-border bg-white py-8">
        <div className="ykb-container">
          <div className="max-w-2xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-textSecondary">Get connected with the service providers</p>
            <h1 className="text-3xl font-semibold text-primary md:text-4xl">Request service</h1>
            <p className="mt-2 max-w-xl text-base leading-relaxed text-textSecondary">
             Tell us what you need help with, and we’ll reach out on WhatsApp/call using the info provided. </p>
          </div>
        </div>
      </section>

      <section className="ykb-section px-4 sm:px-6 lg:px-8 bg-dark-light">
        <div className="max-w-2xl mx-auto">
          <div className="ykb-surface p-4 sm:p-5">
            {!submittedRequest ? (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="block text-sm font-semibold text-primary mb-1" htmlFor="service">
                    Which service do you need?
                  </label>
                  <select
                    id="service"
                    required
                    value={form.service}
                    disabled={isLoadingServices || isServiceUnavailable}
                    onChange={(e) => setForm((prev) => ({ ...prev, service: e.target.value }))}
                    className="ykb-field py-2 text-sm disabled:opacity-70"
                  >
                    <option value="">{isLoadingServices ? 'Loading services…' : 'Select a service'}</option>
                    {serviceOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-primary mb-1" htmlFor="name">
                    Your name
                  </label>
                  <input
                    id="name"
                    required
                    value={form.name}
                    onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                    className="ykb-field py-2 text-sm"
                    placeholder="e.g., Aline"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-primary mb-1" htmlFor="phone">
                    Phone number (optional)
                  </label>
                  <input
                    id="phone"
                    value={form.phone}
                    onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                    className="ykb-field py-2 text-sm"
                    placeholder="e.g., 0798 891 543"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-primary mb-1" htmlFor="details">
                    What do you need?
                  </label>
                  <textarea
                    id="details"
                    required
                    value={form.details}
                    onChange={(e) => setForm((prev) => ({ ...prev, details: e.target.value }))}
                    className="ykb-field py-2 text-sm min-h-[96px]"
                    placeholder="Describe your needs, timing, location, and any important details."
                  />
                </div>

                <button type="submit" className="w-full ykb-button-solid py-2 px-4">
                  Submit Request
                </button>

                <p className="text-xs text-gray-400">
                  After submitting, we’ll reach out on WhatsApp/call using the info provided.
                </p>
              </form>
            ) : (
              <div className="space-y-2">
                <div className="ykb-card p-4">
                  <h2 className="text-xl font-bold text-primary mb-1">Request received</h2>
                  <p className="text-textSecondary">
                    Your request was saved (mocked) and will appear in the admin Requests page.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <button onClick={sendToWhatsApp} className="ykb-button-solid px-4 py-2">
                    Send to WhatsApp
                  </button>
                  <button onClick={() => navigate('/')} className="ykb-button-outline px-4 py-2">
                    Back Home
                  </button>
                </div>

                <button
                  onClick={() => {
                    setSubmittedRequest(null);
                    setForm({ service: '', name: '', phone: '', details: '' });
                  }}
                  className="ykb-button-outline px-4 py-2"
                >
                  Submit another request
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
