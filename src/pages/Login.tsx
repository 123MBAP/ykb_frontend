import { useEffect, useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { login as loginMock, seedAuthIfEmpty } from '../utils/auth';
import { BackendAuthError, loginBackend } from '../utils/backendAuth';

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Helps you test quickly without registering first.
    seedAuthIfEmpty();
  }, []);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const next = new URLSearchParams(location.search).get('next');
    const safeNext = next && next.startsWith('/') ? next : null;

    try {
      const session = await loginBackend(email, password);
      setSuccess(true);
      const dest = safeNext ?? (session.user.role === 'ADMIN' ? '/admin' : '/profile');
      setTimeout(() => navigate(dest), 400);
      return;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Login failed';
      const status = err instanceof BackendAuthError ? err.status : undefined;

      // If the backend says "invalid credentials", fall back to the existing mocked auth
      // so the demo accounts still work.
      if (status === 401 || status === 404) {
        const res = loginMock(email, password);
        if (!res.ok) {
          setError(res.message);
          return;
        }
        setSuccess(true);
        setTimeout(() => navigate(safeNext ?? '/profile'), 400);
        return;
      }

      setError(msg);
      return;
    }
  };

  return (
    <main className="pt-16">
      <section className="bg-black border-b border-primary py-12 px-4 sm:px-6 lg:px-8">
        <div className="ykb-container">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-3">Login</h1>
          <p className="text-lg text-gray-400">Sign in to your account.</p>
        </div>
      </section>

      <section className="ykb-section px-4 sm:px-6 lg:px-8 bg-dark-light">
        <div className="ykb-container">
          <div className="max-w-md mx-auto">
            <div className="ykb-card">
              <form onSubmit={submit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-2" htmlFor="email">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="ykb-field"
                    autoComplete="email"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-2" htmlFor="password">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="ykb-field"
                    autoComplete="current-password"
                    placeholder="Your password"
                  />
                </div>

                {error ? (
                  <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-200">
                    {error}
                  </div>
                ) : null}

                {success ? (
                  <div className="rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-gray-200">
                    Logged in. Redirecting…
                  </div>
                ) : null}

                <button type="submit" className="w-full ykb-button-solid py-3 px-6">
                  Login
                </button>

                <p className="text-sm text-gray-400 text-center">
                  Don’t have an account?{' '}
                  <Link to="/register" className="text-primary hover:underline">
                    Register
                  </Link>
                </p>

                <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-gray-300/80">
                  Test account: <span className="text-gray-200">starter@example.com</span> /{' '}
                  <span className="text-gray-200">password123</span>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
