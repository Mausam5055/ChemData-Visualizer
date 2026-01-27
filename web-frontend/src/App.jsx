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
                <div className="pt-6 pb-2 px-4 sticky top-0 z-50">
                    <nav className="max-w-4xl mx-auto bg-white/90 backdrop-blur-md shadow-xl rounded-full px-8 py-3 ring-1 ring-gray-200">
                        <div className="flex justify-between items-center h-10">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold shadow-sm">C</div>
                                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">ChemViz</h1>
                            </div>
                            <div className="flex items-center gap-4">
                                {view === 'analysis' && (
                                    <button onClick={handleBack} className="text-gray-500 hover:text-gray-900 text-sm font-medium transition-colors flex items-center gap-1">
                                        ← Dashboard
                                    </button>
                                )}
                                <div className="h-4 w-px bg-gray-300 mx-2"></div>
                                <button onClick={handleLogout} className="text-red-600 hover:text-red-700 text-sm font-medium bg-red-50 hover:bg-red-100 px-4 py-1.5 rounded-full transition-all">
                                    Logout
                                </button>
                            </div>
                        </div>
                    </nav>
                </div>

                <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    {content()}
                </main>
            </div>
        )}
    </GoogleOAuthProvider>
  )
}

export default App
