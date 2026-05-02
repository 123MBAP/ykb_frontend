import { NavLink, Outlet } from 'react-router-dom';

const navItems: Array<{ to: string; label: string }> = [
	{ to: '/provider', label: 'Overview' },
	{ to: '/provider/services', label: 'Services' },
	{ to: '/provider/profile', label: 'Profile' },
];

function ProviderTab(props: { to: string; label: string; isLast: boolean }) {
	const { to, label, isLast } = props;
	return (
		<NavLink
			to={to}
			end={to === '/provider'}
			className={({ isActive }) =>
				[
					'relative flex h-10 items-center px-3 text-sm font-semibold transition-colors duration-200',
					isActive ? 'bg-secondary text-white' : 'text-textSecondary hover:bg-surface/60 hover:text-primary',
					isLast ? '' : 'after:absolute after:right-0 after:top-2 after:bottom-2 after:w-px after:bg-border',
				].join(' ')
			}
		>
			{label}
		</NavLink>
	);
}

export function ProviderLayout() {
	return (
		<div className="relative">
			<div className="ykb-container">
				<div className="pt-16">
					<div className="mb-4 flex items-center justify-between gap-3">
						<div className="text-sm font-bold text-primary">Service Provider</div>
						<nav className="max-w-full overflow-x-auto">
							<div className="flex items-stretch whitespace-nowrap">
								{navItems.map((item, index) => (
									<ProviderTab
										key={item.to}
										to={item.to}
										label={item.label}
										isLast={index === navItems.length - 1}
									/>
								))}
							</div>
						</nav>
					</div>

					<div className="-mt-16">
						<Outlet />
					</div>
				</div>
			</div>
		</div>
	);
}

