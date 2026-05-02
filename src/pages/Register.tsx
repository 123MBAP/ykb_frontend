import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { fetchPublicServices, type PublicService } from '../data/registrationServices';
import { type ServiceOffering, type UserRole } from '../utils/auth';
import { BackendAuthError, registerBackend } from '../utils/backendAuth';
import logo from '../assets/images/logo.png';

type Step = 1 | 2;

type IdentityState = {
  firstName: string;
  middleName: string;
  lastName: string;
  country: string;
  phone: string;
};

type AccountState = {
  email: string;
  password: string;
  confirm: string;
};

type ProviderState = {
  businessName: string;
  service: string;
  location: string;
  moneyRange: string;
  services: ServiceOffering[];
};

type FieldErrors = Partial<
  Record<
    | 'firstName'
    | 'lastName'
    | 'country'
    | 'phone'
    | 'email'
    | 'password'
    | 'confirm'
    | 'businessName'
    | 'service'
    | 'location'
    | 'moneyRange'
    | 'services',
    string
  >
>;

function mapBackendMessageToFieldErrors(message: string): FieldErrors {
  const normalized = message.toLowerCase();
  const next: FieldErrors = {};

  if (normalized.includes('businessname')) next.businessName = 'Business name is required.';
  if (normalized.includes('moneyrange')) next.moneyRange = 'Money range is required.';
  if (normalized.includes('services')) next.services = 'Add at least one service with its price.';
  if (normalized.includes('location')) next.location = 'Location is required.';
  if (normalized.includes('service')) next.service = 'Please select a service.';

  if (normalized.includes('email')) next.email = 'Please enter a valid email address.';
  if (normalized.includes('password')) next.password = `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`;

  return next;
}

const PASSWORD_MIN_LENGTH = 8;

function onlyDigits(value: string): string {
  return value.replace(/\D/g, '');
}

function isNonEmpty(value: string): boolean {
  return value.trim().length > 0;
}

function renderFieldLabel(label: string, htmlFor: string, required = true) {
  return (
    <label className="block text-sm font-semibold text-primary mb-1.5" htmlFor={htmlFor}>
      {label}
      {!required ? <span className="text-gray-400"> (optional)</span> : null}
    </label>
  );
}

function createEmptyServiceRow(): ServiceOffering {
  return { name: '', price: '' };
}

function buildDefaultProviderState(services: PublicService[]): ProviderState {
  return {
    businessName: '',
    service: services[0]?.title ?? '',
    location: '',
    moneyRange: '',
    services: [createEmptyServiceRow()],
  };
}

function normalizeServiceRows(rows: ServiceOffering[]): ServiceOffering[] {
  return rows.map((row) => ({
    name: row.name.trim(),
    price: row.price.trim(),
  }));
}

