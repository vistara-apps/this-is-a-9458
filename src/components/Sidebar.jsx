import { clsx } from 'clsx';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Briefcase, 
  Users, 
  RefreshCw, 
  MessageSquare,
  User,
  Settings,
  TrendingUp,
  Plus
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', icon: Home, href: '/' },
  { name: 'Task Feed', icon: Briefcase, href: '/tasks' },
  { name: 'Gig Board', icon: TrendingUp, href: '/gigs' },
  { name: 'Skill Swap', icon: RefreshCw, href: '/skill-swap' },
  { name: 'Community', icon: Users, href: '/community' },
  { name: 'Messages', icon: MessageSquare, href: '/messages' },
];

const quickActions = [
  { name: 'Post Task', icon: Plus, href: '/tasks/create', color: 'bg-primary' },
  { name: 'Post Gig', icon: Plus, href: '/gigs/create', color: 'bg-accent' },
];

const bottomNavigation = [
  { name: 'Profile', icon: User, href: '/profile' },
  { name: 'Settings', icon: Settings, href: '/settings' },
];

export function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const isCurrentPath = (href) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={clsx(
        'fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-neutral/20 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex flex-col h-full">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            {/* Quick Actions */}
            <div className="px-2 mb-6">
              <h3 className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Quick Actions
              </h3>
              <div className="space-y-2">
                {quickActions.map((action) => (
                  <Link
                    key={action.name}
                    to={action.href}
                    onClick={onClose}
                    className={clsx(
                      action.color,
                      'group flex items-center px-3 py-2 text-sm font-medium text-white rounded-md hover:opacity-90 transition-opacity'
                    )}
                  >
                    <action.icon className="mr-3 h-4 w-4" />
                    {action.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Main Navigation */}
            <nav className="flex-1 px-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={onClose}
                  className={clsx(
                    isCurrentPath(item.href)
                      ? 'bg-primary/10 text-primary border-r-2 border-primary'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                    'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors min-h-[44px]'
                  )}
                >
                  <item.icon
                    className={clsx(
                      isCurrentPath(item.href)
                        ? 'text-primary'
                        : 'text-gray-400 group-hover:text-gray-500',
                      'mr-3 flex-shrink-0 h-5 w-5'
                    )}
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          
          {/* Bottom Navigation */}
          <div className="flex-shrink-0 border-t border-neutral/20 p-4">
            <div className="space-y-1">
              {bottomNavigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={onClose}
                  className={clsx(
                    isCurrentPath(item.href)
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                    'flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors min-h-[44px]'
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5 text-gray-400" />
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
