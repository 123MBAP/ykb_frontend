import { Link } from 'react-router-dom';

export function AdminDashboard() {
  return (
    <main className="pt-16">
      <section className="bg-black border-b border-primary py-12 px-4 sm:px-6 lg:px-8">
        <div className="ykb-container">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-3">Admin Dashboard</h1>
          <p className="text-lg text-gray-400">Mocked admin area for managing requests and service providers.</p>
        </div>
      </section>

      <section className="ykb-section px-4 sm:px-6 lg:px-8 bg-dark-light">
        <div className="ykb-container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Link to="/admin/providers" className="ykb-card ykb-card-hover p-8 block">
              <h2 className="text-2xl font-bold text-white mb-2">Service Providers</h2>
              <p className="text-gray-300/80">View the available service providers registered under different services.</p>
            </Link>

            <Link to="/admin/requests" className="ykb-card ykb-card-hover p-8 block">
              <h2 className="text-2xl font-bold text-white mb-2">Requests</h2>
              <p className="text-gray-300/80">See client requests submitted through the app (stored locally for now).</p>
            </Link>

            <Link to="/admin/translators" className="ykb-card ykb-card-hover p-8 block">
              <h2 className="text-2xl font-bold text-white mb-2">Translator Languages</h2>
              <p className="text-gray-300/80">Create languages and set dynamic prices like hour/week/day.</p>
            </Link>

            <Link to="/admin/starter-guide" className="ykb-card ykb-card-hover p-8 block">
              <h2 className="text-2xl font-bold text-white mb-2">Starter Guide Categories</h2>
              <p className="text-gray-300/80">Create categories with optional subcategories like clinics, hospitals, pharmacies, and more.</p>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