export function Register() {
  const [step, setStep] = useState<Step>(1);
  const [role, setRole] = useState<UserRole>('starter');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [isLoadingServices, setIsLoadingServices] = useState(false);
  const [serviceLoadError, setServiceLoadError] = useState<string | null>(null);
  const [publicServices, setPublicServices] = useState<PublicService[]>([]);

  const clearFieldError = (key: keyof FieldErrors) => {
    setFieldErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const fieldClass = (key: keyof FieldErrors, extra?: string) => {
    const errorClass = fieldErrors[key] ? ' border-error focus:border-error focus:ring-error/20' : '';
    return `ykb-field${errorClass}${extra ? ` ${extra}` : ''}`;
  };

  const inlineError = (key: keyof FieldErrors) =>
    fieldErrors[key] ? <p className="mt-1 text-xs font-semibold text-error">{fieldErrors[key]}</p> : null;

  const [identity, setIdentity] = useState<IdentityState>({
    firstName: '',
    middleName: '',
    lastName: '',
    country: 'Rwanda',
    phone: '',
  });

  const [account, setAccount] = useState<AccountState>({
    email: '',
    password: '',
    confirm: '',
  });

  const [provider, setProvider] = useState<ProviderState>(() => buildDefaultProviderState([]));

  useEffect(() => {
    let mounted = true;

    const loadServices = async () => {
      setIsLoadingServices(true);
      setServiceLoadError(null);

      try {
        const services = await fetchPublicServices();
        if (!mounted) return;

        setPublicServices(services);
        setProvider((prev) => {
          if (prev.service || services.length === 0) return prev;
          return { ...prev, service: services[0].title };
        });
      } catch {
        if (!mounted) return;
        setPublicServices([]);
        setServiceLoadError('Could not load the admin-created services right now.');
      } finally {
        if (mounted) setIsLoadingServices(false);
      }
    };

    loadServices();

    return () => {
      mounted = false;
    };
  }, []);

  const providerService = useMemo(
    () => publicServices.find((service) => service.title === provider.service),
    [publicServices, provider.service]
  );

  const resetForm = () => {
    setStep(1);
    setError(null);
    setSuccess(false);
    setIsSubmitting(false);
    setShowPassword(false);
    setShowConfirmPassword(false);
    setFieldErrors({});
    setRole('starter');
    setIdentity({
      firstName: '',
      middleName: '',
      lastName: '',
      country: 'Rwanda',
      phone: '',
    });
    setAccount({
      email: '',
      password: '',
      confirm: '',
    });
    setProvider(buildDefaultProviderState(publicServices));
  };

  const updateServiceRow = (index: number, field: keyof ServiceOffering, value: string) => {
    setProvider((prev) => ({
      ...prev,
      services: prev.services.map((row, rowIndex) =>
        rowIndex === index ? { ...row, [field]: value } : row
      ),
    }));
  };

  const addServiceRow = () => {
    setProvider((prev) => ({
      ...prev,
      services: [...prev.services, createEmptyServiceRow()],
    }));
  };

  const handleFirstStepSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const nextFieldErrors: FieldErrors = {};

    if (!isNonEmpty(identity.firstName)) nextFieldErrors.firstName = 'First name is required.';
    if (!isNonEmpty(identity.lastName)) nextFieldErrors.lastName = 'Last name is required.';
    if (!isNonEmpty(identity.country)) nextFieldErrors.country = 'Country is required.';
    if (!isNonEmpty(identity.phone)) nextFieldErrors.phone = 'Phone number is required.';

    if (Object.keys(nextFieldErrors).length > 0) {
      setFieldErrors(nextFieldErrors);
      setError(Object.values(nextFieldErrors)[0] ?? 'Please fix the highlighted fields.');
      return;
    }

    setFieldErrors({});
    setStep(2);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (isSubmitting) return;

    const nextFieldErrors: FieldErrors = {};

    if (!isNonEmpty(account.email)) nextFieldErrors.email = 'Email is required.';
    if (account.password.length < PASSWORD_MIN_LENGTH) {
      nextFieldErrors.password = `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`;
    }
    if (account.password !== account.confirm) {
      nextFieldErrors.confirm = 'Passwords do not match.';
    }

    let providerPayload:
      | {
          businessName: string;
          service: string;
          location: string;
          moneyRange: string;
          services: Array<{ name: string; price: string }>;
        }
      | null = null;

    if (role === 'serviceProvider') {
      if (isLoadingServices) {
        setError('Please wait while services are loading.');
        return;
      }

      if (publicServices.length === 0) {
        setError('No services are available yet. Ask an admin to create one first.');
        return;
      }

      if (!isNonEmpty(provider.businessName)) nextFieldErrors.businessName = 'Business name is required.';
      if (!isNonEmpty(provider.service)) nextFieldErrors.service = 'Please select a service.';
      if (!isNonEmpty(provider.location)) nextFieldErrors.location = 'Location is required.';
      if (!isNonEmpty(provider.moneyRange)) nextFieldErrors.moneyRange = 'Money range is required.';

      const normalizedServices = normalizeServiceRows(provider.services);
      const hasCompleteService = normalizedServices.some((service) => isNonEmpty(service.name) && isNonEmpty(service.price));

      if (!hasCompleteService) {
        nextFieldErrors.services = 'Add at least one service with its price.';
      }

      const hasPartialService = normalizedServices.some(
        (service) =>
          (isNonEmpty(service.name) && !isNonEmpty(service.price)) ||
          (!isNonEmpty(service.name) && isNonEmpty(service.price))
      );

      if (hasPartialService) {
        nextFieldErrors.services = 'Each service row needs both a service name and a price.';
      }

      if (Object.keys(nextFieldErrors).length > 0) {
        setFieldErrors(nextFieldErrors);
        setError(Object.values(nextFieldErrors)[0] ?? 'Please fix the highlighted fields.');
        return;
      }

      providerPayload = {
        businessName: provider.businessName.trim(),
        service: provider.service.trim(),
        location: provider.location.trim(),
        moneyRange: provider.moneyRange.trim(),
        services: normalizedServices.filter((service) => isNonEmpty(service.name) && isNonEmpty(service.price)),
      };
    }

    if (Object.keys(nextFieldErrors).length > 0) {
      setFieldErrors(nextFieldErrors);
      setError(Object.values(nextFieldErrors)[0] ?? 'Please fix the highlighted fields.');
      return;
    }

    setFieldErrors({});

    const fullName = [identity.firstName, identity.middleName, identity.lastName]
      .map((part) => part.trim())
      .filter(Boolean)
      .join(' ');

    try {
      setIsSubmitting(true);
      await registerBackend({
        email: account.email,
        password: account.password,
        name: fullName,
        phone: identity.phone,
        role: role === 'serviceProvider' ? 'PROVIDER' : 'CUSTOMER',
        ...(providerPayload ?? {}),
      });
      setSuccess(true);
    } catch (err) {
      const status = err instanceof BackendAuthError ? err.status : undefined;

      if (status === 409) {
        setFieldErrors((prev) => ({ ...prev, email: 'An account with this email already exists.' }));
        setError('An account with this email already exists.');
        return;
      }

      if (status === 0 && err instanceof BackendAuthError) {
        setError(err.message);
        return;
      }

      if (status === 400 && err instanceof BackendAuthError) {
        const backendFieldErrors = mapBackendMessageToFieldErrors(err.message);
        if (Object.keys(backendFieldErrors).length > 0) {
          setFieldErrors((prev) => ({ ...prev, ...backendFieldErrors }));
        }
        setError(err.message);
        return;
      }

      if (status === 503) {
        setError('Service is temporarily unavailable. Please try again later.');
        return;
      }

      if (status && status >= 500) {
        setError('Server error. Please try again later.');
        return;
      }

      if (err instanceof BackendAuthError && err.message) {
        setError(err.message);
        return;
      }

      setError('Could not create your account right now. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 pt-20">
      <div className="max-w-6xl mx-auto">
        {/* Unified Card Container */}
        <div className="bg-white  shadow-xl overflow-hidden">
          {success ? (
            <div className="text-center space-y-6 py-16 px-8">
              <div className="flex justify-center">
                <img src={logo} alt="Your Kigali Bestie" className="h-14 w-auto object-contain" />
              </div>
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Registration complete!</h2>
              <p className="text-gray-600 max-w-md mx-auto">
                Your account has been created successfully. You can now sign in to continue.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                <button type="button" className="ykb-button-primary" onClick={resetForm}>
                  Register another account
                </button>
                <Link to="/login" className="ykb-button-outline">
                  Go to login
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row">
              {/* Sidebar Section - Now visually integrated */}
              <div className="md:w-2/5 bg-primary p-8 text-white">
                <div className="space-y-6">
                  <div>

                    <h1 className="text-3xl font-bold mb-6 text-white">Create account</h1>
                    <p className="text-white/80 text-sm leading-relaxed">
                      Join our platform as a Starter or Service Provider. Start booking services or grow your business today.
                    </p>
                  </div>

                  <div className="border-t border-white/20 pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-medium text-white/80">Registration progress</span>
                      <span className="text-2xl font-bold">{step}/2</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div 
                        className="bg-secondary h-2 rounded-full transition-all duration-300" 
                        style={{ width: step === 1 ? '50%' : '100%' }}
                      />
                    </div>
                  </div>

                  <div className="space-y-3 pt-4">
                    <div className="flex items-center gap-3 text-sm">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step >= 1 ? 'bg-secondary text-primary' : 'bg-white/20 text-white/60'}`}>1</div>
                      <span className={step >= 1 ? 'text-white' : 'text-white/60'}>Personal Information</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step === 2 ? 'bg-secondary text-primary' : step > 2 ? 'bg-green-500' : 'bg-white/20 text-white/60'}`}>2</div>
                      <span className={step === 2 ? 'text-white font-medium' : step > 2 ? 'text-white' : 'text-white/60'}>Account Credentials</span>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/20">
                    <p className="text-xs uppercase tracking-wider text-secondary font-semibold mb-3">Selected account type</p>
                    <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                      <p className="font-semibold">{role === 'serviceProvider' ? 'Service Provider' : 'Starter'}</p>
                      <p className="text-xs text-white/70 mt-1">
                        {role === 'serviceProvider' 
                          ? 'List services, manage bookings, grow your business' 
                          : 'Request services, book providers, get things done'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Section */}
              <div className="md:w-3/5 p-8">
                <div className="flex justify-center mb-4">
                  <img src={logo} alt="Your Kigali Bestie" className="h-26 w-auto object-contain" />
                </div>
                <form onSubmit={step === 1 ? handleFirstStepSubmit : handleSubmit} className="space-y-5" noValidate>
                  {error && (
                    <div className="ykb-alert ykb-alert-error">
                      {error}
                    </div>
                  )}

                  {step === 1 ? (
                    <>
                      <div>
                        {renderFieldLabel('Register as', 'role')}
                        <select
                          id="role"
                          value={role}
                          onChange={(event) => {
                            const nextRole = event.target.value as UserRole;
                            setRole(nextRole);
                            setStep(1);
                            setError(null);
                            setFieldErrors({});
                          }}
                          className="ykb-field"
                        >
                          <option value="starter">Starter</option>
                          <option value="serviceProvider">Service Provider</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          {renderFieldLabel('First name', 'firstName')}
                          <input
                            id="firstName"
                            required
                            value={identity.firstName}
                            onChange={(event) => {
                              setIdentity((prev) => ({ ...prev, firstName: event.target.value }));
                              clearFieldError('firstName');
                            }}
                            className={fieldClass('firstName')}
                            placeholder="e.g. Aline"
                          />
                          {inlineError('firstName')}
                        </div>

                        <div>
                          {renderFieldLabel('Middle name', 'middleName', false)}
                          <input
                            id="middleName"
                            value={identity.middleName}
                            onChange={(event) => setIdentity((prev) => ({ ...prev, middleName: event.target.value }))}
                            className="ykb-field"
                            placeholder="e.g. Marie"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          {renderFieldLabel('Last name', 'lastName')}
                          <input
                            id="lastName"
                            required
                            value={identity.lastName}
                            onChange={(event) => {
                              setIdentity((prev) => ({ ...prev, lastName: event.target.value }));
                              clearFieldError('lastName');
                            }}
                            className={fieldClass('lastName')}
                            placeholder="e.g. Uwase"
                          />
                          {inlineError('lastName')}
                        </div>

                        <div>
                          {renderFieldLabel('Country', 'country')}
                          <input
                            id="country"
                            required
                            value={identity.country}
                            onChange={(event) => {
                              setIdentity((prev) => ({ ...prev, country: event.target.value }));
                              clearFieldError('country');
                            }}
                            className={fieldClass('country')}
                            placeholder="e.g. Rwanda"
                          />
                          {inlineError('country')}
                        </div>
                      </div>

                      <div>
                        {renderFieldLabel('Phone number', 'phone')}
                        <input
                          id="phone"
                          required
                          value={identity.phone}
                          onChange={(event) => {
                            setIdentity((prev) => ({ ...prev, phone: onlyDigits(event.target.value).slice(0, 15) }));
                            clearFieldError('phone');
                          }}
                          className={fieldClass('phone')}
                          inputMode="tel"
                          placeholder="e.g. 0798891543"
                        />
                        {inlineError('phone')}
                      </div>

                      <button type="submit" className="w-full ykb-button-primary disabled:opacity-60 disabled:cursor-not-allowed" disabled={isSubmitting}>
                        Continue to Account Setup →
                      </button>
                    </>
                  ) : (
                    <div className="space-y-6">
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <h3 className="text-sm font-semibold text-gray-700 mb-2">Review your information</h3>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div><span className="text-gray-500">Name:</span> {identity.firstName} {identity.middleName} {identity.lastName}</div>
                          <div><span className="text-gray-500">Country:</span> {identity.country}</div>
                          <div><span className="text-gray-500">Phone:</span> {identity.phone}</div>
                          <div><span className="text-gray-500">Type:</span> {role === 'serviceProvider' ? 'Service Provider' : 'Starter'}</div>
                        </div>
                      </div>

                      <div>
                        {renderFieldLabel('Email address', 'email')}
                        <input
                          id="email"
                          type="email"
                          required
                          value={account.email}
                          onChange={(event) => {
                            setAccount((prev) => ({ ...prev, email: event.target.value }));
                            clearFieldError('email');
                          }}
                          className={fieldClass('email')}
                          placeholder="you@example.com"
                        />
                        {inlineError('email')}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          {renderFieldLabel('Password', 'password')}
                          <div className="relative">
                            <input
                              id="password"
                              type={showPassword ? 'text' : 'password'}
                              required
                              value={account.password}
                              onChange={(event) => {
                                setAccount((prev) => ({ ...prev, password: event.target.value }));
                                clearFieldError('password');
                              }}
                              className={fieldClass('password', 'pr-10')}
                              autoComplete="new-password"
                              placeholder={`Min. ${PASSWORD_MIN_LENGTH} characters`}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword((prev) => !prev)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-textSecondary hover:text-primary transition"
                              aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                          {inlineError('password')}
                        </div>

                        <div>
                          {renderFieldLabel('Confirm password', 'confirm')}
                          <div className="relative">
                            <input
                              id="confirm"
                              type={showConfirmPassword ? 'text' : 'password'}
                              required
                              value={account.confirm}
                              onChange={(event) => {
                                setAccount((prev) => ({ ...prev, confirm: event.target.value }));
                                clearFieldError('confirm');
                              }}
                              className={fieldClass('confirm', 'pr-10')}
                              autoComplete="new-password"
                              placeholder="Confirm your password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword((prev) => !prev)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-textSecondary hover:text-primary transition"
                              aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                            >
                              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                          {inlineError('confirm')}
                        </div>
                      </div>

                      {role === 'serviceProvider' && (
                        <div className="space-y-4 bg-surface rounded-lg p-5 border border-border">
                          <h3 className="text-lg font-semibold text-gray-800">Business Information</h3>

                          {serviceLoadError && (
                            <div className="ykb-alert ykb-alert-error">{serviceLoadError}</div>
                          )}

                          <div>
                            {renderFieldLabel('Business / Company name', 'businessName')}
                            <input
                              id="businessName"
                              required
                              value={provider.businessName}
                              onChange={(event) => {
                                setProvider((prev) => ({ ...prev, businessName: event.target.value }));
                                clearFieldError('businessName');
                              }}
                              className={fieldClass('businessName')}
                              placeholder="e.g. Kigali Quick Help"
                            />
                            {inlineError('businessName')}
                          </div>

                          <div>
                            {renderFieldLabel('Main service category', 'service')}
                            <select
                              id="service"
                              required
                              value={provider.service}
                              disabled={isLoadingServices || publicServices.length === 0}
                              onChange={(event) => {
                                setProvider((prev) => ({ ...prev, service: event.target.value }));
                                clearFieldError('service');
                              }}
                              className={`${fieldClass('service')} disabled:opacity-50`}
                            >
                              <option value="">
                                {isLoadingServices ? 'Loading services…' : 'Select a service'}
                              </option>
                              {publicServices.map((service) => (
                                <option key={service.id} value={service.title}>
                                  {service.title}
                                </option>
                              ))}
                            </select>
                            {inlineError('service')}
                          </div>

                          {providerService && (
                            <div className="bg-white rounded-lg p-3 text-sm border border-gray-200">
                              <p className="font-semibold text-gray-700">{providerService.title}</p>
                              <p className="text-gray-600 text-xs mt-1">{providerService.description}</p>
                            </div>
                          )}

                          <div>
                            {renderFieldLabel('Location / Service area', 'location')}
                            <input
                              id="location"
                              required
                              value={provider.location}
                              onChange={(event) => {
                                setProvider((prev) => ({ ...prev, location: event.target.value }));
                                clearFieldError('location');
                              }}
                              className={fieldClass('location')}
                              placeholder="e.g. Kigali, Rwanda"
                            />
                            {inlineError('location')}
                          </div>

                          <div>
                            {renderFieldLabel('Price range', 'moneyRange')}
                            <input
                              id="moneyRange"
                              required
                              value={provider.moneyRange}
                              onChange={(event) => {
                                setProvider((prev) => ({ ...prev, moneyRange: event.target.value }));
                                clearFieldError('moneyRange');
                              }}
                              className={fieldClass('moneyRange')}
                              placeholder="e.g. 10,000 - 100,000 RWF"
                            />
                            {inlineError('moneyRange')}
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <h4 className="font-semibold text-gray-800">Services you provide</h4>
                                <p className="text-xs text-gray-500">Add each service with its price</p>
                              </div>
                              <button
                                type="button"
                                onClick={addServiceRow}
                                className="px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                              >
                                + Add service
                              </button>
                            </div>

                            <div className="space-y-3">
                              {provider.services.map((serviceRow, index) => (
                                <div key={`service-row-${index}`} className="bg-white rounded-lg p-4 border border-gray-200 space-y-3">
                                  <p className="text-sm font-medium text-gray-600">Service #{index + 1}</p>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <input
                                      placeholder="Service name (e.g. House cleaning)"
                                      value={serviceRow.name}
                                      onChange={(event) => updateServiceRow(index, 'name', event.target.value)}
                                      className="ykb-field text-sm"
                                    />
                                    <input
                                      placeholder="Price (e.g. 15,000 RWF)"
                                      value={serviceRow.price}
                                      onChange={(event) => updateServiceRow(index, 'price', event.target.value)}
                                      className="ykb-field text-sm"
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>

                            {inlineError('services')}
                          </div>
                        </div>
                      )}

                      <div className="flex gap-3 pt-4">
                        <button
                          type="button"
                          onClick={() => {
                            setStep(1);
                            setError(null);
                          }}
                          className="ykb-button-outline disabled:opacity-60 disabled:cursor-not-allowed"
                          disabled={isSubmitting}
                        >
                          ← Back
                        </button>
                        <button type="submit" className="flex-1 ykb-button-primary disabled:opacity-60 disabled:cursor-not-allowed" disabled={isSubmitting}>
                          {isSubmitting ? 'Creating account...' : 'Complete registration →'}
                        </button>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}