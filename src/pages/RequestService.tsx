import { useMemo, useState, type FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { services } from '../data/services';
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

  const serviceOptions = useMemo(() => {
    const base = services.map((s) => s.title);
    const extra = ['Service Provider Booking', 'Custom Service'];
    return Array.from(new Set([...base, ...extra]));
  }, []);

  const [form, setForm] = useState({
    service: presetService && serviceOptions.includes(presetService) ? presetService : '',
    name: '',
    phone: '',
    details: '',
  });

  const [submittedRequest, setSubmittedRequest] = useState<ServiceRequest | null>(null);

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

  return (
    <main>
      <section className="bg-black border-b border-primary py-12 px-4 sm:px-6 lg:px-8">
        <div className="ykb-container">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-3">Request a Service</h1>
          <p className="text-lg text-gray-400">
            Tell us what you need. Your request will appear in the admin dashboard (mocked) and you can also send it directly to WhatsApp.
          </p>
        </div>
      </section>

      <section className="ykb-section px-4 sm:px-6 lg:px-8 bg-dark-light">
        <div className="max-w-2xl mx-auto">
          <div className="ykb-surface p-8">
            {!submittedRequest ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-lg font-serif font-semibold text-primary mb-3" htmlFor="service">
                    Which service do you need?
                  </label>
                  <select
                    id="service"
                    required
                    value={form.service}
                    onChange={(e) => setForm((prev) => ({ ...prev, service: e.target.value }))}
                    className="ykb-field"
                  >
                    <option value="">Select a service</option>
                    {serviceOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-lg font-serif font-semibold text-primary mb-3" htmlFor="name">
                    Your name
                  </label>
                  <input
                    id="name"
                    required
                    value={form.name}
                    onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                    className="ykb-field"
                    placeholder="e.g., Aline"
                  />
                </div>

                <div>
                  <label className="block text-lg font-serif font-semibold text-primary mb-3" htmlFor="phone">
                    Phone number (optional)
                  </label>
                  <input
                    id="phone"
                    value={form.phone}
                    onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                    className="ykb-field"
                    placeholder="e.g., 0798 891 543"
                  />
                </div>

                <div>
                  <label className="block text-lg font-serif font-semibold text-primary mb-3" htmlFor="details">
                    What do you need?
                  </label>
                  <textarea
                    id="details"
                    required
                    value={form.details}
                    onChange={(e) => setForm((prev) => ({ ...prev, details: e.target.value }))}
                    className="ykb-field min-h-[140px]"
                    placeholder="Describe your needs, timing, location, and any important details."
                  />
                </div>

                <button type="submit" className="w-full ykb-button-solid py-3 px-6">
                  Submit Request
                </button>

                <p className="text-sm text-gray-400">
                  After submitting, we’ll reach out on WhatsApp/call using the info provided.
                </p>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="ykb-card p-6">
                  <h2 className="text-2xl font-bold text-white mb-2">Request received</h2>
                  <p className="text-gray-300/80">
                    Your request was saved (mocked) and will appear in the admin Requests page.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button onClick={sendToWhatsApp} className="ykb-button-solid px-6 py-3">
                    Send to WhatsApp
                  </button>
                  <button onClick={() => navigate('/')} className="ykb-button-outline px-6 py-3">
                    Back Home
                  </button>
                </div>

                <button
                  onClick={() => {
                    setSubmittedRequest(null);
                    setForm({ service: '', name: '', phone: '', details: '' });
                  }}
                  className="ykb-button-outline px-6 py-3"
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
