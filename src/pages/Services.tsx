import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, BookOpenText, CircleHelp, Compass, ExternalLink, Languages, Smartphone } from 'lucide-react';
import { ServiceCard } from '../components/ServiceCard';
import { openWhatsApp } from '../utils/whatsapp';

type PublicService = {
  id: number;
  title: string;
  description: string;
};

type Language = {
  id: number;
  title: string;
  prices: Record<string, number>;
};

type StarterGuideCategoryGroup = 'APP' | 'INFRASTRUCTURE' | 'OTHERS';

type StarterGuideCategory = {
  id: number;
  category: string;
  group?: StarterGuideCategoryGroup | null;
  subcategories: string[] | null;
};

type ProviderServiceOffering = {
  name: string;
  price: string;
  description?: string;
};

type ProviderSummary = {
  id: string;
  businessName?: string | null;
  mainService?: string | null;
  serviceOfferings?: unknown;
  user?: {
    id?: string;
    name?: string;
  };
};

type ProviderApp = {
  id: string;
  appName: string;
  providerName: string;
  webAppUrl: string | null;
  playStoreUrl: string | null;
  appStoreUrl: string | null;
};

const FALLBACK_GUIDE_BLOCKS = [
  {
    title: 'First 24 Hours',
    items: ['Get a SIM card (MTN/Airtel)', 'Set up Mobile Money', 'Exchange currency safely'],
  },
  {
    title: 'Emergency Contacts',
    items: ['Police: 112', 'Ambulance: 911', 'Medical emergency: 912'],
  },
  {
    title: 'Internet & Housing',
    items: ['Mobile data plans are affordable', 'Fiber options available', 'Apartments and Airbnb options in Kigali'],
  },
];

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

function normalizeHttpUrl(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed) return null;

  try {
    const url = new URL(trimmed);
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.toString() : null;
  } catch {
    // try with https prefix for plain domains
  }

  try {
    const withProtocol = new URL(`https://${trimmed}`);
    return withProtocol.toString();
  } catch {
    return null;
  }
}

function parseServiceOfferings(value: unknown): ProviderServiceOffering[] {
  if (!Array.isArray(value)) return [];

  const rows: ProviderServiceOffering[] = [];

  value.forEach((item) => {
      if (!item || typeof item !== 'object') return;
      const row = item as Record<string, unknown>;
      const name = typeof row.name === 'string' ? row.name.trim() : '';
      const price = typeof row.price === 'string' ? row.price.trim() : '';
      const description = typeof row.description === 'string' ? row.description.trim() : undefined;

      if (!name) return;
      rows.push({ name, price, description });
    });

  return rows;
}

