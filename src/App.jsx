import { useState } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { TaskFeed } from './components/TaskFeed';
import { GigBoard } from './components/GigBoard';
import { SkillSwap } from './components/SkillSwap';
import { Community } from './components/Community';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSidebarOpen(false);
  };

  const handleMenuToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'taskfeed':
        return <TaskFeed />;
      case 'gigboard':
        return <GigBoard />;
      case 'skillswap':
        return <SkillSwap />;
      case 'community':
        return <Community />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onMenuToggle={handleMenuToggle} />
      
      <div className="flex">
        <Sidebar 
          isOpen={sidebarOpen} 
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
        
        <main className="flex-1 lg:ml-0">
          {renderActiveComponent()}
        </main>
      </div>
    </div>
  );
}

export default App;