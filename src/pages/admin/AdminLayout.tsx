import { NavLink, Outlet } from 'react-router-dom';

const navItems: Array<{ to: string; label: string }> = [
  { to: '/admin', label: 'Dashboard' },
  { to: '/admin/providers', label: 'Service Providers' },
  { to: '/admin/requests', label: 'Requests' },
  { to: '/admin/translators', label: 'Translator Languages' },
  { to: '/admin/starter-guide', label: 'Starter Guide' },
];

function SidebarLink(props: { to: string; label: string }) {
  const { to, label } = props;
  return (
    <NavLink
      to={to}
      end={to === '/admin'}
      className={({ isActive }) =>
        [
          'block rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200',
          isActive ? 'text-primary bg-primary/10' : 'text-gray-300 hover:text-white hover:bg-white/5',
        ].join(' ')
      }
    >
      {label}
    </NavLink>
  );
}

export function AdminLayout() {
  return (
    <div className="relative">
      {/* Desktop sidebar */}
      <aside className="hidden md:block fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] border-r border-white/10 bg-black/50 backdrop-blur-sm px-4 py-5 overflow-y-auto">
        <div className="text-sm font-bold text-white mb-3">Admin</div>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <SidebarLink key={item.to} to={item.to} label={item.label} />
          ))}
        </nav>
      </aside>

      {/* Content area */}
      <div className="md:pl-64">
        {/* Mobile sidebar */}
        <div className="md:hidden pt-16 px-4 sm:px-6 lg:px-8">
          <div className="ykb-container">
            <div className="ykb-card p-4">
              <div className="text-sm font-bold text-white mb-3">Admin</div>
              <nav className="space-y-1">
                {navItems.map((item) => (
                  <SidebarLink key={item.to} to={item.to} label={item.label} />
                ))}
              </nav>
            </div>
          </div>
        </div>

        <Outlet />
      </div>
    </div>
  );
}
