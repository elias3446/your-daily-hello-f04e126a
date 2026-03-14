import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Shield, Users, Tag, Ticket, BarChart3, Settings, ScrollText, LogOut, ChevronRight, Layers, Headset,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/dashboard', icon: BarChart3, label: 'Dashboard', end: true },
  { to: '/dashboard/users', icon: Users, label: 'Usuarios' },
  { to: '/dashboard/roles', icon: Tag, label: 'Roles y Permisos' },
  { to: '/dashboard/categories', icon: Layers, label: 'Categorías' },
  { to: '/dashboard/tickets', icon: Ticket, label: 'Tickets' },
  { to: '/dashboard/agents', icon: Headset, label: 'Agentes' },
  { to: '/dashboard/audit', icon: ScrollText, label: 'Auditoría' },
  { to: '/dashboard/settings', icon: Settings, label: 'Configuración' },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 flex w-64 flex-col bg-primary text-primary-foreground">
        {/* Logo */}
        <div className="flex h-16 items-center gap-2 px-6 border-b border-sidebar-border">
          <Shield className="h-6 w-6 text-accent" />
          <span className="text-lg font-bold tracking-tight">HR Nexus</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-snappy',
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-primary-foreground/70 hover:bg-sidebar-accent/50 hover:text-primary-foreground'
                )
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User section */}
        <div className="border-t border-sidebar-border p-4">
          <div className="mb-3">
            <p className="text-sm font-medium truncate">{user?.fullName}</p>
            <p className="text-xs text-primary-foreground/50 truncate">{user?.email}</p>
          </div>
          {role && (
            <span className="inline-flex items-center gap-1 rounded-full bg-success/20 px-2.5 py-0.5 text-xs font-semibold text-success">
              <Shield className="h-3 w-3" />
              {role.name}
            </span>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="mt-3 w-full justify-start gap-2 text-primary-foreground/70 hover:text-primary-foreground hover:bg-sidebar-accent/50"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Cerrar sesión
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-64 flex-1">
        {/* Header */}
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-card px-8">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span>HR Nexus</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground font-medium">Dashboard</span>
          </div>
          <div className="flex items-center gap-2">
            {role && (
              <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2.5 py-1 text-xs font-semibold text-success">
                <Shield className="h-3 w-3" />
                {role.name}
              </span>
            )}
          </div>
        </header>

        {/* Page content */}
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
