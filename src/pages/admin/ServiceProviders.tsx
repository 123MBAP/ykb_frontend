import { serviceProviders } from '../../data/providers';

export function AdminServiceProviders() {
  return (
    <main className="pt-16">
      <section className="bg-black border-b border-primary py-12 px-4 sm:px-6 lg:px-8">
        <div className="ykb-container">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-3">Service Providers</h1>
          <p className="text-lg text-gray-400">Mocked list of providers registered to services.</p>
        </div>
      </section>

      <section className="ykb-section px-4 sm:px-6 lg:px-8 bg-dark-light">
        <div className="ykb-container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {serviceProviders.map((p) => (
              <div key={p.id} className="ykb-card ykb-card-hover p-7">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h2 className="text-xl font-bold text-white">{p.name}</h2>
                    <p className="text-primary font-medium">{p.service}</p>
                  </div>
                  <span className="text-xs text-gray-400">{p.id}</span>
                </div>
                <p className="text-gray-300/80 mb-3">{p.note}</p>
                <div className="space-y-1 text-sm text-gray-400">
                  <div>
                    <span className="text-gray-500">Location:</span> {p.location}
                  </div>
                  {p.phone ? (
                    <div>
                      <span className="text-gray-500">Phone:</span> {p.phone}
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
