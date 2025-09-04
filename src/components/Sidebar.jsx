import { clsx } from 'clsx';
import { 
  Home, 
  Briefcase, 
  Users, 
  RefreshCw, 
  MessageSquare,
  User,
  Settings,
  TrendingUp
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', icon: Home, href: '#', current: true },
  { name: 'Task Feed', icon: Briefcase, href: '#tasks' },
  { name: 'Gig Board', icon: TrendingUp, href: '#gigs' },
  { name: 'Skill Swap', icon: RefreshCw, href: '#skills' },
  { name: 'Community', icon: Users, href: '#community' },
  { name: 'Messages', icon: MessageSquare, href: '#messages' },
];

const bottomNavigation = [
  { name: 'Profile', icon: User, href: '#profile' },
  { name: 'Settings', icon: Settings, href: '#settings' },
];

export function Sidebar({ isOpen, activeTab, onTabChange }) {
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => onTabChange(activeTab)}
        />
      )}
      
      {/* Sidebar */}
      <div className={clsx(
        'fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-neutral/20 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex flex-col h-full">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => onTabChange(item.name.toLowerCase().replace(' ', ''))}
                  className={clsx(
                    activeTab === item.name.toLowerCase().replace(' ', '')
                      ? 'bg-primary/10 text-primary border-r-2 border-primary'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                    'group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full text-left transition-colors min-h-[44px]'
                  )}
                >
                  <item.icon
                    className={clsx(
                      activeTab === item.name.toLowerCase().replace(' ', '')
                        ? 'text-primary'
                        : 'text-gray-400 group-hover:text-gray-500',
                      'mr-3 flex-shrink-0 h-5 w-5'
                    )}
                  />
                  {item.name}
                </button>
              ))}
            </nav>
          </div>
          
          <div className="flex-shrink-0 flex border-t border-neutral/20 p-4">
            <div className="flex-shrink-0 w-full group block">
              <div className="flex items-center">
                <div className="flex flex-col space-y-1">
                  {bottomNavigation.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => onTabChange(item.name.toLowerCase())}
                      className="flex items-center px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:text-gray-900 hover:bg-gray-50 w-full text-left transition-colors min-h-[44px]"
                    >
                      <item.icon className="mr-3 h-5 w-5 text-gray-400" />
                      {item.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}