export function Services() {
  const [services, setServices] = useState<PublicService[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [guideCategories, setGuideCategories] = useState<StarterGuideCategory[]>([]);
  const [providers, setProviders] = useState<ProviderSummary[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const sectionLinks = [
    { id: 'all-services', label: 'All Services' },
    { id: 'translator', label: 'Translator' },
    { id: 'apps', label: 'Apps' },
    { id: 'starter-guide', label: 'Starter Guide' },
  ];

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setStatus('loading');
      setError(null);

      try {
        const [servicesResult, languagesResult, categoriesResult, providersResult] = await Promise.allSettled([
          fetch(`${API_BASE}/services`),
          fetch(`${API_BASE}/languages`),
          fetch(`${API_BASE}/starter-guide-categories`),
          fetch(`${API_BASE}/providers`),
        ]);

        if (servicesResult.status !== 'fulfilled') {
          throw new Error('Could not load services.');
        }

        const servicesResponse = servicesResult.value;
        if (!servicesResponse.ok) {
          throw new Error(await readApiErrorMessage(servicesResponse));
        }

        const servicesJson = (await servicesResponse.json()) as { services?: PublicService[] };
        const servicesList = Array.isArray(servicesJson.services) ? servicesJson.services : [];

        let languagesList: Language[] = [];
        if (languagesResult.status === 'fulfilled' && languagesResult.value.ok) {
          const languagesJson = (await languagesResult.value.json()) as { languages?: Language[] };
          languagesList = Array.isArray(languagesJson.languages) ? languagesJson.languages : [];
        }

        let categoriesList: StarterGuideCategory[] = [];
        if (categoriesResult.status === 'fulfilled' && categoriesResult.value.ok) {
          const categoriesJson = (await categoriesResult.value.json()) as { categories?: StarterGuideCategory[] };
          categoriesList = Array.isArray(categoriesJson.categories) ? categoriesJson.categories : [];
        }

        let providersList: ProviderSummary[] = [];
        if (providersResult.status === 'fulfilled' && providersResult.value.ok) {
          const providersJson = (await providersResult.value.json()) as { providers?: ProviderSummary[] };
          providersList = Array.isArray(providersJson.providers) ? providersJson.providers : [];
        }

        if (!mounted) return;
        setServices(servicesList);
        setLanguages(languagesList);
        setGuideCategories(categoriesList);
        setProviders(providersList);
        setStatus('ready');
      } catch (err) {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : 'Could not load services.');
        setServices([]);
        setLanguages([]);
        setGuideCategories([]);
        setProviders([]);
        setStatus('error');
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const topServices = useMemo(() => services.slice(0, 11), [services]);

  const providerApps = useMemo(() => {
    const rows: ProviderApp[] = [];

    providers.forEach((provider) => {
      const offerings = parseServiceOfferings(provider.serviceOfferings);
      const appName = provider.mainService?.trim() || provider.businessName?.trim() || provider.user?.name?.trim() || 'Provider App';
      const providerName = provider.businessName?.trim() || provider.user?.name?.trim() || 'Service Provider';

      let webAppUrl: string | null = null;
      let playStoreUrl: string | null = null;
      let appStoreUrl: string | null = null;

      offerings.forEach((offering) => {
        const name = offering.name.toLowerCase();
        const link = normalizeHttpUrl(offering.description);
        if (!link) return;

        if (name.includes('web app')) {
          webAppUrl = link;
          return;
        }

        if (name.includes('play store')) {
          playStoreUrl = link;
          return;
        }

        if (name.includes('app store')) {
          appStoreUrl = link;
          return;
        }

        if (!webAppUrl) {
          webAppUrl = link;
        }
      });

      if (!webAppUrl && !playStoreUrl && !appStoreUrl) return;

      rows.push({
        id: provider.id,
        appName,
        providerName,
        webAppUrl,
        playStoreUrl,
        appStoreUrl,
      });
    });

    return rows;
  }, [providers]);

  const starterGuideBlocks = useMemo(() => {
    const blocks = guideCategories
      .filter((item) => item.group !== 'APP')
      .slice(0, 3)
      .map((item) => ({
        title: item.category,
        items: Array.isArray(item.subcategories)
          ? item.subcategories.map((sub) => sub.trim()).filter((sub) => sub.length > 0)
          : [],
      }));

    return blocks.length > 0 ? blocks : FALLBACK_GUIDE_BLOCKS;
  }, [guideCategories]);

  return (
    <main className="pt-16 bg-white text-gray-900">
      <section className="ykb-section bg-[#fdfbf7]">
        <div className="ykb-container">
          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-serif text-start font-bold text-primary mb-2">Services</h1>
            <p className="text-sm text-textSecondary">
              Explore everything in one place. Use the top section menu to jump quickly.
            </p>
          </div>

          <div className="sticky top-16 z-20 mb-8 rounded-2xl border border-secondary/25 bg-linear-to-r from-secondary/10 via-white to-primary/5 p-3 shadow-gold backdrop-blur">
            <div className="flex flex-wrap gap-3">
              {sectionLinks.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="whitespace-nowrap rounded-xl border border-secondary/20 bg-white px-5 py-2.5 text-sm font-bold text-primary shadow-sm transition-colors hover:border-secondary hover:bg-secondary hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                >
                  {section.label}
                </a>
              ))}
            </div>
          </div>

          <section
            id="all-services"
            className="scroll-mt-28 mb-12 rounded-3xl border border-secondary/25 border-l-8 border-l-secondary bg-linear-to-br from-secondary/10 via-white to-white p-4 sm:p-6 lg:p-8 shadow-sm"
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-2xl font-bold text-primary">Our Core Services</h2>
              <span className="ykb-pill">Up to 11 services</span>
            </div>
            <p className="mb-4 text-sm text-textSecondary">
              These are the main service categories your clients can request most often.
            </p>

            {status === 'loading' || status === 'idle' ? (
              <div className="ykb-card">
                <p className="text-sm text-textSecondary">Loading services…</p>
              </div>
            ) : status === 'error' ? (
              <div className="ykb-card">
                <div className="ykb-alert ykb-alert-error">{error ?? 'Could not load services.'}</div>
              </div>
            ) : topServices.length === 0 ? (
              <div className="ykb-card">
                <div className="ykb-alert ykb-alert-info">No services available yet.</div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {topServices.map((service, index) => (
                  <ServiceCard
                    key={service.id}
                    title={service.title}
                    description={service.description}
                    count={index + 1}
                  />
                ))}
              </div>
            )}
          </section>

          <section
            id="translator"
            className="scroll-mt-28 mb-12 rounded-3xl border border-border border-l-8 border-l-primary bg-linear-to-br from-primary/5 via-surface/60 to-white p-4 sm:p-6 lg:p-8 shadow-sm"
          >
            <div className="mb-4 flex items-center gap-3">
              <Languages className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold text-primary">Translator Section</h2>
            </div>
            <p className="mb-4 text-sm text-textSecondary">
              Choose a language and request paid translation support directly from this page.
            </p>

            {languages.length === 0 ? (
              <div className="ykb-card">
                <div className="ykb-alert ykb-alert-info">No translator languages are available yet.</div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {languages.map((language) => {
                  const priceRows = Object.entries(language.prices ?? {})
                    .filter(([unit, amount]) => unit.trim().length > 0 && Number.isFinite(amount) && amount > 0)
                    .sort(([a], [b]) => a.localeCompare(b));

                  return (
                    <article key={language.id} className="ykb-card">
                      <h3 className="text-lg font-semibold text-primary">{language.title}</h3>
                      <p className="mt-2 text-xs text-textSecondary">Available pricing options</p>
                      <div className="mt-3 space-y-2">
                        {priceRows.length === 0 ? (
                          <div className="text-sm text-textSecondary">No prices configured yet.</div>
                        ) : (
                          priceRows.map(([unit, amount]) => (
                            <div key={`${language.id}-${unit}`} className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm">
                              <span className="capitalize text-textSecondary">{unit}</span>
                              <span className="font-semibold text-primary">{amount}</span>
                            </div>
                          ))
                        )}
                      </div>

                      <button
                        onClick={() =>
                          openWhatsApp(
                            [
                              'Hello Your Kigali Bestie, I would like to book a translator.',
                              `Language: ${language.title}`,
                            ].join('\n')
                          )
                        }
                        className="mt-4 ykb-button-primary w-full"
                      >
                        <span>Book Translator</span>
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </article>
                  );
                })}
              </div>
            )}
          </section>

          <section
            id="apps"
            className="scroll-mt-28 mb-12 rounded-3xl border border-border border-l-8 border-l-accent bg-linear-to-br from-surface via-white to-secondary/5 p-4 sm:p-6 lg:p-8 shadow-sm"
          >
            <div className="mb-4 flex items-center gap-3">
              <Smartphone className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold text-primary">Apps Section</h2>
            </div>
            <p className="mb-4 text-sm text-textSecondary">
              Available apps provided directly by registered service providers.
            </p>

            {providerApps.length === 0 ? (
              <div className="ykb-card">
                <div className="ykb-alert ykb-alert-info">
                  No provider app links are published yet. Providers can add Web app, Play Store, and App Store links during registration.
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {providerApps.map((app) => (
                  <article key={app.id} className="ykb-card">
                    <h3 className="text-base font-semibold text-primary">{app.appName}</h3>
                    <p className="mt-1 text-xs text-textSecondary">Provider: {app.providerName}</p>

                    <div className="mt-4 space-y-2">
                      {app.webAppUrl ? (
                        <a
                          href={app.webAppUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm text-primary hover:border-secondary/40"
                        >
                          <span>Web App</span>
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      ) : null}

                      {app.playStoreUrl ? (
                        <a
                          href={app.playStoreUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm text-primary hover:border-secondary/40"
                        >
                          <span>Play Store</span>
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      ) : null}

                      {app.appStoreUrl ? (
                        <a
                          href={app.appStoreUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm text-primary hover:border-secondary/40"
                        >
                          <span>App Store</span>
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section
            id="starter-guide"
            className="scroll-mt-28 rounded-3xl border border-border border-l-8 border-l-textSecondary bg-linear-to-br from-primary/5 via-white to-surface p-4 sm:p-6 lg:p-8 shadow-sm"
          >
            <div className="mb-4 flex items-center gap-3">
              <Compass className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold text-primary">Starter Guide Section</h2>
            </div>
            <p className="mb-4 text-sm text-textSecondary">
              Practical Kigali onboarding tips grouped in one easy section.
            </p>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {starterGuideBlocks.map((block) => (
                <article key={block.title} className="ykb-card">
                  <div className="mb-3 flex items-center gap-2">
                    <BookOpenText className="h-5 w-5 text-primary" />
                    <h3 className="text-base font-semibold text-primary">{block.title}</h3>
                  </div>

                  {block.items.length === 0 ? (
                    <p className="text-sm text-textSecondary">More details coming soon.</p>
                  ) : (
                    <ul className="space-y-2">
                      {block.items.map((item) => (
                        <li key={`${block.title}-${item}`} className="text-sm text-textSecondary">
                          • {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </article>
              ))}
            </div>

            <div className="mt-6 ykb-card">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-primary">Need personalized help?</h3>
                  <p className="text-sm text-textSecondary">Talk to Your Kigali Bestie and get direct support today.</p>
                </div>
                <button
                  onClick={() => openWhatsApp('Hello, I would like personalized support from Your Kigali Bestie.')}
                  className="ykb-button-primary"
                >
                  <CircleHelp className="h-4 w-4" />
                  <span>Contact Support</span>
                </button>
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
