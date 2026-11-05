import { useState, useEffect } from 'react';
import { useSocket } from './hooks/useSocket';
import { api } from './hooks/useApi';
import PhoneLayout from './pages/Phone/PhoneLayout';
import TabletLayout from './pages/Tablet/TabletLayout';
import SetupScreen from './components/SetupScreen';

function App() {
  const { connected, state } = useSocket();
  const [currentUserId, setCurrentUserId] = useState<string | null>(() => {
    return localStorage.getItem('home-app-user-id');
  });
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    // Detect if tablet based on screen size
    const checkDevice = () => {
      setIsTablet(window.innerWidth >= 768);
    };
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  const handleUserCreated = async (name: string) => {
    try {
      const user = await api.createUser(name);
      localStorage.setItem('home-app-user-id', user.id);
      setCurrentUserId(user.id);
    } catch (error) {
      console.error('Failed to create user:', error);
    }
  };

  const handleSelectUser = (userId: string) => {
    localStorage.setItem('home-app-user-id', userId);
    setCurrentUserId(userId);
  };

  const handleLogout = () => {
    localStorage.removeItem('home-app-user-id');
    setCurrentUserId(null);
  };

  const currentUser = state.users.find(u => u.id === currentUserId);

  // Show connection status
  if (!connected) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-400">Connecting to server...</p>
        </div>
      </div>
    );
  }

  // Show setup screen if no user selected
  if (!currentUser) {
    return (
      <SetupScreen
        users={state.users}
        onCreateUser={handleUserCreated}
        onSelectUser={handleSelectUser}
        isTablet={isTablet}
      />
    );
  }

  // Render appropriate layout
  if (isTablet) {
    return (
      <TabletLayout
        state={state}
        currentUser={currentUser}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <PhoneLayout
      state={state}
      currentUser={currentUser}
      onLogout={handleLogout}
    />
  );
}

export default App;
