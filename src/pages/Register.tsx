import { useMemo, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { services } from '../data/services';
import { registerUser, type UserRole } from '../utils/auth';

const COUNTRY_CODES = [
  { label: 'Rwanda (+250)', value: '+250' },
  { label: 'Kenya (+254)', value: '+254' },
  { label: 'Uganda (+256)', value: '+256' },
  { label: 'Tanzania (+255)', value: '+255' },
  { label: 'DRC (+243)', value: '+243' },
];

function onlyDigits(value: string): string {
  return value.replace(/\D/g, '');
}

export function Register() {
  const navigate = useNavigate();

  const serviceOptions = useMemo(() => services.map((s) => s.title), []);

  const [role, setRole] = useState<UserRole>('starter');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [common, setCommon] = useState({
    name: '',
    email: '',
    password: '',
    confirm: '',
  });

  const [provider, setProvider] = useState({
    businessName: '',
    service: serviceOptions[0] ?? '',
    location: '',
    phone: '',
  });

  const [starter, setStarter] = useState({
    country: 'Rwanda',
    countryCode: '+250',
    phoneLocal: '',
  });

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (common.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (common.password !== common.confirm) {
      setError('Password and confirm password do not match.');
      return;
    }

    if (role === 'serviceProvider') {
      const res = registerUser({
        role: 'serviceProvider',
        name: common.name.trim(),
        businessName: provider.businessName.trim(),
        service: provider.service,
        location: provider.location.trim(),
        phone: provider.phone.trim(),
        email: common.email.trim(),
        password: common.password,
      });

      if (!res.ok) {
        setError(res.message);
        return;
      }

      setSuccess(true);
      return;
    }

    const phone = `${starter.countryCode} ${starter.phoneLocal}`.trim();

    const res = registerUser({
      role: 'starter',
      name: common.name.trim(),
      country: starter.country,
      phone,
      email: common.email.trim(),
      password: common.password,
    });

    if (!res.ok) {
      setError(res.message);
      return;
    }

    setSuccess(true);
  };

  return (
    <main className="pt-16">
      <section className="bg-black border-b border-primary py-12 px-4 sm:px-6 lg:px-8">
        <div className="ykb-container">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-3">Create Account</h1>
          <p className="text-lg text-gray-400">
            Register as a Starter or Service Provider (mocked — stored in this browser).
          </p>
        </div>
      </section>

      <section className="ykb-section px-4 sm:px-6 lg:px-8 bg-dark-light">
        <div className="ykb-container">
          <div className="max-w-2xl mx-auto">
            <div className="ykb-card">
              {!success ? (
                <form onSubmit={submit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-200 mb-2" htmlFor="role">
                      Register as
                    </label>
                    <select
                      id="role"
                      value={role}
                      onChange={(e) => setRole(e.target.value as UserRole)}
                      className="ykb-field"
                    >
                      <option value="starter">Starter</option>
                      <option value="serviceProvider">Service Provider</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-200 mb-2" htmlFor="name">
                        Full name
                      </label>
                      <input
                        id="name"
                        required
                        value={common.name}
                        onChange={(e) => setCommon((p) => ({ ...p, name: e.target.value }))}
                        className="ykb-field"
                        placeholder="e.g., Aline"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-200 mb-2" htmlFor="email">
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        required
                        value={common.email}
                        onChange={(e) => setCommon((p) => ({ ...p, email: e.target.value }))}
                        className="ykb-field"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  {role === 'serviceProvider' ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-200 mb-2" htmlFor="businessName">
                          Business name
                        </label>
                        <input
                          id="businessName"
                          required
                          value={provider.businessName}
                          onChange={(e) => setProvider((p) => ({ ...p, businessName: e.target.value }))}
                          className="ykb-field"
                          placeholder="e.g., Kigali Pro Plumbers"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-200 mb-2" htmlFor="service">
                          Service
                        </label>
                        <select
                          id="service"
                          required
                          value={provider.service}
                          onChange={(e) => setProvider((p) => ({ ...p, service: e.target.value }))}
                          className="ykb-field"
                        >
                          {serviceOptions.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-200 mb-2" htmlFor="location">
                            Location
                          </label>
                          <input
                            id="location"
                            required
                            value={provider.location}
                            onChange={(e) => setProvider((p) => ({ ...p, location: e.target.value }))}
                            className="ykb-field"
                            placeholder="e.g., Remera, Kigali"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-200 mb-2" htmlFor="phone">
                            Phone number
                          </label>
                          <input
                            id="phone"
                            required
                            value={provider.phone}
                            onChange={(e) => setProvider((p) => ({ ...p, phone: e.target.value }))}
                            className="ykb-field"
                            placeholder="e.g., 0798 891 543"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-200 mb-2" htmlFor="country">
                          Country
                        </label>
                        <input
                          id="country"
                          required
                          value={starter.country}
                          onChange={(e) => setStarter((p) => ({ ...p, country: e.target.value }))}
                          className="ykb-field"
                          placeholder="e.g., Rwanda"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-200 mb-2" htmlFor="starterPhone">
                          Phone number (with country code)
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <select
                            value={starter.countryCode}
                            onChange={(e) => setStarter((p) => ({ ...p, countryCode: e.target.value }))}
                            className="ykb-field"
                            aria-label="Country code"
                          >
                            {COUNTRY_CODES.map((c) => (
                              <option key={c.value} value={c.value}>
                                {c.label}
                              </option>
                            ))}
                          </select>
                          <input
                            id="starterPhone"
                            required
                            value={starter.phoneLocal}
                            onChange={(e) =>
                              setStarter((p) => ({ ...p, phoneLocal: onlyDigits(e.target.value).slice(0, 12) }))
                            }
                            className="ykb-field sm:col-span-2"
                            inputMode="numeric"
                            placeholder="e.g., 798891543"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-200 mb-2" htmlFor="password">
                        Password
                      </label>
                      <input
                        id="password"
                        type="password"
                        required
                        value={common.password}
                        onChange={(e) => setCommon((p) => ({ ...p, password: e.target.value }))}
                        className="ykb-field"
                        autoComplete="new-password"
                        placeholder="Create a password"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-200 mb-2" htmlFor="confirm">
                        Confirm password
                      </label>
                      <input
                        id="confirm"
                        type="password"
                        required
                        value={common.confirm}
                        onChange={(e) => setCommon((p) => ({ ...p, confirm: e.target.value }))}
                        className="ykb-field"
                        autoComplete="new-password"
                        placeholder="Repeat password"
                      />
                    </div>
                  </div>

                  {error ? (
                    <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-200">
                      {error}
                    </div>
                  ) : null}

                  <button type="submit" className="w-full ykb-button-solid py-3 px-6">
                    Create account
                  </button>

                  <p className="text-sm text-gray-400 text-center">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary hover:underline">
                      Login
                    </Link>
                  </p>
                </form>
              ) : (
                <div className="space-y-5">
                  <div className="rounded-2xl border border-primary/30 bg-primary/10 p-6">
                    <h2 className="text-2xl font-bold text-white">Account created</h2>
                    <p className="text-gray-300/80 mt-1">
                      Your account was saved (mocked) in localStorage.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button onClick={() => navigate('/login')} className="ykb-button-solid px-6 py-3">
                      Go to login
                    </button>
                    <button
                      onClick={() => {
                        setSuccess(false);
                        setError(null);
                        setCommon({ name: '', email: '', password: '', confirm: '' });
                        setProvider({ businessName: '', service: serviceOptions[0] ?? '', location: '', phone: '' });
                        setStarter({ country: 'Rwanda', countryCode: '+250', phoneLocal: '' });
                      }}
                      className="ykb-button-outline px-6 py-3"
                    >
                      Create another
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
