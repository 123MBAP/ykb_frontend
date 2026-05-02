import { Link } from 'react-router-dom';

export function AdminDashboard() {
  return (
    <main className="pt-16">

      <section className="ykb-section bg-dark-light">
        <div className="ykb-container">
          <div className="overflow-hidden rounded-lg border border-border bg-border">
            <div className="grid grid-cols-1 gap-px md:grid-cols-2">
              <Link to="/admin/providers" className="group block bg-white p-5 transition-colors hover:bg-surface/60">
                <h2 className="text-lg font-semibold text-primary mb-1 transition-colors group-hover:text-secondary">Service Providers</h2>
                <p className="text-sm text-textSecondary">View the available service providers registered under different services.</p>
              </Link>

              <Link to="/admin/requests" className="group block bg-white p-5 transition-colors hover:bg-surface/60">
                <h2 className="text-lg font-semibold text-primary mb-1 transition-colors group-hover:text-secondary">Requests</h2>
                <p className="text-sm text-textSecondary">See client requests submitted through the app (stored locally for now).</p>
              </Link>

              <Link to="/admin/translators" className="group block bg-white p-5 transition-colors hover:bg-surface/60">
                <h2 className="text-lg font-semibold text-primary mb-1 transition-colors group-hover:text-secondary">Translator Languages</h2>
                <p className="text-sm text-textSecondary">Create languages and set dynamic prices like hour/week/day.</p>
              </Link>

              <Link to="/admin/starter-guide" className="group block bg-white p-5 transition-colors hover:bg-surface/60">
                <h2 className="text-lg font-semibold text-primary mb-1 transition-colors group-hover:text-secondary">Starter Guide Categories</h2>
                <p className="text-sm text-textSecondary">Create categories with optional subcategories like clinics, hospitals, pharmacies, and more.</p>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
