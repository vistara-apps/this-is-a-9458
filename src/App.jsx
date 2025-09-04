import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { TaskFeed } from './components/TaskFeed';
import { GigBoard } from './components/GigBoard';
import { SkillSwap } from './components/SkillSwap';
import { Community } from './components/Community';
import { AuthPage } from './components/auth/AuthPage';
import { ProfilePage } from './components/profile/ProfilePage';
import { TaskDetailsPage } from './components/tasks/TaskDetailsPage';
import { GigDetailsPage } from './components/gigs/GigDetailsPage';
import { CreateTaskPage } from './components/tasks/CreateTaskPage';
import { CreateGigPage } from './components/gigs/CreateGigPage';
import { MessagesPage } from './components/messages/MessagesPage';
import { PaymentSuccessPage } from './components/payments/PaymentSuccessPage';
import { LoadingSpinner } from './components/ui/LoadingSpinner';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

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
      
      <Route path="/tasks/create" element={
        <ProtectedRoute>
          <AppLayout>
            <CreateTaskPage />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/tasks/:taskId" element={
        <ProtectedRoute>
          <AppLayout>
            <TaskDetailsPage />
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
      
      <Route path="/gigs/create" element={
        <ProtectedRoute>
          <AppLayout>
            <CreateGigPage />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/gigs/:gigId" element={
        <ProtectedRoute>
          <AppLayout>
            <GigDetailsPage />
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
      
      <Route path="/messages" element={
        <ProtectedRoute>
          <AppLayout>
            <MessagesPage />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/profile" element={
        <ProtectedRoute>
          <AppLayout>
            <ProfilePage />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/profile/:userId" element={
        <ProtectedRoute>
          <AppLayout>
            <ProfilePage />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/payment-success" element={
        <ProtectedRoute>
          <AppLayout>
            <PaymentSuccessPage />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <AppRoutes />
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                theme: {
                  primary: 'green',
                  secondary: 'black',
                },
              },
            }}
          />
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
