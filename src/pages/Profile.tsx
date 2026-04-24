import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { MapPin, Mail, Phone, Shield } from 'lucide-react';
import { serviceProviders } from '../data/providers';
import { readJson, writeJson } from '../utils/storage';

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
    <div className="flex items-start gap-3 rounded-xl border border-white/5 bg-black/30 px-4 py-3">
      {icon ? <div className="mt-0.5 text-primary">{icon}</div> : null}
      <div className="min-w-0">
        <div className="text-xs uppercase tracking-wide text-gray-500">{label}</div>
        <div className="text-gray-200 break-words">{value}</div>
      </div>
    </div>
  );
}

export function Profile() {
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

  return (
    <main className="pt-16">
      <section className="bg-black border-b border-primary py-12 px-4 sm:px-6 lg:px-8">
        <div className="ykb-container">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-3">Profile</h1>
          <p className="text-lg text-gray-400">Mocked role-based profiles for your app flow.</p>
        </div>
      </section>

      <section className="ykb-section px-4 sm:px-6 lg:px-8 bg-dark-light">
        <div className="ykb-container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="ykb-card">
                <h2 className="text-xl font-bold text-white mb-4">Role Selection</h2>

                <label className="block text-sm font-semibold text-gray-200 mb-2" htmlFor="role">
                  Choose a role
                </label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value as Role)}
                  className="ykb-field"
                >
                  <option value="starter">Starter</option>
                  <option value="serviceProvider">Service Provider</option>
                  <option value="admin">Admin</option>
                </select>

                {role === 'serviceProvider' ? (
                  <div className="mt-5">
                    <label
                      className="block text-sm font-semibold text-gray-200 mb-2"
                      htmlFor="provider"
                    >
                      Select provider
                    </label>
                    <select
                      id="provider"
                      value={providerId}
                      onChange={(e) => setProviderId(e.target.value)}
                      className="ykb-field"
                    >
                      {providerProfiles.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} — {p.service}
                        </option>
                      ))}
                    </select>
                    <p className="mt-3 text-sm text-gray-400">
                      This is mocked. Later you can fetch real profiles from your backend.
                    </p>
                  </div>
                ) : (
                  <p className="mt-5 text-sm text-gray-400">
                    This role changes which profile fields are shown.
                  </p>
                )}
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="ykb-card">
                <div className="flex items-start gap-5">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-primary to-secondary flex items-center justify-center shadow-lg shadow-black/25">
                      <span className="text-black font-bold text-lg">{getInitials(displayName)}</span>
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-2xl font-bold text-white">{displayName}</h2>
                      <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm text-primary">
                        <Shield className="w-4 h-4" />
                        {selectedProfile.role === 'serviceProvider'
                          ? 'Service Provider'
                          : selectedProfile.role === 'admin'
                            ? 'Admin'
                            : 'Starter'}
                      </span>
                    </div>
                    <p className="mt-2 text-gray-300/80">
                      {selectedProfile.role === 'serviceProvider'
                        ? 'Provider profile showing service and pricing.'
                        : selectedProfile.role === 'admin'
                          ? 'Admin profile (mocked contact details).'
                          : 'Starter profile for new users.'}
                    </p>
                  </div>
                </div>

                <div className="mt-7 grid grid-cols-1 md:grid-cols-2 gap-4">
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
                </div>

                <div className="mt-7 rounded-2xl border border-white/5 bg-black/30 p-5">
                  <h3 className="text-lg font-bold text-white mb-2">Profile Image</h3>
                  <p className="text-sm text-gray-400">
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
