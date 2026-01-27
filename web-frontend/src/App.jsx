import { useState, useEffect } from 'react'
import { GoogleOAuthProvider } from '@react-oauth/google';
import Login from './components/Login'
import Signup from './components/Signup'
import Dashboard from './components/Dashboard'
import Analysis from './components/Analysis'

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [view, setView] = useState('dashboard'); // 'dashboard', 'analysis', 'login', 'signup'
  const [selectedDatasetId, setSelectedDatasetId] = useState(null);

  useEffect(() => {
    if (!token) {
        if (view !== 'signup') setView('login');
    } else {
        if (view === 'login' || view === 'signup') setView('dashboard');
    }
  }, [token, view]);

  const handleLogin = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setView('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setView('login');
  };

  const handleSelectDataset = (id) => {
    setSelectedDatasetId(id);
    setView('analysis');
  };

  const handleBack = () => {
    setSelectedDatasetId(null);
    setView('dashboard');
  };
  
  const content = () => {
      if (!token) {
          if (view === 'signup') return <Signup onLogin={handleLogin} onSwitchToLogin={() => setView('login')} />;
          return <Login onLogin={handleLogin} onSwitchToSignup={() => setView('signup')} />;
      }
      if (view === 'analysis' && selectedDatasetId) return <Analysis datasetId={selectedDatasetId} />;
      return <Dashboard onSelect={handleSelectDataset} />;
  }

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        {!token ? (
            content()
        ) : (
            <div className="min-h-screen bg-gray-100">
                <nav className="bg-white shadow">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16">
                            <div className="flex">
                                <div className="flex-shrink-0 flex items-center">
                                    <h1 className="text-xl font-bold text-gray-800">ChemData Visualizer</h1>
                                </div>
                            </div>
                            <div className="flex items-center">
                                {view === 'analysis' && (
                                    <button onClick={handleBack} className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium mr-4">
                                        Back to Dashboard
                                    </button>
                                )}
                                <button onClick={handleLogout} className="text-red-600 hover:text-red-900 px-3 py-2 rounded-md text-sm font-medium">
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </nav>

                <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    {content()}
                </main>
            </div>
        )}
    </GoogleOAuthProvider>
  )
}

export default App
