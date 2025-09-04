import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Bell, Menu, Search } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

export function Header({ onMenuToggle }) {
  return (
    <header className="bg-white border-b border-neutral/20 px-4 py-3">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuToggle}
            className="lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">LG</span>
            </div>
            <span className="font-bold text-lg text-gray-900 hidden sm:block">LocalGigs</span>
          </div>
        </div>

        <div className="hidden md:flex flex-1 max-w-md mx-6">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search tasks, gigs, or skills..."
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>
          <ConnectButton />
        </div>
      </div>
    </header>
  );
}