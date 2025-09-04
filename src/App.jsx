import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { TaskFeed } from './components/TaskFeed';
import { GigBoard } from './components/GigBoard';
import { SkillSwap } from './components/SkillSwap';
import { Community } from './components/Community';
import { AuthPage } from './components/auth/AuthPage';
import { LoadingSpinner } from './components/ui/LoadingSpinner';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return children;
};

// Main App Layout
const AppLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleMenuToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onMenuToggle={handleMenuToggle} />
      
      <div className="flex">
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)}
        />
        
        <main className="flex-1 lg:ml-0">
          {children}
        </main>
      </div>
    </div>
  );
};

// App Routes Component
const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route 
        path="/auth" 
        element={user ? <Navigate to="/" replace /> : <AuthPage />} 
      />
      
      {/* Protected Routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <AppLayout>
            <Dashboard />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/tasks" element={
        <ProtectedRoute>
          <AppLayout>
            <TaskFeed />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/gigs" element={
        <ProtectedRoute>
          <AppLayout>
            <GigBoard />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/skill-swap" element={
        <ProtectedRoute>
          <AppLayout>
            <SkillSwap />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/community" element={
        <ProtectedRoute>
          <AppLayout>
            <Community />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

// Main App Component
function App() {
  return <AppRoutes />;
}

export default App;

