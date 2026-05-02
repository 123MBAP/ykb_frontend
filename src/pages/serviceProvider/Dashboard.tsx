import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BackendAuthError, getBackendSession } from '../../utils/backendAuth';
import { fetchProviderMeProfile, type BackendProviderProfile } from '../../utils/backendProviders';

type PageState =
	| { status: 'idle' | 'loading' }
	| { status: 'ready'; provider: BackendProviderProfile }
	| { status: 'error'; message: string; statusCode?: number };

export function ServiceProviderDashboard() {
	const [state, setState] = useState<PageState>({ status: 'idle' });

	const session = getBackendSession();
	const accessToken = session?.accessToken;
	const userRole = session?.user?.role;

	useEffect(() => {
		if (!accessToken) return;
		if (userRole && userRole !== 'PROVIDER') return;

		let mounted = true;

		const load = async () => {
			setState({ status: 'loading' });

			try {
				const provider = await fetchProviderMeProfile();
				if (!mounted) return;
				setState({ status: 'ready', provider });
			} catch (err) {
				if (!mounted) return;

				if (err instanceof BackendAuthError) {
					setState({ status: 'error', message: err.message, statusCode: err.status });
					return;
				}

				setState({ status: 'error', message: 'Could not load your provider dashboard.' });
			}
		};

		load();
		return () => {
			mounted = false;
		};
	}, [accessToken, userRole]);

	return (
		<main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-24">
			<div className="ykb-container">
				<header className="mb-6">
					<h1 className="text-3xl font-bold text-primary">Service Provider Dashboard</h1>
					<p className="mt-1 text-sm text-textSecondary">Your services & prices</p>
				</header>

				{userRole && userRole !== 'PROVIDER' ? (
					<div className="ykb-card">
						<div className="ykb-alert ykb-alert-warning">
							This dashboard is only available for service provider accounts.
						</div>
						<div className="mt-4">
							<Link to="/profile" className="ykb-button-outline">Go to profile</Link>
						</div>
					</div>
				) : null}

				{userRole && userRole !== 'PROVIDER' ? null : !accessToken ? (
					<div className="ykb-card">
						<div className="ykb-alert ykb-alert-info">Please log in to view your dashboard.</div>
						<div className="mt-4">
							<Link to="/login" className="ykb-button-primary">Go to login</Link>
						</div>
					</div>
				) : state.status === 'loading' || state.status === 'idle' ? (
					<div className="ykb-card">
						<p className="text-sm text-textSecondary">Loading your services…</p>
					</div>
				) : state.status === 'error' ? (
					<div className="ykb-card">
						<div className="ykb-alert ykb-alert-error">{state.message}</div>
						{state.statusCode === 401 ? (
							<div className="mt-4">
								<Link to="/login" className="ykb-button-primary">Login again</Link>
							</div>
						) : null}
					</div>
				) : state.status === 'ready' ? (
					<div className="grid grid-cols-1 gap-6">
						<section className="ykb-card">
							<div className="text-xs font-semibold uppercase tracking-[0.22em] text-textSecondary">Provider profile</div>
							<div className="mt-3 space-y-2">
								<div>
									<div className="text-xs text-textSecondary">Business name</div>
									<div className="font-semibold text-gray-900">{state.provider.businessName ?? '—'}</div>
								</div>
								<div>
									<div className="text-xs text-textSecondary">Main service</div>
									<div className="font-semibold text-gray-900">{state.provider.mainService ?? '—'}</div>
								</div>
								<div>
									<div className="text-xs text-textSecondary">Location</div>
									<div className="font-semibold text-gray-900">{state.provider.location ?? '—'}</div>
								</div>
								<div>
									<div className="text-xs text-textSecondary">Money range</div>
									<div className="font-semibold text-gray-900">{state.provider.moneyRange ?? '—'}</div>
								</div>
							</div>
						</section>

						<section className="ykb-card">
							<div className="flex items-center justify-between gap-4">
								<div>
									<div className="text-xs font-semibold uppercase tracking-[0.22em] text-textSecondary">Services</div>
									<h2 className="mt-2 text-xl font-semibold text-primary">Services you provide</h2>
								</div>
							</div>

							<div className="mt-4">
								{Array.isArray(state.provider.serviceOfferings) && state.provider.serviceOfferings.length > 0 ? (
									<div className="divide-y divide-border rounded-lg border border-border bg-white">
										{state.provider.serviceOfferings.map((item, index) => (
											<div key={`${item.name}-${index}`} className="flex items-center justify-between gap-4 px-4 py-3">
												<div className="min-w-0">
													<div className="font-semibold text-gray-900 truncate">{item.name}</div>
												</div>
												<div className="shrink-0 font-semibold text-primary">{item.price}</div>
											</div>
										))}
									</div>
								) : (
									<div className="ykb-alert ykb-alert-info">
										No services listed yet.
									</div>
								)}
							</div>
						</section>
					</div>
				) : null}
			</div>
		</main>
	);
}

