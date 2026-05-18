import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Vote, Users, ShieldCheck,
  BarChart2, Settings, LogOut, Fingerprint, X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../utils/cn';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { icon: LayoutDashboard, label: 'Overview',    path: '/admin' },
  { icon: Vote,            label: 'Elections',   path: '/admin/elections' },
  { icon: Users,           label: 'Candidates',  path: '/admin/candidates' },
  { icon: ShieldCheck,     label: 'Users',       path: '/admin/users' },
  { icon: BarChart2,       label: 'Analytics',   path: '/admin/analytics' },
  { icon: Settings,        label: 'Settings',    path: '/admin/settings' },
];

export default function AdminSidebar({ isOpen, onClose }: Props) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <>
      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/60 z-20 lg:hidden" onClick={onClose} />}

      <aside className={cn(
        'fixed top-0 left-0 h-full w-64 bg-surface border-r border-white/10 flex flex-col z-30 transition-transform duration-300',
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}>
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-primary-500/20 rounded-lg">
              <Fingerprint className="w-6 h-6 text-primary-400" />
            </div>
            <div>
              <p className="font-bold text-white text-sm leading-none">VoteAI</p>
              <p className="text-xs text-primary-400 font-medium mt-0.5">Admin Panel</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(({ icon: Icon, label, path }) => (
            <NavLink
              key={path}
              to={path}
              end={path === '/admin'}
              onClick={onClose}
              className={({ isActive }) => cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary-500/15 text-primary-400 border border-primary-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              )}
            >
              <Icon className="w-4.5 h-4.5 shrink-0" size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User + Logout */}
        <div className="px-3 pb-5 border-t border-white/10 pt-4">
          <div className="flex items-center gap-3 px-3 py-2 mb-2 bg-background/50 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-primary-500/30 flex items-center justify-center text-primary-300 font-bold text-sm">
              {user?.fullName?.[0]?.toUpperCase() ?? 'A'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-white truncate">{user?.fullName ?? 'Admin'}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role ?? 'admin'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
