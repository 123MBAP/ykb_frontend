import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { MapPin, Mail, Phone, Shield } from 'lucide-react';
import { serviceProviders } from '../data/providers';
import { readJson, writeJson } from '../utils/storage';
import { getBackendSession } from '../utils/backendAuth';
import { fetchProviderMeProfile, type BackendProviderProfile } from '../utils/backendProviders';

type Role = 'serviceProvider' | 'admin' | 'starter';

type ServiceProviderProfile = {
  id: string;
  role: 'serviceProvider';
  name: string;
  service: string;
  location: string;
  price: string;
  phone?: string;
  email: string;
  imageUrl?: string;
};

type AdminProfile = {
  role: 'admin';
  name: string;
  location: string;
  phone: string;
  email: string;
  imageUrl?: string;
};

type StarterProfile = {
  role: 'starter';
  name: string;
  country: string;
  phone: string;
  email: string;
  imageUrl?: string;
};

type ProfileData = ServiceProviderProfile | AdminProfile | StarterProfile;

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((p) => p.trim())
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('');
}

function priceForService(service: string): string {
  switch (service.toLowerCase()) {
    case 'plumbing':
      return '5,000–25,000 RWF (depending on the job)';
    case 'electrical':
      return '10,000–40,000 RWF (depending on the job)';
    case 'cleaning':
      return '15,000–60,000 RWF (home/office size)';
    default:
      return 'Pricing varies by scope';
  }
}

function FieldRow({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: ReactNode;
}) {
  return (
    <div className="flex items-start gap-2 rounded-md border border-border bg-surface px-3 py-2">
      {icon ? <div className="mt-0.5 text-primary">{icon}</div> : null}
      <div className="min-w-0">
        <div className="text-[11px] uppercase tracking-wide text-textSecondary">{label}</div>
        <div className="text-sm text-gray-900 break-words">{value}</div>
      </div>
    </div>
  );
}

