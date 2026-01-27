import { useState, useEffect } from 'react'
import { GoogleOAuthProvider } from '@react-oauth/google';
import Login from './components/Login'
import Signup from './components/Signup'
import Dashboard from './components/Dashboard'
import Analysis from './components/Analysis'
import Sidebar from './components/Sidebar'
import Features from './components/Features'
import Support from './components/Support'

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [view, setView] = useState('dashboard'); // 'dashboard', 'analysis', 'login', 'signup'
  const [selectedDatasetId, setSelectedDatasetId] = useState(null);

  const [isSidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!token) {
        if (view !== 'signup') setView('login');
    } else {
        // Default to dashboard/overview if logged in and view is auth related or undefined
        if (view === 'login' || view === 'signup' || !view) setView('overview');
    }
  }, [token]);

  const handleLogin = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setView('overview');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setView('login');
    setSelectedDatasetId(null);
  };

  const handleSelectDataset = (id) => {
    setSelectedDatasetId(id);
    setView('analysis');
    // On mobile, close sidebar on selection
    if (window.innerWidth < 1024) setSidebarOpen(false);
  };

  const handleViewChange = (newView) => {
      setView(newView);
      if (newView === 'overview') setSelectedDatasetId(null);
      if (window.innerWidth < 1024) setSidebarOpen(false);
  }

  // Temporary function to simulate upload click for now, can be properly implemented later
  const handleUploadClick = () => {
      // For now, switch to overview where we might put the upload button or open a modal
      setView('overview');
      // If we had a modal, we would open it here. 
      // Current Dashboard has upload, so ensure we are in a mode that shows it.
  };

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        {!token ? (
            view === 'signup' ? 
                <Signup onLogin={handleLogin} onSwitchToLogin={() => setView('login')} /> : 
                <Login onLogin={handleLogin} onSwitchToSignup={() => setView('signup')} />
        ) : (
            <div className="flex h-screen bg-slate-50 overflow-hidden">
                <Sidebar 
                    isOpen={isSidebarOpen} 
                    toggle={() => setSidebarOpen(!isSidebarOpen)}
                    onLogout={handleLogout}
                    onViewChange={handleViewChange}
                    currentView={view}
                    selectedDatasetId={selectedDatasetId}
                    onSelectDataset={handleSelectDataset}
                    onUploadClick={handleUploadClick}
                />

                <div className="flex-1 flex flex-col min-w-0 overflow-hidden lg:pl-72 transition-all duration-300">
                    {/* Data Content */}
                    <main className="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar">
                        {/* Mobile Header Toggle */}
                        <div className="lg:hidden flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold shadow-sm">C</div>
                                <span className="text-xl font-bold text-slate-900">ChemViz</span>
                            </div>
                            <button onClick={() => setSidebarOpen(true)} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                            </button>
                        </div>

                        {view === 'analysis' && selectedDatasetId ? (
                            <Analysis datasetId={selectedDatasetId} />
                        ) : view === 'features' ? (
                            <Features />
                        ) : view === 'support' ? (
                            <Support />
                        ) : (
                            <Dashboard onSelect={handleSelectDataset} />
                        )}
                    </main>
                </div>
            </div>
        )}
    </GoogleOAuthProvider>
  )
}

export default App