export function Profile() {
  const backendSession = getBackendSession();
  const isBackendAuthenticated = Boolean(backendSession?.accessToken);

  const [backendProvider, setBackendProvider] = useState<BackendProviderProfile | null>(null);
  const [backendProviderError, setBackendProviderError] = useState<string | null>(null);
  const [isLoadingBackendProvider, setIsLoadingBackendProvider] = useState(false);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      if (!isBackendAuthenticated) return;
      if (backendSession?.user?.role !== 'PROVIDER') return;

      setIsLoadingBackendProvider(true);
      setBackendProviderError(null);

      try {
        const provider = await fetchProviderMeProfile();
        if (!mounted) return;
        setBackendProvider(provider);
      } catch (err) {
        if (!mounted) return;
        setBackendProvider(null);
        setBackendProviderError(err instanceof Error ? err.message : 'Could not load provider profile');
      } finally {
        if (mounted) setIsLoadingBackendProvider(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [backendSession?.user?.role, isBackendAuthenticated]);

  const providerProfiles: ServiceProviderProfile[] = useMemo(
    () =>
      serviceProviders.map((p) => ({
        id: p.id,
        role: 'serviceProvider',
        name: p.name,
        service: p.service,
        location: p.location,
        price: priceForService(p.service),
        phone: p.phone,
        email: `${p.id}@yourkigalibestie.rw`,
      })),
    []
  );

  const savedRoleRaw = readJson<string>('profileRole', 'starter');
  const initialRole: Role =
    savedRoleRaw === 'serviceProvider' || savedRoleRaw === 'admin' || savedRoleRaw === 'starter'
      ? savedRoleRaw
      : 'starter';

  const savedProviderIdRaw = readJson<string>('profileProviderId', providerProfiles[0]?.id ?? '');
  const initialProviderId = providerProfiles.some((p) => p.id === savedProviderIdRaw)
    ? savedProviderIdRaw
    : providerProfiles[0]?.id ?? '';

  const [role, setRole] = useState<Role>(initialRole);
  const [providerId, setProviderId] = useState<string>(initialProviderId);

  useEffect(() => {
    if (!isBackendAuthenticated) return;

    if (backendSession?.user?.role === 'ADMIN') {
      setRole('admin');
    } else if (backendSession?.user?.role === 'PROVIDER') {
      setRole('serviceProvider');
    } else {
      setRole('starter');
    }
  }, [backendSession?.user?.role, isBackendAuthenticated]);

  useEffect(() => {
    writeJson('profileRole', role);
  }, [role]);

  useEffect(() => {
    if (role === 'serviceProvider') writeJson('profileProviderId', providerId);
  }, [providerId, role]);

  const adminProfile: AdminProfile = {
    role: 'admin',
    name: 'YKB Admin',
    location: 'Kigali, Rwanda',
    phone: '0798 891 543',
    email: 'admin@yourkigalibestie.com',
  };

  const starterProfile: StarterProfile = {
    role: 'starter',
    name: 'Starter Member',
    country: 'Rwanda',
    phone: '07xx xxx xxx',
    email: 'starter@example.com',
  };

  const selectedProfile: ProfileData = useMemo(() => {
    if (role === 'admin') return adminProfile;
    if (role === 'starter') return starterProfile;

    const provider = providerProfiles.find((p) => p.id === providerId) ?? providerProfiles[0];
    return (
      provider ?? {
        id: 'sp-unknown',
        role: 'serviceProvider',
        name: 'Service Provider',
        service: 'Service',
        location: 'Kigali, Rwanda',
        price: 'Pricing varies',
        email: 'provider@yourkigalibestie.rw',
      }
    );
  }, [providerId, providerProfiles, role]);

  const displayName = selectedProfile.name;

  const hasBackendProviderProfile = backendSession?.user?.role === 'PROVIDER' && backendProvider;

  return (
    <main className="pt-16">
      <section className="ykb-section px-2 sm:px-6 lg:px-8 bg-dark-light">
        <h1 className='text-3xl md:text-4xl font-serif text-start font-bold text-primary mb-2'>Profile</h1>
        <div className="ykb-container mx-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
            <div className="lg:col-span-1">
              <div className="ykb-card p-4">
                <h2 className="text-lg font-bold text-primary mb-2">Role Selection</h2>

                {isBackendAuthenticated ? (
                  <div className="mb-3 rounded-md border border-border bg-surface px-3 py-2">
                    <div className="text-[11px] uppercase tracking-wide text-textSecondary">Backend session</div>
                    <div className="mt-1 text-sm text-gray-900 break-words">
                      {backendSession?.user?.email}
                    </div>
                    <div className="mt-1 text-xs text-textSecondary">
                      Role: <span className="font-semibold text-primary">{backendSession?.user?.role}</span>
                    </div>
                  </div>
                ) : null}

                <label className="block text-sm font-semibold text-primary mb-1" htmlFor="role">
                  Choose a role
                </label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value as Role)}
                  className="ykb-field py-2 text-sm"
                  disabled={isBackendAuthenticated}
                >
                  <option value="starter">Starter</option>
                  <option value="serviceProvider">Service Provider</option>
                  <option value="admin">Admin</option>
                </select>

                {role === 'serviceProvider' ? (
                  <div className="mt-3">
                    <label
                      className="block text-sm font-semibold text-primary mb-1"
                      htmlFor="provider"
                    >
                      Select provider
                    </label>
                    <select
                      id="provider"
                      value={providerId}
                      onChange={(e) => setProviderId(e.target.value)}
                      className="ykb-field py-2 text-sm"
                      disabled={isBackendAuthenticated}
                    >
                      {providerProfiles.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} — {p.service}
                        </option>
                      ))}
                    </select>
                    {!isBackendAuthenticated ? (
                      <p className="mt-2 text-sm text-textSecondary">
                        This is mocked. Sign in with the backend to see your real profile.
                      </p>
                    ) : null}
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-textSecondary">
                    This role changes which profile fields are shown.
                  </p>
                )}
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="ykb-card p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                      <span className="text-black font-bold">{getInitials(displayName)}</span>
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-xl font-bold text-primary">{displayName}</h2>
                      <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs text-primary">
                        <Shield className="w-4 h-4" />
                        {selectedProfile.role === 'serviceProvider'
                          ? 'Service Provider'
                          : selectedProfile.role === 'admin'
                            ? 'Admin'
                            : 'Starter'}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-textSecondary">
                      {selectedProfile.role === 'serviceProvider'
                        ? 'Provider profile showing service and pricing.'
                        : selectedProfile.role === 'admin'
                          ? 'Admin profile (mocked contact details).'
                          : 'Starter profile for new users.'}
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
                  <FieldRow label="Phone" value={selectedProfile.phone ?? 'N/A'} icon={<Phone className="w-4 h-4" />} />
                  <FieldRow label="Email" value={selectedProfile.email ?? 'N/A'} icon={<Mail className="w-4 h-4" />} />

                  {selectedProfile.role === 'admin' ? (
                    <FieldRow
                      label="Location"
                      value={selectedProfile.location}
                      icon={<MapPin className="w-4 h-4" />}
                    />
                  ) : null}

                  {selectedProfile.role === 'starter' ? (
                    <FieldRow label="Country" value={selectedProfile.country} icon={<MapPin className="w-4 h-4" />} />
                  ) : null}

                  {selectedProfile.role === 'serviceProvider' ? (
                    <>
                      <FieldRow label="Service" value={selectedProfile.service} />
                      <FieldRow
                        label="Location"
                        value={selectedProfile.location}
                        icon={<MapPin className="w-4 h-4" />}
                      />
                      <div className="md:col-span-2">
                        <FieldRow label="Price Range" value={selectedProfile.price} />
                      </div>
                    </>
                  ) : null}

                  {backendSession?.user?.role === 'PROVIDER' ? (
                    <div className="md:col-span-2 rounded-lg border border-border bg-surface p-4">
                      <h3 className="text-sm font-bold text-primary mb-1">Provider registration details</h3>

                      {backendProviderError ? (
                        <div className="ykb-alert ykb-alert-error">{backendProviderError}</div>
                      ) : null}
                      {isLoadingBackendProvider ? (
                        <div className="text-sm text-textSecondary">Loading provider profile…</div>
                      ) : null}

                      {hasBackendProviderProfile ? (
                        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
                          <FieldRow label="Business Name" value={backendProvider.businessName ?? 'N/A'} />
                          <FieldRow label="Main Service" value={backendProvider.mainService ?? 'N/A'} />
                          <FieldRow label="Location" value={backendProvider.location ?? 'N/A'} icon={<MapPin className="w-4 h-4" />} />
                          <FieldRow label="Money Range" value={backendProvider.moneyRange ?? 'N/A'} />
                          <div className="md:col-span-2">
                            <div className="rounded-md border border-border bg-white px-3 py-2">
                              <div className="text-[11px] uppercase tracking-wide text-textSecondary">Services & prices</div>
                              {Array.isArray(backendProvider.serviceOfferings) && backendProvider.serviceOfferings.length > 0 ? (
                                <ul className="mt-2 space-y-1 text-sm text-gray-900">
                                  {backendProvider.serviceOfferings.map((item, idx) => (
                                    <li key={`${item.name}-${idx}`} className="flex items-center justify-between gap-3">
                                      <span className="font-medium">{item.name}</span>
                                      <span className="text-textSecondary">{item.price}</span>
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <div className="mt-1 text-sm text-textSecondary">No services saved yet.</div>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </div>

                <div className="mt-4 rounded-lg border border-border bg-surface p-4">
                  <h3 className="text-sm font-bold text-primary mb-1">Profile Image</h3>
                  <p className="text-sm text-textSecondary">
                    Mocked for now: we’re showing initials as an avatar. Later you can store and render a real image URL
                    from the backend.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
